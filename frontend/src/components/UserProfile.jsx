import React, { useState } from "react";

export default function UserProfile() {
  const [profile, setProfile] = useState({
    fullName: "Azmach Desalegn",
    email: "azmach.desalegn@mint.gov.et",
    city: "Addis Ababa",
    phone: "0913656284",
    sector: "Digital Transformation",
    subSector: "e-Government Development",
  });

  const [modal, setModal] = useState("");
  const [profileImage, setProfileImage] = useState(
    "/mnt/data/photo_4_2025-05-20_10-57-05.jpg"
  );

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveChanges = () => {
    setModal("");
  };

  const changePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-100 p-5 min-h-screen">
      <div className="max-w-5xl mx-auto h-[600px]  rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative w-32 h-32 mx-auto text-center">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-green-500 cursor-pointer object-cover"
              onClick={() => document.getElementById("fileUpload").click()}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = ""; // force fallback display
                setProfileImage(""); // optional: clear state to show fallback
              }}
            />
          ) : (
            <div
              className="w-32 h-32 rounded-full border-4 border-green-500 bg-gray-200 flex items-center justify-center cursor-pointer"
              onClick={() => document.getElementById("fileUpload").click()}
            >
              <span className="text-gray-500">Profile</span>
            </div>
          )}
          <input
            type="file"
            id="fileUpload"
            accept="image/*"
            className="hidden"
            onChange={changePhoto}
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-4">
          <h2 className="text-3xl font-semibold mb-4">User Profile</h2>
          <div className="space-y-2 flex flex-col gap-4">
            <div>
              <span className="font-bold text-gray-600">Full Name:</span>{" "}
              {profile.fullName}
            </div>
            <div>
              <span className="font-bold text-gray-600">Email:</span>{" "}
              {profile.email}
            </div>
            <div>
              <span className="font-bold text-gray-600">City:</span>{" "}
              {profile.city}
            </div>
            <div>
              <span className="font-bold text-gray-600">Phone Number:</span>{" "}
              {profile.phone}
            </div>
            <div>
              <span className="font-bold text-gray-600">Sector:</span>{" "}
              {profile.sector}
            </div>
            <div>
              <span className="font-bold text-gray-600">Sub-sector:</span>{" "}
              {profile.subSector}
            </div>
          </div>

          <div className="mt-6">
            <button
              className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded mr-4"
              onClick={() => setModal("edit")}
            >
              Edit Profile
            </button>
            <button
              className="bg-gray-600 cursor-pointer text-white px-4 py-2 rounded"
              onClick={() => setModal("password")}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {modal === "edit" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="text-lg font-bold mb-4">
              Edit Profile{" "}
              <span
                className="float-right text-red-500 cursor-pointer"
                onClick={() => setModal("")}
              >
                &times;
              </span>
            </div>
            {["fullName", "email", "city", "phone", "sector", "subSector"].map(
              (field) => (
                <input
                  key={field}
                  name={field}
                  value={profile[field]}
                  onChange={handleChange}
                  placeholder={
                    field.charAt(0).toUpperCase() +
                    field.slice(1).replace(/([A-Z])/g, " $1")
                  }
                  className="w-full mb-3 p-2 border border-gray-300 rounded"
                />
              )
            )}
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={saveChanges}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {modal === "password" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="text-lg font-bold mb-4">
              Change Password{" "}
              <span
                className="float-right text-red-500 cursor-pointer"
                onClick={() => setModal("")}
              >
                &times;
              </span>
            </div>
            <input
              type="password"
              placeholder="Current Password"
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Change Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
