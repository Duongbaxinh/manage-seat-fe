import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
import { useForm } from 'react-hook-form';
import { BiArrowBack, BiArrowFromLeft, BiPlus, BiSave, BiUpload } from 'react-icons/bi';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import Popup from '../components/atom/Popup';
import RoomDiagram from '../components/molecules/RoomDiagram';
import SeatList from '../components/molecules/SeatList';
import { useAuth } from '../context/auth.context';
import { useSeatContext } from '../context/seat.context';
import { useWebSocketContext } from '../context/websoket.context';
import useConfirmReload from '../hooks/useConfirmReload';
import useSaveLocalStorage from '../hooks/useSaveLocalStorage';
import Header from '../layout/Header';
import { permission, ROLES } from '../utils/permission';
import { handleAxiosError } from '../utils/handleError';
import { type } from '@testing-library/user-event/dist/type';

const OBJECT_NEW = {
  id: Date.now(),
  name: 'Object',
  color: '#9B9B9B',
  posX: 50,
  posY: 50,
  width: 100,
  height: 100,
  rotation: 0,
};
const SeatManagement = () => {
  const { setObjects, objects, objected } = useSeatContext();
  const { sendMessage, lastJsonMessage } = useWebSocketContext();
  const { getUser } = useAuth();
  const [userAssign, setUserAssign] = useState(null);
  const [seatAssign, setSeatAssign] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [seats, setSeats] = useState([]);
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    type: "TEMPORARY",
    isOccupied: true
  })
  const [roomInfo, setRoomInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUser] = useState([]);
  const [teams, setTeams] = useState([]);
  const [owner, setOwner] = useState(null);
  const [showImage, setShowImage] = useSaveLocalStorage('showImage', false);
  const [showListSeat, setShowListSeat] = useSaveLocalStorage('showListSeat', false);
  const [assign, setAssign] = useState(false);
  const [color, setColor] = useState('#ff0000');
  const refObject = useRef(null);
  const refColor = useRef(null);
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useConfirmReload();
  const createSeat = async (data) => {
    try {
      const token = localStorage.getItem('accessToken');
      const authentication = {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      if (data.userId && (data.userId === null || users.length === 0)) {
        delete data.userId;
      }
      await axios.post(
        'https://seatment-app-be-v2.onrender.com/seat',
        {
          ...data,
          roomId: id,
          posX: 0,
          posY: 0,
        },
        authentication
      );
      await fetchData(authentication);
      setIsOpen(false);
      reset();
    } catch (error) {
      handleAxiosError(error)
    }
  };

  const handleSetSeatPosition = (seatId, position) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === seatId
          ? {
            ...seat,
            posX: position.x,
            posY: position.y,
          }
          : seat
      )
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const handleResetSeat = (seatId) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) => (seat.id === seatId ? { ...seat, posX: 0, posY: 0 } : seat))
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
    const token = localStorage.getItem('accessToken');
    await axios.put(
      'https://seatment-app-be-v2.onrender.com/seat/assign',
      {
        seatId: seatId,
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }
    );
    fetchDataUser({
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
  };

  const handleReAssign = async (newSeatId, oldSeatId, userId) => {
    const token = localStorage.getItem('accessToken');
    await axios.put(
      'https://seatment-app-be-v2.onrender.com/seat/reassign',
      {
        newSeatId: newSeatId,
        oldSeatId: oldSeatId,
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }
    );
    fetchDataUser({
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
  };

  const handleUnAssign = async (seatId) => {
    if (window.confirm('Are you sure unAssign?')) {
      const token = localStorage.getItem('accessToken');
      await axios.get(`https://seatment-app-be-v2.onrender.com/seat/unassign/${seatId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });
      fetchDataUser({
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });
    }
  };

  const handleSaveDiagram = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('roomId', id);
      if (file) formData.append('image', file);
      formData.append('seats', JSON.stringify(seats));
      formData.append('name', roomInfo.name);
      formData.append('floor', roomInfo.floor);
      formData.append('hall', roomInfo.hall);

      formData.append('object', JSON.stringify(objects));

      await axios.post('https://seatment-app-be-v2.onrender.com/room/save/diagram', formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error saving diagram:', error);
    }
  };

  const handleAddObject = (newObject) => {
    setObjects((prev) => [...prev, newObject]);
  };

  const handleUpdateObject = (objectId, updates) => {
    setObjects((prev) =>
      prev.map((item) => (item.id === objectId ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteObject = (objectId) => {
    setObjects((prev) => prev.filter((item) => item.id !== objectId));
  };

  const fetchDataUser = async (authentication) => {
    try {
      if (!id) return;
      const userResponse = await axios.get(
        `https://seatment-app-be-v2.onrender.com/room/users/${id}`,
        authentication
      );
      setUser(userResponse.data.result);
    } catch (error) {
      handleAxiosError(error)
    }
  };
  const fetchDataTeam = async (authentication) => {
    try {
      if (!id) return;
      const teamRes = await axios.get(
        `https://seatment-app-be-v2.onrender.com/team`,
        authentication
      );
      setTeams(teamRes.data.result);
    } catch (error) {
      handleAxiosError(error)
    }
  };
  const fetchData = useCallback(
    async (authentication) => {
      try {
        const [roomResponse] = await Promise.all([
          // axios.get(`https://seatment-app-be-v2.onrender.com/room/view?roomId=${id}&pageNumber=${filter.page}&pageSize=${filter.limit}&typeSeat=${filter.type}&isOccupied=${filter.isOccupied}`, authentication),
          axios.get(`https://seatment-app-be-v2.onrender.com/room/view/${id}`, authentication),

        ]);
        console.log('check', roomResponse.data.result);
        setPreviewUrl(roomResponse.data.result.image);
        setOwner(roomResponse.data.result.chief);
        setSeats(roomResponse.data.result.seats);
        setObjects(JSON.parse(roomResponse.data.result.object) ?? []);
        setRoomInfo({
          name: roomResponse.data.result.name,
          floor: roomResponse.data.result.floor,
          hall: roomResponse.data.result.hall,
          seatAvailable: roomResponse.data.result.seatAvailable,
          capacity: roomResponse.data.result.capacity,
          usersCount: roomResponse.data.result.usersCount
        });
      } catch (error) {
        handleAxiosError(error)
      }
    },
    [id]
  );

  const handleColor = (newColor) => {
    if (!objected) return
    setColor(newColor);
    handleUpdateObject(objected.id, { color: newColor.hex });
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const authentication = {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };
    sendMessage(JSON.stringify({ type: 'join', value: id.toString() }));
    fetchData(authentication);
    fetchDataUser(authentication);
    fetchDataTeam(authentication)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!lastJsonMessage) return;
    const token = localStorage.getItem('accessToken');
    const authentication = {
      headers: { Authorization: `Bearer ${JSON.parse(token)}` },
    };

    const { type, data } = lastJsonMessage;
    switch (type) {
      case 'seatUpdate':
        setSeats((prevSeats) =>
          prevSeats.map((seat) => (seat.id === data.id ? { ...seat, ...data } : seat))
        );
        break;

      case 'createSeat':
        setSeats((prevSeats) => [...prevSeats, data]);
        break;

      case 'seatDelete':
        setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== data.seatId));
        break;

      case 'reassignSeat':
        setSeats((prevSeats) =>
          prevSeats.map((seat) =>
            seat.id === data.newSeat?.id
              ? { ...seat, isOccupied: true, user: { ...data.newSeat.user } }
              : seat.id === data.oldSeat?.id
                ? { ...seat, isOccupied: false, user: null }
                : seat
          )
        );
        break;

      case 'assignSeat':
        setSeats((prevSeats) =>
          prevSeats.map((seat) =>
            seat.id === data.id ? { ...seat, isOccupied: true, user: data.user } : seat
          )
        );
        setRoomInfo(pre => ({ ...pre, seatAvailable: pre.seatAvailable - 1 }))
        break;

      case 'unAssignSeat':
        setSeats((prevSeats) =>
          prevSeats.map((seat) =>
            seat.id === data.id ? { ...seat, isOccupied: false, user: null } : seat
          )
        );
        setRoomInfo(pre => ({ ...pre, seatAvailable: pre.seatAvailable + 1 }))
        break;

      case 'approve':
        alert(permission(getUser(), 'update:seat', owner) ? data.message : "Layout has been changed");
        fetchData(authentication);
        break;

      case 'saveDiagram':
        alert(data.message);
        fetchData(authentication);
        break;

      case 'reject':
        alert(permission(getUser(), 'update:seat', owner) ? data.message : "Layout has been changed");
        fetchData(authentication);
        break;
      default:
        console.warn('Unknown message type:', type);
    }
  }, [fetchData, lastJsonMessage]);

  return (
    <div className="w-full mx-auto px-4 pt-6 pb-0">
      <Header />
      {roomInfo && (
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-3  bg-white px-7 py-3 mt-2">
            <h1 className="text-2xl font-semibold text-gray-700 uppercase">{roomInfo.name} - </h1>
            <h1 className="text-2xl font-semibold text-gray-700 uppercase"> {roomInfo.floor} - </h1>
            <h1 className="text-2xl font-semibold text-gray-700 uppercase"> {roomInfo.hall}</h1>
          </div>
          <div className="flex items-center justify-start gap-3  px-7  mt-2">
            <h1 className="p-3 text-2xl font-semibold text-gray-700 uppercase bg-blue-200 rounded-sm "> <span>Total User</span>-{roomInfo.usersCount} </h1>
            <h1 className="p-3 text-2xl font-semibold text-gray-700 uppercase bg-blue-200 rounded-sm "> <span>Total Seat</span>-{roomInfo.capacity} </h1>
            <h1 className="p-3 text-2xl font-semibold text-gray-700 uppercase bg-green-200 rounded-sm">  <span>Seat Available </span>{roomInfo.seatAvailable}</h1>
          </div>
        </div>
      )}
      <div className="rounded-lg shadow-sm mt-6">
        <div className="flex gap-3 w-full ">
          <div className=" sticky top-0 flex flex-col gap-2 justify-start items-start  h-[100vh] p-2 bg-white text-white">
            {previewUrl && (
              <button
                className={`${!showImage ? 'bg-red-400' : 'bg-green-400'
                  } w-full px-3 py-2 rounded-md`}
                onClick={() => setShowImage(!showImage)}
              >
                {!showImage ? (
                  <div className="flex items-center gap-2">
                    <BsEye /> <p>Hidden Diagram</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <BsEyeSlash /> <p>Visible Diagram</p>
                  </div>
                )}
              </button>
            )}
            {permission(getUser(), 'update:seat', owner) && (
              <>
                <button
                  onClick={() => handleAddObject(OBJECT_NEW)}
                  className=" w-full flex gap-2  px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <BiPlus />
                  Add New Object
                </button>

                <div className=" w-full bg-yellow-300 rounded-md p-1 cursor-pointer flex items-center text-white">
                  <label htmlFor="fileupload" className="cursor-pointer flex gap-2 px-5 py-2 ">
                    <BiUpload /> Upload Diagram{' '}
                  </label>
                  <input
                    id="fileupload"
                    type="file"
                    onChange={handleFileChange}
                    className="mb-2 hidden"
                  />
                </div>
                <button
                  onClick={handleSaveDiagram}
                  className=" w-full  flex gap-2 px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  {/* <BiSave /><p>{owner.role === ROLES.SUPERUSER ?  : "Send request"}</p>
                   */}
                  <p>Save Diagram</p>
                </button>
                {/* {objected && ( */}
                <div ref={refColor} className="w-full">
                  <SketchPicker color={color} onChange={(newColor) => handleColor(newColor)} />
                </div>
                {teams.length > 0 && (
                  <>
                    <h1 className='text-black font-bold'>Teams</h1>
                    {teams.map((team, index) => (
                      <div key={index} className="px-3 py-2 text-white w-full text-center" style={{ backgroundColor: team.code }}>{team.name}</div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>

          <div style={{ border: '1px solid blue' }} className="flex-grow overflow-auto py-10">
            <RoomDiagram
              permissionAction={permission(getUser(), 'update:seat', owner)}
              showImage={showImage}
              diagramUrl={previewUrl}
              onAddObject={handleAddObject}
              onUpdateObject={handleUpdateObject}
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
              onSetSeatPosition={handleSetSeatPosition}
              onUnassign={handleUnassignSeat}
              onReset={handleResetSeat}
              refObject={refObject}
            />
          </div>

          <div className=" sticky top-0   h-[100vh] p-2 bg-white">
            {showListSeat ?
              <button className="p-2 cursor-pointer " onClick={() => setShowListSeat(false)} >
                <BiArrowFromLeft />
              </button> :
              <button className="p-2 cursor-pointer " onClick={() => setShowListSeat(true)} >
                <BiArrowBack /></button>}
            <div className={`${showListSeat ? " block" : "hidden"}  min-w-[200px]`}>
              <SeatList
                permissionAction={permission(getUser(), 'update:seat', owner)}
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
      </div>

      <Popup title={'Add new Seat'} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="min-w-[500px] p-3">
          <form onSubmit={handleSubmit(createSeat)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="border-0   rounded-md outline-none px-2 py-1 shadow-md text-[13px]  "
                placeholder="Enter seat name"
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                minLength={7}
                {...register('description')}
                className="border-0   rounded-md outline-none px-2 py-1 shadow-md text-[13px] "
                placeholder="Enter seat description"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-1 flex-col gap-1  ">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select
                  {...register('typeSeat', { required: 'Seat type is required' })}
                  className="border-0   rounded-md outline-none px-2 py-1 shadow-md text-[13px] "
                >
                  <option value="">Select type</option>
                  <option value="TEMPORARY">Temporary</option>
                  <option value="PERMANENT">Permanent</option>
                </select>
                {errors.typeSeat && (
                  <span className="text-red-500 text-sm">{errors.typeSeat.message}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">User</label>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        setAssign(e.target.checked);
                      }}
                    />
                  </div>
                  <select
                    {...register('userId')}
                    className="border-0  rounded-md outline-none px-2 py-1 shadow-md text-[13px]"
                  >
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </option>
                      ))
                    ) : (
                      <option value={null}>Not user not have seat</option>
                    )}
                  </select>
                  {errors.userId && (
                    <span className="text-red-500 text-sm">{errors.userId.message}</span>
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
