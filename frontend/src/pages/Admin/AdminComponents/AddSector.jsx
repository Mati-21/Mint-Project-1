function AddSector() {
  return (
    <div className="flex bg-white rounded flex-col p-4 w-[450px] shadow-2xl">
      <h1 className="text-2xl mb-6 font-semibold">Add Sector</h1>
      <form action="" className="flex flex-col gap-4 ">
        <div className="flex flex-col">
          <label htmlFor="sectorName" className="mb-2 font-semibold">
            Sector Name:
          </label>
          <input
            type="text"
            id="sectorName"
            name="sectorName"
            className="bg-gray-100 border-2 border-black p-1 text-lg outline-none"
          />
        </div>
        <input
          type="submit"
          className="cursor-pointer bg-blue-500 text-white font-semibold p-2 rounded"
        />
      </form>
    </div>
  );
}

export default AddSector;
