import { Sparkles, Bot, Loader2 } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import MarkdownRenderer from "./MarkdownRenderer";

const AiAssistantBubble = () => {
  const { aiStreamingState } = useChatStore();

  if (!aiStreamingState.isStreaming && !aiStreamingState.text) return null;

  return (
    <div className="chat chat-start my-3 animate-fadeIn">
      <div className="chat-image avatar">
        <div className="size-10 rounded-2xl border border-primary/40 bg-gradient-to-tr from-primary/20 to-accent/20 flex items-center justify-center text-primary shadow-md">
          <Bot className="size-5 animate-pulse" />
        </div>
      </div>
      <div className="chat-header mb-1 flex items-center gap-1.5 text-xs text-primary font-bold">
        <Sparkles className="size-3.5 animate-spin text-primary" />
        <span>AI Assistant (Groq Token Stream)</span>
      </div>
      <div className="chat-bubble bg-base-200/90 border border-primary/30 text-base-content shadow-lg relative p-4 rounded-2xl min-w-[280px]">
        {aiStreamingState.text ? (
          <MarkdownRenderer content={aiStreamingState.text} />
        ) : (
          <div className="flex items-center gap-2 text-xs opacity-70 py-1 font-medium">
            <Loader2 className="size-4 animate-spin text-primary" />
            <span>Retrieving context & generating structured answer...</span>
          </div>
        )}
        {aiStreamingState.isStreaming && aiStreamingState.text && (
          <span className="inline-block size-2 bg-primary ml-1 animate-ping rounded-full" />
        )}
      </div>
    </div>
  );
};

export default AiAssistantBubble;
