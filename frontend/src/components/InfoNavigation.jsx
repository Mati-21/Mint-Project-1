function InfoNavigation() {
  return (
    <div className="w-full grid grid-cols-1  sm:grid-cols-2 justify-items-stretch gap-4  sm:flex-wrap lg:flex  lg:justify-center lg:gap-8 lg:mx-auto ">
      <div className="h-30 shadow-2xl shadow-black-all	  text-sm rounded-lg lg:flex-1 bg-red-800 text-white flex flex-col justify-around px-2">
        <p>Ministry of Innovation and Technology Sector Plan and Report</p>
        <p>More Info → </p>
      </div>

      <div className="h-30  text-sm rounded-lg lg:flex-1 text-white shadow-black-all bg-green-800 px-4 flex flex-col justify-around">
        <div className="flex justify-between  w-full items-center">
          <p>Number of main objectives/GOAL</p>
          <span className="text-xl">5</span>
        </div>
        <p>More Info → </p>
      </div>

      <div className="h-30  text-sm rounded-lg lg:flex-1 bg-yellow-500 shadow-black-all text-white px-4 flex flex-col justify-around">
        <div className="flex justify-between w-full items-center">
          <p>Number of expected results/KRA</p>
          <span className="text-xl">18</span>
        </div>
        <p>More Info → </p>
      </div>
      <div className="h-30  text-sm rounded-lg lg:flex-1 bg-blue-800 shadow-black-all text-white px-4 flex flex-col justify-around">
        <div className="flex justify-between  w-full items-center">
          <p>Number of expected results/KRA</p>
          <span className="text-xl">5</span>
        </div>
        <p>More Info → </p>
      </div>
    </div>
  );
}

export default InfoNavigation;
