import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Search, Users, Sparkles, UserCheck, Bot } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    isGlobalAiSelected,
    setIsGlobalAiSelected,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOnline && matchesSearch;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-80 border-r border-base-300 flex flex-col transition-all duration-300 bg-base-100/60 backdrop-blur-xl shadow-lg">
      {/* Header section */}
      <div className="border-b border-base-300 w-full p-4 space-y-3 bg-base-200/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Users className="size-5" />
            </div>
            <div className="hidden lg:block">
              <h2 className="font-bold text-sm tracking-tight text-base-content">Messages</h2>
              <p className="text-[11px] text-base-content/50">Direct & AI Workspace</p>
            </div>
          </div>
          <span className="hidden lg:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/20">
            {users.length} Users
          </span>
        </div>

        {/* Search input for large screens */}
        <div className="hidden lg:block relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 pr-3 rounded-xl text-xs bg-base-100/80 focus:outline-none focus:border-primary transition-all shadow-inner"
          />
        </div>

        {/* Online filter toggle */}
        <div className="hidden lg:flex items-center justify-between text-xs text-base-content/70 pt-1">
          <label className="cursor-pointer flex items-center gap-2 select-none font-medium hover:text-base-content transition-colors">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-xs checkbox-primary rounded-md"
            />
            <span>Online Only</span>
          </label>
          <span className="text-emerald-500 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[11px]">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            {Math.max(0, onlineUsers.length - 1)} Online
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="overflow-y-auto w-full py-2 space-y-1.5 px-2 flex-1 no-scrollbar">
        {/* Global AI Copilot Button */}
        <button
          onClick={() => setIsGlobalAiSelected(true)}
          className={`
            w-full p-3 flex items-center gap-3.5 rounded-2xl transition-all duration-200
            group border mb-2
            ${
              isGlobalAiSelected
                ? "bg-gradient-to-r from-primary/20 via-accent/15 to-primary/10 text-primary border-primary/40 shadow-md font-bold"
                : "bg-base-200/50 border-primary/20 text-base-content hover:bg-primary/10 hover:border-primary/40"
            }
          `}
        >
          <div className="size-11 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-content shrink-0 shadow-md group-hover:scale-105 transition-transform">
            <Bot className="size-6 animate-pulse" />
          </div>
          <div className="hidden lg:block text-left min-w-0 flex-1">
            <div className="font-extrabold text-sm flex items-center justify-between">
              <span>Global AI Copilot</span>
              <Sparkles className="size-3.5 text-primary" />
            </div>
            <div className="text-[11px] text-primary/80 font-semibold truncate mt-0.5">
              Cross-Chat Assistant (RAG)
            </div>
          </div>
        </button>

        <div className="hidden lg:block px-2 py-1 text-[10px] font-bold text-base-content/40 uppercase tracking-wider">
          Direct Messages
        </div>

        {filteredUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const isSelected = selectedUser?._id === user._id && !isGlobalAiSelected;

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3.5 rounded-2xl transition-all duration-200
                group relative border
                ${
                  isSelected
                    ? "bg-primary/10 text-primary border-primary/30 shadow-md shadow-primary/5 font-semibold"
                    : "border-transparent text-base-content hover:bg-base-200/70 hover:border-base-300"
                }
              `}
            >
              <div className="relative mx-auto lg:mx-0 shrink-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-11 object-cover rounded-2xl border-2 border-base-100 shadow-sm group-hover:scale-105 transition-transform"
                />
                {isOnline ? (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-emerald-500 
                    rounded-full ring-2 ring-base-100 shadow-sm"
                  />
                ) : (
                  <span className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-base-300 rounded-full ring-2 ring-base-100" />
                )}
              </div>

              {/* User info - visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div className="font-semibold text-sm truncate flex items-center justify-between">
                  <span>{user.fullName}</span>
                </div>
                <div className="text-xs text-base-content/60 truncate flex items-center gap-1.5 mt-0.5">
                  {isOnline ? (
                    <span className="text-emerald-500 font-medium flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Active now
                    </span>
                  ) : (
                    <span className="opacity-70">Offline</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/50 py-12 text-sm flex flex-col items-center gap-2">
            <UserCheck className="size-8 opacity-40 stroke-1" />
            <p className="font-medium">No contacts match filter</p>
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
