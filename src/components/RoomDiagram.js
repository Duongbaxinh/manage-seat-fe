import React, { useState, useRef } from "react";
import { CancelIcon } from "../icons";

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
  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0,
    placement: "right",
  });
  const [isDraggingAssigned, setIsDraggingAssigned] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [draggedObject, setDraggedObject] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState(false);
  const [rotating, setRotating] = useState(false);
  const diagramRef = useRef(null);

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
    setIsDraggingAssigned(false);
  };

  const handleObjectMouseDown = (e, object) => {
    e.stopPropagation();

    if (e.target.classList.contains("resize-handle")) {
      setResizing(true);
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

      // Constrain to diagram boundaries
      const constrainedX = Math.max(
        0,
        Math.min(newX, rect.width - (draggedObject.width || 100))
      );
      const constrainedY = Math.max(
        0,
        Math.min(newY, rect.height - (draggedObject.height || 100))
      );

      onSetPositionObject(draggedObject.id, {
        ...draggedObject,
        posX: constrainedX,
        posY: constrainedY,
      });
    } else if (selectedObject) {
      if (resizing) {
        const newWidth = Math.max(
          50,
          e.clientX - rect.left - selectedObject.posX
        );
        const newHeight = Math.max(
          50,
          e.clientY - rect.top - selectedObject.posY
        );

        onSetPositionObject(selectedObject.id, {
          ...selectedObject,
          width: newWidth,
          height: newHeight,
        });
      } else if (rotating) {
        const centerX = selectedObject.posX + (selectedObject.width || 100) / 2;
        const centerY =
          selectedObject.posY + (selectedObject.height || 100) / 2;
        const angle =
          Math.atan2(
            e.clientY - rect.top - centerY,
            e.clientX - rect.left - centerX
          ) *
          (180 / Math.PI);

        onSetPositionObject(selectedObject.id, {
          ...selectedObject,
          rotation: angle,
        });
      }
    }
  };

  const handleMouseUp = () => {
    setDraggedObject(null);
    setResizing(false);
    setRotating(false);
  };

  const handleSeatDragStart = (e, seat) => {
    e.dataTransfer.setData("text/plain", seat.id);
    e.dataTransfer.setData("repositioning", "true");
    e.dataTransfer.effectAllowed = "move";
    setDraggedSeat(seat.id);
    setIsDraggingAssigned(true);

    const dragImage = e.target.cloneNode(true);
    dragImage.style.transform = "scale(0.75)";
    dragImage.style.opacity = "0.8";
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 20, 20);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleSeatHover = (seat, e) => {
    if (!isDraggingAssigned) {
      const rect = e.currentTarget.getBoundingClientRect();
      const tooltipWidth = 256;
      const tooltipHeight = 180;
      const gap = 12;

      let x = rect.right + gap;
      let y = rect.top - 10;
      let placement = "right";

      if (x + tooltipWidth > window.innerWidth) {
        x = rect.left - tooltipWidth - gap;
        placement = "left";
      }

      if (x < 0) {
        x = rect.left - (tooltipWidth - rect.width) / 2;
        y = rect.top - tooltipHeight - gap;
        placement = "top";
      }

      if (y < 0) {
        y = rect.bottom + gap;
        placement = "bottom";
      }

      x = Math.max(gap, Math.min(x, window.innerWidth - tooltipWidth - gap));
      y = Math.max(gap, Math.min(y, window.innerHeight - tooltipHeight - gap));

      setTooltipPosition({ x, y, placement });
      setHoveredSeat(seat);
    }
  };

  const getObjectStyle = (object) => {
    const baseStyle = {
      position: "absolute",
      top: object.posY,
      left: object.posX,
      width: object.width || 100,
      height: object.height || 30,
      transform: `rotate(${object.rotation || 0}deg)`,
      cursor: draggedObject?.id === object.id ? "grabbing" : "grab",
      transition: draggedObject?.id === object.id ? "none" : "all 0.2s ease",
      userSelect: "none",
      touchAction: "none",
    };

    switch (object.name) {
      case "table":
        return {
          ...baseStyle,
          backgroundColor: "#8B4513",
          borderRadius: "8px",
          boxShadow:
            selectedObject?.id === object.id
              ? "0 0 0 2px #3B82F6, 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              : "0 2px 4px rgba(0, 0, 0, 0.1)",
        };
      case "wall":
        return {
          ...baseStyle,
          backgroundColor: "#808080",
          border: "2px solid #666",
          boxShadow:
            selectedObject?.id === object.id
              ? "0 0 0 2px #3B82F6, 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              : "0 2px 4px rgba(0, 0, 0, 0.1)",
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: object.color || "#ddd",
        };
    }
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
          key={object.id}
          className="group"
          style={getObjectStyle(object)}
          onMouseDown={(e) => handleObjectMouseDown(e, object)}
        >
          {selectedObject?.id === object.id && (
            <>
              <div
                className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-nw-resize resize-handle"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setResizing(true);
                  setSelectedObject(object);
                }}
              />
              <div
                className="absolute top-1/2 -right-6 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-ew-resize rotate-handle"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setRotating(true);
                  setSelectedObject(object);
                }}
              />
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
            className={`absolute transition-all duration-200 ${
              draggedSeat === seat.id ? "opacity-50" : ""
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
              onMouseEnter={(e) => handleSeatHover(seat, e)}
              onMouseLeave={() => setHoveredSeat(null)}
            >
              <div className="flex flex-col items-center">
                <span className="text-base">{seat.avatar}</span>
                <span className="text-xs font-medium text-gray-600">
                  {seat.name}
                </span>
              </div>
            </div>
          </div>
        ))}

      {hoveredSeat && !isDraggingAssigned && (
        <div
          className={`fixed bg-white rounded-lg shadow-lg p-3 border border-gray-200 w-64 z-50 transition-opacity duration-150
            ${tooltipPosition.placement === "right" ? "origin-left" : ""}
            ${tooltipPosition.placement === "left" ? "origin-right" : ""}
            ${tooltipPosition.placement === "top" ? "origin-bottom" : ""}
            ${tooltipPosition.placement === "bottom" ? "origin-top" : ""}`}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          <div className="text-sm">
            <div className="font-medium mb-1">{hoveredSeat.name}</div>
            <div className="text-gray-600">Status: {hoveredSeat.status}</div>
            {hoveredSeat.description && (
              <div className="text-gray-600 mt-1">
                {hoveredSeat.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDiagram;
