import { X, Sparkles, Phone, Video } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, setIsSearchModalOpen } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser?._id);

  return (
    <div className="p-3.5 border-b border-base-300 bg-base-100/70 backdrop-blur-md sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {/* Avatar */}
          <div className="relative">
            <img
              src={selectedUser?.profilePic || "/avatar.png"}
              alt={selectedUser?.fullName}
              className="size-11 object-cover rounded-2xl border-2 border-primary/20 shadow-sm"
            />
            {isOnline ? (
              <span className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-emerald-500 rounded-full ring-2 ring-base-100 shadow-sm" />
            ) : (
              <span className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-base-300 rounded-full ring-2 ring-base-100" />
            )}
          </div>

          {/* User info */}
          <div>
            <h3 className="font-bold text-base text-base-content tracking-tight">{selectedUser?.fullName}</h3>
            <div className="flex items-center gap-1.5 text-xs">
              {isOnline ? (
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Now
                </span>
              ) : (
                <span className="text-base-content/50 font-medium">Offline</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="btn btn-sm btn-ghost btn-circle text-primary hover:bg-primary/10 transition-colors"
            title="AI Semantic Search"
          >
            <Sparkles className="size-4" />
          </button>

          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-sm btn-ghost btn-circle text-base-content/60 hover:text-base-content hover:bg-base-200 transition-colors"
            title="Close chat"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
