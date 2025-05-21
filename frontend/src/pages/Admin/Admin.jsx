import AdminTopBar from "./AdminTopBar";
import AdminSideBar from "./AdminSideBar";
import { Outlet } from "react-router-dom";

function Admin() {
  return (
    <div className="flex h-screen">
      {/* Side Nav Bar */}
      <div className="relative bg-amber-400 h-screen w-70">
        <AdminSideBar />
      </div>
      {/* Main Section */}
      <div className="flex-1 flex flex-col ">
        <AdminTopBar />
        <main className="px-6 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Admin;
