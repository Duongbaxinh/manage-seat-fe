import React, { useEffect, useMemo, useState } from "react";
import { useObjectContext } from "../../../context/object.context";
import Object from "./Object";
import Seat from "./Seat";

const RoomDiagram = (
    {
        roomId,
        seats,
        owner,
        setSeats,
        onAssignSeat,
        onReAssignSeat,
        onSwitchSeat,
        onRemoveSeat,
        permissionAction,
        users,
        onSetSeatPosition,
        onUpdateObject,
        showImage,
        diagramUrl,
        seatAssign,
        refObject,
        onAddSeat,
        userNoSeat,
        onUnAssignSeat

    }) => {
    const { objects } = useObjectContext()
    const [option, setOption] = useState(null);

    const [isDrag, setIsDrag] = useState(null)
    const [isOY, setIsOY] = useState(false);
    const [isOX, setIsOX] = useState(false);

    const { widthRoom, heightRoom } = useMemo(() => {
        const objectMaxX = objects?.length > 0 ? Math.max(...objects.map(o => o.posX + o.width + 100)) : 0;
        const seatMaxX = seats?.length > 0 ? Math.max(...seats.map(s => s.posX + 300)) : 0;
        const objectMayY = objects?.length > 0 ? Math.max(...objects.map(o => o.posY + o.height + 100)) : 0;
        const seatMayY = seats?.length > 0 ? Math.max(...seats.map(s => s.posY + 300)) : 0;

        return { widthRoom: Math.max(1440, objectMaxX, seatMaxX), heightRoom: Math.max(1440, objectMayY, seatMayY) };
    }, [objects, seats]);

    const handleDrop = async (e) => {
        e.preventDefault();
        const nameSeat = e.dataTransfer.getData("seatDragId");
        if (!nameSeat) return;
        if (e.currentTarget) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = Math.max(0, Math.round(e.clientX - rect.left));
            const y = Math.max(0, Math.round(e.clientY - rect.top));
            onAddSeat({ name: nameSeat, x: x, y: y })
        }
    };

    useEffect(() => {
    }, [widthRoom, heightRoom])

    const seatAvailable = seats.filter((seat) => seat.user === null)
    return (
        <div
            style={{ minWidth: ` ${Number(widthRoom)}px`, minHeight: ` ${Number(heightRoom)}px` }}
            className="min-w-max  h-full min-h-screen  "
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e)}
        >
            <div className="w-full h-full relative min-h-[100vh] ">
                {diagramUrl && showImage && (<img src={`${diagramUrl}`} alt="layoutImage" className="w-full h-auto absolute min-w-[1440px] max-w-[1440px]" />)}

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

                {seats && seats.map((seat) => (
                    <Seat
                        key={seat.id}
                        owner={owner}
                        roomId={roomId}
                        permissionAction={permissionAction}
                        seat={seat}
                        setSeats={setSeats}
                        users={users}
                        seatOption={option}
                        onSeatOption={setOption}
                        onRemoveSeat={onRemoveSeat}
                        onSwitchSeat={onSwitchSeat}
                        onSetSeatPosition={onSetSeatPosition}
                        seatAssign={seatAssign}
                        seatAvailable={seatAvailable}
                        isDrag={isDrag}
                        isOX={isOX}
                        setIsOX={setIsOX}
                        isOY={isOY}
                        setIsOY={setIsOY}
                        setIsDrag={setIsDrag}
                        userNoSeat={userNoSeat}
                        onUnAssignSeat={onUnAssignSeat}
                        onAssignSeat={onAssignSeat}
                        onReAssignSeat={onReAssignSeat}
                    />
                ))}
            </div>
        </div>
    );
};

export default RoomDiagram;
