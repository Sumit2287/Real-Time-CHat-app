import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // AI Feature States
  isSearchModalOpen: false,
  searchResults: [],
  isSearching: false,
  smartReplies: [],
  isSmartRepliesLoading: false,
  isGlobalAiSelected: false,
  aiStreamingState: { isStreaming: false, text: "", streamId: null },

  setIsSearchModalOpen: (isOpen) => set({ isSearchModalOpen: isOpen }),
  setIsGlobalAiSelected: (isGlobal) => set({ isGlobalAiSelected: isGlobal, selectedUser: null }),

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true, smartReplies: [] });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
      // Fetch fresh smart reply recommendations for selected user
      get().getSmartReplies(userId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data], smartReplies: [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // AI Semantic Search Action
  searchMessages: async (query) => {
    if (!query || !query.trim()) return;
    set({ isSearching: true });
    try {
      const { selectedUser } = get();
      const params = { query: query.trim() };
      if (selectedUser) params.targetUserId = selectedUser._id;

      const res = await axiosInstance.get("/ai/search", { params });
      set({ searchResults: res.data.data || [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Semantic search failed");
    } finally {
      set({ isSearching: false });
    }
  },

  clearSearch: () => set({ searchResults: [] }),

  // AI Smart Reply Recommender Action
  getSmartReplies: async (targetUserId) => {
    const recipientId = targetUserId || get().selectedUser?._id;
    if (!recipientId) return;

    set({ isSmartRepliesLoading: true });
    try {
      const res = await axiosInstance.get(`/ai/smart-replies/${recipientId}`);
      set({ smartReplies: res.data.suggestions || [] });
    } catch (error) {
      console.warn("Smart replies unavailable:", error.message);
    } finally {
      set({ isSmartRepliesLoading: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });

      // Refresh smart reply recommendations when receiving incoming message
      get().getSmartReplies(selectedUser._id);
    });

    // AI Socket Token Streaming Events
    socket.on("aiStreamStart", (data) => {
      set({
        aiStreamingState: { isStreaming: true, text: "", streamId: data.streamId },
      });
    });

    socket.on("aiStreamChunk", (data) => {
      set((state) => ({
        aiStreamingState: {
          ...state.aiStreamingState,
          text: data.accumulated || state.aiStreamingState.text + (data.token || ""),
        },
      }));
    });

    socket.on("aiStreamEnd", () => {
      set({
        aiStreamingState: { isStreaming: false, text: "", streamId: null },
      });
    });

    socket.on("aiStreamError", (data) => {
      toast.error(data.error || "AI response error");
      set({
        aiStreamingState: { isStreaming: false, text: "", streamId: null },
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("aiStreamStart");
    socket.off("aiStreamChunk");
    socket.off("aiStreamEnd");
    socket.off("aiStreamError");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser, isGlobalAiSelected: false, smartReplies: [] }),
}));
