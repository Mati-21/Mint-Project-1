import { HiOutlineUsers } from "react-icons/hi2";
import { MdPendingActions } from "react-icons/md";
import { PiWarningCircleLight } from "react-icons/pi";
import { TbActivityHeartbeat } from "react-icons/tb";

function AdminInfo() {
  return (
    <div className="flex gap-4 justify-around items-center">
      <div className="flex flex-col gap-2 p-2 flex-1 bg-white border font-sans border-gray-100 rounded-sm shadow-lg">
        <div className="flex justify-between items-center gap-2 p-2">
          <p className="font-bold">Active User</p>{" "}
          <span>
            <HiOutlineUsers size={25} />
          </span>
        </div>
        <h3 className="text-2xl font-semibold  px-2">234</h3>
        <h5>+12 form last month</h5>
      </div>
      <div className="flex flex-col gap-2 p-2 flex-1 bg-white border font-sans border-gray-100 rounded-sm shadow-lg">
        <div className="flex justify-between items-center gap-2 p-2">
          <p className="font-bold">Pending Approval</p>{" "}
          <span>
            <MdPendingActions size={25} />
          </span>
        </div>
        <h3 className="text-2xl font-semibold  px-2">12</h3>
        <h5>+12 form last month</h5>
      </div>
      <div className="flex flex-col gap-2 p-2 flex-1 bg-white border font-sans border-gray-100 rounded-sm shadow-lg">
        <div className="flex justify-between items-center gap-2 p-2">
          <p className="font-bold">Overdue Reports</p>{" "}
          <span>
            <PiWarningCircleLight size={30} className="font-bold" />
          </span>
        </div>
        <h3 className="text-2xl font-semibold  px-2">7</h3>
        <h5>+12 form last month</h5>
      </div>
      <div className="flex flex-col gap-2 p-2 flex-1 bg-white border font-sans border-gray-100 rounded-sm shadow-lg">
        <div className="flex justify-between items-center gap-2 p-2">
          <p className="font-bold">System Health</p>{" "}
          <span>
            <TbActivityHeartbeat size={30} />
          </span>
        </div>
        <h3 className="text-2xl font-semibold  px-2">99.8%</h3>
        <h5>+12 form last month</h5>
      </div>
    </div>
  );
}

export default AdminInfo;
