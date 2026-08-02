import { getGroqModel } from "../chains/reply.chain.js";
import { ASSISTANT_CHAT_PROMPT } from "../prompts/templates.js";
import { chromaService } from "../vectorstore/chroma.service.js";
import { sanitizePromptInput } from "../utils/security.util.js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

/**
 * Handles RAG + Groq Token Streaming workflow for @AI queries over Socket.IO
 */
export async function executeAiAssistantWorkflow({
  userQuery,
  userName,
  currentUserId,
  conversationId,
  recentMessages = [],
  socket,
  receiverSocket,
}) {
  const cleanQuery = sanitizePromptInput(userQuery.replace(/^@AI\s*/i, ""));
  const streamSessionId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  // Emit Stream Start to client(s)
  const notifyStream = (event, payload) => {
    if (socket) socket.emit(event, payload);
    if (receiverSocket) receiverSocket.emit(event, payload);
  };

  notifyStream("aiStreamStart", {
    streamId: streamSessionId,
    query: cleanQuery,
  });

  try {
    // 1. RAG Context Retrieval via ChromaDB
    const vectorContext = await chromaService.similaritySearch({
      query: cleanQuery,
      conversationId,
      currentUserId,
      limit: 7,
    });

    const retrievedContextText = vectorContext.length > 0
      ? vectorContext.map((c, i) => `[Context ${i + 1}] (${(c.score * 100).toFixed(0)}% match): ${c.content}`).join("\n")
      : "No vector context matches found.";

    // 2. Format Recent Chat History
    const formattedHistoryText = recentMessages
      .map((m) => `${m.senderId}: ${m.text}`)
      .join("\n") || "No recent messages.";

    // 3. Check for API key presence
    if (!process.env.GROQ_API_KEY) {
      const fallbackMsg = "I am ready to assist! Please add your `GROQ_API_KEY` to `backend/.env` to enable full Groq AI responses.";
      
      notifyStream("aiStreamChunk", { streamId: streamSessionId, token: fallbackMsg });
      notifyStream("aiStreamEnd", { streamId: streamSessionId, fullText: fallbackMsg });
      return fallbackMsg;
    }

    // 4. LangChain Model & Streaming Callbacks
    let accumulatedText = "";
    const model = getGroqModel({ temperature: 0.3, streaming: true });

    const chain = RunnableSequence.from([
      ASSISTANT_CHAT_PROMPT,
      model,
      new StringOutputParser(),
    ]);

    // Stream invocation
    const stream = await chain.stream({
      currentTime: new Date().toLocaleString(),
      userName: userName || "User",
      retrievedContext: retrievedContextText,
      recentHistory: formattedHistoryText,
      historyCount: recentMessages.length,
      userQuery: cleanQuery,
    });

    for await (const chunk of stream) {
      accumulatedText += chunk;
      notifyStream("aiStreamChunk", {
        streamId: streamSessionId,
        token: chunk,
        accumulated: accumulatedText,
      });
    }

    notifyStream("aiStreamEnd", {
      streamId: streamSessionId,
      fullText: accumulatedText,
    });

    return accumulatedText;
  } catch (error) {
    console.error("[AiAssistantWorkflow] Error during streaming:", error.message);
    const errorMsg = `Sorry, I encountered an issue processing your request: ${error.message}`;
    
    notifyStream("aiStreamError", {
      streamId: streamSessionId,
      error: errorMsg,
    });

    return errorMsg;
  }
}
