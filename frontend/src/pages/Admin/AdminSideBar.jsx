import AdminSideHeader from "./AdminSideHeader";
import AdminSideBody from "./AdminSideBody";

function AdminSideBar() {
  return (
    <div
      className="fixed w-72 bg-green-800 h-full flex flex-col p-6 gap-4 text-white overflow-y-auto"
      style={{
        scrollbarWidth: "none",        // Firefox
        msOverflowStyle: "none",       // IE 10+
      }}
    >
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <AdminSideHeader />
      <AdminSideBody />
    </div>
  );
}

export default AdminSideBar;
