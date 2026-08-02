import { ChromaClient } from "chromadb";
import { bgeEmbeddings } from "../embeddings/bge.embedding.js";
import path from "path";
import fs from "fs";

class ChromaService {
  constructor() {
    this.collectionName = "chat_messages";
    this.client = null;
    this.collection = null;
    this.initialized = false;
    this.initPromise = null;
    // Fallback in-memory store if ChromaDB native server is offline
    this.fallbackStore = new Map();
  }

  async init() {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        const chromaUrl = process.env.CHROMA_URL || "http://localhost:8000";
        this.client = new ChromaClient({ path: chromaUrl });
        
        // Ensure collection exists
        this.collection = await this.client.getOrCreateCollection({
          name: this.collectionName,
          metadata: { "hnsw:space": "cosine" },
        });

        this.initialized = true;
        console.log(`[ChromaService] Successfully connected to ChromaDB at ${chromaUrl}`);
      } catch (error) {
        console.warn(`[ChromaService] Native ChromaDB server not reachable (${error.message}). Operating with resilient hybrid vector store.`);
        this.initialized = true;
      }
    })();

    return this.initPromise;
  }

  /**
   * Indexes a message into the vector store.
   */
  async addMessage({ messageId, conversationId, senderId, receiverId, text, timestamp, messageType = "text" }) {
    if (!text || !text.trim()) return;
    await this.init();

    try {
      const embedding = await bgeEmbeddings.embedQuery(text);
      const metadata = {
        messageId: String(messageId),
        conversationId: String(conversationId),
        senderId: String(senderId),
        receiverId: String(receiverId),
        timestamp: Number(timestamp || Date.now()),
        messageType: String(messageType),
        text: String(text),
      };

      if (this.collection) {
        await this.collection.add({
          ids: [String(messageId)],
          embeddings: [embedding],
          metadatas: [metadata],
          documents: [text],
        });
      } else {
        // Persistent in-memory vector store fallback
        this.fallbackStore.set(String(messageId), {
          id: String(messageId),
          embedding,
          metadata,
          text,
        });
      }
    } catch (err) {
      console.error("[ChromaService] Error indexing message:", err.message);
    }
  }

  /**
   * Performs similarity search over messages within specified conversation or globally across all user conversations.
   */
  async similaritySearch({ query, conversationId, currentUserId, limit = 10 }) {
    await this.init();
    if (!query || !query.trim()) return [];

    try {
      const queryEmbedding = await bgeEmbeddings.embedQuery(query);

      if (this.collection) {
        let whereClause;
        if (conversationId) {
          whereClause = { conversationId: String(conversationId) };
        }

        const results = await this.collection.query({
          queryEmbeddings: [queryEmbedding],
          nResults: limit,
          where: whereClause,
        });

        if (!results || !results.documents || !results.documents[0]) return [];

        const docs = results.documents[0];
        const metadatas = results.metadatas[0];
        const distances = results.distances ? results.distances[0] : [];

        let matches = docs.map((doc, idx) => {
          const dist = distances[idx] !== undefined ? distances[idx] : 0.5;
          const score = Math.max(0, Math.min(1, 1 - dist));
          return {
            content: doc,
            metadata: metadatas[idx] || {},
            score: Number(score.toFixed(4)),
          };
        });

        // If searching globally for a user, ensure metadata matches senderId or receiverId
        if (currentUserId && !conversationId) {
          matches = matches.filter(
            (m) =>
              String(m.metadata.senderId) === String(currentUserId) ||
              String(m.metadata.receiverId) === String(currentUserId)
          );
        }

        return matches;
      } else {
        // Calculate cosine similarity over fallback store
        const matches = [];
        for (const entry of this.fallbackStore.values()) {
          if (conversationId && entry.metadata.conversationId !== String(conversationId)) {
            continue;
          }
          if (
            currentUserId &&
            !conversationId &&
            String(entry.metadata.senderId) !== String(currentUserId) &&
            String(entry.metadata.receiverId) !== String(currentUserId)
          ) {
            continue;
          }
          const sim = cosineSimilarity(queryEmbedding, entry.embedding);
          matches.push({
            content: entry.text,
            metadata: entry.metadata,
            score: Number(sim.toFixed(4)),
          });
        }

        matches.sort((a, b) => b.score - a.score);
        return matches.slice(0, limit);
      }
    } catch (err) {
      console.error("[ChromaService] Similarity search error:", err.message);
      return [];
    }
  }
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const chromaService = new ChromaService();
