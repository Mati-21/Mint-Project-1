export default function InfoPanel({ user, group }) {
  return (
    <div className="p-4">
      {user && (
        <div>
          <div className="font-bold text-lg mb-2">{user.fullName}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      )}
      {group && (
        <div>
          <div className="font-bold text-lg mb-2">{group.name}</div>
          <div className="text-sm text-gray-500">{group.members.length} members</div>
        </div>
      )}
      {!user && !group && (
        <div className="text-gray-400 text-sm">Select a user or group to start chatting.</div>
      )}
    </div>
  );
}