import { ChevronDown } from "lucide-react";
import Datas from "./WorkUnitSideMenuTitles";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/themeStore";

function WorkUnitSideBody({ open }) {
  const dark = useThemeStore((state) => state.dark);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState({});
  const [isSubSubMenuOpen, setSubSubMenuOpen] = useState({});
  const scrollRef = useRef(null);

  const userData = { sector: "Innovation and research" };

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

  useEffect(() => {
    if (!open && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [open]);

  return (
    <div
      ref={scrollRef}
      className="text-sm h-full overflow-y-auto px-2 scrollbar-hidden"
    >
      <ul className="space-y-1">
        {Datas.map((data, index) => (
          <div key={index}>
            {/* Section Title with HR */}
            {data.sectionTitle && (
              <div
                className={`border-t pt-4 flex items-center ${
                  open ? "justify-between" : "justify-center"
                } ${dark ? "text-white font-bold" : "text-[rgba(13,42,92,0.85)] font-bold"}`}
              >
                <h1 className={`${!open ? "hidden" : "uppercase text-xs tracking-wide"}`}>
                  {data.sectionTitle}
                </h1>
                <span>{data.icon}</span>
              </div>
            )}

            {/* Menu Item */}
            <Link to={data.link || "#"}>
              <li
                className={`flex gap-2 px-2 py-1 items-center rounded cursor-pointer transition duration-300 mt-2 ${
                  dark
                    ? "text-white hover:bg-gray-700"
                    : "text-[rgba(13,42,92,0.85)] hover:bg-orange-100"
                } ${!open ? "justify-center" : ""}`}
                onClick={(e) => {
                  if (data.submenu) {
                    e.preventDefault();
                    toggleDropdown(data.key);
                  }
                }}
              >
                <span className={`${open ? "" : "text-[16px]"}`}>{data.icon}</span>
                <span className={`font-medium text-xs ${!open ? "hidden" : ""} whitespace-nowrap`}>
                  {data.menu}
                </span>
                {data.submenu && open && (
                  <ChevronDown
                    className={`transition-transform ${
                      isSubMenuOpen[data.key] ? "rotate-180" : ""
                    }`}
                    size={15}
                  />
                )}
              </li>
            </Link>

            {/* Submenus */}
            {data.subMenuItems && isSubMenuOpen[data.key] && open && (
              <div className="ml-4 flex flex-col mt-2 gap-2">
                {data.subMenuItems
                  .filter((sec) => sec.subMenuItem === userData.sector)
                  .map((item, subIndex) => (
                    <div key={subIndex}>
                      <li
                        className={`flex justify-between items-center px-2 py-1 rounded cursor-pointer transition duration-300 ${
                          dark
                            ? "bg-white/10 text-white hover:bg-white/20"
                            : "bg-orange-50 text-gray-800 hover:bg-orange-100"
                        }`}
                        onClick={() => toggleSubSubMenu(subIndex)}
                      >
                        {item.subMenuItem}
                        {item.subsubmenu && (
                          <ChevronDown
                            className={`transition-transform ${
                              isSubSubMenuOpen[subIndex] ? "rotate-180" : ""
                            }`}
                            size={15}
                          />
                        )}
                      </li>

                      {/* Sub-submenus */}
                      {item.subsubmenu && isSubSubMenuOpen[subIndex] && (
                        <ul className="flex flex-col gap-2 ml-4 mt-2 text-xs">
                          {item.subsubMenus.map((sub, i) => (
                            <li
                              key={i}
                              className={`px-2 py-1 rounded cursor-pointer transition ${
                                dark
                                  ? "bg-gray-700 text-white hover:bg-gray-600"
                                  : "bg-orange-100 text-gray-800 hover:bg-orange-200"
                              }`}
                            >
                              {sub}
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

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}

export default WorkUnitSideBody;
