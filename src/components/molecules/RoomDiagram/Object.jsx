import React, { useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import { CancelIcon } from '../../../icons';

function Object({
    object,
    onUpdateObject,
    onSetNameObject,
    onDeleteObject,
    onCopyOrPaste,
    isDrag,
    setIsDrag,
    setObjected,
    permissionAction,
    refObject,
}) {

    const [isHover, setIsHover] = useState(null)
    const handleDeleteObject = (id) => {
        if (!permissionAction) return
        onDeleteObject(id)
    }
    return (
        <div
            ref={refObject}
            onMouseLeave={() => setIsHover(null)}
            onKeyDown={(e) => onCopyOrPaste(e, object)}
        >
            <Rnd

                size={{ width: object.width, height: object.height }}
                position={{ x: object.posX, y: object.posY }}
                onDragStop={(e, d) => {
                    if (!permissionAction) return
                    setIsDrag(null)
                    onUpdateObject(object.id, { ...object, posX: d.x, posY: d.y })
                }}
                onDrag={(e, d) => {
                    if (!permissionAction) return
                    setIsHover(null)
                    setIsDrag(object.id)
                }}
                onResize={(e, d) => {
                    if (!permissionAction) return
                    setIsHover(null)
                    setIsDrag(object.id)
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                    if (!permissionAction) return
                    setIsDrag(null)
                    onUpdateObject(object.id, {
                        width: parseInt(ref.style.width, 10),
                        height: parseInt(ref.style.height, 10),
                        ...position,
                    });
                }}

            >
                <div
                    style={{ backgroundColor: `${object.color ?? "white"}` }}
                    className="relative w-full h-full outline-none"
                    onMouseEnter={() => {
                        setIsHover(object.id)
                    }}
                    onClick={() => setObjected(object)}
                >
                    <input className="w-full h-full border-0 outline-none text-center uppercase bg-transparent" value={object.name}
                        onChange={(e) => onSetNameObject(e, object.id)} />

                    {isDrag === object.id && (
                        <>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[0.5px] bg-red-300 z-[99]"></div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100vw] h-[0.5px] bg-red-300 z-[99]"></div>
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[100vh] w-[0.5px] bg-red-300 z-[99]"></div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[100vh] w-[0.5px] bg-red-300 z-[99]"></div>
                        </>
                    )}

                    {isHover === object.id && permissionAction && (<button className="absolute -top-[10px] -left-[10px] cursor-pointer z-10"
                        onClick={() => handleDeleteObject(object.id)}><CancelIcon /></button>)}
                </div>
            </Rnd>
        </div >
    );
}

export default Object;