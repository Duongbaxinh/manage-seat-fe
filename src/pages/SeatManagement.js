import React, { useEffect, useState } from "react";
import SeatList from "../components/SeatList";
import RoomDiagram from "../components/RoomDiagram";
import axios from "axios";
import { useParams } from "react-router-dom";
import Popup from "../Component/atom/Popup";
import { useForm } from "react-hook-form";

const SeatManagement = () => {
  const [seats, setSeats] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUser] = useState([]);
  const [assign, setAssign] = useState(false);
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "http://localhost:8080/seat",
        {
          ...data,
          roomId: id,
          posX: 0,
          posY: 0,
          status: "Unassigned",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating seat:", error);
    }
  };

  const handleSeatDrop = (seatId, position, isRepositioning) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) => {
        if (seat.id === seatId) {
          // If it's a repositioning, just update the position
          if (isRepositioning) {
            return {
              ...seat,
              posX: position.x,
              posY: position.y,
            };
          }
          // If it's a new assignment, update status and position
          return {
            ...seat,
            status: "Assigned",
            posX: position.x,
            posY: position.y,
          };
        }
        return seat;
      })
    );
  };

  const handleUnassignSeat = (seatId) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) => {
        if (seat.id === seatId) {
          return {
            ...seat,
            posX: 0,
            posY: 0,
          };
        }
        return seat;
      })
    );
  };

  const fetchData = async (authentication) => {
    const { data } = await axios.get(
      `http://localhost:8080/seat/filter?page=0&size=10&sortBy=name&roomId=${id}`,
      authentication
    );
    console.log("check ::: ", data.result);
    setSeats(data.result.content);
  };
  const fetchDataUser = async (authentication) => {
    const { data } = await axios.get(
      `http://localhost:8080/room/users/${id}`,
      authentication
    );
    console.log("check user", data);
    setUser(data.result);
  };
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const authentication = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    fetchData(authentication);
    fetchDataUser(authentication);
  }, []);
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      <Popup isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="min-w-[500px]">
          <h1 className="text-xl font-semibold mb-4">Add new Seat</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter seat name"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                {...register("description")}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter seat description"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select
                {...register("typeSeat", { required: "Seat type is required" })}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="TEMPORARY">Temporary</option>
                <option value="PERMANENT">Permanent</option>
              </select>
              {errors.type && (
                <span className="text-red-500 text-sm">
                  {errors.type.message}
                </span>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <input
                onChange={(e) => setAssign(e.target.checked)}
                type="checkbox"
              />
              <label>Assign User</label>
            </div>
            {assign && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  User
                </label>
                <select
                  {...register("userId")}
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {users.map((user, index) => (
                    <option value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <span className="text-red-500 text-sm">
                    {errors.type.message}
                  </span>
                )}
              </div>
            )}
            <div className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  reset();
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Create Seat
              </button>
            </div>
          </form>
        </div>
      </Popup>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Seat Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Drag seats to assign, reposition, or return them to the unassigned
          list
        </p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-160px)]">
        <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <SeatList
            seats={seats}
            onUnassignDrop={handleUnassignSeat}
            onAdd={() => setIsOpen(true)}
          />
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <RoomDiagram
            seats={seats}
            onSeatDrop={handleSeatDrop}
            onUnassign={handleUnassignSeat}
          />
        </div>
      </div>
    </div>
  );
};

export default SeatManagement;
