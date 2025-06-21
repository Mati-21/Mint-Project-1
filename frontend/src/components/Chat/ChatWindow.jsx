import { useState, useEffect, useRef } from "react";
import axios from "axios";
import useAuthStore from "../../store/auth.store";

const backendUrl = "http://localhost:1221";

function FilePreviewModal({ file, onRemove, onSend, loading }) {
  if (!file) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg max-w-180 w-150 p-6 relative border border-green-200">
        <button
          className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-red-500"
          onClick={onRemove}
          disabled={loading}
        >
          &times;
        </button>
        <div className="mb-2 font-semibold text-xs">{file.name}</div>
        <div className="mb-4 text-xs text-gray-500">
          {(file.size / (1024 * 1024)).toFixed(2)} MB
        </div>
        <div className="flex flex-col items-center mb-4">
          {/* Image preview */}
          {/\.(jpg|jpeg|png|gif|webp)$/i.test(file.name) && (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="max-h-60 rounded"
            />
          )}
          {/* Audio preview */}
          {/\.(mp3|wav|ogg)$/i.test(file.name) && (
            <audio controls src={URL.createObjectURL(file)} className="w-full mt-2" />
          )}
          {/* Video preview */}
          {/\.(mp4|webm|ogg)$/i.test(file.name) && (
            <video
              controls
              src={URL.createObjectURL(file)}
              className="w-full max-h-60 mt-2"
            />
          )}
          {/* PDF preview */}
          {/\.(pdf)$/i.test(file.name) && (
            <iframe
              src={URL.createObjectURL(file)}
              title={file.name}
              className="w-full h-60 mt-2"
            />
          )}
          {/* Other file types */}
          {!/\.(jpg|jpeg|png|gif|webp|mp3|wav|ogg|mp4|webm|pdf)$/i.test(file.name) && (
            <div className="text-gray-600 mt-4">No preview available for this file type.</div>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="bg-red-500 text-white px-4 py-1 rounded"
            onClick={onRemove}
            disabled={loading}
          >
            Remove
          </button>
          <button
            className="bg-green-600 text-white px-4 py-1 rounded"
            onClick={onSend}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatWindow({ user, group }) {
  const authUser = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Normalize fileUrl to ensure it starts with /uploads/
  const normalizeFileUrl = (fileUrl) => {
    if (!fileUrl) return null;
    if (fileUrl.startsWith("/uploads/")) return fileUrl;
    if (fileUrl.startsWith("uploads/")) return "/" + fileUrl;
    return "/uploads/" + fileUrl;
  };

  // Fetch messages function (extract to reuse)
  const fetchMessages = async () => {
    try {
      let res;
      if (group) {
        res = await axios.get(`${backendUrl}/api/chat/group-messages/${group._id}`, {
          withCredentials: true,
        });
      } else if (user) {
        res = await axios.get(`${backendUrl}/api/chat/messages/${user._id}`, {
          withCredentials: true,
        });
        await axios.post(
          `${backendUrl}/api/chat/mark-seen/${user._id}`,
          {},
          { withCredentials: true }
        );
      }

      console.log("Fetched messages:", res.data);

      // Log whenever file messages appear
      const fileMessages = res.data.filter((m) => m.fileUrl);
      if (fileMessages.length > 0) {
        console.log("File messages received:", fileMessages);
      }

      const msgs = res.data.map((m) => ({
        ...m,
        fileUrl: normalizeFileUrl(m.fileUrl),
      }));

      setMessages(msgs);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  // Fetch messages on user/group change
  useEffect(() => {
    fetchMessages();
  }, [user, group]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send text message or open file modal if file selected
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    if (file) {
      setShowFileModal(true);
      return;
    }

    try {
      if (group) {
        await axios.post(
          `${backendUrl}/api/chat/send-group/${group._id}`,
          { text: input },
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${backendUrl}/api/chat/send/${user._id}`,
          { text: input },
          { withCredentials: true }
        );
      }

      setInput("");
      await fetchMessages(); // Force re-fetch instead of just append
    } catch (err) {
      alert("Failed to send message.");
      console.error(err);
    }
  };

  // Confirm and upload the selected file
const handleConfirmFile = async () => {
  if (!file) return;

  setUploading(true);
  const formData = new FormData();
  formData.append("file", file);

  if (group) {
    formData.append("groupId", group._id);
  } else {
    formData.append("to", user._id); // ✅ Add this
  }

  try {
    await axios.post(
      group
        ? `${backendUrl}/api/chat/upload-group-file`
        : `${backendUrl}/api/chat/upload-file`,
      formData,
      { withCredentials: true }
    );

    await fetchMessages();
  } catch (err) {
    console.error("File upload failed:", err);
    alert("File upload failed");
  } finally {
    setFile(null);
    setShowFileModal(false);
    setUploading(false);
  }
};


  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setShowFileModal(true);
    }
  };

  const handleRemoveFile = () => {
    setShowFileModal(false);
    setFile(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={msg._id || idx}
            className={`mb-2 flex ${msg.isMe ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-xs">
              <div
                className={`px-3 py-2 rounded-lg ${
                  msg.isMe ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {/* Show sender name in group chat for messages not sent by me */}
                {group && !msg.isMe && msg.from?.fullName && (
                  <div className="text-xs font-semibold mb-1">{msg.from.fullName}</div>
                )}

                {msg.text && <div>{msg.text}</div>}

                {msg.fileUrl && (
                  <div className="mt-2">
                    {/* Image */}
                    {msg.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <a
                        href={`${backendUrl}${msg.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`${backendUrl}${msg.fileUrl}`}
                          alt={msg.fileName}
                          className="max-h-40 rounded border mb-1"
                        />
                        <div className="text-blue-600 underline text-sm truncate">
                          📎 {msg.fileName}
                        </div>
                      </a>
                    ) : msg.fileUrl.match(/\.(mp3|wav|ogg)$/i) ? (
                      <div>
                        <audio controls src={`${backendUrl}${msg.fileUrl}`} className="w-full" />
                        <a
                          href={`${backendUrl}${msg.fileUrl}`}
                          download={msg.fileName}
                          className="text-blue-600 underline text-sm"
                        >
                          📎 {msg.fileName}
                        </a>
                      </div>
                    ) : msg.fileUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                      <div>
                        <video
                          controls
                          src={`${backendUrl}${msg.fileUrl}`}
                          className="max-h-40 w-full mb-1"
                        />
                        <a
                          href={`${backendUrl}${msg.fileUrl}`}
                          download={msg.fileName}
                          className="text-blue-600 underline text-sm"
                        >
                          📎 {msg.fileName}
                        </a>
                      </div>
                    ) : msg.fileUrl.match(/\.(pdf)$/i) ? (
                      <div>
                        <iframe
                          src={`${backendUrl}${msg.fileUrl}`}
                          title={msg.fileName}
                          className="w-full h-60 rounded border mb-1"
                        />
                        <a
                          href={`${backendUrl}${msg.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          📎 {msg.fileName}
                        </a>
                      </div>
                    ) : (
                      <a
                        href={`${backendUrl}${msg.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                        download={msg.fileName}
                      >
                        📎 {msg.fileName || "Download file"}
                      </a>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs mt-1">
                  <span className="text-gray-400">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

     

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-3 border-t bg-white"
        style={{ boxShadow: "0 -1px 4px rgba(0,0,0,0.03)" }}
      >
        <label className="flex items-center cursor-pointer bg-gray-100 hover:bg-green-100 px-3 py-2 rounded transition">
          <svg
            className="w-5 h-5 text-green-600 mr-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l7.586-7.586a4 4 0 10-5.656-5.656l-8.486 8.486a6 6 0 108.486 8.486l1.414-1.414"
            />
          </svg>
          <span className="text-xs text-green-700">Attach</span>
          <input type="file" onChange={handleFileChange} className="hidden" />
        </label>
        <input
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition"
        >
          Send
        </button>
      </form>

      {showFileModal && file && (
        <FilePreviewModal
          file={file}
          onRemove={handleRemoveFile}
          onSend={handleConfirmFile}
          loading={uploading}
        />
      )}
    </div>
  );
}
