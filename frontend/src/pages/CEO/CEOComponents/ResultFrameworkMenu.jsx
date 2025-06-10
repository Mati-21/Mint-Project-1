import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { LuFrame } from "react-icons/lu";
import { Link } from "react-router-dom";

const backendUrl = "http://localhost:1221";

const ResultFrameworkMenu = ({ open = true }) => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSectors, setOpenSectors] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const role = (user?.role || "").toLowerCase();
  const userSectorId = user?.sector;
  const userSubsectorId = user?.subsector;

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/menu/result-framework`);
        const fullData = Array.isArray(res.data) ? res.data : [];

        let filteredData = [];

        if (role === "chief ceo") {
          // Filter only the user's sector
          filteredData = fullData.filter((sector) => sector._id === userSectorId);
        } else if (role === "ceo" || role === "worker") {
          // Find sector that contains the user's subsector
          filteredData = fullData
            .map((sector) => {
              const matchingSubsectors = sector.subsectors?.filter(
                (sub) => sub._id === userSubsectorId
              );

              if (matchingSubsectors.length > 0) {
                return {
                  ...sector,
                  subsectors: matchingSubsectors,
                };
              }
              return null;
            })
            .filter(Boolean); // remove nulls
        } else {
          // For admin, minister, strategic unit, etc.
          filteredData = fullData;
        }

        setMenuData(filteredData);
      } catch (err) {
        console.error(err);
        setError("Error loading menu.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [role, userSectorId, userSubsectorId]);

  const toggleSector = (sectorId) => {
    setOpenSectors((prev) => ({
      ...prev,
      [sectorId]: !prev[sectorId],
    }));
  };

  if (loading) return <div className="text-white p-4">Loading menu...</div>;
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
        {menuData.length === 0 && (
          <li className="text-gray-300 px-2">No sectors available.</li>
        )}

        {menuData.map((sector) => (
          <li key={sector._id} className="mt-2 rounded overflow-hidden">
            <div className="flex items-center bg-green-300/20 hover:bg-green-300/40 duration-300 rounded cursor-pointer">
              <Link
                to={`/allSector/${sector._id}?userId=${user._id}`}
                className="flex-1 px-2 py-1 text-white font-semibold"
              >
                {sector.name}
              </Link>

              {sector.subsectors && sector.subsectors.length > 0 && (
                <button
                  onClick={() => toggleSector(sector._id)}
                  className="p-1 mr-2 rounded hover:bg-green-300/40"
                  aria-label={`Toggle ${sector.name} subsectors`}
                  type="button"
                >
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 text-white ${
                      openSectors[sector._id] ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
              )}
            </div>

            {sector.subsectors && openSectors[sector._id] && (
              <ul className="ml-4 mt-1 flex flex-col gap-1">
                {sector.subsectors.map((subsector) => (
                  <li key={subsector._id}>
                    <Link
                      to={`/allSubsector/${subsector._id}?userId=${user._id}`}
                      className="block px-2 py-1 rounded text-white bg-green-200/30 hover:bg-green-300/40 duration-300"
                    >
                      {subsector.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultFrameworkMenu;
