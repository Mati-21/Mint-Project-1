import { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "http://localhost:1221";

export default function GroupChat({ onSelectGroup }) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/chat/groups`, { withCredentials: true })
      .then((res) => setGroups(res.data));
  }, []);

  const handleFileUpload = async (file, groupId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("groupId", groupId); // <-- Make sure groupId is sent

    try {
      const res = await axios.post(
        `${backendUrl}/api/chat/upload-group-file`,
        formData,
        { withCredentials: true }
      );
      // Handle successful file upload (e.g., update UI, show message, etc.)
    } catch (err) {
      alert("File upload failed");
    }
  };

  return (
    <div>
      <h2 className="font-bold p-4">Groups</h2>
      <ul>
        {groups.map((group) => (
          <li
            key={group._id}
            className="p-2 cursor-pointer hover:bg-green-100"
            onClick={() => onSelectGroup(group)}
          >
            {group.name}
          </li>
        ))}
      </ul>
    </div>
  );
}