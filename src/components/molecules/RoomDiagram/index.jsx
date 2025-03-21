import React, { useState } from "react";
import Object from "./Object";
import Seat from "./Seat";

const RoomDiagram = ({
    seats,
    permissionAction,
    onSetNameObject,
    users,
    onSeatDrop,
    objects,
    onSetPositionObject,
    onDeleteObject,
    onUnAssign,
    onAssign,
    onReAssign,
    showImage,
    diagramUrl,
    userAssign,
    setUserAssign,
    seatAssign,
    setSeatAssign
}) => {
    const [isDrag, setIsDrag] = useState(false);
    const [hoveredSeat, setHoveredSeat] = useState(null);
    const [dragItem, setDragItem] = useState(null);
    const [selectedObject, setSelectedObject] = useState(null);
    const [isAssign, setIsAssign] = useState(false);
    const [isReAssign, setIsReAssign] = useState(false);

    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleDragStart = (e, object, type = "object") => {
        if (!permissionAction) return
        setHoveredSeat(null);
        setDragItem(object);
        const rect = e.target.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnd = (e) => {
        if (!dragItem || !permissionAction) return;
        const rect = e.currentTarget.parentElement.getBoundingClientRect();
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
        if (!permissionAction) return
        const seatId = e.dataTransfer.getData("text/plain");
        if (!seatId) return;
        if (e.currentTarget) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = Math.max(0, Math.round(e.clientX - rect.left - dragOffset.x));
            const y = Math.max(0, Math.round(e.clientY - rect.top - dragOffset.y));
            onSeatDrop(seatId, { x, y }, true);
        }
        setIsDrag(false);
    };

    const handleSeatDragStart = (e, seat) => {

        if (!permissionAction) return
        e.dataTransfer.setData("text/plain", seat.id);
        e.dataTransfer.effectAllowed = "move";
        const rect = e.target.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const handleSeatHover = (seatId) => {
        setHoveredSeat(seatId)
    };

    return (
        <div className="bg-gray-300" style={{
            position: 'relative',
            width: '100vw',
            height: '100%',
            overflow: 'auto',
            minHeight: '100vh'
        }}>
            <div
                className=" w-full min-w-[100vw] min-h-[100vh] bg-gray-100  select-none"
                style={{
                    position: 'relative',
                    minHeight: '100%',
                    minWidth: '100%'
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {diagramUrl && showImage && (<img src={diagramUrl} alt="layoutImage" className="w-full h-auto" />)}
                <div className="absolute top-2 left-2 text-sm font-medium text-gray-700">
                    Diagram Room
                </div>

                {!showImage && objects && objects.map((object) => (
                    <Object
                        key={object.id}
                        permissionAction={permissionAction}
                        object={object}
                        selectedObject={selectedObject}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onSetPositionObject={onSetPositionObject}
                        onSetNameObject={onSetNameObject}
                        onDeleteObject={onDeleteObject}
                        setSelectedObject={setSelectedObject}
                    />
                ))}

                {seats && seats.filter((seat) => seat.posX !== 0 || seat.posY !== 0).map((seat) => (
                    <Seat
                        key={seat.id}
                        permissionAction={permissionAction}
                        isDrag={isDrag}
                        seat={seat}
                        users={users}
                        hoveredSeat={hoveredSeat}
                        onUnAssign={onUnAssign}
                        onAssign={onAssign}
                        handleSeatDragStart={handleSeatDragStart}
                        handleSeatHover={handleSeatHover}
                        isAssign={isAssign}
                        isReAssign={isReAssign}
                        userAssign={userAssign}
                        setUserAssign={setUserAssign}
                        seatAssign={seatAssign}
                        setSeatAssign={setSeatAssign}
                        setIsAssign={setIsAssign}
                        setIsReAssign={setIsReAssign}
                        onReAssign={onReAssign}
                        seatAvailable={seats.filter((seat) => seat.user === null)}
                    />
                ))}
            </div>
        </div>
    );
};

export default RoomDiagram;
