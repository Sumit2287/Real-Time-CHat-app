import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAiHealth, getSmartReplies, searchMessages, askGlobalCopilot } from "../controllers/ai.controller.js";
import { validateSearchQuery, validateSmartReplyRequest } from "../ai/middleware/ai.middleware.js";

const router = express.Router();

router.get("/health", protectRoute, getAiHealth);
router.get("/search", protectRoute, validateSearchQuery, searchMessages);
router.post("/search", protectRoute, validateSearchQuery, searchMessages);
router.get("/smart-replies/:targetUserId", protectRoute, validateSmartReplyRequest, getSmartReplies);
router.post("/copilot", protectRoute, askGlobalCopilot);

export default router;
