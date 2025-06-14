import { useState, useEffect, useRef } from "react";
import axios from "axios";

const backendUrl = "http://localhost:1221";

function FilePreviewModal({ file, onRemove, onSend, loading }) {
  if (!file) return null;

  const ext = file.name.split('.').pop().toLowerCase();

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center  backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg max-w-180 w-150 p-6 relative border border-green-200">
        <button
          className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-red-500"
          onClick={onRemove}
        >
          &times;
        </button>
        <div className="mb-2 font-semibold text-xs">{file.name}</div>
        <div className="mb-4 text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
        <div className="flex flex-col items-center mb-4">
          {/* Image */}
          {/\.(jpg|jpeg|png|gif|webp)$/i.test(file.name) && (
            <img src={URL.createObjectURL(file)} alt={file.name} className="max-h-60 rounded" />
          )}
          {/* Audio */}
          {/\.(mp3|wav|ogg)$/i.test(file.name) && (
            <audio controls src={URL.createObjectURL(file)} className="w-full mt-2" />
          )}
          {/* Video */}
          {/\.(mp4|webm|ogg)$/i.test(file.name) && (
            <video controls src={URL.createObjectURL(file)} className="w-full max-h-60 mt-2" />
          )}
          {/* PDF */}
          {/\.(pdf)$/i.test(file.name) && (
            <iframe
              src={URL.createObjectURL(file)}
              title={file.name}
              className="w-full h-60 mt-2"
            />
          )}
          {/* Other */}
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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch messages
  useEffect(() => {
    if (group) {
      axios.get(`${backendUrl}/api/chat/group-messages/${group._id}`, { withCredentials: true })
        .then(res => setMessages(res.data));
    } else if (user) {
      axios.get(`${backendUrl}/api/chat/messages/${user._id}`, { withCredentials: true })
        .then(res => setMessages(res.data));
    }
  }, [user, group]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message or file
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    if (file) {
      setShowFileModal(true);
      return;
    }

    try {
      const res = await axios.post(
        group
          ? `${backendUrl}/api/chat/send-group/${group._id}`
          : `${backendUrl}/api/chat/send/${user._id}`,
        { text: input },
        { withCredentials: true }
      );
      setInput("");
      setMessages((prev) => [...prev, res.data]);
    } catch {
      alert("Failed to send message.");
    }
  };

  // Actually upload the file after confirming in modal
  const handleConfirmFile = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (group) formData.append("groupId", group._id);

    try {
      const res = await axios.post(
        group
          ? `${backendUrl}/api/chat/upload-group-file`
          : `${backendUrl}/api/chat/upload-file`,
        formData,
        { withCredentials: true }
      );
      setMessages((prev) => [...prev, res.data]);
      setFile(null);
      setShowFileModal(false);
      setUploading(false);
    } catch {
      alert("File upload failed");
      setUploading(false);
      setShowFileModal(false);
      setFile(null);
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
          <div key={msg._id || idx} className={`mb-2 flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
            <div className="max-w-xs">
              <div className={`px-3 py-2 rounded-lg ${msg.isMe ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                {msg.text && <div>{msg.text}</div>}
                {msg.fileUrl && (
                  <div className="mt-2">
                    {/* Image preview */}
                    {msg.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <a href={`${backendUrl}${msg.fileUrl}`} target="_blank" rel="noopener noreferrer">
                        <img src={`${backendUrl}${msg.fileUrl}`} alt={msg.fileName} className="max-h-40 rounded border mb-1" />
                        <div className="text-blue-600 underline text-sm truncate">📎 {msg.fileName}</div>
                      </a>
                    ) : /* Audio preview */
                    msg.fileUrl.match(/\.(mp3|wav|ogg)$/i) ? (
                      <div>
                        <audio controls src={`${backendUrl}${msg.fileUrl}`} className="w-full" />
                        <a href={`${backendUrl}${msg.fileUrl}`} download={msg.fileName} className="text-blue-600 underline text-sm">
                          📎 {msg.fileName}
                        </a>
                      </div>
                    ) : /* Video preview */
                    msg.fileUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                      <div>
                        <video controls src={`${backendUrl}${msg.fileUrl}`} className="max-h-40 w-full mb-1" />
                        <a href={`${backendUrl}${msg.fileUrl}`} download={msg.fileName} className="text-blue-600 underline text-sm">
                          📎 {msg.fileName}
                        </a>
                      </div>
                    ) : /* PDF preview */
                    msg.fileUrl.match(/\.(pdf)$/i) ? (
                      <div>
                        <iframe
                          src={`${backendUrl}${msg.fileUrl}`}
                          title={msg.fileName}
                          className="w-full h-60 rounded border mb-1"
                        />
                        <a href={`${backendUrl}${msg.fileUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                          📎 {msg.fileName}
                        </a>
                      </div>
                    ) : (
                      // Generic file download
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
        {/* File input with custom button */}
        <label className="flex items-center cursor-pointer bg-gray-100 hover:bg-green-100 px-3 py-2 rounded transition">
          <svg className="w-5 h-5 text-green-600 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l7.586-7.586a4 4 0 10-5.656-5.656l-8.486 8.486a6 6 0 108.486 8.486l1.414-1.414" />
          </svg>
          <span className="text-xs text-green-700">Attach</span>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <input
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition"
        >
          Send
        </button>
      </form>
      {/* File Preview Modal */}
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