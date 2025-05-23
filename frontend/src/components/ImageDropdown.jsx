import manjpg from "../assets/man.jpg";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { IoMdSettings } from "react-icons/io";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function ImageDropdown({ role }) {
  const [opendropDown, setOpenDropDown] = useState(false);

  function toggleProfile() {
    setOpenDropDown((prev) => !prev);
  }

  const myref = useRef();

  useEffect(() => {
    function handler(event) {
      if (myref.current && !myref.current.contains(event.target)) {
        setOpenDropDown(false);
      }
    }

    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  return (
    <div
      className="w-10 h-10 text-black bg-amber-600 rounded-full overflow-hidden "
      ref={myref}
    >
      <img
        src={manjpg}
        alt="user"
        className=" w-full h-auto cursor-pointer"
        onClick={toggleProfile}
      />

      {/* drop down content */}
      <div
        className={`bg-white w-60 p-4 absolute right-4 shadow-black-all ${
          !opendropDown && "opacity-1"
        } mt-4 duration-300`}
      >
        {/* upper part */}
        <div className="flex gap-4 border-b border-black items-center pb-2">
          <div className="w-10 h-10 bg-amber-600 rounded-full overflow-hidden">
            <img
              src={manjpg}
              alt="user"
              className=" w-full h-auto cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-1 ">
            <h1 className="text-md font-bold">Mati Melkamu</h1>
            <p className="text-xs">Excutive director</p>
          </div>
        </div>
        {/* lower part */}

        <ul className="mt-2">
          <Link to={`user-profile`} onClick={toggleProfile}>
            <li className="group flex items-center justify-between px-4 py-1 rounded cursor-pointer transition-all hover:font-semibold">
              <span className="flex items-center gap-2">
                <FaUser /> <span>Edit Profile</span>
              </span>
              <ChevronRight className="transition-all duration-500 group-hover:translate-x-2" />
            </li>
          </Link>

          <Link to="/setting" onClick={toggleProfile}>
            <li className="group flex items-center justify-between px-4 py-1 rounded cursor-pointer transition-all hover:font-semibold">
              <span className="flex items-center gap-2">
                <IoMdSettings /> <span>System setting</span>
              </span>
              <ChevronRight className="transition-all duration-500 group-hover:translate-x-2" />
            </li>
          </Link>
          <Link>
            <li className="group flex items-center justify-between px-4 py-1 rounded cursor-pointer transition-all hover:font-semibold">
              <span className="flex items-center gap-2">
                <FiLogOut /> <span>Logout</span>
              </span>
              <ChevronRight className="transition-all duration-500 group-hover:translate-x-2" />
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default ImageDropdown;
