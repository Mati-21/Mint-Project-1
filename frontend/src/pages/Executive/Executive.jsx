import { Outlet } from "react-router-dom";
import ExecutiveSideBar from "./ExecutiveSideBar";
import ExecutiveTopBar from "./ExecutiveTopBar";
import TopNavBar from "../../components/TopNavBar";

function Executive() {
  return (
    <div className="flex ">
      <div className="h-screen relative w-72 bg-amber-200">
        <ExecutiveSideBar />
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

export default Executive;
