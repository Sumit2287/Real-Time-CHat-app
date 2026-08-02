import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import GlobalAiChatContainer from "../components/GlobalAiChatContainer";

const HomePage = () => {
  const { selectedUser, isGlobalAiSelected } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-2xl overflow-hidden">
            <Sidebar />

            {isGlobalAiSelected ? (
              <GlobalAiChatContainer />
            ) : !selectedUser ? (
              <NoChatSelected />
            ) : (
              <ChatContainer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
