import React, { useEffect, useState } from "react";
import useAuthStore from "../store/auth.store";

const UserProfile = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [sector, setSector] = useState("");
  const [subsector, setSubsector] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const { user, updateProfile, isLoading } = useAuthStore();

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setSector(user.sector?.sector_name || "");
      setSubsector(user.subsector?.subsector_name || "");
      if (user.image) setProfileImage(user.image);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "fullName":
        setFullName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "sector":
        setSector(value);
        break;
      case "subsector":
        setSubsector(value);
        break;
      default:
        break;
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(file);
  };

  const saveChanges = async () => {
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("sector", sector);
    formData.append("subsector", subsector);
    formData.append("image", profileImage);

    await updateProfile(formData);
    setEditMode(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">👤 Profile Details</h2>

      <div className="flex items-center gap-6 mb-6">
        {profileImage ? (
          <img
            src={profileImage instanceof File ? URL.createObjectURL(profileImage) : profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-green-600 shadow"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm border">
            No Image
          </div>
        )}

        {editMode && (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-gray-600 file:border-0 file:bg-green-100 file:px-3 file:py-1 file:rounded file:text-green-700"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
          {editMode ? (
            <input
              type="text"
              name="fullName"
              value={fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-200"
            />
          ) : (
            <p className="text-sm text-gray-800">{fullName || "N/A"}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
          {editMode ? (
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-200"
            />
          ) : (
            <p className="text-sm text-gray-800">{email || "N/A"}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Sector</label>
          {editMode ? (
            <input
              type="text"
              name="sector"
              value={sector}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-200"
            />
          ) : (
            <p className="text-sm text-gray-800">{sector || "N/A"}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Subsector</label>
          {editMode ? (
            <input
              type="text"
              name="subsector"
              value={subsector}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-200"
            />
          ) : (
            <p className="text-sm text-gray-800">{subsector || "N/A"}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        {editMode ? (
          <>
            <button
              onClick={saveChanges}
              disabled={isLoading}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition mr-2"
            >
              {isLoading ? "Updating..." : "Save Changes"}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
