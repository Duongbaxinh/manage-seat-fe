import React, { useState, useRef } from "react";
import { CancelIcon } from "../icons";

const RoomDiagram = ({
  seats,
  onSeatDrop,
  onUnassign,
  objects,
  onSetPositionObject,
}) => {
  const [draggedSeat, setDraggedSeat] = useState(null);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0,
    placement: "right",
  });
  const [isDraggingAssigned, setIsDraggingAssigned] = useState(false);
  const diagramRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const seatId = e.dataTransfer.getData("text/plain");
    const idObject = e.dataTransfer.getData("idObject");
    const isRepositioning = e.dataTransfer.getData("repositioning") === "true";

    if (diagramRef.current) {
      const rect = diagramRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      console.log("Vị trí chính xác:", x, y);
      onSetPositionObject(idObject, { x, y });
    }

    if (seatId && diagramRef.current) {
      const rect = diagramRef.current.getBoundingClientRect();
      const x = Math.max(20, Math.min(e.clientX - rect.left, rect.width - 20));
      const y = Math.max(20, Math.min(e.clientY - rect.top, rect.height - 20));

      onSeatDrop(seatId, { x, y }, isRepositioning);
    }
    setIsDraggingAssigned(false);
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

  const handleSeatDragEnd = () => {
    setDraggedSeat(null);
    setIsDraggingAssigned(false);
  };

  const handleSeatHover = (seat, e) => {
    if (!isDraggingAssigned) {
      const rect = e.currentTarget.getBoundingClientRect();
      const tooltipWidth = 256; // w-64 = 16rem = 256px
      const tooltipHeight = 180; // Approximate height of tooltip
      const gap = 12; // Gap between seat and tooltip

      // Try to position tooltip to the right first
      let x = rect.right + gap;
      let y = rect.top - 10;
      let placement = "right";

      // If tooltip would go off the right edge, try left side
      if (x + tooltipWidth > window.innerWidth) {
        x = rect.left - tooltipWidth - gap;
        placement = "left";
      }

      // If tooltip would go off the left edge, try above
      if (x < 0) {
        x = rect.left - (tooltipWidth - rect.width) / 2;
        y = rect.top - tooltipHeight - gap;
        placement = "top";
      }

      // If tooltip would go off the top, try below
      if (y < 0) {
        y = rect.bottom + gap;
        placement = "bottom";
      }

      // Final adjustments to keep tooltip within viewport
      x = Math.max(gap, Math.min(x, window.innerWidth - tooltipWidth - gap));
      y = Math.max(gap, Math.min(y, window.innerHeight - tooltipHeight - gap));

      setTooltipPosition({ x, y, placement });
      setHoveredSeat(seat);
    }
  };

  return (
    <div
      ref={diagramRef}
      className="w-full h-full bg-blue-500 relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="absolute top-2 left-2 text-sm font-medium text-white">
        Diagram Room
      </div>

      {/* Grid overlay for visual guidance */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-4 p-4 pointer-events-none">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="bg-white/10 rounded" />
        ))}
      </div>
      {objects.length > 0 &&
        objects.map((item, index) => (
          <div
            className={`absolute bg-${item.color} flex gap-3 items-center`}
            style={{
              top: item.posX,
              left: item.posY,
              backgroundColor: item.color,
            }}
            draggable
            onDragEnd={(e) => {
              const idObject = e.dataTransfer.getData("idObject");
              const x = e.clientX;
              const y = e.clientY;
              console.log("check ", idObject, "  ", x, "  ", y);
              return onSetPositionObject(idObject, { x: x, y: y });
            }}
            onDragStart={(e) => {
              e.dataTransfer.setData("idObject", item.id);
              e.dataTransfer.effectAllowed = "move";
            }}
          >
            {item.name} <CancelIcon />
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
              onDragEnd={handleSeatDragEnd}
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
          <div
            className={`absolute w-2 h-2 bg-white border border-gray-200 rotate-45 transform
            ${
              tooltipPosition.placement === "right"
                ? "-left-1 top-4 border-r-0 border-t-0"
                : ""
            }
            ${
              tooltipPosition.placement === "left"
                ? "-right-1 top-4 border-l-0 border-b-0"
                : ""
            }
            ${
              tooltipPosition.placement === "top"
                ? "-bottom-1 left-1/2 -ml-1 border-l-0 border-t-0"
                : ""
            }
            ${
              tooltipPosition.placement === "bottom"
                ? "-top-1 left-1/2 -ml-1 border-r-0 border-b-0"
                : ""
            }`}
          />
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">
              {hoveredSeat.name}
            </span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
              {/* {hoveredSeat.user} */}
            </span>
          </div>
          {hoveredSeat.user ? (
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">user:</span>
                <span className="font-medium">
                  {hoveredSeat.user?.lastName +
                    " " +
                    hoveredSeat.user?.firstName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Team:</span>
                <span className="font-medium">
                  {hoveredSeat.user?.team?.name}
                </span>
              </div>
              {hoveredSeat.status === "Assigned" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Project:</span>
                    <span className="font-medium truncate max-w-[120px]">
                      {hoveredSeat?.user.user || "Not set"}
                    </span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p>empty</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomDiagram;
