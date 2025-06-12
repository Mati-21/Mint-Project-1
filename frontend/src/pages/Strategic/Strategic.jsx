import StrategicSideBar from "./StrategicSideBar";

import { Outlet } from "react-router-dom";
import TopNavBar from "../../components/TopNavBar";

function Strategic() {
  return (
    <div className="flex">
      <div className="h-screen relative w-70">
        <StrategicSideBar />
      </div>

      <div className="flex-1 flex flex-col ">
        <TopNavBar />

        <div className="px-6 py-3">
         
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Strategic;
