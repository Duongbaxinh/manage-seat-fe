import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useParams } from "react-router-dom";
import Popup from "../components/atom/Popup";
import RoomDiagram from "../components/molecules/RoomDiagram";
import SeatList from "../components/molecules/SeatList";
import { useAuth } from "../context/auth.context";
import { useWebSocketContext } from "../context/websoket.context";
import useConfirmReload from "../hooks/useConfirmReload";
import useSaveLocalStorage from "../hooks/useSaveLocalStorage";
import { permission } from "../utils/permission";

const SeatManagement = () => {
  const { sendMessage,
    lastJsonMessage, readyState } = useWebSocketContext();
  const { getUser } = useAuth()
  const [userAssign, setUserAssign] = useState(null);
  const [seatAssign, setSeatAssign] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [seats, setSeats] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUser] = useState([]);
  const [owner, setOwner] = useState(null)
  const [showImage, setShowImage] = useSaveLocalStorage("showImage", false)
  const [assign, setAssign] = useState(false);
  const [objects, setObjects] = useState([]);
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useConfirmReload()
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("check data create seat :::: ", data)
      if (data.userId && (data.userId === null || !assign || users.length === 0)) {
        delete data.userId
      }
      await axios.post(
        "http://localhost:8080/seat",
        {
          ...data,
          roomId: id,
          posX: 0,
          posY: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        }
      );
      await fetchData();
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating seat:", error);
    }
  };

  const handleSeatDrop = (seatId, position,) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) => seat.id === seatId ? {
        ...seat,
        posX: position.x,
        posY: position.y,
      } : seat)
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

  const handleAssign = async (seatId, userId) => {
    const token = localStorage.getItem("accessToken");
    console.log("check seatId :::: ", seatId, "   ", userId)
    await axios.put("http://localhost:8080/seat/assign", {
      "seatId": seatId,
      "userId": userId,
    },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }
    )
    fetchDataUser({
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    })
  }

  const handleReAssign = async (newSeatId, oldSeatId, userId) => {
    const token = localStorage.getItem("accessToken");
    console.log("check seatId :::: ", newSeatId, "   ", oldSeatId, "  ", userId)
    await axios.put("http://localhost:8080/seat/reassign", {
      "newSeatId": newSeatId,
      "oldSeatId": oldSeatId,
      "userId": userId
    },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }
    )
    fetchDataUser({
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    })
  }
  const handleUnAssign = async (seatId) => {
    if (window.confirm("Are you sure unAssign?")) {
      const token = localStorage.getItem("accessToken");
      await axios.get(`http://localhost:8080/seat/unassign/${seatId}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        }
      )
      fetchDataUser({
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
    }

  }
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
      const formData = new FormData();
      formData.append("roomId", id);
      if (file) {
        formData.append("image", file ? file : null);
      }
      formData.append("seats", JSON.stringify(seats.map((seat) => ({
        seatId: seat.id,
        posX: seat.posX,
        posY: seat.posY,
      }))));
      formData.append("object", JSON.stringify(objects));

      await axios.post("http://localhost:8080/room/diagram", formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data"
        },
      });

      // Show success message or handle response
    } catch (error) {
      console.error("Error saving diagram:", error);
    }
  };

  const fetchDataUser = async (authentication) => {
    try {
      const userResponse = await axios.get(`http://localhost:8080/room/users/${id}`, authentication)
      setUser(userResponse.data.result);
    } catch (error) {
      alert(error.message)
    }
  }
  const fetchData = async (authentication) => {
    try {
      const [roomResponse] = await Promise.all([
        axios.get(`http://localhost:8080/room/${id}`, authentication),
      ]);

      setPreviewUrl(roomResponse.data.result.image)
      setOwner(roomResponse.data.result.chief)
      setSeats(roomResponse.data.result.seats);
      setObjects(JSON.parse(roomResponse.data.result.object) ?? []);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSetNameObject = (e, idObject) => {
    if (objects.length <= 0) return
    setObjects((prev) => prev.map((object) => object.id === idObject ? { ...object, name: e.target.value } : object))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const authentication = {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };

    sendMessage(JSON.stringify({ type: "join", value: id.toString() }))
    fetchData(authentication);
    fetchDataUser(authentication)
    console.log("run at here")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const authentication = {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };
    if (lastJsonMessage) {
      switch (lastJsonMessage.type) {
        case "notice":
          console.log("Received message:", lastJsonMessage.data.notice);
          alert(lastJsonMessage.data.notice.toString())
          fetchData(authentication)
          break;
        case "seatUpdate":
          console.log("Updating seat: ", lastJsonMessage.data);
          setSeats((prevSeats) =>
            prevSeats.map((seat) =>
              seat.id === lastJsonMessage.data.id ? { ...seat, ...lastJsonMessage.data } : seat
            )
          );
          break;
        case "reassignSeat":
          console.log("Reassign seat: ", lastJsonMessage.data);
          setSeats((prevSeats) => {
            const updatedSeats = prevSeats.map((seat) => {
              if (seat.id === lastJsonMessage.data.newSeat?.id) {
                return { ...seat, isOccupied: true, user: { ...lastJsonMessage.data.newSeat.user } };
              }
              if (seat.id === lastJsonMessage.data.oldSeat?.id) {
                return { ...seat, isOccupied: false, user: null };
              }
              return seat;
            });

            return [...updatedSeats];
          });
          break;

        case "seatCreate":
          console.log("Creating new seat: ", lastJsonMessage.data.id);
          setSeats((prevSeats) => [...prevSeats, lastJsonMessage.data]);
          break;

        case "seatDelete":
          console.log("Deleting seat: ", lastJsonMessage.data.seatId);
          setSeats((prevSeats) =>
            prevSeats.filter((seat) => seat.id !== lastJsonMessage.data.seatId)
          );
          break;
        case "assignSeat":
          console.log("Assign seat: ", lastJsonMessage.data);
          setSeats((prevSeats) =>
            prevSeats.map((seat) =>
              seat.id === lastJsonMessage.data.id ? { ...seat, isOccupied: true, user: lastJsonMessage?.data.user } : seat
            )
          );
          break;
        case "unAssignSeat":
          console.log("Assign seat: ", lastJsonMessage.data.id);
          setSeats((prevSeats) =>
            prevSeats.map((seat) =>
              seat.id === lastJsonMessage.data.id ? { ...seat, isOccupied: false, user: lastJsonMessage?.data.user } : seat
            )
          );
          break;

        default:
          console.warn("Unknown message type:", lastJsonMessage.type);
      }
    }

  }, [lastJsonMessage])

  console.log("check data :::: ", getUser(), "  ", owner)
  return (
    <div className="w-full mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex w-full ">
          <div className="fixed top-0 left-0 z-30 flex flex-col gap-2 justify-start items-start mb-6 w-[100px] h-[100vh] p-2 bg-white">
            {previewUrl && <button className={`${!showImage ? "bg-red-400" : "bg-green-400"} w-full px-3 py-2 rounded-md`} onClick={() => setShowImage(!showImage)} >
              {!showImage ? <BsEye /> : <BsEyeSlash />}
            </button>}
            {permission(getUser(), "update:seat", owner) && (
              <>
                <button
                  onClick={() => handleAddObject("object")}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Add Object
                </button>

                <div className="bg-yellow-300 rounded-md p-1 cursor-pointer flex justify-center items-center text-white">
                  <label htmlFor="fileupload" className="cursor-pointer ">Upload Image</label>
                  <input id="fileupload" type="file" onChange={handleFileChange} className="mb-2 hidden" />
                </div>
                <button
                  onClick={handleSaveDiagram}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Save Layout
                </button></>

            )}
          </div>
          <div className=" flex-grow ml-[80px] mr-[150px]  ">
            <RoomDiagram
              permissionAction={permission(getUser(), "update:seat", owner)}
              showImage={showImage}
              diagramUrl={previewUrl}
              onSetNameObject={handleSetNameObject}
              onSetPositionObject={handleSetPositionObject}
              objects={objects}
              onDeleteObject={handleDeleteObject}
              users={users}
              userAssign={userAssign}
              onAssign={handleAssign}
              onUnAssign={handleUnAssign}
              onReAssign={handleReAssign}
              seats={seats}
              seatAssign={seatAssign}
              setSeatAssign={setSeatAssign}
              setUserAssign={setUserAssign}
              onSeatDrop={handleSeatDrop}
              onUnassign={handleUnassignSeat}
            />
          </div>
          <div className=" fixed top-0 right-0  w-[250px] h-[100vh] p-2 bg-white">
            <SeatList
              permissionAction={permission(getUser(), "update:seat", owner)}
              onAssign={handleAssign}
              onUnAssign={handleUnAssign}
              seats={seats}
              users={users}
              seatAvailable={seats.filter((seat) => seat.user === null)}
              seatAssign={seatAssign}
              setSeatAssign={setSeatAssign}
              userAssign={userAssign}
              setUserAssign={setUserAssign}
              onReAssign={handleReAssign}
              onUnassignDrop={handleUnassignSeat}
              onAdd={() => setIsOpen(true)}
            />
          </div>
        </div>
      </div>

      <Popup title={"Add new Seat"} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="min-w-[500px] p-3">

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="border-0   rounded-md outline-none px-2 py-1 shadow-md text-[13px]  "
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
              <textarea
                minLength={7}
                {...register("description")}
                className="border-0   rounded-md outline-none px-2 py-1 shadow-md text-[13px] "
                placeholder="Enter seat description"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-1 flex-col gap-1  ">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select
                  {...register("typeSeat", { required: "Seat type is required" })}
                  className="border-0   rounded-md outline-none px-2 py-1 shadow-md text-[13px] "
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
              <div className="flex-1">


                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      User
                    </label>
                    <input type="checkbox" onChange={(e) => { setAssign(e.target.checked) }} />
                  </div>
                  <select
                    disabled={!assign}
                    {...register("userId")}
                    className="border-0  rounded-md outline-none px-2 py-1 shadow-md text-[13px] disabled: bg-gray-400 "
                  >
                    {users.length > 0 ? users.map((user, index) => (
                      <option value={user.id}>
                        {user.firstName} {user.lastName}
                      </option>
                    )) : (
                      <option value={null}>Not user not have seat</option>
                    )}
                  </select>
                  {errors.userId && (
                    <span className="text-red-500 text-sm">
                      {errors.userId.message}
                    </span>
                  )}
                </div>

              </div>
            </div>
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
