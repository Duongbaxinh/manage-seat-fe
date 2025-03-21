import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { ChairIcon, MoreIcon, SearchIcon } from "../../../icons";
import Popup from "../../atom/Popup";

const SeatList = ({ seats, onUnassignDrop, onAdd, onAssign, fetchDataUser, users, setUserAssign, userAssign, seatAvailable, setSeatAssign, seatAssign, onReAssign, onUnAssign, permissionAction }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);
    const [seatDetail, setSeatDetail] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isAssign, setIsAssign] = useState(false);
    const [isReAssign, setIsReAssign] = useState(false);
    const unassignedSeats = seats.filter(seat => seat.posX === 0 && seat.posY === 0);
    const filteredSeats = unassignedSeats.filter(seat => seat.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const seatId = e.dataTransfer.getData("text/plain");
        if (seatId) {
            onUnassignDrop(seatId);
        }
        setIsDragOver(false);
    };


    return (
        <div className={`flex flex-col h-full ${isDragOver ? "bg-blue-50" : ""} transition-colors`}
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            <div className="p-4 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-medium text-gray-900">Unassigned Seats</h2>
                    <span className="text-xs text-gray-500">{unassignedSeats.length} seats</span>
                </div>
                <div className="relative flex gap-4">
                    <input type="text" placeholder="Search seats..." className="  w-full pl-8 pr-3 py-1.5 text-sm border !border-black shadow-md rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <SearchIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                    {permissionAction && (
                        <button onClick={onAdd} className="flex items-center justify-center bg-blue-500 text-white rounded-sm min-w-[30px] max-w-[30px] min-h-[30px] max-h-[30px]">
                            <BiPlus />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                {filteredSeats.map(seat => (
                    <div key={seat.id} style={{ backgroundColor: seat?.user?.team?.code ?? "white" }} className="p-3 bg-white hover:bg-gray-50 transition-colors cursor-move group" draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", seat.id);
                            e.dataTransfer.effectAllowed = "move";
                        }}>
                        <div className="flex items-center gap-3 relative">
                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 transition-colors">
                                <ChairIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="min-w-0 flex gap-3 items-center flex-1">
                                <h3 className="text-sm font-medium text-gray-900 truncate">{seat.name}</h3>
                                <span className={`text-sm ${seat.isOccupied ? "text-green-600" : "text-gray-500"}`}>
                                    {seat.isOccupied ? "Occupied" : "UnOccupied"}
                                </span>
                            </div>
                            <div className="flex-shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreIcon className="w-5 h-5" onClick={() => { setSeatDetail(seat); setIsPopupOpen(true); }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} title="Seat Details">
                {seatDetail && seatDetail.user ? (
                    <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-md shadow-sm">
                        <p className="text-lg font-semibold text-gray-900">{seatDetail.name}</p>
                        <p className="text-sm text-gray-600">User: <span className="font-medium">{seatDetail.user.username}</span></p>
                        <p className="text-sm text-gray-600">Team: <span className="font-medium">{seatDetail.user.team.name}</span></p>
                        <div className="text-sm flex gap-2 items-center">
                            {isReAssign &&
                                <div className="w-full px-1 py-1">
                                    <select value={seatAssign} onChange={(e) => setSeatAssign(e.target.value)}
                                        className="w-full px-1 py-0 m-0"
                                    >
                                        <option value="">Select Seat</option>
                                        {seatAvailable.map((sa) => (
                                            <option className="px-1" value={sa.id}>{sa.name}</option>
                                        ))}
                                    </select>
                                </div>
                            }
                            <div className="flex gap-2">

                                {isReAssign && seatAssign && (
                                    <button
                                        onClick={() => {
                                            onReAssign(seatAssign, seatDetail.id, seatDetail.user.id)
                                            setIsPopupOpen(false)
                                        }}
                                        className="px-[5px] rounded-sm bg-green-400 text-white"
                                    >
                                        Save
                                    </button>
                                )}

                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => { setIsReAssign(true) }}>ReAssign</button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => {
                                onUnAssign(seatDetail.id)
                                setIsPopupOpen(false)
                            }}>UnAssign</button>
                            <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={() => setIsPopupOpen(false)}>Close</button>
                        </div>
                    </div>
                ) : (
                    <div className="w-[200px] p-2 flex gap-2">
                        {isAssign && (
                            <select
                                onChange={(e) => setUserAssign(e.target.value)}
                                className="w-full border-0 rounded-md outline-none px-2 py-1 shadow-md text-[13px]"
                            >
                                <option value="">Select user</option>
                                {users.map((item) => (
                                    <option key={item.id} value={item.id}>{item.username}</option>
                                ))}
                            </select>
                        )}
                        {!isAssign && (
                            <button
                                className="px-[5px] py-2 rounded-sm bg-green-400 text-white"
                                onClick={() => { setIsAssign(true) }}
                            >
                                Assign
                            </button>
                        )}
                        {isAssign && userAssign && (
                            <button
                                onClick={() => {
                                    onAssign(seatDetail.id, userAssign)
                                    setIsPopupOpen(false)
                                }}
                                className="px-[5px] rounded-sm bg-green-400 text-white"
                            >
                                Save
                            </button>
                        )}
                    </div>
                )}
            </Popup>
        </div>
    );
};

export default SeatList;