import { chromaService } from "../vectorstore/chroma.service.js";
import { executeSemanticSearchChain } from "../chains/search.chain.js";
import { generateSmartRepliesChain } from "../chains/reply.chain.js";
import { executeAiAssistantWorkflow } from "../workflows/assistant.workflow.js";
import { getConversationId } from "../utils/security.util.js";
import Message from "../../models/message.model.js";

class AiService {
  /**
   * Index a message asynchronously into vector store
   */
  async indexMessage(message) {
    if (!message || !message.text || !message.text.trim()) return;

    try {
      const conversationId = getConversationId(message.senderId, message.receiverId);
      await chromaService.addMessage({
        messageId: message._id,
        conversationId,
        senderId: message.senderId,
        receiverId: message.receiverId,
        text: message.text,
        timestamp: message.createdAt ? new Date(message.createdAt).getTime() : Date.now(),
        messageType: message.image ? "image" : "text",
      });
    } catch (err) {
      console.error("[AiService] Failed to index message:", err.message);
    }
  }

  /**
   * Perform semantic search across conversations
   */
  async searchMessages({ query, currentUserId, targetUserId, limit = 10 }) {
    let conversationId;
    if (targetUserId) {
      conversationId = getConversationId(currentUserId, targetUserId);
    }

    return await executeSemanticSearchChain({
      query,
      conversationId,
      limit,
    });
  }

  /**
   * Generate 3 contextual smart reply recommendations
   */
  async getSmartReplies({ currentUserId, targetUserId, currentUser = "User" }) {
    const conversationId = getConversationId(currentUserId, targetUserId);
    
    // Fetch last 15 messages for context
    const recentMessages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: currentUserId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(15);

    recentMessages.reverse();

    if (recentMessages.length === 0) {
      return ["Hello!", "How are you?", "What's up?"];
    }

    const lastMsg = recentMessages[recentMessages.length - 1];
    const historyText = recentMessages.map((m) => `${m.senderId}: ${m.text || ""}`).join("\n");
    const cacheKey = `${conversationId}_${lastMsg._id}`;

    return await generateSmartRepliesChain({
      currentUser,
      chatHistory: historyText,
      lastMessage: lastMsg.text || "",
      cacheKey,
    });
  }

  /**
   * Process @AI Assistant Query (Supports both single chat and global cross-chat RAG)
   */
  async handleAiAssistantQuery({ userQuery, userName, currentUserId, targetUserId, socket, receiverSocket }) {
    let conversationId = null;
    let recentMessages = [];

    if (targetUserId) {
      conversationId = getConversationId(currentUserId, targetUserId);
      recentMessages = await Message.find({
        $or: [
          { senderId: currentUserId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: currentUserId },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(10);
      recentMessages.reverse();
    } else {
      // Global search across all conversations of current user
      recentMessages = await Message.find({
        $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
      })
        .sort({ createdAt: -1 })
        .limit(15);
      recentMessages.reverse();
    }

    return await executeAiAssistantWorkflow({
      userQuery,
      userName,
      currentUserId,
      conversationId,
      recentMessages,
      socket,
      receiverSocket,
    });
  }
}

export const aiService = new AiService();
