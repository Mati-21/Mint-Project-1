import ChatPage from "./ChatPage";
import { IoClose } from "react-icons/io5";
import { useChat } from "../../context/ChatContext";

export default function ChatDrawer() {
  const { showChat, setShowChat } = useChat();

  if (!showChat) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col shadow-2xl"
      style={{ minWidth: 320, minHeight: 300 }}
    >
      <div className="flex justify-between items-center p-4 bg-green-600 text-white">
        <span className="font-bold text-lg">Chat</span>
        <button
          className="text-2xl"
          onClick={() => setShowChat(false)}
          aria-label="Close chat"
        >
          <IoClose />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ChatPage />
      </div>
    </div>
  );
}