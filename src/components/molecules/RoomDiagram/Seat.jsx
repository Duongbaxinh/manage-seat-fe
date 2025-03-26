import React, { useCallback, useEffect, useRef } from "react";
import { CancelIcon } from "../../../icons";
import { Rnd } from "react-rnd";
import Tippy from "@tippyjs/react";

const Seat = ({
  permissionAction,
  seat,
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

  const handleClickOutside = useCallback(
    (event) => {
      if (optionRef.current && !optionRef.current.contains(event.target) && refMenu.current && !refMenu.current.contains(event.target)) {
        onSeatOption(null);
      }
    },
    [onSeatOption]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="absolute">
      <Rnd
        size={{ width: "40px", height: "40px" }}
        position={{ x: seat.posX, y: seat.posY }}
        onDragStop={(e, d) => onSetSeatPosition(seat.id, { x: d.x, y: d.y }, true)}
        style={{
          border: "1px solid black",
          background: seat.user ? seat.user.team.code : "lightgray",
          position: "relative",
        }}
      >
        <Tippy
          content={
            <div className="bg-white shadow-md rounded-sm flex flex-col gap-2 p-3">
              <div>📌 <b>Name:</b> {seat?.name}</div>
              <div>📝 <b>Description:</b> {seat?.description}</div>
              <div>👤 <b>Username:</b> {seat?.user?.username}</div>
              <div>🏢 <b>Team:</b> {seat?.user?.team?.name}</div>
            </div>
          }
          allowHTML={true}
          placement="top"
        >
          <div
            ref={optionRef}
            onContextMenu={handleClickRight}
            className="w-10 h-10 rounded-sm shadow-md flex items-center justify-center cursor-move hover:shadow-lg"
          >
            {seat?.name}
          </div>
        </Tippy>

        {seatOption === seat.id && (
          <div ref={refMenu} className="absolute min-w-[220px] z-10 bottom-[20px] left-[40px] w-[200px] bg-white p-2 rounded-md">
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
                          onReAssign(seatAssign, seat.id, seat.user.id);
                          setIsReAssign(false);
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
                    <button
                      onClick={() => onReset(seat.id)}
                      className="px-[5px] rounded-sm bg-red-400 text-white"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {permissionAction && (
                  <div className="w-[200px] p-2 flex gap-2">
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
                        className="px-[5px] py-2 rounded-sm bg-green-400 text-white"
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
          </div>
        )}
      </Rnd>
    </div>
  );
};

export default Seat;