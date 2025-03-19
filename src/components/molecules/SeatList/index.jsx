import React, { useState } from "react";
import { SearchIcon, ArrowDownIcon, ChairIcon, MoreIcon } from "../../../icons";
import { BiPlus } from "react-icons/bi";

const SeatList = ({ seats, onUnassignDrop, onAdd }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);

    const unassignedSeats = seats.filter((seat) => {
        return seat.posX === 0 && seat.posY === 0;
    });
    const filteredSeats = unassignedSeats.filter((seat) =>
        seat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        <div
            className={`flex flex-col h-full ${isDragOver ? "bg-blue-50" : ""
                } transition-colors`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="p-4 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-medium text-gray-900">
                        Unassigned Seats
                    </h2>
                    <span className="text-xs text-gray-500">
                        {unassignedSeats.length} seats
                    </span>
                </div>
                <div className="relative flex gap-4">
                    <input
                        type="text"
                        placeholder="Search seats..."
                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <SearchIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                    <button
                        onClick={() => onAdd()}
                        className="flex items-center justify-center bg-blue-500 text-white rounded-sm min-w-[30px] max-w-[30px] min-h-[30px] max-h-[30px] "
                    >
                        <BiPlus />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                {isDragOver && filteredSeats.length === 0 && (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <ArrowDownIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-sm text-blue-600 font-medium">
                                Drop here to unassign
                            </p>
                            <p className="text-xs text-blue-500 mt-1">
                                Seat will be added to unassigned list
                            </p>
                        </div>
                    </div>
                )}

                {!isDragOver && filteredSeats.length === 0 ? (
                    <div className="p-4 text-center">
                        <ChairIcon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No unassigned seats found</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Try adjusting your search
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredSeats.map((seat) => (
                            <div
                                key={seat.id}
                                className="p-3 bg-white hover:bg-gray-50 transition-colors cursor-move group"
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData("text/plain", seat.id);
                                    e.dataTransfer.effectAllowed = "move";
                                    const dragImage = e.target.cloneNode(true);
                                    dragImage.style.transform = "scale(0.5)";
                                    document.body.appendChild(dragImage);
                                    e.dataTransfer.setDragImage(dragImage, 0, 0);
                                    setTimeout(() => document.body.removeChild(dragImage), 0);
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 transition-colors">
                                        <ChairIcon className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div className="min-w-0 flex gap-3 items-center flex-1">
                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                            {seat.name}
                                        </h3>
                                        <span
                                            className={`text-sm ${seat.isOccupied ? "text-green-600" : "text-gray-500"
                                                }`}
                                        >
                                            {seat.isOccupied ? "Occupied" : "UnOccupied"}
                                        </span>
                                    </div>
                                    <div className="flex-shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreIcon className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeatList;
