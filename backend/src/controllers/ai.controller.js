import { aiService } from "../ai/services/ai.service.js";

/**
 * Controller for AI Semantic Search
 */
export const searchMessages = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { query, targetUserId, limit } = req.validatedAiQuery;

    const results = await aiService.searchMessages({
      query,
      currentUserId,
      targetUserId,
      limit,
    });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error in searchMessages controller:", error.message);
    res.status(500).json({ error: "Failed to perform semantic search", message: error.message });
  }
};

/**
 * Controller for Context-Aware Smart Reply Recommendations
 */
export const getSmartReplies = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user.fullName;
    const { targetUserId } = req.validatedSmartReply;

    const suggestions = await aiService.getSmartReplies({
      currentUserId,
      targetUserId,
      currentUser,
    });

    res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("Error in getSmartReplies controller:", error.message);
    res.status(500).json({ error: "Failed to generate smart replies", message: error.message });
  }
};

/**
 * Controller for Global Cross-Conversation AI Copilot Queries
 */
export const askGlobalCopilot = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const userName = req.user.fullName;
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Query string is required" });
    }

    const aiResponseText = await aiService.handleAiAssistantQuery({
      userQuery: query,
      userName,
      currentUserId,
      targetUserId: null, // Omit targetUserId to query globally
      socket: null,
      receiverSocket: null,
    });

    res.status(200).json({
      success: true,
      answer: aiResponseText,
    });
  } catch (error) {
    console.error("Error in askGlobalCopilot controller:", error.message);
    res.status(500).json({ error: "Failed to execute global copilot query", message: error.message });
  }
};

/**
 * Controller for AI Service Health Check
 */
export const getAiHealth = async (req, res) => {
  res.status(200).json({
    status: "online",
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    timestamp: new Date().toISOString(),
  });
};
