import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { chromaService } from "../vectorstore/chroma.service.js";

/**
 * Custom LangChain Tool for retrieving semantic conversation context
 */
export const conversationContextRetrieverTool = new DynamicStructuredTool({
  name: "get_conversation_context",
  description: "Retrieves relevant messages and context from previous conversation history based on semantic similarity.",
  schema: z.object({
    query: z.string().describe("The user's query or search term to retrieve context for"),
    conversationId: z.string().describe("The normalized conversation ID"),
    limit: z.number().optional().default(5),
  }),
  func: async ({ query, conversationId, limit }) => {
    try {
      const results = await chromaService.similaritySearch({
        query,
        conversationId,
        limit,
      });

      if (!results || results.length === 0) {
        return "No relevant past messages found in the conversation context.";
      }

      return results
        .map(
          (item, idx) =>
            `[Message ${idx + 1}] (Relevance: ${(item.score * 100).toFixed(0)}%)\nText: "${item.content}"`
        )
        .join("\n\n");
    } catch (err) {
      return `Error retrieving context: ${err.message}`;
    }
  },
});
