import { Outlet } from "react-router-dom";
import MinisterSideMenu from "./MinisterSideMenu";

import MinisterTopBar from "./MinisterTopBar";

function Minister() {
  return (
    <div className="flex">
      <div className="h-full w-72  ">
        <MinisterSideMenu />
      </div>

      <div className="flex-1 flex flex-col">
        <div>
          <MinisterTopBar />
        </div>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Minister;
