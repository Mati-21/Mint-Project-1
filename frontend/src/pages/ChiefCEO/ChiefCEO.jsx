import { Outlet } from "react-router-dom";

import TopNavBar from "../../components/TopNavBar";
import ChiefCEOSideBar from "./ChiefCEOSideBar";

function ChiefCEO() {
  return (
    <div className="flex ">
      <div className="h-screen relative w-72 bg-amber-200">
        <ChiefCEOSideBar />
      </div>
      <div className="flex-1 flex flex-col ">
        <div>
          <TopNavBar />
        </div>
        <main className="bg-gray-500">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ChiefCEO;
