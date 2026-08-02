import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import AiAssistantBubble from "./AiAssistantBubble";
import AiSearchModal from "./AiSearchModal";
import MarkdownRenderer from "./MarkdownRenderer";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
        <AiSearchModal />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto relative">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isAiMsg = message.text && message.text.includes("AI Assistant:");
          const isSender = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <div className=" chat-image avatar">
                <div className="size-10 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
                  <img
                    src={
                      isSender
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div
                className={`chat-bubble flex flex-col p-4 rounded-2xl ${
                  isSender ? "bg-primary text-primary-content" : "bg-base-200 text-base-content border border-base-300"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[240px] rounded-xl mb-2"
                  />
                )}
                {message.text && (
                  isAiMsg ? (
                    <MarkdownRenderer content={message.text} />
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  )
                )}
              </div>
            </div>
          );
        })}

        {/* Real-time Streaming AI Assistant Bubble */}
        <AiAssistantBubble />
      </div>

      <MessageInput />
      <AiSearchModal />
    </div>
  );
};
export default ChatContainer;
