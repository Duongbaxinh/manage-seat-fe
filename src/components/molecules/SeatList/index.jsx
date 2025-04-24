import React, { useState } from "react";
import { ChairIcon, SearchIcon } from "../../../icons";
import { removeSeatType } from "../../../services/seattype.service";

const SeatList = ({ seats, loadingSeat, onAdd, permissionAction }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
    };
    const handleRemoveSeatType = async (idSeat) => {
        await removeSeatType(idSeat)
    }
    if (loadingSeat) return <h1>Loading...</h1>
    const filteredSeats = seats?.filter(seat =>
        seat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className={`flex flex-col h-full ${isDragOver ? "bg-blue-50" : ""} transition-colors`}
            onDragOver={handleDragOver} >
            <div className="p-2 bg-white border-b border-gray-200">
                <div className="relative space-y-4">
                    <div id="search-seat-type" className="flex gap-4" >
                        <input type="text" placeholder="Search seats..." className="  w-full pl-8  py-1.5 text-sm border !border-black shadow-md rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <SearchIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                    </div>
                    {permissionAction && (
                        <button
                            id={"add-type-seat"}
                            onClick={onAdd} className="flex items-center justify-center bg-blue-500 text-white rounded-sm w-full h-[30px] px-2 whitespace-nowrap ">
                            Add type seat
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto max-h-[200px]">
                {filteredSeats && filteredSeats.length > 0 && filteredSeats.map(seat => (
                    <div key={seat.id} style={{ backgroundColor: seat?.user?.team?.code ?? "white" }} className="p-3 bg-white hover:bg-gray-50 transition-colors cursor-move group" draggable
                        onDragStart={(e) => {
                            if (!permissionAction) return
                            e.dataTransfer.setData("seatDragId", seat.name);
                            e.dataTransfer.effectAllowed = "move";
                        }}>
                        <div id="add-seat" className="flex items-center gap-3 relative">
                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 transition-colors">
                                <ChairIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className=" flex gap-3 items-center flex-1">
                                <h3 className="text-sm font-medium text-gray-900 truncate">{seat.name}</h3>
                            </div>
                            {/* <div className="cursor-pointer" onClick={() => handleRemoveSeatType(seat.id)}><DeleteIcon /></div> */}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default SeatList;