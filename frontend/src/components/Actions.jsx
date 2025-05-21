import { CgAdd } from "react-icons/cg";
import { RiSettings5Fill } from "react-icons/ri";
import { TbReport } from "react-icons/tb";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";

function Actions({ toggleForm }) {
  return (
    <div className="flex-1 flex col-start-4 col-end-5 flex-col gap-2 rounded-sm  shadow-lg p-4  transform transition-all duration-500 ">
      <h2 className="text-3xl">Quick Actions</h2>
      <h4 className="mb-4">Common tasks and Shortcuts</h4>
      <div className="grid grid-cols-2 grid-rows-2 justify-items-stretch gap-2">
        <div
          className={`p-2 flex flex-col items-center   cursor-pointer gap-1 justify-center border border-gray-400 rounded`}
          onClick={() => toggleForm(1)}
        >
          <p className="p-2 font-bold">Add User</p>
          <CgAdd size={25} />
        </div>

        <div
          className={`p-2   flex flex-col items-center  gap-1 justify-center cursor-pointer border border-gray-400 rounded`}
          onClick={toggleForm}
        >
          <p className="p-2 font-bold">Configuration</p>
          <RiSettings5Fill size={25} />
        </div>

        <div
          className={`p-2  flex flex-col items-center gap-1 justify-center cursor-pointer border border-gray-400 rounded `}
          onClick={toggleForm}
        >
          <p className="p-2 text-center font-bold">Generate Report</p>
          <TbReport size={25} />
        </div>

        <div
          className={`p-2   flex flex-col items-center gap-1 justify-center cursor-pointer border border-gray-400 rounded `}
          onClick={toggleForm}
        >
          <p className="p-2 font-bold">View Alert</p>
          <IoMdNotificationsOutline size={25} />
        </div>
        <div
          className={`p-2   flex flex-col items-center gap-1 justify-center cursor-pointer border border-gray-400 rounded `}
          onClick={() => toggleForm(2)}
        >
          <p className="p-2 font-bold">Add sector</p>
          <CgAdd size={25} />
        </div>
        <div
          className={`p-2   flex flex-col items-center gap-1 justify-center cursor-pointer border border-gray-400 rounded `}
          onClick={() => toggleForm(3)}
        >
          <p className="p-2 font-bold">Add Sub-Se</p>
          <CgAdd size={25} />
        </div>
        <div
          className={`p-2   flex flex-col items-center gap-1 justify-center cursor-pointer border border-gray-400 rounded `}
          onClick={() => toggleForm(4)}
        >
          <p className="p-2 font-bold">Add Desk</p>
          <CgAdd size={25} />
        </div>
      </div>
    </div>
  );
}

export default Actions;
