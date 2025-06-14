import { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "http://localhost:1221";

export default function FindUser({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [unread, setUnread] = useState({});

  useEffect(() => {
    if (search.length >= 2) {
      axios.get(`${backendUrl}/api/users/get-users`, { withCredentials: true })
        .then(res => setUsers(res.data));
      // Fetch unread counts for all users
      axios.get(`${backendUrl}/api/chat/unread-per-user`, { withCredentials: true })
        .then(res => setUnread(res.data)); // { userId: count, ... }
    } else {
      setUsers([]);
    }
  }, [search]);

  const filtered = users.filter(u =>
    (u.fullName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-2 border-b">
      <input
        className="w-full border rounded px-2 py-1 mb-2"
        placeholder="Find user..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {search.length >= 2 && (
        <div className="max-h-40 overflow-y-auto">
          {filtered.map(u => (
            <div
              key={u._id}
              className="p-2 hover:bg-blue-50 cursor-pointer rounded flex justify-between items-center"
              onClick={() => onSelectUser(u)}
            >
              <span>{u.fullName}</span>
              {unread[u._id] > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 ml-2">
                  {unread[u._id]}
                </span>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-xs text-gray-400 text-center mt-2">No users found.</div>
          )}
        </div>
      )}
    </div>
  );
}