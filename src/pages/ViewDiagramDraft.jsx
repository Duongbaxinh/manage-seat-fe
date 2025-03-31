import Tippy from '@tippyjs/react';
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BiPlus, BiSave, BiUpload } from 'react-icons/bi';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { Rnd } from 'react-rnd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/auth.context';
import useSaveLocalStorage from '../hooks/useSaveLocalStorage';
import { permission, ROLES } from '../utils/permission';
import { useNoticeContext } from '../context/notice.context';

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
const ViewDraftDiagram = () => {
    const { getUser } = useAuth();
    const { requestApprove, setRequestApprove, setDiagrams } = useNoticeContext();
    const [previewUrl, setPreviewUrl] = useState('');
    const [seats, setSeats] = useState([]);
    const [roomInfo, setRoomInfo] = useState(null);
    const [objects, setObjects] = useState([]);
    const [showImage, setShowImage] = useSaveLocalStorage('showImage', false);
    const [showInfoUser, setShowInfoUser] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    const handleApproving = async () => {
        const token = localStorage.getItem('accessToken');
        await axios
            .get(`http://localhost:8080/room/diagram/approving/${id}`, {
                headers: { Authorization: `Bearer ${JSON.parse(token)}` },
            })
            .then((res) => {
                if (res.status === 200) {
                    alert('Approving success');
                    setDiagrams((prev) => prev.filter((diagram) => diagram.roomId !== id));
                    setRequestApprove(requestApprove - 1);
                    navigate('/approving-diagram');
                } else {
                    alert('Approving failed');
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };
    const handleRejecting = async () => {
        const token = localStorage.getItem('accessToken');
        await axios
            .get(`http://localhost:8080/room/diagram/rejecting/${id}`, {
                headers: { Authorization: `Bearer ${JSON.parse(token)}` },
            })
            .then((res) => {
                if (res.status === 200) {
                    alert('You rejected request change layout of room ' + id);
                    setDiagrams((prev) => prev.filter((diagram) => diagram.roomId !== id));
                    setRequestApprove(requestApprove - 1);
                    navigate('/approving-diagram');
                } else {
                    alert('Reject failed');
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const { widthRoom, heightRoom } = useMemo(() => {
        const objectMaxX =
            objects.length > 0 ? Math.max(...objects.map((o) => o.posX + o.width + 100)) : 0;
        const seatMaxX = seats.length > 0 ? Math.max(...seats.map((s) => s.posX + 300)) : 0;
        const objectMayY =
            objects.length > 0 ? Math.max(...objects.map((o) => o.posY + o.height + 100)) : 0;
        const seatMayY = seats.length > 0 ? Math.max(...seats.map((s) => s.posY + 300)) : 0;

        return {
            widthRoom: Math.max(1440, objectMaxX, seatMaxX),
            heightRoom: Math.max(1440, objectMayY, seatMayY),
        };
    }, [objects, seats]);

    const fetchData = useCallback(
        async (authentication) => {
            try {
                const [roomResponse] = await Promise.all([
                    axios.get(`http://localhost:8080/diagram/${id}`, authentication),
                ]);

                setPreviewUrl(roomResponse.data.image ?? '');
                setSeats(roomResponse.data.seats);
                setObjects(JSON.parse(roomResponse.data.object) ?? []);
                setRoomInfo({
                    name: roomResponse.data?.name,
                    floor: roomResponse.data?.floor,
                    hall: roomResponse.data?.hall,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        [id]
    );

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const authentication = {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
        };

        fetchData(authentication);
    }, []);

    const filterSeat = seats.filter((seat) => seat.posX !== 0 && seat.posY !== 0);
    return (
        <div className="w-full mx-auto px-4 py-6">
            {roomInfo && (
                <div className="flex items-center justify-start gap-3  bg-white px-7 py-3 mt-2">
                    <h1 className="text-2xl font-semibold text-gray-700 uppercase">{roomInfo.name} - </h1>
                    <h1 className="text-2xl font-semibold text-gray-700 uppercase"> {roomInfo.floor} - </h1>
                    <h1 className="text-2xl font-semibold text-gray-700 uppercase"> {roomInfo.hall}</h1>
                </div>
            )}
            <div className="rounded-lg shadow-sm mt-6">
                <div className="flex gap-3 w-full ">
                    <div className=" sticky top-0 flex flex-col gap-2 justify-start items-start mb-6  h-[90vh] p-2 bg-white text-white">
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
                        {permission(getUser(), 'update:seat') && (
                            <>
                                <button
                                    className=" w-full flex gap-2  px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    onClick={() => handleRejecting()}
                                >
                                    <BiPlus />
                                    Rejecting request
                                </button>

                                <button
                                    onClick={() => handleApproving()}
                                    className=" w-full  flex gap-2 px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                >
                                    <BiSave />
                                    <p>Approving Diagram</p>
                                </button>
                            </>
                        )}
                    </div>

                    <div style={{ border: '1px solid blue' }} className="flex-grow overflow-auto py-10">
                        <div
                            style={{ minWidth: ` ${Number(widthRoom)}px`, minHeight: ` ${Number(heightRoom)}px` }}
                            className="min-w-max  h-full min-h-screen bg-gray-300 "
                        >
                            <div className="bg-gray-100  w-full h-full relative ">
                                {!showImage && (
                                    <img
                                        src={previewUrl}
                                        alt="diagram"
                                        className="absolute top-0 left-0 max-w-[1440px] h-auto"
                                    />
                                )}
                                {objects.length > 0 &&
                                    showImage &&
                                    objects.map((object) => (
                                        <Rnd
                                            style={{ border: 0 }}
                                            size={{ width: object.width, height: object.height }}
                                            position={{ x: object.posX, y: object.posY }}
                                        >
                                            <div
                                                style={{ backgroundColor: `${object.color ?? 'white'}` }}
                                                className="relative w-full h-full outline-none"
                                            >
                                                <p className="w-full h-full border-0 outline-none flex items-center justify-center uppercase bg-transparent">
                                                    {object.name}
                                                </p>
                                            </div>
                                        </Rnd>
                                    ))}
                                {filterSeat &&
                                    filterSeat.map((seat) => (
                                        <Rnd
                                            size={{ width: '40px', height: '40px' }}
                                            position={{ x: seat.posX, y: seat.posY }}
                                            style={{
                                                background: seat.user ? seat.user.team.code : 'lightgray',
                                                position: 'relative',
                                            }}
                                        >
                                            <Tippy
                                                content={
                                                    seat?.user ? (
                                                        <div className="bg-white shadow-md rounded-sm flex flex-col gap-2 p-3">
                                                            <div>
                                                                📌 <b>Name:</b> {seat?.name}
                                                            </div>
                                                            <div>
                                                                📝 <b>Description:</b> {seat?.description}
                                                            </div>
                                                            <div>
                                                                👤 <b>Username:</b> {seat?.user?.username}
                                                            </div>
                                                            <div>
                                                                🏢 <b>Team:</b> {seat?.user?.team?.name}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="p-2 bg-white font-bold rounded-sm">UnOccupant</p>
                                                    )
                                                }
                                                allowHTML={true}
                                                placement="top"
                                            >
                                                <div className="relative w-10 h-10 rounded-sm shadow-md flex items-center justify-center cursor-move hover:shadow-lg">
                                                    {seat.name}
                                                </div>
                                            </Tippy>
                                        </Rnd>
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div className=" sticky top-0  min-w-[200px]  h-[90vh] p-2 bg-white">List Diagram</div>
                </div>
            </div>
        </div>
    );
};

export default ViewDraftDiagram;
