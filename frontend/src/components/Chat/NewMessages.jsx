import { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:1221";

export default function NewMessages({ onSelectUser }) {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    axios.get(`${backendUrl}/api/chat/recent`, { withCredentials: true })
      .then(res => setRecent(res.data));
  }, []);

  return (
    <div className="p-2 border-b">
      <div className="font-bold text-sm mb-2">Recent Chats</div>
      <div className="max-h-32 overflow-y-auto">
        {recent.map(u => (
          <div
            key={u._id}
            className="p-2 hover:bg-blue-50 cursor-pointer rounded"
            onClick={() => onSelectUser(u)}
          >
            {u.fullName}
          </div>
        ))}
      </div>
    </div>
  );
}