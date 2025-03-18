import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RoomManage = () => {
  const [rooms, setRooms] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const handleEdit = (Room) => {
    setEditingRoom(Room);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setRooms(rooms.filter((Room) => Room.id !== id));
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const fetchData = async () => {
    const token = localStorage.getItem("accessToken");
    const { data } = await axios.get("http://localhost:8080/room", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRooms(data.result);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assigned rooms</h1>
        <div className="space-x-2">
          <button
            onClick={handleAddRoom}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Room
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((Room) => (
              <tr key={Room.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {Room.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Room.capacity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-sm ${
                      Room.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : Room.status === "Occupied"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {Room.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(Room)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(Room.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Delete
                  </button>

                  <Link to={`/seat-management/${Room.id}`}>Manage Seat</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RoomManage;
