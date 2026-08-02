import { Sparkles, Loader2 } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const SmartReplies = ({ onSelectReply }) => {
  const { smartReplies, isSmartRepliesLoading } = useChatStore();

  if (isSmartRepliesLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-1.5 text-xs text-base-content/60 animate-pulse">
        <Loader2 className="size-3.5 animate-spin text-primary" />
        <span>Generating smart replies...</span>
      </div>
    );
  }

  if (!smartReplies || smartReplies.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary/80 shrink-0 mr-1">
        <Sparkles className="size-3.5" />
        <span>Suggestions:</span>
      </div>
      {smartReplies.map((reply, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelectReply(reply)}
          className="text-xs bg-base-200 hover:bg-primary/20 hover:text-primary hover:border-primary/40 border border-base-300 transition-all rounded-full px-3 py-1 text-base-content whitespace-nowrap shadow-sm active:scale-95"
        >
          {reply}
        </button>
      ))}
    </div>
  );
};

export default SmartReplies;
