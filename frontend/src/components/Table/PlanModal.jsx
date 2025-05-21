import React from "react";

function PlanModal({ modalInfo, closeModal, handleFormSubmit }) {
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">Edit KPI</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">KPI Name</label>
            <input
              type="text"
              defaultValue={modalInfo.kpiName}
              className="w-full border px-3 py-1 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Year</label>
            <input
              type="text"
              defaultValue={modalInfo.year}
              className="w-full border px-3 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Target</label>
            <input
              type="text"
              defaultValue={modalInfo.target}
              className="w-full border px-3 py-1 rounded"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlanModal;
