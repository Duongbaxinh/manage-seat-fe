import Tippy from '@tippyjs/react';
import debounce from 'lodash.debounce';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import Switch from "react-switch";
import { toast } from 'react-toastify';
import LoadingProgress from '../components/atom/LoadingProgress';
import Popup from '../components/atom/Popup';
import RoomLayoutSkeleton from '../components/atom/RoomLayoutSkeleton';
import RoomDiagram from '../components/molecules/RoomDiagram';
import SeatList from '../components/molecules/SeatList';
import { useAuth } from '../context/auth.context';
import { useOnboardingGuide } from '../context/guide.context';
import { useObjectContext } from '../context/object.context';
import { useWebSocketContext } from '../context/websoket.context';
import useConfirmReload from '../hooks/useConfirmReload';
import useGetData from '../hooks/useGetData';
import useSaveLocalStorage from '../hooks/useSaveLocalStorage';
import Header from '../layout/Header';
import { switchDraftDiagram } from '../services/diagram.service';
import DetailRoomService from '../services/room.service';
import useSeat from '../services/seat.service';
import { addSeat, addSeatType, assignSeat, reAssignSeat, removeSeat, switchSeat, unAssignSeat } from '../services/seattype.service';
import { permission, ROLES } from '../utils/permission';
import { useSeatMap } from '../context/seatmap.context';

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
  const { roomId } = useParams();
  useConfirmReload();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    previewUrl,
    seats,
    file,
    roomInfo,
    owner,
    users,
    userNoSeat,
    teams,
    loading: loadingPage,
    isDraftLayout,
    loadingProgress,
    setSeats,
    setFile,
    setPreviewUrl,
    setRoomInfo,
    getDetailRoom,
    getRoomLayoutDraft,
    fetchDataUser,
    handleSaveDiagram,
    handleSaveDiagramAuto,
    fetchDataTeam,
    checkIsDraftLayout
  } = DetailRoomService(roomId);
  const { objects } = useObjectContext()
  const {
    isOpen,
    setIsOpen,
    handleSetSeatPosition,
    handleAddObject,
    handleDeleteObject,
    handleUpdateObject,
  } = useSeat(roomId);

  const { data: seatType, loading: loadingSeat, setData: setDataSeatType } = useGetData({
    url: `https://seatmanage-be-v3.onrender.com/seat-type/${roomId}`,
    authorization: true,
  });
  const { goToTarget } = useSeatMap();
  const { sendMessage, lastJsonMessage } = useWebSocketContext();
  const { getUser } = useAuth();
  const [loading, setLoading] = useState(false)
  const [showImage, setShowImage] = useSaveLocalStorage('showImage', false);
  const [isDraft, setIsDraft] = useState(false);
  const [currentLayout, setCurrentLayout] = useState(true);
  const { setIsGuideActive, setCurrentStep, handleShowGuide } = useOnboardingGuide();
  const refObject = useRef(null);


  const isOwner = getUser()?.id === owner?.id;
  const isSuperuser = getUser()?.role === ROLES.SUPERUSER;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      handleShowGuide(2)
    }
  };

  const handleRemoveBackground = () => {
    handleShowGuide(1)
    setFile("");
    setPreviewUrl("");
  };

  const handleUnAssignSeat = async (seatId) => {
    const token = localStorage.getItem('accessToken');
    const authentication = {
      headers: { Authorization: `Bearer ${JSON.parse(token)}` },
    };
    if (isSuperuser) {
      await unAssignSeat(seatId)
    } else {
      setSeats(prev => prev.map(seat => seat.id === seatId ? { ...seat, user: null, expireTime: null } : seat))
      setRoomInfo((pre) => ({ ...pre, seatAvailable: pre?.seatAvailable + 1 }));
      fetchDataUser(roomId, false, authentication);
      fetchDataUser(roomId, true, authentication);
    }
  }

  const handleSwitchSeat = async ({ seatSwitch, userSwitch, seatSelected }) => {
    console.log("seat selected", seatSelected)
    if (isSuperuser) {
      await switchSeat({ seatId: seatSwitch.id, userIdSwitch: userSwitch.id, seatSelected })
    } else {

      setSeats((prevSeats) =>
        prevSeats.map((seat) => {
          if (seat.id === seatSwitch.id) {
            return {
              ...seat,
              user: userSwitch
            };
          }
          else if (seat?.user?.id === userSwitch.id && seat.id === seatSelected) {
            return {
              ...seat,
              user: seatSwitch.user,
            };
          } else {
            return seat;
          }
        })
      );
    }
  }

  const handleAddSeat = async (dataSeat) => {
    const newSeat = {
      id: Math.random(10000),
      name: dataSeat.name,
      description: `description ${dataSeat.name}`,
      typeSeat: "TEMPORARY",
      posX: dataSeat.x,
      posY: dataSeat.y,
      roomId: roomId,
    }
    if (isSuperuser) {
      // thêm ghế tạm thời
      setSeats((prev) => [
        ...prev,
        {
          id: `draft_${dataSeat.name}`,
          name: "Creating...",
          description: `description ${dataSeat.name}`,
          posX: dataSeat.x,
          posY: dataSeat.y,
          roomId: roomId,
        },
      ]);
      await addSeat(newSeat);
      // xóa ghế tạm thời
      setSeats((prev) => prev.filter((seat) => seat.id !== `draft_${dataSeat.name}`));
      handleShowGuide(11)
    } else {
      setSeats((prevSeats) => [...prevSeats, newSeat]);
      setRoomInfo((pre) => ({
        ...pre,
        capacity: pre?.capacity + 1,
        seatAvailable: pre?.seatAvailable + 1,
      }));
      handleShowGuide(11)
    }
  };

  const handleCreateTypeSeat = async (dataSeatType) => {

    await addSeatType({ name: dataSeatType.name, roomId: roomId });
    setIsOpen(false);
    handleShowGuide(10)
    toast("create type seat success");
  };

  const handleSwitchDiagram = async (value) => {
    if (!value && !currentLayout) {
      handleShowGuide(25)
    }
    if (value) {
      handleShowGuide(5)
    }
    if (currentLayout && !isDraft && isDraftLayout) {
      const check = window.confirm("Hành động này sẽ làm mất layout draft trước đó")
      if (check) {
        handleSaveDiagramAuto(roomId);
        setIsDraft(value);
        setCurrentLayout(false)
        if (value) {
          await switchDraftDiagram(roomId);
        }
      }
    } else {
      setIsDraft(value);
      setCurrentLayout(false)
      if (value) {
        await switchDraftDiagram(roomId);
      }
    }
  };

  const handleRemoveSeat = async (seatId) => {
    const token = localStorage.getItem('accessToken');
    const authentication = {
      headers: { Authorization: `Bearer ${JSON.parse(token)}` },
    };
    if (isSuperuser) {
      await removeSeat(seatId);
    } else {
      const seatRemove = seats.find(seat => seat.id === seatId)
      setSeats(prev => prev.filter(seat => seat.id !== seatId));
      if (seatRemove.user === null) {
        setRoomInfo((pre) => ({ ...pre, seatAvailable: pre?.seatAvailable - 1 }));
      }
      setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== seatRemove.id));
      setRoomInfo((pre) => ({ ...pre, capacity: pre.capacity - 1 }));
      fetchDataUser(roomId, false, authentication);
      fetchDataUser(roomId, true, authentication);
    }
  }
  const handleAssignSeat = async (assignData) => {
    const token = localStorage.getItem('accessToken');
    const authentication = {
      headers: { Authorization: `Bearer ${JSON.parse(token)}` },
    };
    if (isSuperuser) {
      await assignSeat({
        "userId": assignData.user.id,
        "seatId": assignData.seatId,
        "typeSeat": assignData.typeSeat,
        "expiration": assignData.expiration
      })
    }
    else {
      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          seat.id === assignData.seatId
            ? {
              ...seat, isOccupied: true,
              user: assignData.user,
              expireTime: assignData.expiration,
              typeSeat: assignData.typeSeat
            }
            : seat
        ))
      setRoomInfo((pre) => ({ ...pre, seatAvailable: pre.seatAvailable - 1 }));
      fetchDataUser(roomId, false, authentication);
      fetchDataUser(roomId, true, authentication);
    }
  }

  const handleReAssignSeat = async (reassignData) => {
    const token = localStorage.getItem('accessToken');
    const authentication = {
      headers: { Authorization: `Bearer ${JSON.parse(token)}` },
    };
    if (isSuperuser) {
      await reAssignSeat({
        newUserId: reassignData.newUser.id,
        seatId: reassignData.seatId,
        userId: reassignData.oldUser?.id,
        "typeSeat": reassignData.typeSeat,
        "expiration": reassignData.expiration
      })
    }
    else {
      setSeats((prevSeats) =>
        prevSeats.map((seat) => {
          if (seat.id === reassignData.seatId) {
            return {
              ...seat,
              isOccupied: true,
              user: { ...reassignData.newUser },
              expireTime: reassignData.expiration,
              typeSeat: reassignData.typeSeat,
            };
          }
          else {
            return seat;
          }
        })
      );
      fetchDataUser(roomId, false, authentication);
      fetchDataUser(roomId, true, authentication);
    }
  }

  const userId = getUser().id;
  useEffect(() => {
    setTimeout(() => {
      setIsGuideActive(true)
      setCurrentStep(0)
    }, 2000);
    const token = localStorage.getItem('accessToken');
    const authentication = {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };
    if (roomId) {
      setLoading(true)
      getDetailRoom(roomId);
      checkIsDraftLayout(roomId, authentication);
      fetchDataTeam(roomId, authentication);
      fetchDataUser(roomId, true, authentication);
      fetchDataUser(roomId, false, authentication);
      setLoading(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);


  useEffect(() => {
    sendMessage(JSON.stringify({ type: 'join', value: roomId.toString() }));
  }, [roomId, sendMessage]);
  useEffect(() => {
    if (!lastJsonMessage) return;
    const token = localStorage.getItem('accessToken');
    const authentication = {
      headers: { Authorization: `Bearer ${JSON.parse(token)}` },
    };
    const { type, data } = lastJsonMessage;
    switch (type) {
      case 'createSeat':
        if (currentLayout) {
          setSeats((prevSeats) => [...prevSeats, data]);
          setRoomInfo((pre) => ({
            ...pre,
            capacity: pre.capacity + 1,
            seatAvailable: pre.seatAvailable + 1,
          }));
        }
        break;
      case 'createTypeSeat':
        setDataSeatType((prev) => [...prev, data]);
        break;
      case 'switchSeat':
        setSeats((prevSeats) =>
          prevSeats.map((seat) => {
            if (seat.id === data.seat.id) {
              return {
                ...data.seat
              };
            }
            else if (seat.id === data.switchSeat.id) {
              return {
                ...data.switchSeat
              };
            } else {
              return seat;
            }
          })
        );
        break;
      case 'deleteSeat':
        if (currentLayout) {
          if (data.user === null) {
            setRoomInfo((pre) => ({ ...pre, seatAvailable: pre?.seatAvailable - 1 }));
          }
          setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== data.id));
          setRoomInfo((pre) => ({ ...pre, capacity: pre.capacity - 1 }));
          fetchDataUser(roomId, false, authentication);
          fetchDataUser(roomId, true, authentication);
        }
        break;
      case 'reassignSeat':
        if (currentLayout) {
          setSeats((prevSeats) =>
            prevSeats.map((seat) => {
              if (seat.id === data?.id) {
                return {
                  ...seat,
                  isOccupied: true,
                  user: { ...data.user },
                  expireTime: data.expireTime,
                  typeSeat: data.typeSeat,
                };
              } else {
                return seat;
              }
            })
          );
          fetchDataUser(roomId, false, authentication);
          fetchDataUser(roomId, true, authentication);
        }
        break;
      case 'assignSeat':
        if (currentLayout) {
          setSeats((prevSeats) =>
            prevSeats.map((seat) =>
              seat.id === data.id
                ? { ...seat, isOccupied: true, user: data.user, expireTime: data.expireTime, typeSeat: data.typeSeat }
                : seat
            )
          );
          setRoomInfo((pre) => ({ ...pre, seatAvailable: pre?.seatAvailable - 1 }));
          fetchDataUser(roomId, false, authentication);
          fetchDataUser(roomId, true, authentication);
        }
        break;
      case 'unAssignSeat':
        if (currentLayout) {
          setSeats((prevSeats) =>
            prevSeats.map((seat) =>
              seat.id === data.id
                ? { ...seat, isOccupied: false, user: null, expireTime: null, typeSeat: null }
                : seat
            )
          );
          setRoomInfo((pre) => ({ ...pre, seatAvailable: pre?.seatAvailable + 1 }));
          fetchDataUser(roomId, false, authentication);
          fetchDataUser(roomId, true, authentication);
        }
        break;
      case 'approve':
        toast("Layout đã được thay đổi")
        setCurrentLayout(true)
        getDetailRoom(roomId);
        break;
      case 'saveDiagram':
        if (currentLayout) {
          toast(data.message, " ", "loading page to see ");
          getDetailRoom(roomId);
        }
        break;
      case 'reject':
        toast("Layout đã bị từ chối")
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage]);

  useEffect(() => {
    const debouncedSave = debounce(() => {
      handleSaveDiagramAuto(roomId);
    }, 2000);

    if (isOwner && !currentLayout && isDraft) {
      debouncedSave();
    }
    return () => {
      debouncedSave.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seats, file, roomInfo, objects, isOwner]);


  const titleSave = "Send request";
  return (
    <div className="w-full mx-auto px-4 pt-6 min-w-[1440px] relative">
      <LoadingProgress loading={loadingProgress} />
      <Header />

      {roomInfo && (
        <div id={'over-view'} className="flex items-center justify-between min-w-[1440px]">
          <div className="flex items-center justify-start gap-3 bg-white px-7 py-3 mt-2">
            <h1 className="text-md font-semibold text-gray-700 uppercase">{roomInfo.name} - </h1>
            <h1 className="text-md font-semibold text-gray-700 uppercase">{roomInfo.floor} - </h1>
            <h1 className="text-md font-semibold text-gray-700 uppercase">{roomInfo.hall}</h1>
          </div>
          <div id="room-summary" className="flex items-center justify-start gap-3 px-7 mt-2">
            <h1 className="p-3 text-md font-semibold text-gray-700 uppercase bg-blue-200 rounded-sm">
              <span>User In Room</span>-{roomInfo.usersCount}
            </h1>
            <h1 className="p-3 text-md font-semibold text-gray-700 uppercase bg-blue-200 rounded-sm">
              <span>Total Seat</span>-{roomInfo.capacity}
            </h1>
            <h1 className="p-3 text-md font-semibold text-gray-700 uppercase bg-green-200 rounded-sm">
              <span>Seat Available </span>{roomInfo.seatAvailable}
            </h1>
          </div>
        </div>
      )}
      <div className="rounded-lg shadow-sm mt-3">
        <div className="flex gap-3 w-full min-w-[1440px]">

          <div className="bg-white overflow-auto w-full sticky top-0 h-[95vh] ">
            <div className="flex sticky top-0 left-0 z-20 bg-white gap-3 w-full shadow-md p-3">
              <button onClick={() => goToTarget(`#user-${userId}`)} className='p-3 bg-blue-300 rounded-sm'>
                My seat
              </button>
              {previewUrl && (
                <button
                  id={`${showImage ? "hide-background" : "visible-background"} `}
                  className={`${showImage ? 'bg-red-400' : 'bg-green-400'} w-fit whitespace-nowrap p-2 bg-blue-400 text-white rounded-sm flex items-center`}
                  onClick={() => setShowImage(!showImage)}
                >
                  {showImage ? (
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
                !previewUrl ? (
                  <div
                    id="upload-background"
                    className="w-fit whitespace-nowrap p-2 bg-blue-400 text-white rounded-sm flex items-center"
                  >
                    <label htmlFor="fileupload" className="cursor-pointer">
                      Upload Background
                    </label>
                    <input
                      id="fileupload"
                      type="file"
                      onChange={handleFileChange}
                      className="mb-2 hidden"
                    />
                  </div>
                ) : (
                  <button
                    id="remove-background"
                    onClick={handleRemoveBackground}
                    className="whitespace-nowrap p-2 bg-blue-400 text-white rounded-sm"
                  >
                    <p>Remove Background</p>
                  </button>
                )
              )}

              {isOwner && (
                <>
                  {isDraftLayout && currentLayout && (
                    <button
                      id='continue-draft-layout'
                      onClick={() => {
                        getRoomLayoutDraft(roomId);
                        setIsDraft(true);
                        setCurrentLayout(false);
                        handleShowGuide(3);
                      }}
                      className="whitespace-nowrap p-2 bg-blue-400 text-white rounded-sm"
                    >
                      <p>Continue draft layout</p>
                    </button>
                  )}
                  {!currentLayout && isDraftLayout && (
                    <button
                      id="current-layout"
                      onClick={() => {
                        getDetailRoom(roomId);
                        setCurrentLayout(true);
                        setIsDraft(false);
                        handleShowGuide(2);
                      }}
                      className="whitespace-nowrap p-2 bg-blue-400 text-white rounded-sm"
                    >
                      <p>Current layout</p>
                    </button>
                  )}
                </>
              )}
              {(isSuperuser) && (
                <button
                  id='save-layout'
                  onClick={() => handleSaveDiagram({ roomId, draft: false })}
                  className="whitespace-nowrap p-2 bg-blue-400 text-white rounded-sm"
                >
                  <p>Save layout</p>
                </button>
              )}
              {((!isDraft && !currentLayout && isOwner)) && (
                <button
                  id={isSuperuser ? "save-layout" : "send-request"}
                  onClick={() => handleSaveDiagram({ roomId, draft: false })}
                  className="whitespace-nowrap p-2 bg-blue-400 text-white rounded-sm"
                >
                  <p>{titleSave}</p>
                </button>
              )}
              {isOwner && (
                <Tippy content={!isDraft ? 'Sửa layout' : 'Gửi yêu cầu'}>
                  <div id={isDraft ? "complete-request" : "edit-layout"} className="whitespace-nowrap p-2 bg-blue-400 text-white rounded-sm flex items-center">
                    <Switch onChange={handleSwitchDiagram} checked={isDraft} />
                  </div>
                </Tippy>
              )}
            </div>
            {loadingPage ? (
              <div className="w-full h-full  flex items-center justify-center">
                <RoomLayoutSkeleton />
              </div>
            ) : (
              <div className="grow border border-blue-500">
                <RoomDiagram
                  roomId={roomId}
                  permissionAction={permission(getUser(), 'update:seat', owner, isDraft)}
                  owner={owner}
                  onAddSeat={handleAddSeat}
                  showImage={showImage}
                  diagramUrl={previewUrl}
                  onAddObject={handleAddObject}
                  onUpdateObject={handleUpdateObject}
                  onDeleteObject={handleDeleteObject}
                  onUnAssignSeat={handleUnAssignSeat}
                  onReAssignSeat={handleReAssignSeat}
                  onSwitchSeat={handleSwitchSeat}
                  onAssignSeat={handleAssignSeat}
                  onRemoveSeat={handleRemoveSeat}
                  users={users}
                  userNoSeat={userNoSeat}
                  seats={seats}
                  setSeats={setSeats}
                  onSetSeatPosition={handleSetSeatPosition}
                  refObject={refObject}
                />
              </div>
            )}
          </div>

          {(isDraft || isSuperuser) && (
            <div className="sticky top-0 h-[80vh] w-full max-w-[230px] min-w-[230px] p-2 bg-white overflow-y-scroll overflow-x-visible">
              <div className="w-full space-y-5">
                <SeatList
                  permissionAction={permission(getUser(), 'update:seat', owner, isDraft)}
                  seats={seatType}
                  loadingSeat={loadingSeat}
                  onAdd={() => setIsOpen(true)}
                />

                {permission(getUser(), 'update:seat', owner, isDraft) && (
                  <>
                    <button
                      id="add-object"
                      onClick={() => {
                        handleShowGuide(19)
                        handleAddObject(OBJECT_NEW)
                      }}
                      className="w-full flex gap-2 px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Add New Object
                    </button>

                  </>
                )}
                {teams.length > 0 && (
                  <>
                    <h1 className="text-black font-bold">Teams</h1>
                    {teams.map((team, index) => (
                      <div key={index} className="px-3 py-2 text-white w-full text-center" style={{ backgroundColor: team.code }}>
                        {team.name}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Popup title={'Add new Seat'} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="min-w-[500px] p-3">
          <form onSubmit={handleSubmit(handleCreateTypeSeat)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="border-0 rounded-md outline-none px-2 py-1 shadow-md text-[13px]"
                placeholder="Enter seat name"
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Create Seat
            </button>
          </form>
        </div>
      </Popup>

    </div>
  );
};

export default SeatManagement;