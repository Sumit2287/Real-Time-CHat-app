import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Search, Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOnline && matchesSearch;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 bg-base-100/50">
      <div className="border-b border-base-300 w-full p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            <span className="font-semibold hidden lg:block text-base">Contacts</span>
          </div>
          <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {users.length} total
          </span>
        </div>

        {/* Search input for large screens */}
        <div className="hidden lg:block relative">
          <Search className="absolute left-3 top-2.5 size-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 rounded-lg text-xs"
          />
        </div>

        {/* Online filter toggle */}
        <div className="hidden lg:flex items-center justify-between text-xs text-base-content/70">
          <label className="cursor-pointer flex items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-xs checkbox-primary rounded"
            />
            <span>Show online only</span>
          </label>
          <span className="text-emerald-500 font-medium flex items-center gap-1">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            {Math.max(0, onlineUsers.length - 1)} online
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-2 space-y-1 px-1">
        {filteredUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const isSelected = selectedUser?._id === user._id;

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-200
                hover:bg-base-200/80
                ${isSelected ? "bg-primary/10 text-primary border border-primary/20 shadow-sm font-medium" : "text-base-content"}
              `}
            >
              <div className="relative mx-auto lg:mx-0 shrink-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-11 object-cover rounded-full border border-base-300"
                />
                {isOnline && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-emerald-500 
                    rounded-full ring-2 ring-base-100 shadow-sm"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div className="font-semibold text-sm truncate">{user.fullName}</div>
                <div className="text-xs text-base-content/60 truncate">
                  {isOnline ? (
                    <span className="text-emerald-500 font-medium">Online</span>
                  ) : (
                    "Offline"
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/50 py-8 text-sm">
            No contacts found
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;

