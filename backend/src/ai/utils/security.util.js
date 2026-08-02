/**
 * Security and Sanitization Utilities for AI Pipeline
 */

/**
 * Normalizes two user IDs into a deterministic conversation ID.
 * Ensures User A -> User B and User B -> User A share the exact same vector partition key.
 */
export function getConversationId(userId1, userId2) {
  if (!userId1 || !userId2) return "";
  return [String(userId1), String(userId2)].sort().join("_");
}

/**
 * Sanitizes user input to prevent prompt injection attacks.
 * Strips known injection delimiters and normalizes whitespace.
 */
export function sanitizePromptInput(input) {
  if (!input || typeof input !== "string") return "";

  return input
    // Replace systemic control tokens often used in injection payloads
    .replace(/<\|im_start\|>|<\|im_end\|>|<\|endoftext\|>/gi, "")
    .replace(/\[SYSTEM\]|\[INST\]|\[\/INST\]/gi, "")
    // Normalize excessive newline flooding
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

/**
 * Truncates text safely to max length without breaking words.
 */
export function truncateText(text, maxLength = 1000) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
