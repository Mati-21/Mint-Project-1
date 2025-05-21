import MinisterSideMenu from "./MinisterSideMenu";
import MinisterMain from "./MinisterMain";
import MinisterTopBar from "./MinisterTopBar";

function Minister() {
  return (
    <div className="flex ">
      {/* Side Nav Bar */}
      <div className="h-screen ">
        <MinisterSideMenu />
      </div>
      {/* Main Section */}
      <div className="flex-1 flex flex-col ">
        <MinisterTopBar />
        <MinisterMain />
      </div>
    </div>
  );
}

export default Minister;
