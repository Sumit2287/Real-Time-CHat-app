import { SearchQuerySchema, SmartReplyRequestSchema } from "../types/ai.types.js";

/**
 * Middleware to validate semantic search request query parameters
 */
export const validateSearchQuery = (req, res, next) => {
  try {
    const parsed = SearchQuerySchema.parse({
      query: req.query.query || req.body.query,
      targetUserId: req.query.targetUserId || req.body.targetUserId,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });
    req.validatedAiQuery = parsed;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Validation Error",
      details: err.errors ? err.errors.map((e) => e.message) : err.message,
    });
  }
};

/**
 * Middleware to validate smart reply request parameters
 */
export const validateSmartReplyRequest = (req, res, next) => {
  try {
    const parsed = SmartReplyRequestSchema.parse({
      targetUserId: req.params.targetUserId || req.body.targetUserId,
    });
    req.validatedSmartReply = parsed;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Validation Error",
      details: err.errors ? err.errors.map((e) => e.message) : err.message,
    });
  }
};
