import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { useWebSocketContext } from "../../../context/websoket.context";
import Seat from "./Seat";

const RoomDiagram = ({
    seats,
    permissionAction,
    onSetNameObject,
    users,
    onSetSeatPosition,
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
    setSeatAssign,
    onReset
}) => {
    const [optionSeat, setOptionSeat] = useState(null);
    const [isAssign, setIsAssign] = useState(false);
    const [isReAssign, setIsReAssign] = useState(false);
    const { sendJsonMessage } = useWebSocketContext();

    return (
        <div
            // onDragOver={handleDragOver}
            // onDrop={handleDrop}
            className="!bg-[#f3f4f6] overflow-auto" style={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
                minHeight: '100vh'
            }}>

            <div
                className=" min-w-s  bg-gray-100  w-fit "
                style={{
                    position: 'relative',
                    minHeight: '100%',
                    minWidth: '100%'
                }}

            >
                {diagramUrl && showImage && (<img src={diagramUrl} alt="layoutImage" className="w-full h-auto" />)}
                <div className="absolute top-2 left-2 text-sm font-medium text-gray-700">
                    Diagram Room
                </div>

                {!showImage && objects && objects.map((object) => (
                    <Rnd
                        size={{ width: object.width, height: object.height }}
                        position={{ x: object.posX, y: object.posY }}
                        onDragStop={(e, d) => onSetPositionObject(object.id, { ...object, posX: d.x, posY: d.y })}
                        onResizeStop={(e, direction, ref, delta, position) => {
                            onSetPositionObject(object.id, {
                                width: parseInt(ref.style.width, 10),
                                height: parseInt(ref.style.height, 10),
                                ...position,
                            });

                        }}
                        style={{ border: "1px solid black", background: "lightgray" }}
                    >
                        {object.name}
                    </Rnd>
                ))}

                {seats && seats.filter((seat) => seat.posX !== 0 || seat.posY !== 0).map((seat) => (
                    <Seat
                        key={seat.id}
                        permissionAction={permissionAction}
                        seat={seat}
                        users={users}
                        seatOption={optionSeat}
                        onSeatOption={setOptionSeat}
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
                        seatAvailable={seats.filter((seat) => seat.user === null)}
                        onReset={onReset}
                    />
                ))}
            </div>
        </div>
    );
};

export default RoomDiagram;
