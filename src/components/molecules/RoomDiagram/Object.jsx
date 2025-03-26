import React, { useState } from "react";
import { Resizable } from 'react-resizable';
import { CancelIcon } from "../../../icons";
import { Rnd } from "react-rnd";

const Object = ({
  object,
  permissionAction,
  selectedObject,
  onDragStart,
  onDragEnd,
  onSetPositionObject,
  onSetNameObject,
  onDeleteObject,
  setSelectedObject,
  setRotating
}) => {
  const [size, setSize] = useState({
    width: object.width || 100,
    height: object.height || 30
  });
  const [isResizing, setIsResizing] = useState(false);

  const getObjectStyle = (object) => {
    return {
      position: "absolute",
      top: object.posY,
      left: object.posX,
      transform: `rotate(${object.rotation || 0}deg)`,
      cursor: isResizing ? "auto" : "grab",
      userSelect: "none",
      touchAction: "none",
      backgroundColor: object.color ?? 'gray'
    };
  };

  const handleDeleteObject = (e, idObject) => {
    onDeleteObject(idObject);
  };

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
  };

  const onResize = (e, { size: newSize }) => {
    e.stopPropagation();
    const updatedSize = { width: newSize.width, height: newSize.height };
    setSize(updatedSize);
    onSetPositionObject(object.id, {
      ...object,
      width: updatedSize.width,
      height: updatedSize.height
    });
  };

  const handleDragStart = (e) => {
    if (isResizing) {
      e.preventDefault();
      return;
    }
    onDragStart(e, object);
  };

  return (
    <div
      style={getObjectStyle(object)}
      draggable={!isResizing}
      key={object.id}
      tabIndex={0}
      onBlur={() => setTimeout(() => setSelectedObject(null), 500)}
      className="group"
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      {selectedObject?.id === object.id ? (
        <Rnd
          size={{ width: object.width, height: object.height }}
          position={{ x: object.posX, y: object.posY }}
          onDragStop={(e, d) => onSetPositionObject(object.id, { ...object, posX: d.x, posY: d.y })}
          onResizeStop={(e, position) => onSetPositionObject(object.id, { ...object, width: size.width, height: size.height, ...position })}
        >
          <div
            style={{
              width: size.width,
              height: size.height,
              backgroundColor: object.color ?? 'gray',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <button className="absolute -top-2 -left-2" onClick={(e) => handleDeleteObject(e, object.id)}> <CancelIcon /></button>
            <input
              value={object.name}
              onChange={(e) => onSetNameObject(e, object.id)}
              className="w-full text-center cursor-move bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:cursor-text text-white"
            />
          </div>
        </Rnd>
      ) : (
        <div
          style={{
            width: object.width || 100,
            height: object.height || 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setSelectedObject(object)}
        >
          <input
            value={object.name}
            readOnly
            className="w-full text-center cursor-move bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:cursor-text text-white"
          />
        </div>
      )}
    </div>
  );
};

export default Object;
