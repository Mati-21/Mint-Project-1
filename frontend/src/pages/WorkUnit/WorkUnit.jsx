import StrategicSideBar from "../Strategic/StrategicSideBar";
import StrategicTopBar from "../Strategic/StrategicTopBar";
import { Outlet } from "react-router-dom";
import WorkUnitSideBar from "./WorkUnitSideBar";
import WorkUnitTopBar from "./WorkUnitTopBar";

function WorkUnit() {
  return (
    <div className="flex ">
      <div className="h-screen relative w-70 bg-amber-200">
        <WorkUnitSideBar />
      </div>
      <div className="flex-1 flex flex-col ">
        <div>
          <WorkUnitTopBar />
        </div>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default WorkUnit;
