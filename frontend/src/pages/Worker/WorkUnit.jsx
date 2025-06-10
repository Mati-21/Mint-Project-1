import { Outlet } from "react-router-dom";
import WorkUnitSideBar from "./WorkUnitSideBar";

import TopNavBar from "../../components/TopNavBar";

function WorkUnit() {
  return (
    <div className="flex ">
      <div className="h-screen relative w-70 bg-amber-200">
        <WorkUnitSideBar />
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

export default WorkUnit;
