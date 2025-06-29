import { Outlet, useLocation, useNavigate } from "react-router-dom";

function Container() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the last part of the current path
  const currentTab = location.pathname.includes("performance")
    ? "performance"
    : "planning";

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white shadow-md rounded-xl overflow-hidden">
      <div className="flex">
        <button
          className={`flex-1 py-3 text-center font-semibold ${
            currentTab === "planning"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => navigate("/worker/planning")}
        >
          Planning
        </button>
        <button
          className={`flex-1 py-3 text-center font-semibold ${
            currentTab === "performance"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => navigate("/worker/performance")}
        >
          Performance
        </button>
      </div>
      <Outlet />
    </div>
  );
}

export default Container;
