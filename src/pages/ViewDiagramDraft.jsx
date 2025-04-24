import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
import { useForm } from 'react-hook-form';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingProgress from '../components/atom/LoadingProgress';
import Popup from '../components/atom/Popup';
import RoomDiagram from '../components/molecules/RoomDiagram';
import SeatList from '../components/molecules/SeatList';
import { useAuth } from '../context/auth.context';
import { useNoticeContext } from '../context/notice.context';
import { useObjectContext } from '../context/object.context';
import useConfirmReload from '../hooks/useConfirmReload';
import useGetData from '../hooks/useGetData';
import useSaveLocalStorage from '../hooks/useSaveLocalStorage';
import DetailRoomService from '../services/room.service';
import useSeat from '../services/seat.service';
import { removeSeat, unAssignSeat } from '../services/seattype.service';
import { handleAxiosError } from '../utils/handleError';
import { permission, ROLES } from '../utils/permission';
import LoadingPage from './LoadingPage';
import { useWebSocketContext } from '../context/websoket.context';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';

const OBJECT_NEW = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    name: 'Object',
    color: '#9B9B9B',
    posX: 50,
    posY: 50,
    width: 100,
    height: 100,
    rotation: 0,
};

const ViewDraftDiagram = () => {
    const { roomId } = useParams();
    const { lastJsonMessage } = useWebSocketContext()
    useConfirmReload();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const { objects } = useObjectContext()
    const {
        previewUrl,
        seats,
        roomInfo,
        owner,
        loading,
        users,
        file,
        userNoSeat,
        teams,
        loadingProgress,
        setSeats,
        setFile,
        setPreviewUrl,
        setRoomInfo,
        getRoomLayoutRequest,
        handleSaveDiagramRequest,
        fetchDataUser,
        fetchDataTeam,
    } = DetailRoomService(roomId);
    const {
        isOpen,
        userAssign,
        seatAssign,
        color,
        setIsOpen,
        setUserAssign,
        setSeatAssign,
        handleSetSeatPosition,
        handleAddObject,
        handleDeleteObject,
        handleUpdateObject,
        handleColor,
    } = useSeat(roomId);

    const { data: seatType, loading: loadingSeat, setData: setDataSeatType } = useGetData({
        url: `https://seatmanage-be-v3.onrender.com/seat-type/${roomId}`,
        authorization: true,
    });

    const { getUser } = useAuth();

    const [showImage, setShowImage] = useSaveLocalStorage('showImage', false);
    const { requestApprove, setRequestApprove, setDiagrams } = useNoticeContext();
    const [loadingProcess, setLoadingProcess] = useState(false)
    const refObject = useRef(null);
    const refColor = useRef(null);
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
        }
    };

    const handleRemoveBackground = () => {
        setFile("");
        setPreviewUrl("");
    };
    const handleSwitchSeat = async ({ seatSwitch, userSwitch, seatSelected }) => {
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

    const handleUnAssignSeat = async (seatId) => {
        setSeats(prev => prev.map(seat => seat.id === seatId ? { ...seat, user: null } : seat))
        setRoomInfo((pre) => ({ ...pre, seatAvailable: pre.seatAvailable + 1 }));
    }

    const handleAddSeat = async (dataSeat) => {
        const newSeat = {
            id: Math.random(10000),
            name: dataSeat.name,
            description: `description ${dataSeat.name}`,
            typeSeat: "TEMPORARY",
            user: null,
            posX: dataSeat.x,
            posY: dataSeat.y,
            roomId: roomId,
        }
        // const seatNew = await addSeat(newSeat);
        setSeats(prev => [...prev, newSeat])
        setRoomInfo((pre) => ({
            ...pre,
            capacity: pre.capacity + 1,
            seatAvailable: pre.seatAvailable + 1,
        }));
    };

    const handleCreateTypeSeat = async (dataSeatType) => {
        setDataSeatType((prev) => [...prev, { id: Math.random(1000), name: dataSeatType.name, roomId: roomId }]);
    };

    const handleRemoveSeat = async (seatId) => {

        setSeats(prev => prev.filter(seat => seat.id !== seatId));
        const seatRemove = seats.find(seat => seat.id === seatId)
        const checkSeatAvailable = seatRemove.user === null || seatRemove.user === 'null'

        setSeats(prev => prev.filter(seat => seat.id !== seatId));
        setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== seatRemove.id));
        setRoomInfo((pre) => ({ ...pre, capacity: pre.capacity - 1, seatAvailable: checkSeatAvailable ? pre.seatAvailable - 1 : pre.seatAvailable }));

    }

    const handleAssignSeat = async (assignData) => {

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
        setRoomInfo((pre) => ({ ...pre, seatAvailable: pre?.seatAvailable - 1 }));

    }

    const handleReAssignSeat = async (reassignData) => {
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
                } else if (seat?.user?.id === reassignData.newUser.id) {
                    if (seat.user !== null) {
                        setRoomInfo((pre) => ({ ...pre, seatAvailable: pre?.seatAvailable + 1 }));
                    }
                    return {
                        ...seat,
                        isOccupied: false,
                        user: null,
                        expireTime: null,
                        typeSeat: null,
                    };
                } else {
                    return seat;
                }
            })
        );
    }

    const handleApproving = async () => {
        setLoadingProcess(true)
        const token = localStorage.getItem('accessToken');
        await axios
            .get(`https://seatmanage-be-v3.onrender.com/room/diagram/approving/${roomId}`, {
                headers: { Authorization: `Bearer ${JSON.parse(token)}` },
            })
            .then((res) => {
                if (res.status === 200) {
                    alert('Approving success');
                    setDiagrams((prev) => prev.filter((diagram) => diagram.roomId !== roomId));
                    setRequestApprove(requestApprove - 1);
                    setLoadingProcess(false)
                    navigate('/approving-diagram')
                } else {
                    setLoadingProcess(false)
                    alert('Approving failed');
                }
            })
            .catch((err) => {
                setLoadingProcess(false)
                handleAxiosError(err)
            });
    };

    const handleRejecting = async () => {
        setLoadingProcess(true)
        const token = localStorage.getItem('accessToken');
        await axios
            .get(`https://seatmanage-be-v3.onrender.com/room/diagram/rejecting/${roomId}`, {
                headers: { Authorization: `Bearer ${JSON.parse(token)}` },
            })
            .then((res) => {
                if (res.status === 200) {
                    alert('You rejected request change layout of room ' + roomId);
                    setDiagrams((prev) => prev.filter((diagram) => diagram.roomId !== roomId));
                    setRequestApprove(requestApprove - 1);
                    navigate('/approving-diagram');
                } else {
                    setLoadingProcess(false)
                    alert('Reject failed');
                }
            })
            .catch((err) => {
                setLoadingProcess(false)
                handleAxiosError(err)
            });
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const authentication = {
            headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        };
        if (roomId) {
            getRoomLayoutRequest(roomId)
            fetchDataTeam(roomId, authentication)
            fetchDataUser(roomId, false, authentication);
            fetchDataUser(roomId, true, authentication);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId])

    useEffect(() => {
        const debouncedSave = debounce(() => {
            handleSaveDiagramRequest(roomId);
        }, 1500);


        debouncedSave();
        return () => {
            debouncedSave.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seats, file, roomInfo, objects]);



    useEffect(() => {
        switch (lastJsonMessage?.type) {
            case "switchDiagram":
                toast(`Phòng ${lastJsonMessage.data} đang có sự điều chỉnh`)
                navigate("/approving-diagram")
                break;
            default:
                break;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastJsonMessage]);
    if (loading) return <LoadingPage loading={loading} />;


    return (
        <div className="w-full mx-auto px-4 pt-6 min-w-[1440px] relative">
            <LoadingProgress loading={loadingProgress | loadingProcess} />
            {roomInfo && (
                <div className="flex items-center justify-between min-w-[1440px]">

                    <div className="flex items-center justify-start gap-3 bg-white px-7 py-3 mt-2">
                        <h1 className="text-2xl font-semibold text-gray-700 uppercase">{roomInfo.name} - </h1>
                        <h1 className="text-2xl font-semibold text-gray-700 uppercase">{roomInfo.floor} - </h1>
                        <h1 className="text-2xl font-semibold text-gray-700 uppercase">{roomInfo.hall}</h1>
                    </div>
                    <div id="room-summary" className="flex items-center justify-start gap-3 px-7 mt-2">
                        <h1 className="p-3 text-2xl font-semibold text-gray-700 uppercase bg-blue-200 rounded-sm">
                            <span>User In Room</span>-{roomInfo.usersCount}
                        </h1>
                        <h1 className="p-3 text-2xl font-semibold text-gray-700 uppercase bg-blue-200 rounded-sm">
                            <span>Total Seat</span>-{roomInfo.capacity}
                        </h1>
                        <h1 className="p-3 text-2xl font-semibold text-gray-700 uppercase bg-green-200 rounded-sm">
                            <span>Seat Available </span>{roomInfo.seatAvailable}
                        </h1>
                    </div>
                </div>
            )}
            <div className="rounded-lg shadow-sm mt-6">
                <div className="flex gap-3 w-full min-w-[1440px]">
                    <div className="sticky top-0 flex flex-col gap-2 justify-start items-start min-w-[230px] h-[100vh] p-2 bg-white text-white">
                        <>
                            <button
                                id="add-new-object"
                                onClick={() => handleAddObject({ ...OBJECT_NEW, id: Date.now() })}
                                className="w-full flex gap-2 px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                Add New Object
                            </button>
                            <div ref={refColor} className="w-full color-picker">
                                <SketchPicker disableAlpha color={color} onChange={(newColor) => handleColor(newColor)} />
                            </div>
                        </>
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

                    <div className="bg-white overflow-auto w-full sticky top-0 h-[95vh]">
                        <div className="flex sticky top-0 left-0 z-20 bg-white gap-3 w-full shadow-md p-3">
                            {previewUrl && (
                                <button
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
                            {!previewUrl ? (
                                <div className="w-fit whitespace-nowrap p-2 bg-blue-400 text-white rounded-sm flex items-center">
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
                                    onClick={handleRemoveBackground}
                                    className="whitespace-nowrap p-2 bg-blue-400 text-white rounded-sm"
                                >
                                    <p>Remove Background</p>
                                </button>
                            )}

                            <>
                                <button
                                    disabled={loadingProcess}
                                    onClick={handleApproving}
                                    className="whitespace-nowrap p-2 bg-blue-400 text-white rounded-sm disabled:opacity-[0.5]"
                                >
                                    <p>Approving</p>
                                </button>

                                <button
                                    disabled={loadingProcess}
                                    onClick={handleRejecting}
                                    className="whitespace-nowrap p-2 bg-blue-400 text-white rounded-sm disabled:opacity-[0.5]"
                                >
                                    <p>Reject Layout</p>
                                </button>

                            </>

                        </div>
                        <div className="grow border border-blue-500">
                            <RoomDiagram
                                roomId={roomId}
                                permissionAction={permission(getUser(), 'update:seat', owner)}
                                owner={owner}
                                onAddSeat={handleAddSeat}
                                showImage={showImage}
                                diagramUrl={previewUrl}
                                onAddObject={handleAddObject}
                                onUpdateObject={handleUpdateObject}
                                onDeleteObject={handleDeleteObject}
                                onUnAssignSeat={handleUnAssignSeat}
                                onReAssignSeat={handleReAssignSeat}
                                onAssignSeat={handleAssignSeat}
                                onRemoveSeat={handleRemoveSeat}
                                onSwitchSeat={handleSwitchSeat}
                                users={users}
                                userNoSeat={userNoSeat}
                                seats={seats}
                                setSeats={setSeats}
                                onSetSeatPosition={handleSetSeatPosition}
                                refObject={refObject}
                            />
                        </div>
                    </div>

                    <div className="sticky top-0 h-[80vh] w-full max-w-[230px] min-w-[230px] p-2 bg-white overflow-y-scroll overflow-x-visible">
                        <div className="w-full">
                            <SeatList

                                permissionAction={permission(getUser(), 'update:seat', owner)}
                                onAssign={handleAssignSeat}
                                onUnAssign={handleUnAssignSeat}
                                seats={seatType}
                                loadingSeat={loadingSeat}
                                users={users}
                                seatAvailable={[]}
                                seatAssign={seatAssign}
                                setSeatAssign={setSeatAssign}
                                userAssign={userAssign}
                                setUserAssign={setUserAssign}
                                onAdd={() => setIsOpen(true)}
                            />
                        </div>
                    </div>

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

export default ViewDraftDiagram;