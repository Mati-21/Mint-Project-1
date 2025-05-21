import StrategicSideBar from "./StrategicSideBar";
// import StrategicMain from "./StrategicMain";
import StrategicTopBar from "./StrategicTopBar";
import InfoNavigation from "../../components/InfoNavigation";
import { Outlet } from "react-router-dom";

function Strategic() {
  return (
    <div className="flex">
      <div className="h-screen relative w-70">
        <StrategicSideBar />
      </div>

      <div className="flex-1 flex flex-col ">
        <StrategicTopBar />

        <div className="px-6 py-3">
          <InfoNavigation />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Strategic;
