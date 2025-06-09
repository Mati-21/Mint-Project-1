import { BsArrowLeftShort } from "react-icons/bs";
import ExecutiveSideHeader from "./ExecutiveSideHeader";
import ExecutiveSideBody from "./ExecutiveSideBody";
import ResultFrameworkMenu from "./ExecutiveComponents/ResultFrameworkMenu";

function ExecutiveSideBar({ open = true }) {
  return (
    <div
      className={`bg-green-700 h-full p-4 fixed w-72 duration-300 scrollbar-hidden flex flex-col`}
    >
      <BsArrowLeftShort
        className={`text-3xl text-dark-purple lg:block rounded-full bg-white top-20 absolute right-0 border border-dark-purple translate-x-1/2 cursor-pointer ${
          open ? "" : "rotate-180"
        } z-20`}
        // onClick={() => dispatch(toggleMainSidenav())}
      />
      <ExecutiveSideHeader />

      {/* Scrollable area */}
      <div className="flex-1 overflow-auto scrollbar-hidden space-y-4 mt-2">
        <ResultFrameworkMenu open={open} />
        <ExecutiveSideBody open={open} />
      </div>
    </div>
  );
}

export default ExecutiveSideBar;
