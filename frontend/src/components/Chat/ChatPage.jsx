import { useState } from "react";
import FindUser from "./FindUser";
import ChatWindow from "./ChatWindow";
import NewMessages from "./NewMessages";
import InfoPanel from "./InfoPanel";
import GroupChat from "./GroupChat";

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSelectedGroup(null);
  };
  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
  };

  return (
    <div className="flex h-[85vh] bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
      {/* Left: Find User & New Messages & Groups */}
      <div className="w-1/4 border-r flex flex-col bg-white/80">
        <FindUser onSelectUser={handleSelectUser} />
        <NewMessages onSelectUser={handleSelectUser} />
        {/* Pass the handler so GroupChat can select a group */}
        <GroupChat onSelectGroup={handleSelectGroup} />
      </div>
      {/* Center: Chat Window */}
      <div className="flex-1 flex flex-col bg-white/90">
        {selectedUser && <ChatWindow user={selectedUser} />}
        {selectedGroup && !selectedUser && (
          // Only render ChatWindow for group here, not inside GroupChat
          <ChatWindow group={selectedGroup} />
        )}
        {!selectedUser && !selectedGroup && (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a user or group to chat
          </div>
        )}
      </div>
      {/* Right: Info Panel */}
      <div className="w-1/4 border-l bg-white/80">
        <InfoPanel user={selectedUser} group={selectedGroup} />
      </div>
    </div>
  );
}