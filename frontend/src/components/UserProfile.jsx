import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/auth.store";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",

    sector: "",
    subsector: "",
  });
  const [profileImage, setProfileImage] = useState("");
  const [editMode, setEditMode] = useState(false);

  const { updateProfile, user, fetchProfile, isLoading } = useAuthStore();
  console.log(user);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:1221/api/users/get-profile",
          {
            withCredentials: true,
          }
        );

        if (res.data.success && res.data.user) {
          const user = res.data.user;

          console.log(user);
          setProfile({
            fullName: user.fullName || "N/A",
            email: user.email || "N/A",

            sector: user.sector?.sector_name || "N/A",
            subsector: user.subsector?.subsector_name || "N/A",
          });

          setProfileImage(user.profileImage || "");
        }

        console.log(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to update profile.");
        return;
      }

      const res = await axios.put(
        "http://localhost:1221/api/users/update-profile",
        { ...profile, profileImage },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        alert("Profile updated successfully!");
        setEditMode(false);
      } else {
        alert("Update failed.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-6">User Profile</h2>

      <div className="flex items-center gap-4 mb-6">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        {editMode && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="ml-4"
          />
        )}
      </div>

      <div className="space-y-4">
        {["fullName", "email", "sector", "subsector"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium capitalize">
              {field}
            </label>
            {editMode ? (
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={profile[field]}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            ) : (
              <p className="text-gray-700">{profile[field] || "N/A"}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        {editMode ? (
          <>
            <button
              onClick={saveChanges}
              className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
              disabled={isLoading}
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
