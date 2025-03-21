import React from "react";
import { CancelIcon } from "../../../icons";

const Seat = ({
  permissionAction,
  seat,
  users,
  hoveredSeat,
  onUnAssign,
  onAssign,
  handleSeatDragStart,
  handleSeatHover,
  isAssign,
  setIsAssign,
  setUserAssign,
  setIsReAssign,
  seatAvailable,
  isReAssign,
  userAssign,
  onReAssign,
  setSeatAssign,
  seatAssign,
  isDrag
}) => {
  const handleCancel = () => {
    setIsAssign(false)
    setUserAssign(null)
    setSeatAssign(null)
    setIsReAssign(false)
  }
  return (
    <div
      key={seat.id}
      className={`absolute`}
      onMouseLeave={() => { if (!isAssign && !isReAssign) { handleSeatHover(null) } }}
      style={{
        backgroundColor: seat?.user?.team?.code ?? "white",
        left: seat.posX,
        top: seat.posY,
      }}
    >
      {hoveredSeat === seat.id && (
        <div className="absolute min-w-[220px] z-10 bottom-[20px] left-[40px] w-[200px] bg-white p-2 rounded-md">
          {seat?.user ? (
            <div className="text-sm">
              <div className="">{permissionAction.toString()}</div>
              <div className="font-medium mb-1">{seat.name}</div>
              <div className="text-gray-600">{seat.description}</div>
              <div className="text-gray-600">{seat.user.username}</div>
              <div className="text-gray-600">{seat.user.team.name}</div>
              {isReAssign && permissionAction &&
                <div className="w-full px-1 py-1">
                  <select value={seatAssign} onChange={(e) => setSeatAssign(e.target.value)}
                    className="w-full px-1 py-0 m-0"
                  >
                    <option value="">Select Seat</option>
                    {seatAvailable.map((sa) => (
                      <option className="px-1" value={sa.id}>{sa.name}</option>
                    ))}
                  </select>
                </div>
              }
              {permissionAction && (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setIsReAssign(true) }}
                    className="px-[5px] rounded-sm bg-green-400 text-white"
                  >
                    Reassign
                  </button>
                  {isReAssign && seatAssign && (
                    <button
                      onClick={() => {
                        onReAssign(seatAssign, seat.id, seat.user.id)
                        setIsReAssign(false)
                      }}
                      className="px-[5px] rounded-sm bg-green-400 text-white"
                    >
                      Save
                    </button>
                  )}
                  <button
                    onClick={() => { onUnAssign(seat.id) }}
                    className="px-[5px] rounded-sm bg-red-400 text-white"
                  >
                    UnAssign
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="">
              {permissionAction ? (<div className="w-[200px] p-2 flex gap-2">
                {isAssign && permissionAction && (
                  <select
                    onChange={(e) => setUserAssign(e.target.value)}
                    className="w-full border-0 rounded-md outline-none px-2 py-1 shadow-md text-[13px]"
                  >
                    <option value="">Select user</option>
                    {users.map((item) => (
                      <option key={item.id} value={item.id}>{item.username}</option>
                    ))}
                  </select>
                )}
                {!isAssign && permissionAction && (
                  <button
                    className="px-[5px] py-2 rounded-sm bg-green-400 text-white"
                    onClick={() => { setIsAssign(true) }}
                  >
                    Assign
                  </button>
                )}
                {isAssign && userAssign && (
                  <button
                    onClick={() => {
                      onAssign(seat.id, userAssign)
                      setIsAssign(false)
                    }}
                    className="px-[5px] rounded-sm bg-green-400 text-white"
                  >
                    Save
                  </button>
                )}
              </div>) : "Empty"}
            </div>
          )}

          {(isAssign || isReAssign) && (
            <button className="absolute top-0 right-0"
              onClick={() => handleCancel()}
            ><CancelIcon className="text-[13px]" />
            </button>)}
        </div>
      )}
      <div
        className="w-10 h-10
        rounded-sm shadow-md flex items-center 
        justify-center cursor-move
         hover:shadow-lg transition-all"
        draggable
        onDragStart={(e) => handleSeatDragStart(e, seat)}
        onMouseEnter={() => { if (!isAssign && !isReAssign) { handleSeatHover(seat.id) } }}
      >
        <div className="flex flex-col items-center">
          <span className="text-base">{seat.avatar}</span>
          <span className="text-xs font-medium text-gray-600">
            {seat.name}
          </span>
        </div>

      </div>
    </div>
  );
};

export default Seat;
