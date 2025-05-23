import { ChevronDown } from "lucide-react";
import Datas from "./WorkUnitSideMenuTitles";
import { useState } from "react";
import { Link } from "react-router-dom";

function WorkUnitSideBarBody() {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState({
    menu1: false,
    menu2: false,
    menu3: false,
    menu4: false,
  });

  const [userData, setUserData] = useState({
    sector: "Innovation and research",
    subSector: "National Research",
  });

  const [isSubSubMenuOpen, setSubSubMenuOpen] = useState({});

  const toggleDropdown = (key) => {
    setIsSubMenuOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleSubSubMenu = (subIndex) => {
    setSubSubMenuOpen((prev) => ({
      ...prev,
      [subIndex]: !prev[subIndex],
    }));
  };

  return (
    <div
      className={`overflow-auto ${
        !open ? "px-0" : "px-4 "
      }  text-sm bg-green-700 h-[450px] rounded scrollbar-hidden`}
    >
      <ul>
        {Datas.map((data, index) => (
          <div key={index}>
            {data.sectionTitle && (
              <div
                className={`flex items-center  border-b pb-2 mt-4  ${
                  !open ? "justify-center cursor-pointer" : "justify-between"
                } border-black/50 `}
              >
                <h1 className={`${!open && "hidden"}  font-bold text-md `}>
                  {data.sectionTitle}
                </h1>
                <span className={`${!open && "text-4xl"}  `}>{data.icon}</span>
              </div>
            )}

            <Link>
              <li
                className={` ${
                  !open && "hidden"
                } flex gap-4 px-2 py-1  items-center bg-green-300/20 cursor-pointer rounded duration-500 text-white hover:bg-slate-300/20 mt-2`}
              >
                <span className="flex-1 font-bold text-xs">{data.menu}</span>
                {data.submenu && (
                  <ChevronDown
                    className={`  cursor-pointer text-white  transition-transform  duration-200 `}
                    onClick={() => toggleDropdown(data.key)}
                    size={15}
                  />
                )}
              </li>
            </Link>

            {data.subMenuItems && isSubMenuOpen[data.key] && (
              <div className="py-4 flex flex-col  mt-1 gap-3">
                {data.subMenuItems
                  .filter((sec) => sec.subMenuItem === userData.sector)
                  .map((item, subIndex) => (
                    <div>
                      <Link>
                        <li
                          key={subIndex}
                          className=" duration-300 py-1 flex justify-between rounded px-2 ml-2 text-white/80 mr-1 cursor-pointer bg-green-200/10 hover:bg-green-300/20"
                        >
                          {item.subMenuItem}
                          {
                            <ChevronDown
                              className={`  cursor-pointer text-white  transition-transform  duration-200 `}
                              onClick={() => toggleSubSubMenu(subIndex)}
                              size={15}
                            />
                          }
                        </li>
                      </Link>

                      {item.subsubmenu && isSubSubMenuOpen[subIndex] && (
                        <ul className="flex flex-col text-xs gap-3 w-46 cursor-pointer ml-4 mt-2">
                          {item.subsubMenus
                            .filter(
                              (subsubmenu) => userData.subSector === subsubmenu
                            )
                            .map((subsubmenu) => (
                              <li
                                className="px-2 py-1 bg-green-600 rounded text-white"
                                key={subsubmenu}
                              >
                                {subsubmenu}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default WorkUnitSideBarBody;
