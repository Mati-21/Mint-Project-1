import { BsArrowLeftShort, BsSearch } from "react-icons/bs";
import StrategicSideHeader from "./StrategicSideHeader";
import StrategicSideBody from "./StrategicSideBody";

function StrategicSideBar() {
  return (
    <div
      className={` bg-green-700 h-full  p-4 fixed w-72  duration-300 scrollbar-hidden`}
    >
      <BsArrowLeftShort
        className={`text-3xl text-dark-purple  lg:block rounded-full bg-white top-20  absolute right-0  border border-dark-purple translate-x-1/2 cursor-pointer ${
          open ? null : "rotate-180"
        } z-20 `}
        // onClick={() => dispatch(toggleMainSidenav())}
      />
      <StrategicSideHeader />
      <div className=" h-[450px] overflow-auto scrollbar-hidden">
        <StrategicSideBody />
      </div>
    </div>
  );
}

export default StrategicSideBar;
