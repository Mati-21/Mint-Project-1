import { Bell, CheckCircle } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Report Received",
    module: "Reports Management",
    message: '"USER NAME" Sent a report and tagged you as a recipient.',
    time: "1 min ago",
    isRead: true,
  },
  {
    id: 2,
    title: "Leave Request Received",
    module: "Leave Management",
    message: '"USER NAME" Sent a leave request and tagged you as a recipient.',
    time: "1 min ago",
    isRead: false,
  },
  {
    id: 3,
    title: "Exit Request Received",
    module: "Exit Management",
    message: '"USER NAME" Sent an exit request and tagged you as a recipient.',
    time: "1 min ago",
    isRead: false,
  },
  {
    id: 4,
    title: "Punch in",
    module: "Time Management",
    message: '"USER NAME" Just punched in at the "Main Office".',
    time: "1 min ago",
    isRead: false,
  },
  {
    id: 5,
    title: "Punch in",
    module: "Time Management",
    message: '"USER NAME" Just punched in at the "Main Office".',
    time: "1 min ago",
    isRead: false,
  },
];

export default function NotificationCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 max-w-5xl mx-auto">
      <h2 className="text-4xl font-semibold mb-4">Notifications</h2>

      {notifications.map((note) => (
        <div
          key={note.id}
          className="border-t first:border-none py-3 px-1 relative group"
        >
          <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
            <span className="text-red-400 font-bold">{note.module}</span>
            <span>{note.time}</span>
          </div>

          <p className="font-medium text-gray-800">{note.title}</p>
          <p className="text-sm text-gray-600 mb-1">{note.message}</p>

          <div className="text-sm text-indigo-600 font-medium">
            {note.isRead ? (
              <span className="flex items-center gap-1 text-gray-500">
                <CheckCircle className="w-4 h-4" /> Read
              </span>
            ) : (
              <button className="hover:underline">Mark as Read</button>
            )}
          </div>

          {!note.isRead && (
            <div className="absolute top-0 right-0 w-1.5 h-full bg-indigo-600 rounded-r-lg" />
          )}
        </div>
      ))}

      <div className="mt-4 text-center">
        <button className="text-indigo-700 font-medium hover:underline text-sm flex items-center justify-center gap-1 mx-auto">
          <CheckCircle className="w-4 h-4" /> Mark All as Read
        </button>
      </div>
    </div>
  );
}
