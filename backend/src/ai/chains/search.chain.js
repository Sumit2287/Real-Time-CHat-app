import { chromaService } from "../vectorstore/chroma.service.js";
import { sanitizePromptInput } from "../utils/security.util.js";

/**
 * Performs semantic search over conversation vector store
 * with match highlighting and relevance percentage scoring.
 */
export async function executeSemanticSearchChain({ query, conversationId, limit = 10 }) {
  const sanitizedQuery = sanitizePromptInput(query);
  if (!sanitizedQuery) return [];

  // Query vector store
  const results = await chromaService.similaritySearch({
    query: sanitizedQuery,
    conversationId,
    limit,
  });

  // Highlight matches and structure output DTO
  const queryTerms = sanitizedQuery.toLowerCase().split(/\s+/).filter(Boolean);

  return results.map((res) => {
    let text = res.content || "";
    let highlightedText = text;

    // Highlight key matching terms
    for (const term of queryTerms) {
      if (term.length > 2) {
        const regex = new RegExp(`(${escapeRegExp(term)})`, "gi");
        highlightedText = highlightedText.replace(regex, "<mark class='bg-yellow-200 dark:bg-yellow-800 rounded px-1'>$1</mark>");
      }
    }

    return {
      messageId: res.metadata.messageId,
      conversationId: res.metadata.conversationId,
      senderId: res.metadata.senderId,
      receiverId: res.metadata.receiverId,
      timestamp: res.metadata.timestamp,
      messageType: res.metadata.messageType,
      text,
      highlightedText,
      relevanceScore: Math.round(res.score * 100), // Percentage representation
      score: res.score,
    };
  });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
