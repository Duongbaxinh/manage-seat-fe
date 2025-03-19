import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Popup from "../Component/atom/Popup";
import RoomDiagram from "../components/RoomDiagram";
import SeatList from "../components/SeatList";

const SeatManagement = () => {
  const [seats, setSeats] = useState([]);
  const [room, setRoom] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUser] = useState([]);
  const [assign, setAssign] = useState(false);
  const [objects, setObjects] = useState([]);
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
      fetchData();
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
          if (isRepositioning) {
            return {
              ...seat,
              posX: position.x,
              posY: position.y,
            };
          }
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

  const handleAddObject = (type) => {
    const newObject = {
      id: Date.now(),
      name: type,
      posX: 50,
      posY: 50,
      width: type === "wall" ? 200 : 100,
      height: type === "wall" ? 20 : 100,
      rotation: 0,
    };
    setObjects((prev) => [...prev, newObject]);
  };

  const handleSetPositionObject = (objectId, updates) => {
    setObjects((prev) =>
      prev.map((item) =>
        item.id === objectId ? { ...item, ...updates } : item
      )
    );
  };

  const handleDeleteObject = (objectId) => {
    setObjects((prev) => prev.filter((item) => item.id !== objectId));
  };

  const handleSaveDiagram = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const diagram = {
        roomId: id,
        image: "https://example.com/room_image.png",
        seats: seats.map((seat) => ({
          seatId: seat.id,
          posX: seat.posX,
          posY: seat.posY,
        })),
        object: JSON.stringify(
          objects.map((obj) => ({
            id: obj.id,
            name: obj.name,
            posX: obj.posX,
            posY: obj.posY,
            width: obj.width,
            height: obj.height,
            rotation: obj.rotation,
          }))
        ),
      };

      await axios.post("http://localhost:8080/room/diagram", diagram, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Show success message or handle response
    } catch (error) {
      console.error("Error saving diagram:", error);
    }
  };

  const fetchData = async (authentication) => {
    const { data } = await axios.get(
      `http://localhost:8080/seat/filter?page=0&size=10&sortBy=name&roomId=${id}`,
      authentication
    );
    const { data: roomData } = await axios.get(
      `http://localhost:8080/room/${id}`,
      authentication
    );
    setSeats(data.result.content);

    console.log("--------", JSON.parse(roomData.result.object));
    setObjects(JSON.parse(roomData.result.object));
  };

  const fetchDataUser = async (authentication) => {
    const { data } = await axios.get(
      `http://localhost:8080/room/users/${id}`,
      authentication
    );

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

  console.log("check roomsss", objects);
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Room Layout</h1>
          <div className="flex gap-4">
            <button
              onClick={() => handleAddObject("table")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add Table
            </button>
            <button
              onClick={() => handleAddObject("wall")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Add Wall
            </button>
            <button
              onClick={handleSaveDiagram}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Save Layout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-3 bg-white rounded-lg border h-[600px]">
            <RoomDiagram
              seats={seats}
              objects={objects}
              onSeatDrop={handleSeatDrop}
              onSetPositionObject={handleSetPositionObject}
              onDeleteObject={handleDeleteObject}
              onUnassign={handleUnassignSeat}
            />
          </div>
          <div className="col-span-1">
            <SeatList
              seats={seats}
              onUnassignDrop={handleUnassignSeat}
              onAdd={() => setIsOpen(true)}
            />
          </div>
        </div>
      </div>

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
              {errors.typeSeat && (
                <span className="text-red-500 text-sm">
                  {errors.typeSeat.message}
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
                {errors.userId && (
                  <span className="text-red-500 text-sm">
                    {errors.userId.message}
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
    </div>
  );
};

export default SeatManagement;
