import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdAnalytics } from 'react-icons/md';
import { PiPlus } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import Popup from '../components/atom/Popup';
import { DeleteIcon, EditIcon } from '../icons';

const RoomManage = () => {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [halls, setHalls] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchData = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const [roomRes, userRes, hallRes] = await Promise.all([
        axios.get('https://seatment-app-be-v2.onrender.com/room', {
          headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        }),
        axios.get('https://seatment-app-be-v2.onrender.com/user/notowner', {
          headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        }),
        axios.get('https://seatment-app-be-v2.onrender.com/hall', {
          headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        }),
      ]);
      setRooms(roomRes.data.result);
      setUsers(userRes.data.result);
      setHalls(hallRes.data.result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (room) => {
    setEditingRoom(room);
    reset(room);
    setIsModalOpen(true);
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    reset();
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      const token = localStorage.getItem('accessToken');
      try {
        await axios.delete(`https://seatment-app-be-v2.onrender.com/room/${id}`, {
          headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        });
        setRooms(rooms.filter((room) => room.id !== id));
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  const onSubmit = async (data) => {
    const token = localStorage.getItem('accessToken');

    try {
      if (editingRoom) {
        await axios.put(`https://seatment-app-be-v2.onrender.com/room/${editingRoom.id}`, data, {
          headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        });
      } else {
        await axios.post('https://seatment-app-be-v2.onrender.com/room', data, {
          headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        });
      }

      fetchData(); // Refresh data
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  return (
    <div className="p-5">
      <Popup
        title={editingRoom ? 'Edit Room' : 'Add Room'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="min-w-[500px] p-3">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="border rounded-md px-2 py-1 shadow-md"
                placeholder="Enter room name"
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Capacity</label>
              <input
                {...register('capacity', { required: 'Capacity is required' })}
                type="number"
                className="border rounded-md px-2 py-1 shadow-md"
                placeholder="Enter room capacity"
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Hall</label>
              <select
                {...register('hallId', { required: 'Hall is required' })}
                className="border rounded-md px-2 py-1 shadow-md"
              >
                <option value="">Select Hall</option>
                {halls.map((hall) => (
                  <option key={hall.hallId} value={hall.hallId}>
                    {hall.name}{' '}
                  </option>
                ))}
              </select>
              {errors.hallId && (
                <span className="text-red-500 text-sm">{errors.hallId.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">User</label>
              <select {...register('userId')} className="border rounded-md px-2 py-1 shadow-md">
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingRoom ? 'Update Room' : 'Create Room'}
              </button>
            </div>
          </form>
        </div>
      </Popup>

      <div className="flex flex-col justify-start items-start gap-3 mb-2">
        <h1 className="text-2xl font-bold">Rooms Management</h1>
        <div className="flex items-center gap-2  bg-blue-500 text-white rounded-sm px-3">
          <button onClick={handleAddRoom} className="  py-2  ">
            <PiPlus />
          </button>
          <p>Add new roomo</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg  max-h-[700vh] overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="h-[40px]">
              <th className="text-left px-3 ">Name</th>
              <th className="text-left px-3 ">SeatAvailable</th>
              <th className="text-left px-3 ">Capacity</th>
              <th className="text-left px-3 ">Owner</th>
              <th className="text-left px-3 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="h-[50px] border-b-[1px]">
                <td className="px-3">{room.name}</td>
                <td className="px-3">{room?.seats?.length ?? 0}</td>
                <td className="px-3">{room?.capacity ?? 0}</td>
                <td className="px-3">{room?.chief?.username ?? '-'}</td>
                <td className="px-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(room)}>
                      <EditIcon className="text-blue-300" />
                    </button>
                    <button onClick={() => handleDelete(room.id)}>
                      <DeleteIcon className="text-red-300" />
                    </button>
                    <Link to={`/seat-management/${room.id}`}>
                      <MdAnalytics />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomManage;
