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
  const [openSubsectors, setOpenSubsectors] = useState({});

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/menu/result-framework`);
        setMenuData(Array.isArray(res.data) ? res.data : []);
        console.log(res.data);
      } catch (err) {
        setError("Error loading menu.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const toggleSector = (sectorId) => {
    setOpenSectors((prev) => ({
      ...prev,
      [sectorId]: !prev[sectorId],
    }));
  };

  const toggleSubsector = (sectorId, subsectorId) => {
    setOpenSubsectors((prev) => ({
      ...prev,
      [`${sectorId}-${subsectorId}`]: !prev[`${sectorId}-${subsectorId}`],
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
          <Link key={sector._id} to={`allSector/${sector._id}`}>
          <li >
            <div
              className={`${
                !open && "hidden"
              } flex justify-between items-center px-2 py-1 rounded cursor-pointer text-white bg-green-300/20 hover:bg-green-300/40 duration-300 mt-2`}
              onClick={() => toggleSector(sector._id)}
              >
              <span className="font-semibold">{sector.name}</span>
              {sector.subsectors && sector.subsectors.length > 0 && (
                <ChevronDown
                size={15}
                className={`transition-transform duration-200 ${
                  openSectors[sector._id] ? "rotate-180" : "rotate-0"
                }`}
                />
              )}
            </div>

            {sector.subsectors && openSectors[sector._id] && (
              <ul className="ml-4 mt-1 flex flex-col gap-1">
                {sector.subsectors.map((subsector) => (
                  <li key={subsector._id}>
                    <div
                      className="flex justify-between items-center px-2 py-1 rounded cursor-pointer text-white bg-green-200/30 hover:bg-green-300/40 duration-300"
                      onClick={() => toggleSubsector(sector._id, subsector._id)}
                      >
                      <span>{subsector.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
            </Link>
        ))}
      </ul>
    </div>
  );
};

export default ResultFrameworkMenu;
