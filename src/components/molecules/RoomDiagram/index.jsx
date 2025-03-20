import React, { useRef, useState } from "react";

const RoomDiagram = ({
    seats,
    onSeatDrop,
    objects,
    onSetPositionObject,
    onDeleteObject,
}) => {
    const [draggedSeat, setDraggedSeat] = useState(null);
    const [hoveredSeat, setHoveredSeat] = useState(null);
    const [dragItem, setDragItem] = useState(null)
    const [selectedObject, setSelectedObject] = useState(null);
    const [resizing, setResizing] = useState(null);
    const [rotating, setRotating] = useState(false);
    const diagramRef = useRef(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });


    const handleRotation = (e) => {
        if (!rotating || !selectedObject) return;
        const rect = diagramRef.current.getBoundingClientRect();
        const centerX = selectedObject.posX + selectedObject.width / 2;
        const centerY = selectedObject.posY + selectedObject.height / 2;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);

        onSetPositionObject(selectedObject.id, {
            ...selectedObject,
            rotate: angle
        });
    };

    const handleResizeStart = (e, object, direction) => {
        e.stopPropagation();
        setResizing({ object, direction });
        e.preventDefault();
    };

    const handleResizing = (e) => {
        if (!resizing) return;

        const { object, direction } = resizing;
        const rect = diagramRef.current.getBoundingClientRect();

        let newWidth = object.width;
        let newHeight = object.height;

        if (direction === "width") {
            console.log("check ...... ", e.clientX, rect.left, object.posX)
            newWidth = Math.max(10, e.clientX - rect.left - object.posX);
        }
        if (direction === "height") {
            newHeight = Math.max(10, e.clientY - rect.top - object.posY);
        }

        onSetPositionObject(object.id, {
            ...object,
            width: newWidth,
            height: newHeight,
        });
    };


    const handleDragStart = (e, object) => {
        setDragItem(object)
        const rect = e.target.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });

        e.dataTransfer.effectAllowed = "move"
    }

    const handleDragEnd = (e) => {
        if (!dragItem) return;

        const rect = diagramRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.round(e.clientX - rect.left - dragOffset.x));
        const y = Math.max(0, Math.round(e.clientY - rect.top - dragOffset.y));

        onSetPositionObject(dragItem.id, {
            ...dragItem,
            posX: x,
            posY: y,
        });

        setDragItem(null);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const seatId = e.dataTransfer.getData("text/plain");
        if (diagramRef.current && seatId) {
            const rect = diagramRef.current.getBoundingClientRect();
            const x = Math.max(20, Math.min(e.clientX - rect.left, rect.width - 20));
            const y = Math.max(20, Math.min(e.clientY - rect.top, rect.height - 20));
            onSeatDrop(seatId, { x, y }, true);
        }

    };

    const handleMouseUp = () => {
        setResizing(null)
        setRotating(false);
    };

    const handleSeatDragStart = (e, seat) => {
        e.dataTransfer.setData("text/plain", seat.id);
        e.dataTransfer.effectAllowed = "move";
        setDraggedSeat(seat.id);
        // setIsDraggingAssigned(true);
    };

    const handleSeatHover = (seatId, e) => {
        setHoveredSeat(seatId)
    };

    const getObjectStyle = (object) => {
        return {
            position: "absolute",
            top: object.posY,
            left: object.posX,
            rotate: `${object.rotate}deg`,
            width: object.width || 100,
            height: object.height || 30,
            backgroundColor: object.color ?? 'gray',

            transform: `rotate(${object.rotation || 0}deg)`,
            cursor: dragItem?.id === object.id ? "grabbing" : "grab",
            transition: dragItem?.id === object.id ? "none" : "all 0.2s ease",
            userSelect: "none",
            touchAction: "none",
        };

    };

    return (
        <div
            ref={diagramRef}
            className="w-full h-full bg-gray-100 relative select-none"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onMouseMove={(e) => {
                handleResizing(e)
                handleRotation(e)
            }}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
                handleMouseUp();

            }}

        >
            <div className="absolute top-2 left-2 text-sm font-medium text-gray-700">
                Diagram Room
            </div>

            <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-4 p-4 pointer-events-none">
                {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="bg-gray-200/40 rounded" />
                ))}
            </div>

            {
                objects.map((object) => (
                    <div
                        draggable
                        key={object.id}
                        className="group"
                        style={getObjectStyle(object)}
                        onDragStart={(e) => { handleDragStart(e, object) }}
                        onDragEnd={(e) => { handleDragEnd(e) }}
                    >
                        {selectedObject?.id === object.id && (
                            <>

                                <div
                                    className="absolute right-1 top-0 w-4 h-4 bg-white border-2
                                     border-blue-500 rounded-full cursor-progress transform -translate-y-1/2
                                     
                                     "
                                    onMouseDown={() => setRotating(true)}
                                />
                                <div
                                    className="absolute -right-2 top-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-ew-resize transform -translate-y-1/2"
                                    onMouseDown={(e) => handleResizeStart(e, object, "width")}
                                />
                                {/* Nút kéo resize dọc */}
                                <div
                                    className="absolute -bottom-2 left-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-ns-resize transform -translate-x-1/2"
                                    onMouseDown={(e) => handleResizeStart(e, object, "height")}
                                />
                                {/* Nút Xóa */}
                                <button
                                    className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => onDeleteObject(object.id)}
                                >
                                    ×
                                </button>

                            </>
                        )}
                        <div
                            onClick={() => setSelectedObject(object)}
                            className="w-full h-full flex items-center justify-center text-white font-medium">
                            {object.name}
                        </div>
                    </div>
                ))
            }

            {
                seats
                    .filter((seat) => seat.posX !== 0 && seat.posY !== 0)
                    .map((seat) => (
                        <div
                            key={seat.id}
                            className={`absolute transition-all duration-200 ${draggedSeat === seat.id ? "opacity-50" : ""
                                }`}
                            style={{
                                left: seat.posX - 20,
                                top: seat.posY - 20,
                            }}
                        >
                            <div
                                className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center cursor-move hover:shadow-lg transition-all"
                                draggable
                                onDragStart={(e) => handleSeatDragStart(e, seat)}
                                onDragEnd={() => setDraggedSeat(null)}
                                onMouseEnter={(e) => handleSeatHover(seat.id)}
                                onMouseLeave={() => setHoveredSeat(null)}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-base">{seat.avatar}</span>
                                    <span className="text-xs font-medium text-gray-600">
                                        {seat.name}
                                    </span>
                                </div>
                                {hoveredSeat && hoveredSeat === seat.id && (
                                    <div className="absolute bottom-[20px] left-[40px] w-[200px] bg-white p-2 rounded-md"
                                    >
                                        {seat.user ? (<div className="text-sm">
                                            <div className="font-medium mb-1">{seat.name}</div>
                                            <div className="text-gray-600">{seat.description} </div>
                                            <div className="text-gray-600">{seat.user.username} </div>
                                            <div className="text-gray-600">{seat.user.team.name} </div>
                                        </div>) : (<div>Empty</div>)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
            }
        </div >
    );
};

export default RoomDiagram;
