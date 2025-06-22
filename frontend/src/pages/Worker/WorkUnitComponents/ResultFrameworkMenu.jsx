import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuFrame } from "react-icons/lu";
import { Link } from "react-router-dom";
import useAuthStore from "../../../store/auth.store"; // ✅ Use auth store

const backendUrl = "http://localhost:1221";

const ResultFrameworkMenu = ({ open = true }) => {
  const { user } = useAuthStore(); // ✅ Get user from global state
  const role = user?.role?.toLowerCase() || "";

  // Properly extract populated IDs
  const userSectorId = user?.sector?._id || user?.sector;
  const userSubsectorId = user?.subsector?._id || user?.subsector;

  const [subsectors, setSubsectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubsectors = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/subsector/get-subsector`);
        let subsectorList = Array.isArray(res.data) ? res.data : [];

        if (role === "chief ceo") {
          // Show only subsectors in the same sector
          subsectorList = subsectorList.filter(
            (sub) =>
              sub?.sectorId === userSectorId ||
              sub?.sectorId?._id === userSectorId
          );
        } else if (role === "ceo" || role === "worker") {
          // Show only the user's own subsector
          subsectorList = subsectorList.filter(
            (sub) => sub?._id === userSubsectorId
          );
        }

        setSubsectors(subsectorList);
      } catch (err) {
        console.error("Failed to fetch subsectors:", err);
        setError("Error loading subsectors.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubsectors();
  }, [role, userSectorId, userSubsectorId]);

  if (loading) return <div className="text-white p-4">Loading subsectors...</div>;
  if (error) return <div className="text-red-400 p-4">{error}</div>;

  return (
    <div className={`${!open ? "px-0" : "px-4"} text-sm bg-green-700 rounded`}>
      <div
        className={`flex items-center border-b border-black/50 py-2 mb-4 ${
          !open ? "justify-center" : "justify-between"
        }`}
      >
        <div className={`${!open && "hidden"} flex items-center gap-2`}>
          <LuFrame size={23} className="text-white" />
          <h2 className="text-lg font-bold text-white">Result Framework</h2>
        </div>
      </div>

      <ul>
        {subsectors.length === 0 ? (
          <li className="text-gray-300 px-2">No subsectors available.</li>
        ) : (
          subsectors.map((subsector) => (
            <li key={subsector._id} className="mt-2 rounded overflow-hidden">
              <Link
                to={`/ceo/allSubsector/${subsector._id}?userId=${user._id}`}
                className="block px-2 py-1 rounded text-white bg-green-200/30 hover:bg-green-300/40 duration-300"
              >
                {subsector.subsector_name || subsector.name}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ResultFrameworkMenu;
