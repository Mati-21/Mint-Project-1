import { HiOutlineUsers } from "react-icons/hi2";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoSettings } from "react-icons/io5";
import { MdNotificationsActive } from "react-icons/md";

import { Link } from "react-router-dom";

const settings = [
  {
    setting: "Dashboard",
    emoji: <LuLayoutDashboard />,
    link: "dashboard",
  },
  {
    setting: "User Managment",
    emoji: <HiOutlineUsers />,
    link: "user-managment",
  },
  {
    setting: "Configuration",
    emoji: <IoSettings />,
    link: "configuration",
  },
  {
    setting: "Notfication And Alert",
    emoji: <MdNotificationsActive />,
    link: "alert",
  },
  {
    setting: "Add Goal,Kra& Kpi",
    emoji: <MdNotificationsActive />,
    link: "Goal-Kra-Kpi",
  },
  {
    setting: "KPI Assignment",
    emoji: <MdNotificationsActive />,
    link: "Kpi-Assign",
  },
  {
    setting: "KPI Year Assignment",
    emoji: <MdNotificationsActive />,
    link: "Kpi-Year-Assign",
  },
  
];

function AdminSideBody() {
  return (
    <ul className="flex flex-col gap-4 rounded py-2 w-full">
      {settings.map((sett) => (
        <Link
          key={sett.setting}
          to={sett.link === "dashboard" ? "." : sett.link}
        >
          <li className="flex hover:bg-green-500 transition-all duration-200 cursor-pointer justify-between items-center w-full bg-green-700 p-2 rounded">
            <p>{sett.setting}</p> <p>{sett.emoji}</p>
          </li>
        </Link>
      ))}
    </ul>
  );
}

export default AdminSideBody;
