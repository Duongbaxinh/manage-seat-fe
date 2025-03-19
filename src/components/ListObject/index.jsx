import React, { useState } from 'react';

function ListObject() {
    const [position, setPosition] = useState({ x: 0, y: 0 })

    return (
        <div className="relative w-screen h-screen bg-gray-100" onDragOver={() => { }}>
            <p>{position.x} --- {position.y}</p>
            <div
                className="w-[100px] h-[100px] bg-blue-500 text-white font-bold flex items-center justify-center cursor-grab absolute"
                style={{ left: position.x, top: position.y }}
                draggable="true"
                onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", JSON.stringify({ x: e.clientX, y: e.clientY }));
                }}
                onDragEnd={(e) => {
                    setPosition({ x: e.clientX, y: e.clientY });
                }}
            >
                Drag me
            </div>
        </div>
    );
}

export default ListObject;