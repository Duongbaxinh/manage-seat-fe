import React, { useState } from "react";
import { Resizable } from 'react-resizable';
import { CancelIcon } from "../../../icons";

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
      // onBlur={() => setTimeout(() => setSelectedObject(null), 200)}
      className="group"
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      {selectedObject?.id === object.id ? (
        <Resizable
          width={size.width}
          height={size.height}
          onResize={onResize}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          // minConstraints={[50, 30]}
          // maxConstraints={[500, 500]}
          resizeHandles={['se', 'sw', 'ne', 'e', 'n', 's']}
          handle={(h, ref) => (
            <div
              ref={ref}
              className="resize-handle absolute w-2 h-2 bg-blue-500 border border-white"
              style={{
                cursor: `${h}-resize`,
                ...{
                  s: { bottom: -4, left: '50%', transform: 'translateX(-50%)' },
                  n: { top: -4, left: '50%', transform: 'translateX(-50%)' },
                  e: { right: -4, top: '50%', transform: 'translateY(-50%)' },
                  // w: { left: -4, top: '50%', transform: 'translateY(-50%)' },
                  se: { bottom: -4, right: -4 },
                  sw: { bottom: -4, left: -4 },
                  ne: { top: -4, right: -4 },
                }[h]
              }}
            />
          )}
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
        </Resizable>
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
