import { useState } from "react";
import { Bot, Sparkles, Send, Loader2, Compass, Layers, Zap } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import MarkdownRenderer from "./MarkdownRenderer";
import toast from "react-hot-toast";

const GlobalAiChatContainer = () => {
  const [query, setQuery] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "👋 Welcome to **Global AI Copilot**!\n\nI have semantic vector access across **all of your conversations**. Ask me anything, for example:\n- *'Summarize all decisions made across my chats today.'*\n- *'What did James and Sarah discuss regarding Docker and JWT authentication?'*\n- *'List all action items and next steps.'*",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const samplePrompts = [
    "Summarize all discussions about JWT & Docker",
    "What decisions were made across all chats?",
    "Show action items mentioned by my team",
  ];

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userText = query.trim();
    setQuery("");

    // Append user message
    const userMsg = { id: `user_${Date.now()}`, role: "user", text: userText };
    setChatLog((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/ai/copilot", { query: userText });
      const aiMsg = {
        id: `ai_${Date.now()}`,
        role: "assistant",
        text: res.data.answer || "No response received.",
      };
      setChatLog((prev) => [...prev, aiMsg]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Global Copilot query failed");
      setChatLog((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          text: "⚠️ Sorry, I encountered an issue retrieving cross-conversation context. Please make sure `GROQ_API_KEY` is set in `backend/.env`.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-base-100/50 backdrop-blur-md relative">
      {/* Header */}
      <div className="p-4 border-b border-base-300 bg-base-100/80 backdrop-blur-md flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-content shadow-lg">
            <Bot className="size-6 animate-pulse" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-base-content tracking-tight flex items-center gap-2">
              <span>Global AI Copilot</span>
              <span className="badge badge-primary badge-sm font-semibold">RAG Cross-Chat</span>
            </h2>
            <p className="text-xs text-base-content/60 font-medium">
              Queries vectors across all your direct messages & team threads
            </p>
          </div>
        </div>
      </div>

      {/* Chat Output Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatLog.map((msg) => (
          <div
            key={msg.id}
            className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div
                className={`size-10 rounded-2xl flex items-center justify-center border shadow-sm ${
                  msg.role === "user"
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-gradient-to-tr from-primary/20 to-accent/20 text-primary border-primary/40"
                }`}
              >
                {msg.role === "user" ? (
                  <span className="font-bold text-xs">YOU</span>
                ) : (
                  <Sparkles className="size-5" />
                )}
              </div>
            </div>
            <div
              className={`chat-bubble p-4 rounded-2xl max-w-2xl ${
                msg.role === "user"
                  ? "bg-primary text-primary-content font-medium"
                  : "bg-base-200 text-base-content border border-base-300 shadow-md"
              }`}
            >
              <MarkdownRenderer content={msg.text} />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="size-10 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <Bot className="size-5 animate-pulse" />
              </div>
            </div>
            <div className="chat-bubble bg-base-200 border border-base-300 p-4 rounded-2xl flex items-center gap-3 text-xs text-base-content/70">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span>Scanning ChromaDB vector store & synthesizing response...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts & Input Bar */}
      <div className="p-4 border-t border-base-300 bg-base-100/80 backdrop-blur-md">
        {/* Sample Prompt Chips */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar">
          <span className="text-xs font-semibold text-primary shrink-0 flex items-center gap-1">
            <Sparkles className="size-3" /> Quick Prompts:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(p);
              }}
              className="text-xs bg-base-200 hover:bg-primary/15 hover:text-primary border border-base-300 rounded-full px-3 py-1 text-base-content transition-all shrink-0 active:scale-95"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            className="input input-bordered w-full rounded-xl input-md text-sm focus:outline-none focus:border-primary shadow-inner"
            placeholder="Ask Global Copilot across all conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="btn btn-primary rounded-xl px-5 flex items-center gap-1.5 shadow-md"
          >
            {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GlobalAiChatContainer;
