import { MessageSquare, ShieldCheck, Zap, Sparkles, Bot, Search } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const NoChatSelected = () => {
  const { setIsSearchModalOpen } = useChatStore();

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-8 lg:p-16 bg-base-100/40 backdrop-blur-md">
      <div className="max-w-lg text-center space-y-6">
        {/* Animated Hero Icon */}
        <div className="flex justify-center mb-2">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30 shadow-2xl group-hover:scale-105 transition-all">
              <MessageSquare className="w-12 h-12 text-primary animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -right-2 size-8 bg-primary/20 backdrop-blur-md rounded-2xl border border-primary/30 flex items-center justify-center text-primary shadow-lg">
              <Sparkles className="size-4 animate-spin" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Welcome to Chatty AI 💬
          </h2>
          <p className="text-sm text-base-content/70 max-w-md mx-auto leading-relaxed">
            Select a contact from the sidebar to start messaging, or try our AI-powered features like **@AI Assistant**, **Semantic Search**, and **Smart Replies**.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="btn btn-primary btn-outline gap-2 rounded-xl px-6 font-semibold shadow-md hover:scale-105 transition-all"
          >
            <Sparkles className="size-4 text-primary" />
            <span>Open AI Semantic Search</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-base-300/60">
          <div className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-base-200/50 border border-base-300/40 shadow-sm hover:border-primary/40 transition-all">
            <Bot className="size-5 text-primary animate-bounce" />
            <span className="text-xs font-bold text-base-content">@AI Assistant</span>
            <span className="text-[10px] text-base-content/60">Context RAG</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-base-200/50 border border-base-300/40 shadow-sm hover:border-primary/40 transition-all">
            <Search className="size-5 text-amber-500" />
            <span className="text-xs font-bold text-base-content">Vector Search</span>
            <span className="text-[10px] text-base-content/60">ChromaDB</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-base-200/50 border border-base-300/40 shadow-sm hover:border-primary/40 transition-all">
            <Zap className="size-5 text-indigo-500" />
            <span className="text-xs font-bold text-base-content">Smart Replies</span>
            <span className="text-[10px] text-base-content/60">3 Recommendations</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-base-200/50 border border-base-300/40 shadow-sm hover:border-primary/40 transition-all">
            <ShieldCheck className="size-5 text-emerald-500" />
            <span className="text-xs font-bold text-base-content">Real-Time</span>
            <span className="text-[10px] text-base-content/60">Socket.IO Stream</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
