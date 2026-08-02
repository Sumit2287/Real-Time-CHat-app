import { useState } from "react";
import { Sparkles, Search, X, Loader2, MessageSquare } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const AiSearchModal = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, searchResults, isSearching, searchMessages, clearSearch } = useChatStore();
  const [query, setQuery] = useState("");

  if (!isSearchModalOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      searchMessages(query);
    }
  };

  const handleClose = () => {
    setIsSearchModalOpen(false);
    clearSearch();
    setQuery("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-base-100 border border-base-300 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-base-300 flex items-center justify-between bg-base-200/50">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <Sparkles className="size-5 text-primary animate-pulse" />
            <span>AI Semantic Search (RAG)</span>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle text-base-content/70 hover:text-base-content"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="p-4 border-b border-base-300 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
            <input
              type="text"
              className="input input-bordered w-full pl-9 pr-4 input-md rounded-xl focus:outline-none focus:border-primary"
              placeholder="Search meaning (e.g. 'JWT token discussion', 'Docker deployment')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <button type="submit" disabled={isSearching || !query.trim()} className="btn btn-primary rounded-xl px-6">
            {isSearching ? <Loader2 className="size-5 animate-spin" /> : "Search"}
          </button>
        </form>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isSearching && (
            <div className="flex flex-col items-center justify-center py-12 text-base-content/60 gap-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Computing dense embeddings with BAAI/bge-small-en-v1.5...</p>
            </div>
          )}

          {!isSearching && searchResults.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-base-content/50">
              <MessageSquare className="size-12 mb-2 stroke-1 opacity-40" />
              <p className="text-base font-semibold">
                {query ? "No semantic matches found" : "Enter a search query to search across conversations"}
              </p>
              <p className="text-xs max-w-sm mt-1">
                AI semantic search understands context, concepts, and intent rather than plain keyword matching.
              </p>
            </div>
          )}

          {!isSearching &&
            searchResults.map((res, index) => (
              <div
                key={res.messageId || index}
                className="p-4 rounded-xl border border-base-200 bg-base-200/40 hover:bg-base-200 transition-all flex flex-col gap-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="badge badge-primary badge-outline text-xs font-semibold gap-1">
                    <Sparkles className="size-3" />
                    {res.relevanceScore}% Match
                  </span>
                  <span className="text-xs opacity-50 font-mono">
                    {res.timestamp ? new Date(res.timestamp).toLocaleTimeString() : ""}
                  </span>
                </div>

                <div
                  className="text-sm text-base-content leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: res.highlightedText || res.text }}
                />
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-base-300 text-xs text-center text-base-content/50 bg-base-200/30">
          Powered by ChromaDB Vector Database & BAAI/bge-small-en-v1.5 Embeddings
        </div>
      </div>
    </div>
  );
};

export default AiSearchModal;
