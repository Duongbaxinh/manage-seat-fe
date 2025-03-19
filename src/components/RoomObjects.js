import React from "react";
import { TableIcon, WallIcon, DoorIcon, WindowIcon } from "../icons";

const ROOM_OBJECTS = [
  {
    id: "table",
    name: "Table",
    icon: TableIcon,
    width: 120,
    height: 80,
    type: "table"
  },
  {
    id: "wall",
    name: "Wall",
    icon: WallIcon,
    width: 200,
    height: 10,
    type: "wall"
  },
  {
    id: "door",
    name: "Door",
    icon: DoorIcon,
    width: 60,
    height: 10,
    type: "door"
  },
  {
    id: "window",
    name: "Window",
    icon: WindowIcon,
    width: 100,
    height: 10,
    type: "window"
  }
];

const RoomObjects = () => {
  const handleDragStart = (e, object) => {
    e.dataTransfer.setData("application/json", JSON.stringify({
      ...object,
      isRoomObject: true,
      id: `${object.type}_${Date.now()}` // Generate unique ID for new objects
    }));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-900">Room Objects</h2>
        <p className="text-xs text-gray-500 mt-1">Drag objects to add to room</p>
      </div>
      
      <div className="p-4 space-y-3">
        {ROOM_OBJECTS.map((object) => {
          const Icon = object.icon;
          return (
            <div
              key={object.id}
              className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-move group"
              draggable
              onDragStart={(e) => handleDragStart(e, object)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 transition-colors">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{object.name}</h3>
                  <p className="text-xs text-gray-500">
                    {object.width}x{object.height}px
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomObjects;
