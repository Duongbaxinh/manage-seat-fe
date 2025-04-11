import React, { useEffect, useMemo, useState } from "react";
import { useObjectContext } from "../../../context/object.context";
import Object from "./Object";
import Seat from "./Seat";

const RoomDiagram = (
    {
        seats,
        permissionAction,
        users,
        onSetSeatPosition,
        onUpdateObject,
        onUnAssign,
        onAssign,
        onReAssign,
        showImage,
        diagramUrl,
        userAssign,
        setUserAssign,
        seatAssign,
        setSeatAssign,
        onReset,
        refObject,
    }) => {
    const { objects } = useObjectContext()
    const [option, setOption] = useState(null);
    const [isAssign, setIsAssign] = useState(false);
    const [isReAssign, setIsReAssign] = useState(false);
    const [isDrag, setIsDrag] = useState(null)
    const [isOY, setIsOY] = useState(false);
    const [isOX, setIsOX] = useState(false);

    const { widthRoom, heightRoom } = useMemo(() => {
        const objectMaxX = objects.length > 0 ? Math.max(...objects.map(o => o.posX + o.width + 100)) : 0;
        const seatMaxX = seats.length > 0 ? Math.max(...seats.map(s => s.posX + 300)) : 0;
        const objectMayY = objects.length > 0 ? Math.max(...objects.map(o => o.posY + o.height + 100)) : 0;
        const seatMayY = seats.length > 0 ? Math.max(...seats.map(s => s.posY + 300)) : 0;

        return { widthRoom: Math.max(1440, objectMaxX, seatMaxX), heightRoom: Math.max(1440, objectMayY, seatMayY) };
    }, [objects, seats]);

    const handleDrop = (e) => {
        console.log("drop here")
        e.preventDefault();
        const seatId = e.dataTransfer.getData("seatDragId");

        if (!seatId) return;
        if (e.currentTarget) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = Math.max(0, Math.round(e.clientX - rect.left));
            const y = Math.max(0, Math.round(e.clientY - rect.top));

            onSetSeatPosition(seatId, { x, y }, true);
        }
    };

    useEffect(() => {
    }, [widthRoom, heightRoom])

    const seatAvailable = seats.filter((seat) => seat.user === null)
    return (
        <div
            style={{ minWidth: ` ${Number(widthRoom)}px`, minHeight: ` ${Number(heightRoom)}px` }}
            className="min-w-max  h-full min-h-screen !bg-gray-900 "
        >
            <div className="bg-gray-100  w-full h-full relative "
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e)}
            >
                {diagramUrl && showImage && (<img src={diagramUrl} alt="layoutImage" className="w-full h-auto absolute min-w-[1440px] max-w-[1440px]" />)}
                {objects && objects.map((object) => (
                    <Object
                        isDrag={isDrag}
                        object={object}
                        onUpdateObject={onUpdateObject}
                        permissionAction={permissionAction}
                        refObject={refObject}
                        setIsDrag={setIsDrag}
                        isOX={isOX}
                        setIsOX={setIsOX}
                        isOY={isOY}
                        setIsOY={setIsOY}
                        key={object.id}
                    />

                ))}

                {seats && seats.filter((seat) => seat.posX !== 0 || seat.posY !== 0).map((seat) => (
                    <Seat
                        key={seat.id}
                        permissionAction={permissionAction}
                        seat={seat}
                        users={users}
                        seatOption={option}
                        onSeatOption={setOption}
                        onUnAssign={onUnAssign}
                        onAssign={onAssign}
                        isAssign={isAssign}
                        isReAssign={isReAssign}
                        userAssign={userAssign}
                        onSetSeatPosition={onSetSeatPosition}
                        setUserAssign={setUserAssign}
                        seatAssign={seatAssign}
                        setSeatAssign={setSeatAssign}
                        setIsAssign={setIsAssign}
                        setIsReAssign={setIsReAssign}
                        onReAssign={onReAssign}
                        seatAvailable={seatAvailable}
                        onReset={onReset}
                        isDrag={isDrag}
                        isOX={isOX}
                        setIsOX={setIsOX}
                        isOY={isOY}
                        setIsOY={setIsOY}
                        setIsDrag={setIsDrag}
                    />
                ))}
            </div>
        </div>
    );
};

export default RoomDiagram;
