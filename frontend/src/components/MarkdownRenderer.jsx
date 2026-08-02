import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  // Clean out any legacy robot prefix strings if present
  const cleanedContent = content.replace(/^🤖 AI Assistant:\s*/i, "").trim();

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none text-inherit leading-relaxed overflow-x-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-3 rounded-xl border border-base-300 shadow-sm">
              <table className="table table-sm w-full bg-base-100/80 text-xs border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-base-200/80 text-primary font-bold border-b border-base-300" {...props} />
          ),
          th: ({ node, ...props }) => <th className="px-3 py-2 text-left font-bold" {...props} />,
          td: ({ node, ...props }) => <td className="px-3 py-2 border-t border-base-200/60" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside my-2 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-2 space-y-1" {...props} />,
          li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
          code: ({ node, inline, className, children, ...props }) => {
            if (inline) {
              return (
                <code className="bg-base-300/60 text-primary px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-base-300/80 text-base-content p-3 rounded-xl overflow-x-auto my-2 text-xs font-mono border border-base-300">
                <code {...props}>{children}</code>
              </pre>
            );
          },
          p: ({ node, children, ...props }) => <p className="my-1 leading-relaxed" {...props}>{children}</p>,
        }}
      >
        {cleanedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
