import { z } from "zod";

// Schema for Semantic Search Requests
export const SearchQuerySchema = z.object({
  query: z.string().min(1, "Search query cannot be empty").max(500, "Search query too long"),
  targetUserId: z.string().optional(), // Specific recipient/chat filter
  limit: z.number().int().positive().max(50).default(10),
});

// Schema for Smart Reply Requests
export const SmartReplyRequestSchema = z.object({
  targetUserId: z.string().min(1, "Target user ID is required"),
  limit: z.number().int().positive().max(30).default(15),
});

// Schema for Assistant Message Requests
export const AssistantMessageSchema = z.object({
  text: z.string().min(1, "Text is required"),
  targetUserId: z.string().min(1, "Target user ID is required"),
});

// Zod Schema for Vector Document Metadata
export const VectorMetadataSchema = z.object({
  messageId: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  timestamp: z.number(),
  messageType: z.enum(["text", "image", "ai"]),
});
