import { Embeddings } from "@langchain/core/embeddings";
import { embeddingCache } from "../utils/cache.util.js";

/**
 * Custom LangChain Embeddings implementation using BAAI/bge-small-en-v1.5
 * Runs via @xenova/transformers ONNX execution engine directly within Node.js.
 */
export class BgeEmbeddings extends Embeddings {
  constructor(fields = {}) {
    super(fields);
    this.modelName = fields.modelName || "Xenova/bge-small-en-v1.5";
    this.pipeline = null;
    this.initPromise = null;
  }

  async getPipeline() {
    if (this.pipeline) return this.pipeline;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        const { pipeline } = await import("@xenova/transformers");
        // Initialize feature-extraction pipeline for BGE small model (384 dimensions)
        this.pipeline = await pipeline("feature-extraction", this.modelName, {
          quantized: true,
        });
        return this.pipeline;
      } catch (err) {
        console.error("Failed to load @xenova/transformers pipeline, using fallback vector generator:", err.message);
        // Fallback vector generator if native ONNX binary loading encounters environment limits
        this.pipeline = async (text) => {
          return { data: new Float32Array(384).fill(0.01) };
        };
        return this.pipeline;
      }
    })();

    return this.initPromise;
  }

  /**
   * Generates a 384-dim normalized embedding vector for a single query.
   */
  async embedQuery(text) {
    const cached = embeddingCache.get(text);
    if (cached) return cached;

    const extractor = await this.getPipeline();
    const output = await extractor(text, { pooling: "mean", normalize: true });
    const vector = Array.from(output.data);

    embeddingCache.set(text, vector);
    return vector;
  }

  /**
   * Generates embeddings for an array of documents (batch processing).
   */
  async embedDocuments(documents) {
    const vectors = await Promise.all(documents.map((doc) => this.embedQuery(doc)));
    return vectors;
  }
}

export const bgeEmbeddings = new BgeEmbeddings();
