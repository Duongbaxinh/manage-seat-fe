import Tippy from "@tippyjs/react";
import React, { useRef } from "react";
import { Rnd } from "react-rnd";
import useClickOutside from "../../../hooks/useClickOutside";
import { CancelIcon } from "../../../icons";

const Seat = ({
  permissionAction,
  seat,
  isDrag,
  setIsDrag,
  seatAssign,
  setSeatAssign,
  onSetSeatPosition,
  users,
  seatOption,
  onSeatOption,
  onUnAssign,
  onAssign,
  isAssign,
  setIsAssign,
  setUserAssign,
  setIsReAssign,
  onReAssign,
  isReAssign,
  seatAvailable,
  userAssign,
  onReset,
}) => {
  const optionRef = useRef(null);
  const refMenu = useRef(null)
  const handleCancel = () => {
    setIsAssign(false);
    setUserAssign(null);
    setSeatAssign(null);
    setIsReAssign(false);
  };

  const handleClickRight = (e) => {
    e.preventDefault();
    onSeatOption(seat.id);
  };

  useClickOutside([optionRef, refMenu], () => {
    onSeatOption(null);
  });


  return (
    <div className="absolute">
      <Rnd
        size={{ width: "40px", height: "40px" }}
        position={{ x: seat.posX, y: seat.posY }}
        onDragStop={(e, d) => {
          if (!permissionAction) return
          setIsDrag(null)
          return onSetSeatPosition(seat.id, { x: d.x, y: d.y }, true)
        }}
        onDrag={() => {
          if (!permissionAction) return
          setIsDrag(seat.id)
        }}
        style={{
          background: seat.user ? seat.user.team.code : "lightgray",
          position: "relative",
        }}
      >
        <Tippy
          content={
            isDrag === null && (
              seat?.user ? (
                <div className="bg-white shadow-md rounded-sm flex flex-col gap-2 p-3">
                  <div>📌 <b>Name:</b> {seat?.name}</div>
                  <div>📝 <b>Description:</b> {seat?.description}</div>
                  <div>👤 <b>Username:</b> {seat?.user?.username}</div>
                  <div>🏢 <b>Team:</b> {seat?.user?.team?.name}</div>
                </div>
              ) : (<p className="p-2 bg-white font-bold rounded-sm">UnOccupant</p>)
            )
          }
          allowHTML={true}
          placement="top"
        >
          <div
            ref={optionRef}
            onContextMenu={handleClickRight}
            className="relative w-10 h-10 rounded-sm shadow-md flex items-center justify-center cursor-move hover:shadow-lg"
          >
            <p className="uppercase">   {seat?.name.split('')[0]}</p>
            {isDrag === seat.id && (
              <>
                <div className="absolute -top-[1px]  min-w-[100vw] h-[0.5px] bg-red-300 z-[99]"></div>
                <div className="absolute -left-[1px]  min-h-[100vw] w-[0.5px] bg-red-300 z-[99]"></div>
                <div className="absolute bottom-[1px]  min-w-[100vw] h-[0.5px] bg-red-300 z-[99]"></div>
                <div className="absolute right-[1px]  min-h-[100vw] w-[0.5px] bg-red-300 z-[99]"></div></>
            )}
          </div>
        </Tippy>

        {seatOption === seat.id && permissionAction && (
          <div ref={refMenu} className="absolute min-w-[220px] z-50 top-[40px] left-[40px] w-[200px] bg-white p-2 rounded-md">
            {seat?.user ? (
              <div className="text-sm">
                {isReAssign && permissionAction && (
                  <div className=" flex gap-2 w-full px-1 py-1">
                    <select
                      value={seatAssign}
                      onChange={(e) => setSeatAssign(e.target.value)}
                      className="w-full px-1 py-0 m-0"
                    >
                      <option value="">Select Seat</option>
                      {seatAvailable.map((sa) => (
                        <option key={sa.id} className="px-1" value={sa.id}>{sa.name}</option>
                      ))}
                    </select>
                    {isReAssign && seatAssign && (
                      <button
                        onClick={() => {
                          onReAssign(seatAssign, seat.id, seat.user.id)
                          handleCancel()
                        }}
                        className="px-[5px] rounded-sm bg-green-400 text-white"
                      >
                        Save
                      </button>
                    )}
                  </div>
                )}
                {permissionAction && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setIsReAssign(true)}
                      className="px-[5px] rounded-sm bg-green-400 text-white"
                    >
                      Reassign
                    </button>

                    <button
                      onClick={() => onUnAssign(seat.id)}
                      className="px-[5px] rounded-sm bg-red-400 text-white"
                    >
                      UnAssign
                    </button>

                  </div>
                )}
              </div>
            ) : (
              <div>
                {permissionAction && (
                  <div className="w-[200px]  flex gap-2">
                    {isAssign && (
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
                    {!isAssign && (

                      <button
                        className="w-full rounded-sm bg-green-400 text-white"
                        onClick={() => setIsAssign(true)}
                      >
                        Assign
                      </button>
                    )}
                    {isAssign && userAssign && (
                      <button
                        onClick={() => {
                          onAssign(seat.id, userAssign);
                          setIsAssign(false);
                        }}
                        className="px-[5px] rounded-sm bg-green-400 text-white"
                      >
                        Save
                      </button>
                    )}
                  </div>
                )}

              </div>
            )}
            {(isAssign || isReAssign) && (
              <button className="absolute top-0 right-0" onClick={handleCancel}>
                <CancelIcon className="text-[13px]" />
              </button>
            )}

            <button
              onClick={() => onReset(seat.id)}
              className=" w-full mt-2 px-[5px] rounded-sm bg-red-400 text-white"
            >
              Reset
            </button>

          </div>
        )
        }
      </Rnd >
    </div >
  );
};

export default Seat;