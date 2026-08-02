# ⚡ Chatty - Real-Time Full Stack Chat Application with AI Capabilities 💬

[![Live Demo](https://img.shields.io/badge/Live_Demo-Render-brightgreen?style=for-the-badge&logo=render)](https://chitchat-rv2h.onrender.com)
[![Tech Stack](https://img.shields.io/badge/Stack-MERN_%2B_Socket.io_%2B_LangChain-blue?style=for-the-badge&logo=node.js)](https://chitchat-rv2h.onrender.com)
[![AI VectorDB](https://img.shields.io/badge/AI-ChromaDB_%2B_Groq_%2B_BGE_Small-purple?style=for-the-badge&logo=openai)](https://chitchat-rv2h.onrender.com)

A modern, high-performance, real-time messaging web application built using the MERN stack (MongoDB, Express, React, Node.js), Socket.io, TailwindCSS, DaisyUI, Zustand, and extended with an enterprise-grade **LangChain + Groq RAG AI Pipeline**.

---

## 🤖 Advanced AI Features

1. 🔍 **AI Semantic Search (RAG)**:
   - Dense vector similarity search across all user conversations using **BAAI/bge-small-en-v1.5** embeddings and **ChromaDB**.
   - Filters results by authorized conversation key (`[userA, userB].sort().join('_')`).
   - Displays percentage relevance match scores and highlights exact matching query concepts in yellow.

2. 🤖 **AI Chat Assistant (@AI Trigger)**:
   - Type `@AI <question>` in chat to trigger context-grounded AI responses.
   - Retrieves semantic context via vector similarity + recent chat history using LangChain chains.
   - Streams tokens in real-time over Socket.IO directly to the chat interface like ChatGPT.
   - Strictly grounded on conversation history to prevent hallucination.

3. ⚡ **Smart Reply Recommender**:
   - Automatically generates 3 context-aware reply suggestions for incoming messages based on recent context, sender relationship, and conversation tone.
   - Clicking a suggestion instantly populates the message input field without auto-sending.

---

## 🏗️ AI System Architecture & Data Flow

```
+-----------------------------------------------------------------------------------+
|                                  FRONTEND (React)                                 |
|  [Navbar: AI Search]   [ChatContainer: @AI Streaming]   [SmartReplies Component]  |
+------------------------------------------+----------------------------------------+
                                           | HTTP / Socket.IO Token Stream
+------------------------------------------v----------------------------------------+
|                                BACKEND (Express + Socket.IO)                      |
|                                                                                   |
|  routes/ai.route.js                   controllers/message.controller.js           |
|            |                                       | (on message sent)            |
|            v                                       v                              |
|  +-----------------------------------------------------------------------------+  |
|  |                             src/ai/ Architecture                            |  |
|  |                                                                             |  |
|  |  +--------------------+   +-----------------------+   +-------------------+ |  |
|  |  |   ai/middleware/   |   |     ai/types/         |   |    ai/utils/      | |  |
|  |  | (Zod Validation &  |   | (Zod Schemas & DTOs)  |   | (Sanitization &   | |  |
|  |  | Prompt Security)   |   +-----------------------+   | Caching Utilities)| |  |
|  |  +---------+----------+                               +---------+---------+ |  |
|  |            |                                                    |           |  |
|  |            v                                                    v           |  |
|  |  +-----------------------------------------------------------------------+ |  |
|  |  |                             ai/services/                              | |  |
|  |  |  - search.service.js      - assistant.service.js   - reply.service.js | |  |
|  |  +---------+--------------------------+-------------------------+--------+ |  |
|  |            |                          |                         |          |  |
|  |            v                          v                         v          |  |
|  |  +-------------------+      +------------------+     +-------------------+ |  |
|  |  |    ai/chains/     |      |  ai/workflows/   |     |    ai/prompts/    | |  |
|  |  | (RunnableSequence |<---->| (RAG Workflow &  |<--->| (Modular System   | |  |
|  |  |  & Parsers)       |      | Token Streaming) |     |  Prompt Templates)| |  |
|  |  +---------+---------+      +--------+---------+     +-------------------+ |  |
|  |            |                         |                                     |  |
|  |            +------------+------------+                                     |  |
|  |                         |                                                  |  |
|  |                         v                                                  |  |
|  |  +-----------------------------------------------+                         |  |
|  |  |  ai/embeddings/           ai/vectorstore/     |                         |  |
|  |  | (BAAI/bge-small-en-v1.5)  (ChromaDB Manager & |                         |  |
|  |  |                           Metadata Filters)   |                         |  |
|  |  +-------------------+---------------+-----------+                         |  |
|  +----------------------|---------------|-------------------------------------+  |
+-------------------------|---------------|-----------------------------------------+
                          |               |
             +------------v---+       +---v------------+
             |    Groq API    |       |    ChromaDB    |
             | (LLM Inference)|       | (Vector Store) |
             +----------------+       +----------------+
```

---

## 📁 AI Backend Folder Structure

```
backend/src/ai/
├── chains/
│   ├── reply.chain.js        # RunnableSequence for 3 context-aware reply suggestions
│   └── search.chain.js       # RAG Vector Search & match highlight chain
├── workflows/
│   └── assistant.workflow.js # RAG workflow for @AI queries + Socket.IO token streaming
├── prompts/
│   └── templates.js          # Reusable LangChain ChatPromptTemplates
├── tools/
│   └── contextRetriever.tool.js # LangChain context retriever tool
├── vectorstore/
│   └── chroma.service.js     # ChromaDB vector store manager
├── embeddings/
│   └── bge.embedding.js      # BAAI/bge-small-en-v1.5 ONNX embedding generator
├── services/
│   └── ai.service.js         # Master service exposing clean AI interfaces
├── middleware/
│   └── ai.middleware.js      # Zod validation middleware for AI requests
├── utils/
│   ├── cache.util.js         # In-memory LRU cache for embeddings & smart replies
│   └── security.util.js      # Prompt injection guard & conversation ID normalizer
└── types/
    └── ai.types.js           # Zod schemas for AI request/response validation
```

---

## 🛠️ Environment Variables

Add the following to `backend/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# AI Stack Configuration
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
CHROMA_URL=http://localhost:8000
NODE_ENV=development
```

---

## ⚙️ Local Development Setup

1. **Clone & Install Dependencies**:
   ```bash
   git clone https://github.com/Sumit2287/Real-Time-CHat-app.git
   cd Real-Time-CHat-app
   cd backend && npm install --legacy-peer-deps
   cd ../frontend && npm install
   ```

2. **Configure Environment Variables**:
   Update `backend/.env` with your `GROQ_API_KEY` and MongoDB credentials.

3. **Run Application**:
   ```bash
   # Backend
   cd backend && npm run dev

   # Frontend (in another terminal)
   cd frontend && npm run dev
   ```

---

## 🚀 Instant Demo Sign-In

| Account | Email | Password |
| :--- | :--- | :--- |
| 👩 **Emma Thompson** | `emma.thompson@example.com` | `123456` |
| 👨 **James Anderson** | `james.anderson@example.com` | `123456` |
