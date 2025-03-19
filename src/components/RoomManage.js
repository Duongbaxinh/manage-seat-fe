import axios from "axios";
import React, { useState, useEffect } from "react";

const RoomManage = () => {
  const [rooms, setRoom] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get("http://localhost:8080/room");
    };
    fetchData();
  }, []);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {rooms ? "Edit rooms" : "Add New rooms"}
          </h2>
          <button
            // onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
        // onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                rooms Name
              </label>
              <input
                type="text"
                // value={formData.name}
                onChange={
                  (e) => {}
                  //   setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacity
              </label>
              <input
                type="number"
                // value={formData.capacity}
                onChange={
                  (e) => {}
                  //   setFormData({
                  //     ...formData,
                  //     capacity: parseInt(e.target.value),
                  //   })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                // value={formData.status}
                onChange={
                  (e) => {}
                  //   setFormData({ ...formData, status: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              //   onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {rooms ? "Save Changes" : "Add rooms"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomManage;
