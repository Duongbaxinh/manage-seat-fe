import React, { useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useObjectContext } from '../../../context/object.context';
import useKeyboardShortcuts from '../../../hooks/useKeyboardShortcuts';
import { CancelIcon } from '../../../icons';
import ColorPickerRadio from '../ColorPickerRadio';
import useClickOutside from '../../../hooks/useClickOutside';
import useSeat from '../../../services/seat.service';

function Object({
    object,
    isDrag,
    setIsDrag,
    permissionAction,
    refObject,
    isOX,
    setIsOX,
    isOY,
    setIsOY
}) {
    const { handleSetNameObject, handleDeleteObject, handleUpdateObject, handleAddObject, objected, setObjected } = useObjectContext();
    const {
        handleColor,
    } = useSeat();
    const [isHover, setIsHover] = useState(null);
    const [objectCopy, setObjectCopy] = useState(null);
    const refColor = useRef(null)
    const handleResizeStop = (e, direction, ref, delta, position) => {
        if (!permissionAction) return;
        setIsDrag(null);

        let newWidth = parseInt(ref.style.width, 10);
        let newHeight = parseInt(ref.style.height, 10);
        let newX = object.posX;
        let newY = object.posY;

        if (direction.includes("left")) {
            newX = position.x;
        }
        if (direction.includes("top")) {
            newY = position.y;
        }
        handleUpdateObject(object.id, {
            width: newWidth,
            height: newHeight,
            posX: newX,
            posY: newY,
        });
    };

    const handleChangeColor = (color) => {
        handleColor(color)
    }
    useKeyboardShortcuts((action, type) => {
        if (action === "copy" && type === "keydown") setObjectCopy(objected);
        if (action === "paste" && type === "keydown") {
            if (!objectCopy) return;
            return handleAddObject({ ...objectCopy, id: Date.now(), posX: (objectCopy.posX + 10) });
        }
        if (action === "shift" && type === "keydown") setIsOY(true);
        if (action === "shift" && type === "keyup") setIsOY(false);
        if (action === "ctrl+shift" && type === "keydown") setIsOX(true);
        if ((action === "shift" || action === "ctrl") && type === "keyup") setIsOX(false);
    });
    useClickOutside([refColor], () => {
        setObjected(null)
    })

    const handleDrag = (e, d) => {
        if (!permissionAction) return;
        setIsHover(null);
        setIsDrag(object.id);

        if (isOY) {
            handleUpdateObject(object.id, { ...object, posX: object.posX, posY: d.y });
        }
        else if (isOX) {
            handleUpdateObject(object.id, { ...object, posX: d.x, posY: object.posY });
        }
        else {
            handleUpdateObject(object.id, { ...object, posX: d.x, posY: d.y });
        }
    };

    return (
        <Rnd
            bounds={"parent"}
            style={{ border: 0 }}
            size={{ width: object.width, height: object.height }}
            position={{ x: object.posX, y: object.posY }}
            onDragStop={(e, d) => {
                if (!permissionAction) return;
                setIsDrag(null);
                handleUpdateObject(object.id, { ...object, posX: d.x, posY: d.y });
            }}
            onDrag={handleDrag}
            onResize={(e, d) => {
                if (!permissionAction) return;
                setIsHover(null);
                setIsDrag(object.id);
            }}
            onResizeStop={handleResizeStop}
        >
            <div
                id='drag-object'
                ref={refObject}
                onMouseLeave={() => setIsHover(null)}
                style={{ backgroundColor: `${object.color ?? "white"}` }}
                className="relative w-full h-full outline-none"
                onMouseEnter={() => {
                    setIsHover(object.id);
                }}
            >
                {objected && objected.id === object.id && (
                    <div ref={refColor} className="absolute -top-[20px] left-0 z-10">
                        <ColorPickerRadio onChangeColor={handleChangeColor} />
                    </div>
                )}

                <div
                    className="w-full h-full flex items-center justify-center overflow-hidden"
                    onClick={() => setObjected(object)}
                >
                    <input
                        id='object-name'
                        className="w-fit h-fit border-0 outline-none text-center uppercase bg-transparent text-white text-[13px] font-bold"
                        value={object.name}
                        onChange={(e) => handleSetNameObject(e, object.id)}
                    />
                </div>

                {isDrag === object.id && (
                    <>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[0.1px] bg-red-300 z-[99]"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100vw] h-[0.1px] bg-red-300 z-[99]"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[100vh] w-[0.1px] bg-red-300 z-[99]"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[100vh] w-[0.1px] bg-red-300 z-[99]"></div>
                    </>
                )}

                {isHover === object.id && permissionAction && (
                    <button
                        id='object-delete'
                        className="absolute -top-[0px] -left-[0px] cursor-pointer z-10"
                        onClick={() => {
                            if (!permissionAction) return;
                            handleDeleteObject(object.id);
                        }}
                    >
                        <CancelIcon />
                    </button>
                )}
            </div>
        </Rnd>
    );
}

export default Object;