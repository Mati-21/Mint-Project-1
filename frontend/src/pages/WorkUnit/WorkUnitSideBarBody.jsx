import { ChevronDown } from "lucide-react";
import Datas from "./MinisterSideMenuTitles";
import { useState } from "react";
import { Link } from "react-router-dom";

function MinisterSideBody({ open = true }) {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState({});
  const [isSubSubMenuOpen, setSubSubMenuOpen] = useState({});

  const UserInfo = {
    name: "Tom",
    sector: "Innovation and research", // match with subMenuItem
    subSector: "National Research", // match with subsubMenus item
  };

  const toggleDropdown = (key) => {
    setIsSubMenuOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleSubSubMenu = (mainKey, subIndex) => {
    const uniqueKey = `${mainKey}-${subIndex}`;
    setSubSubMenuOpen((prev) => ({
      ...prev,
      [uniqueKey]: !prev[uniqueKey],
    }));
  };

  return (
    <div
      className={`overflow-auto ${
        !open ? "px-0" : "px-4"
      } text-sm bg-green-700 h-[450px] rounded scrollbar-hidden`}
    >
      <ul>
        {Datas.map((data, index) => {
          if (!data.subMenuItems) return null;

          const filteredSubMenuItems = data.subMenuItems.filter(
            (item) =>
              item.subMenuItem === UserInfo.sector &&
              item.subsubMenus?.includes(UserInfo.subSector)
          );

          if (filteredSubMenuItems.length === 0) return null;

          return (
            <div key={index}>
              {data.sectionTitle && (
                <div
                  className={`flex items-center border-b pb-2 mt-4 ${
                    !open ? "justify-center cursor-pointer" : "justify-between"
                  } border-black/50`}
                >
                  <h1 className={`${!open && "hidden"} font-bold text-md`}>
                    {data.sectionTitle}
                  </h1>
                  <span className={`${!open && "text-4xl"}`}>{data.icon}</span>
                </div>
              )}

              <li
                className={`${
                  !open && "hidden"
                } flex gap-4 px-2 py-1 items-center bg-green-300/20 cursor-pointer rounded duration-500 text-white hover:bg-slate-300/20 mt-2`}
                onClick={() => toggleDropdown(data.key)}
              >
                <span className="flex-1 font-bold text-xs">
                  {data.menu?.[0]}
                </span>
                <ChevronDown
                  className="cursor-pointer text-white transition-transform duration-200"
                  size={15}
                />
              </li>

              {isSubMenuOpen[data.key] && (
                <div className="py-4 flex flex-col mt-1 gap-3">
                  {filteredSubMenuItems.map((item, subIndex) => {
                    const uniqueKey = `${data.key}-${subIndex}`;
                    return (
                      <div key={uniqueKey}>
                        <li
                          className="duration-300 py-1 flex justify-between rounded px-2 ml-2 text-white/80 mr-1 cursor-pointer bg-green-200/10 hover:bg-green-300/20"
                          onClick={() =>
                            item.subsubmenu &&
                            toggleSubSubMenu(data.key, subIndex)
                          }
                        >
                          <Link to={item.link} className="flex-1">
                            {item.subMenuItem}
                          </Link>
                          {item.subsubmenu && (
                            <ChevronDown
                              className="cursor-pointer text-white transition-transform duration-200"
                              size={15}
                            />
                          )}
                        </li>

                        {item.subsubmenu &&
                          isSubSubMenuOpen[uniqueKey] &&
                          item.subsubMenus && (
                            <ul className="flex flex-col text-xs gap-3 w-46 cursor-pointer ml-4 mt-2">
                              {item.subsubMenus
                                .filter((sub) => sub === UserInfo.subSector)
                                .map((subsubmenu, subsubIndex) => (
                                  <li
                                    className="px-2 py-1 bg-green-600 rounded text-white"
                                    key={subsubIndex}
                                  >
                                    {subsubmenu}
                                  </li>
                                ))}
                            </ul>
                          )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default MinisterSideBody;
