import { Outlet } from "react-router-dom";

import TopNavBar from "../../components/TopNavBar";
import CEOSideBar from "./CEOSideBar";

function CEO() {
  return (
    <div className="flex ">
      <div className="h-screen relative w-72 bg-amber-200">
        <CEOSideBar />
      </div>
      <div className="flex-1 flex flex-col ">
        <div>
          <TopNavBar />
        </div>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CEO;
