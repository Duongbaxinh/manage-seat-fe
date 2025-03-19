import React, { useRef, useState } from "react";

const RoomDiagram = ({
    seats,
    onSeatDrop,
    onUnassign,
    objects,
    onSetPositionObject,
    onDeleteObject,
}) => {
    const [draggedSeat, setDraggedSeat] = useState(null);
    const [hoveredSeat, setHoveredSeat] = useState(null);
    const [dragItem, setDragItem] = useState(null)
    const [selectedObject, setSelectedObject] = useState(null);
    const [draggedObject, setDraggedObject] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [resizeType, setResizeType] = useState(null);
    const [rotating, setRotating] = useState(false);
    const diagramRef = useRef(null);

    const handleDragStart = (e, object) => {
        setDragItem(object)
        setDragOffset({ x: e.clientX - object.posX, y: e.clientY - object.posY })
        e.dataTransfer.effectAllowed = "move"
    }
    const handleDragEnd = (e) => {
        if (!diagramRef.current) return;
        const rect = diagramRef.current.getBoundingClientRect();
        if (draggedObject) {
            const newX = e.clientX - rect.left - dragOffset.x;
            const newY = e.clientY - rect.top - dragOffset.y;

            const constrainedX = Math.max(
                0,
                Math.min(newX, rect.width - (draggedObject.width))
            );
            const constrainedY = Math.max(
                0,
                Math.min(newY, rect.height - (draggedObject.height))
            );

            onSetPositionObject(draggedObject.id, {
                ...draggedObject,
                posX: constrainedX,
                posY: constrainedY,
            });

        };
    }
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
        // setIsDraggingAssigned(false);
    };

    const handleObjectMouseDown = (e, object) => {
        e.stopPropagation();

        if (e.target.classList.contains("resize-width")) {
            setResizeType('width');
            setSelectedObject(object);
        } else if (e.target.classList.contains("resize-height")) {
            setResizeType('height');
            setSelectedObject(object);
        } else if (e.target.classList.contains("rotate-handle")) {
            setRotating(true);
            setSelectedObject(object);
        } else {
            setSelectedObject(object);
            setDraggedObject(object);
            const rect = e.currentTarget.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const handleMouseMove = (e) => {
        if (!diagramRef.current) return;
        const rect = diagramRef.current.getBoundingClientRect();
        if (draggedObject) {
            const newX = e.clientX - rect.left - dragOffset.x;
            const newY = e.clientY - rect.top - dragOffset.y;

            const constrainedX = Math.max(
                0,
                Math.min(newX, rect.width - (draggedObject.width))
            );
            const constrainedY = Math.max(
                0,
                Math.min(newY, rect.height - (draggedObject.height))
            );

            onSetPositionObject(draggedObject.id, {
                ...draggedObject,
                posX: constrainedX,
                posY: constrainedY,
            });
        } else if (selectedObject) {
            if (resizeType === 'width') {
                const newWidth = Math.max(
                    10,
                    e.clientX - rect.left - selectedObject.posX
                );
                onSetPositionObject(selectedObject.id, {
                    ...selectedObject,
                    width: newWidth,
                });
            } else if (resizeType === 'height') {
                const newHeight = Math.max(
                    10,
                    e.clientY - rect.top - selectedObject.posY
                );
                onSetPositionObject(selectedObject.id, {
                    ...selectedObject,
                    height: newHeight,
                });
            }

            // else if (rotating) {
            //     const centerX = selectedObject.posX + (selectedObject.width || 100) / 2;
            //     const centerY = selectedObject.posY + (selectedObject.height || 30) / 2;
            //     const angle =
            //         Math.atan2(
            //             e.clientY - rect.top - centerY,
            //             e.clientX - rect.left - centerX
            //         ) *
            //         (180 / Math.PI);

            //     onSetPositionObject(selectedObject.id, {
            //         ...selectedObject,
            //         rotation: angle,
            //     });
            // }
        }
    };

    const handleMouseUp = () => {
        setDraggedObject(null);
        setResizeType(null);
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
            backgroundColor: 'black',
            width: object.width || 100,
            height: object.height || 30,
            transform: `rotate(${object.rotation || 0}deg)`,
            cursor: draggedObject?.id === object.id ? "grabbing" : "grab",
            transition: draggedObject?.id === object.id ? "none" : "all 0.2s ease",
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
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="absolute top-2 left-2 text-sm font-medium text-gray-700">
                Diagram Room
            </div>

            <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-4 p-4 pointer-events-none">
                {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="bg-gray-200/40 rounded" />
                ))}
            </div>

            {objects.map((object) => (
                <div
                    draggable
                    key={object.id}
                    className="group"
                    style={getObjectStyle(object)}
                    onDragStart={(e) => { handleDragStart(e, object) }}
                    onDragEnd={(e) => { handleDragEnd(e) }}
                // onMouseDown={(e) => handleObjectMouseDown(e, object)}
                >
                    {selectedObject?.id === object.id && (
                        <>
                            {/* Width resize handle */}
                            <div
                                className="absolute -right-2 top-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-ew-resize resize-width transform -translate-y-1/2"
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    setResizeType('width');
                                    setSelectedObject(object);
                                }}
                            />
                            {/* Height resize handle */}
                            <div
                                className="absolute -bottom-2 left-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-ns-resize resize-height transform -translate-x-1/2"
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    setResizeType('height');
                                    setSelectedObject(object);
                                }}
                            />
                            {/* Rotate handle */}
                            <div
                                className="absolute top-0 -right-6 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-ew-resize rotate-handle"
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    setRotating(true);
                                    setSelectedObject(object);
                                }}
                            />
                            {/* Delete button */}
                            <button
                                className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onDeleteObject(object.id)}
                            >
                                ×
                            </button>
                        </>
                    )}
                    <div className="w-full h-full flex items-center justify-center text-white font-medium">
                        {object.name}
                    </div>
                </div>
            ))}

            {seats
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
                ))}
        </div>
    );
};

export default RoomDiagram;
