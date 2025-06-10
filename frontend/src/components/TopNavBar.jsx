import { NavLink } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import { IoIosNotifications } from "react-icons/io";

import { IoMdMenu } from "react-icons/io";

import ImageDropdown from "./ImageDropdown";
import useAuthStore from "../store/auth.store";

function TopNavBar({ bgColor = "bg-white" }) {
  const { user } = useAuthStore();
  //
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
            <IoHome size={23} />
            Home
          </NavLink>

          <NavLink className="text-sm hidden lg:flex lg:gap-2 lg:items-center">
            <HiChatBubbleLeftEllipsis size={23} />
            Contact
          </NavLink>
          <NavLink
            to="/notification"
            className="text-sm hidden lg:flex lg:gap-2 lg:items-center"
          >
            <IoIosNotifications size={23} />
            Notification
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
