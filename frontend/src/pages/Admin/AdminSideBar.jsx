import AdminSideHeader from "./AdminSideHeader";
import AdminSideBody from "./AdminSideBody";

function AdminSideBar() {
  return (
    <div className="fixed w-70  bg-green-800 h-full flex flex-col items-center p-6 gap-4 text-white ">
      <AdminSideHeader />
      <AdminSideBody />
    </div>
  );
}

export default AdminSideBar;
