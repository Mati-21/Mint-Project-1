import { Outlet } from "react-router-dom";
import WorkUnitSideBar from "./WorkUnitSideBar";

import TopNavBar from "../../components/TopNavBar";
import useAuthStore from "../../store/auth.store";

function Worker() {
  const user = useAuthStore((state) => state.user); // ✅ Correct reactive usage

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

export default Worker;
