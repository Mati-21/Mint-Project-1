import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../../store/auth.store";  // your auth store

const backendUrl = "http://localhost:1221";

export default function GroupChat({ onSelectGroup, selectedGroup }) {
  const currentUser = useAuthStore(state => state.user);  // get current user from store

  const [groups, setGroups] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!currentUser) return;  // wait for user to be loaded

    setSelectedUserIds(new Set([currentUser._id]));

    axios.get(`${backendUrl}/api/users/get-users`, { withCredentials: true })
      .then(res => setAllUsers(res.data))
      .catch(() => alert("Failed to load users"));

    fetchGroups();
  }, [currentUser]);

  const fetchGroups = () => {
    axios.get(`${backendUrl}/api/chat/groups`, { withCredentials: true })
      .then(res => setGroups(res.data))
      .catch(() => alert("Failed to load groups"));
  };

  const toggleUser = id => {
    setSelectedUserIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (id !== currentUser._id) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCreateGroup = () => {
    axios.post(`${backendUrl}/api/chat/groups`, {
      name: groupName,
      members: Array.from(selectedUserIds),
    }, { withCredentials: true })
      .then(() => {
        fetchGroups();
        setShowCreateForm(false);
        setGroupName("");
        setSearch("");
        setSelectedUserIds(new Set([currentUser._id]));
      })
      .catch(() => alert("Failed to create group"));
  };

  const handleLeave = groupId => {
    axios.post(`${backendUrl}/api/chat/groups/${groupId}/leave`, {}, { withCredentials: true })
      .then(() => fetchGroups())
      .catch(() => alert("Failed to leave group"));
  };

  const handleDelete = groupId => {
    axios.delete(`${backendUrl}/api/chat/groups/${groupId}`, { withCredentials: true })
      .then(() => {
        fetchGroups();
        onSelectGroup(null);
      })
      .catch(() => alert("Failed to delete group"));
  };

  if (!currentUser) return <div>Loading user...</div>;

  const filteredUsers = allUsers.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-2 border-r bg-white">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">Groups</h2>
        <button
          className="text-green-600 text-xs"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "Create"}
        </button>
      </div>

      {showCreateForm && (
        <div className="p-2 bg-gray-50 rounded mb-4">
          <input
            placeholder="Group name"
            className="w-full mb-2 px-2 py-1 border rounded text-sm"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
          />
          <input
            placeholder="Search users..."
            className="w-full mb-2 px-2 py-1 border rounded text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="max-h-32 overflow-y-auto mb-2 border p-1 text-sm">
            {filteredUsers.map(user => (
              <label key={user._id} className="flex items-center space-x-2 mb-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedUserIds.has(user._id)}
                  disabled={user._id === currentUser._id}
                  onChange={() => toggleUser(user._id)}
                />
                <span>{user.fullName}{user._id === currentUser._id ? " (You)" : ""}</span>
              </label>
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-xs text-gray-400 text-center mt-2">No users found.</div>
            )}
          </div>
          <button
            className="bg-green-600 text-white py-1 px-3 rounded text-sm disabled:opacity-50"
            onClick={handleCreateGroup}
            disabled={!groupName || selectedUserIds.size < 2}
          >
            Create
          </button>
        </div>
      )}

      <ul className="space-y-1">
        {groups.map(group => {
          const isOwner = currentUser && group.owner === currentUser._id;
          const inGroup = currentUser && group.members.includes(currentUser._id);
          return (
            <li key={group._id}>
              <div
                className="flex justify-between p-2 hover:bg-green-100 rounded cursor-pointer"
                onClick={() => onSelectGroup(group)}
              >
                <span>{group.name}</span>
                {(isOwner || inGroup) && (
                  <div className="space-x-1">
                    {isOwner && (
                      <button
                        className="text-red-600 text-xs"
                        onClick={e => {
                          e.stopPropagation();
                          handleDelete(group._id);
                        }}
                      >
                        Delete
                      </button>
                    )}
                    {!isOwner && (
                      <button
                        className="text-gray-600 text-xs"
                        onClick={e => {
                          e.stopPropagation();
                          handleLeave(group._id);
                        }}
                      >
                        Leave
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
