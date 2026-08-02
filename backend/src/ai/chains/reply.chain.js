import { ChatGroq } from "@langchain/groq";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { SMART_REPLY_PROMPT } from "../prompts/templates.js";
import { smartReplyCache } from "../utils/cache.util.js";

/**
 * Creates Groq Chat Model instance with specified or fallback model
 */
export function getGroqModel(options = {}) {
  const apiKey = process.env.GROQ_API_KEY || "dummy_groq_key";
  const preferredModel = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
  const fallbackModel = "llama-3.3-70b-versatile";

  try {
    return new ChatGroq({
      apiKey,
      model: preferredModel,
      temperature: options.temperature ?? 0.4,
      streaming: options.streaming ?? false,
      maxRetries: 2,
    });
  } catch (err) {
    console.warn(`[GroqModel] Preferred model ${preferredModel} init issue, attempting fallback ${fallbackModel}:`, err.message);
    return new ChatGroq({
      apiKey,
      model: fallbackModel,
      temperature: options.temperature ?? 0.4,
      streaming: options.streaming ?? false,
    });
  }
}

/**
 * Executes Smart Reply Recommender chain to produce 3 context-aware suggestions
 */
export async function generateSmartRepliesChain({ currentUser, chatHistory, lastMessage, cacheKey }) {
  if (cacheKey) {
    const cached = smartReplyCache.get(cacheKey);
    if (cached) return cached;
  }

  const defaultReplies = ["Sure!", "Sounds good.", "Can you tell me more?"];

  try {
    if (!process.env.GROQ_API_KEY) {
      console.warn("[SmartReply] GROQ_API_KEY not found in environment variables. Returning default suggestions.");
      return defaultReplies;
    }

    const model = getGroqModel({ temperature: 0.5 });
    const outputParser = new StringOutputParser();

    const chain = RunnableSequence.from([
      SMART_REPLY_PROMPT,
      model,
      outputParser,
    ]);

    const rawResult = await chain.invoke({
      currentUser: currentUser || "User",
      chatHistory: chatHistory || "No recent history.",
      lastMessage: lastMessage || "",
    });

    // Clean JSON response from markdown blocks if present
    const cleanedJson = rawResult
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanedJson);
    if (Array.isArray(parsed) && parsed.length >= 1) {
      const suggestions = parsed.slice(0, 3).map((str) => String(str).trim());
      if (cacheKey) smartReplyCache.set(cacheKey, suggestions);
      return suggestions;
    }

    return defaultReplies;
  } catch (error) {
    console.error("[SmartReply] Error generating reply suggestions:", error.message);
    return defaultReplies;
  }
}
