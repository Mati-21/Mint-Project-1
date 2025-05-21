import { BsArrowLeftShort, BsSearch } from "react-icons/bs";

import MinisterSideHeader from "./MinisterSideHeader";
import MinisterSideBody from "./MinisterSideBody";

function MinisterSideMenu() {
  return (
    <div
      className={`bg-green-700 h-full   p-4 relative ${
        open ? "w-72" : "w-20"
      }  duration-300 scrollbar-hidden`}
    >
      <BsArrowLeftShort
        className={`text-3xl text-dark-purple  lg:block rounded-full bg-white top-20  absolute right-0  border border-dark-purple translate-x-1/2 cursor-pointer ${
          open ? null : "rotate-180"
        } z-20 `}
      />
      <MinisterSideHeader />
      <div className=" h-[450px] overflow-auto scrollbar-hidden">
        <MinisterSideBody />
      </div>
    </div>
  );
}

export default MinisterSideMenu;
