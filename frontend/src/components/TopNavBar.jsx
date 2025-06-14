import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";

import { IoMdMenu } from "react-icons/io";

import ImageDropdown from "./ImageDropdown";
import useAuthStore from "../store/auth.store";
import { useChat } from "../context/ChatContext";
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import { useEffect, useState } from "react";
import axios from "axios";

function TopNavBar({ bgColor = "bg-white" }) {
  const { user } = useAuthStore();
  const { setShowChat, unreadCount } = useChat();
  const location = useLocation();
  const navigate = useNavigate();

  const [count, setCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:1221/api/notification/get-notifications/${user._id}`
      );
      setCount(res.data.length);
    } catch (err) {
      setCount(0);
    }
  };

  useEffect(() => {
    if (user && user._id) fetchNotifications();
  }, [user && user._id]);

  return (
    <div className="bg-green-600 sticky top-0 text-white items-center duration-500 flex justify-between pl-1 pr-4 lg:pl-4 lg:pr-16 py-2">
      <div className="flex gap-6 px-2">
        <IoMdMenu
          size={23}
          className="cursor-pointer lg:hidden"
          // onClick={() => dispatch(showMainSidenav())}
        />
        <div className="flex gap-4">
          <NavLink
            to="/"
            className="hidden text-sm lg:flex lg:gap-2 lg:items-center"
          >
            <IoHomeOutline size={23} />
            Home
          </NavLink>

          <button
            className="relative text-sm hidden lg:flex lg:gap-2 lg:items-center"
            onClick={() => {
              const match = location.pathname.match(/^\/(admin|ceo|chief-ceo|strategic)/i);
              const basePath = match ? `/${match[1]}` : "";
              navigate(`${basePath}/chat`);
            }}
          >
            <HiChatBubbleLeftEllipsis size={23} />
            Chat
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs text-white rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </button>
          <NavLink
            to="/notification"
            className="text-sm hidden lg:flex lg:gap-2 lg:items-center relative"
          >
            <IoIosNotifications size={23} />
            Notification
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs text-white rounded-full px-2 py-0.5">
                {count}
              </span>
            )}
          </NavLink>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <p className="hidden lg:block">{user?.email || "No User"}</p>
        <ImageDropdown />
      </div>
    </div>
  );
}

export default TopNavBar;
