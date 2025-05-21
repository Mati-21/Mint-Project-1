import StrategicSideBar from "../Strategic/StrategicSideBar";
import StrategicTopBar from "../Strategic/StrategicTopBar";

function WorkUnit() {
  return (
    <div className="flex ">
      <div className="h-screen relative w-72 bg-amber-200">
        <StrategicSideBar />
      </div>
      <div className="flex-1 flex flex-col bg-green-200 ">
        <div>
          <StrategicTopBar />
        </div>
        <div>
          <h1>Hello Worker</h1>
        </div>
      </div>
    </div>
  );
}

export default WorkUnit;
