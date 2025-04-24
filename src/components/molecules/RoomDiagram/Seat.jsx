import Tippy from "@tippyjs/react";
import React, { useEffect, useRef, useState } from "react";
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import Countdown from "react-countdown";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import { Rnd } from "react-rnd";
import { useAuth } from "../../../context/auth.context";
import { useOnboardingGuide } from "../../../context/guide.context";
import useClickOutside from "../../../hooks/useClickOutside";
import { CancelIcon } from "../../../icons";
import Popup from "../../atom/Popup";
import useSeat from "../../../services/seat.service";
import DetailRoomService from "../../../services/room.service";
import { useSeatMap } from "../../../context/seatmap.context";
import { set } from "react-hook-form";

const Seat = ({
  permissionAction,
  seat,
  setSeats,
  isDrag,
  setIsDrag,
  onSetSeatPosition,
  users,
  seatOption,
  onSeatOption,
  userNoSeat,
  onUnAssignSeat,
  onReAssignSeat,
  onSwitchSeat,
  onAssignSeat,
  onRemoveSeat
}) => {
  const { getUser } = useAuth()
  const { goToTarget } = useSeatMap();
  const { seats } = DetailRoomService()
  const { userAssign, setUserAssign } = useSeat()
  const [typeSeat, setTypeSeat] = useState("");
  const [expiredAt, setExpiredAt] = useState(null);
  const [seatAssign, setSeatAssign] = useState(false)
  const [seatSelected, setSeatSelected] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [noSeat, setNoSeat] = useState(false)
  const [isSwitchSeat, setIsSwitchSeat] = useState(false)
  const [seatReAssign, setSeatReAssign] = useState(false)
  const [processAssign, setProcessAssign] = useState(false)
  const [seatUser, setSeatUser] = useState([]);
  const { handleShowGuide, isGuideActive } = useOnboardingGuide();
  const optionRef = useRef(null);
  const popupRef = useRef(null);
  const refMenu = useRef(null)



  const handleCancel = () => {
    setUserAssign(null);

    setSeatAssign(null);
    setSeatReAssign(false);
    setIsOpen(false)
    onSeatOption(null)
  };

  const handleClickRight = (e) => {
    e.preventDefault();
    handleShowGuide(14)
    onSeatOption(seat.id);
  };


  const handleSetUserAssign = (userId) => {
    const user = users.find(u => u.id === userId)
    setUserAssign(user)
  }

  const handleSwitchSeat = async () => {
    if (!userAssign || !seat) return
    setProcessAssign(true)
    await onSwitchSeat({
      seatSwitch: seat,
      userSwitch: userAssign,
      seatSelected: seatSelected ? seatSelected : seatUser[0]?.id,
    })
    setProcessAssign(false)
    setIsSwitchSeat(false)
  }

  const handleAssign = async (assignData) => {
    setProcessAssign(true)
    if (seatAssign) {
      await onAssignSeat({
        "user": userAssign,
        "seatId": assignData.seatId,
        "typeSeat": assignData.typeSeat,
        "expiration": assignData?.expiredAt ?? null
      })
    } else {
      await onReAssignSeat({
        newUser: userAssign,
        seatId: assignData.seatId,
        oldUser: seat.user,
        "typeSeat": assignData.typeSeat,
        "expiration": assignData?.expiredAt?.toISOString() ?? null
      })
    }
    setProcessAssign(false)
    handleCancel()
  }

  useClickOutside([optionRef, refMenu, popupRef], () => {
    if (!isGuideActive) {
      handleCancel()
    }
  });

  useEffect(() => {
    if (userAssign !== null && isSwitchSeat) {
      const seatUser = seats.filter((s) => (s.user && s.user.id === userAssign.id))
      setSeatUser(seatUser)
    }
  }, [userAssign, seats])
  const userPopup = noSeat ? userNoSeat : users.filter((item) => item?.username !== seat?.user?.username)
  const noSeatIds = userNoSeat.map(u => u.id); // Lấy ID user chưa có ghế

  const userHaveSeat = users.filter(user => !noSeatIds.includes(user.id));

  const userId = getUser()?.id;
  return (
    <>
      <Rnd
        className="!absolute"
        bounds={"parent"}
        size={{ width: "100px", height: "40px" }}
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
          background: seat.user ? seat?.user?.team?.code : "lightgray",
          position: "relative",
        }}
      >
        <Tippy
          content={
            isDrag === null && (
              seat?.user ? (
                <div className="bg-white shadow-md rounded-sm flex flex-col gap-2 p-3">
                  <div>🪑 <b>Name:</b> {seat?.name}</div>
                  <div>📝 <b>Description:</b> {seat?.description}</div>
                  <div>👤 <b>Username:</b> {seat?.user?.username}</div>
                  <div>💺 <b>Type of Seat:</b> {seat?.typeSeat}</div>
                  {seat?.expireTime && (
                    <>
                      <div>
                        ⏳ <b>Expire Time:</b>{' '}
                        {new Date(seat.expireTime).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div>⏰ <b>Rest Time:</b> {
                        <Countdown
                          date={new Date(seat.expireTime)}
                          onComplete={() => onUnAssignSeat(seat.id)}
                        />
                      }
                      </div></>)}
                  <div>👥 <b>Team:</b> {seat?.user?.team?.name}</div>
                  <div>👥 <b>Project:</b> {seat?.user?.project?.name}</div>

                </div>
              ) : (<p className="p-2 bg-white font-bold rounded-sm">Unoccupied</p>)
            )
          }
          allowHTML={true}
          placement="top"
        >

          <div id="seat-hover-area" className={`w-full h-full flex flex-col items-center justify-center `}>
            <div id={`user-${seat?.user?.id}`} className={`${userId === seat?.user?.id && "  absolute w-[100px] h-[40px]"}`} />
            {seat?.expireTime && (
              <div className="text-[12px] text-white">{
                <Countdown
                  date={new Date(seat.expireTime)}
                />
              }
              </div>)}
            <div
              ref={optionRef}
              onContextMenu={handleClickRight}
              className="relative w-full h-full rounded-sm  flex items-center justify-center cursor-move hover:shadow-lg"
            >

              <p className="uppercase whitespace-nowrap"> {seat.user ? seat?.user.username : seat.name}</p>
              {isDrag === seat.id && (
                <>
                  <div className="absolute -top-[1px]  min-w-[100vw] h-[0.5px] bg-red-300 z-[99]"></div>
                  <div className="absolute -left-[1px]  min-h-[100vw] w-[0.5px] bg-red-300 z-[99]"></div>
                  <div className="absolute bottom-[1px]  min-w-[100vw] h-[0.5px] bg-red-300 z-[99]"></div>
                  <div className="absolute right-[1px]  min-h-[100vw] w-[0.5px] bg-red-300 z-[99]"></div></>
              )}
            </div></div>
        </Tippy>
        {seatOption === seat.id && permissionAction && (
          <div ref={refMenu} className="absolute min-w-[220px] z-[999] top-[40px] left-[40px] w-[200px] bg-white p-2 rounded-md">
            {seat?.user ? (
              <div className="text-sm">
                {permissionAction && (
                  <div className="flex flex-col gap-2">
                    {!seatReAssign && (
                      <button
                        id="context-reassign"
                        onClick={() => {
                          setSeatReAssign(true)
                          setIsOpen(true)
                        }}
                        className="py-2 rounded-sm bg-green-400 text-white"
                      >
                        Reassign
                      </button>
                    )}
                    {!isSwitchSeat && (
                      <button
                        id="context-reassign"
                        onClick={() => {
                          setIsSwitchSeat(true)
                        }}
                        className="py-2 rounded-sm bg-green-400 text-white"
                      >
                        Switch Seat
                      </button>
                    )}
                    <button
                      id="context-unassign"
                      onClick={() => {
                        if (window.confirm('Are you sure unAssign?')) {
                          onUnAssignSeat(seat.id)
                        }
                      }}
                      className="p-2 rounded-sm bg-red-400 text-white"
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
                    {!seatAssign && (
                      <button
                        id="context-assign"
                        className="w-full p-2 rounded-sm bg-green-400 text-white"
                        onClick={() => {
                          setSeatAssign(true)
                          setIsOpen(true)
                        }}
                      >
                        Assign
                      </button>
                    )}
                  </div>
                )}

              </div>
            )}
            {(seatAssign || seatReAssign) && (
              <button className="absolute top-0 right-0" onClick={handleCancel}>
                <CancelIcon className="text-[13px]" />
              </button>
            )}

            <button
              id="context-remove"
              onClick={() => onRemoveSeat(seat.id)}
              className=" w-full mt-2 p-2 rounded-sm bg-red-400 text-white"
            >
              Remove
            </button>

          </div>
        )
        }
      </Rnd >

      <Popup ref={popupRef} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="">
          <div className="p-6 space-y-4 min-w-[500px] max-w-[500px]">

            <div>
              <label className="text-sm font-medium">👤 User Haven't seat</label>
              <input type="checkbox" className=" ml-2  bg-blue-200" value={noSeat} onChange={(e) => setNoSeat(e.target.checked)} />
            </div>
            <div >
              <label className="text-sm font-medium">👤 Người dùng</label>
              <select
                onChange={(e) => handleSetUserAssign(e.target.value)}
                value={userAssign?.id || ""}
                className="mt-1 w-full p-2 border rounded-md shadow-sm"
              >
                <option value="">-- Chọn người dùng --</option>
                {userPopup.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>


            </div>

            {/* Chọn loại ghế */}
            <div>
              <label className="text-sm font-medium">🪑 Loại ghế</label>
              <select
                value={typeSeat}
                onChange={(e) => setTypeSeat(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md shadow-sm"
              >
                <option value="">-- Chọn loại ghế --</option>
                <option value="PERMANENT">Permanent</option>
                <option value="TEMPORARY">Temporary</option>
              </select>
            </div>

            {/* Nếu là temporary thì cho chọn thời gian hết hạn */}
            {typeSeat === "TEMPORARY" && (
              <div>
                <label className="text-sm font-medium">⏳ Thời gian kết thúc</label>
                <DateTimePicker
                  disableClock
                  onChange={setExpiredAt}
                  value={expiredAt}
                  format="y-MM-dd HH:mm"
                  minDate={new Date()}
                  className="!h-[50px] flex items-center justify-center"
                />
              </div>
            )}

            {/* Nút xác nhận */}
            <div className="pt-2">
              <button
                disabled={processAssign}
                onClick={() => {
                  if (!userAssign) return alert("Vui lòng chọn người dùng!");
                  if (!typeSeat) return alert("Vui lòng chọn loại ghế!");
                  if (typeSeat === "TEMPORARY" && (!expiredAt || expiredAt <= new Date())) {
                    return alert("Thời gian kết thúc không hợp lệ!");
                  }
                  handleAssign({ seatId: seat.id, typeSeat, expiredAt })
                }}
                className="w-full p-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-all
                 disabled:opacity-[0.5] disabled:pointer-events-none"
              >
                ✅ Xác nhận
              </button>
            </div>
          </div>
        </div>
      </Popup>


      <Popup isOpen={isSwitchSeat} onClose={() => setIsSwitchSeat(false)}>
        <div className="">
          <div className="p-6 space-y-4 min-w-[500px] max-w-[500px]">
            <div >
              <label className="text-sm font-medium">👤 `Ngườ`i dùng</label>
              <select
                onChange={(e) => handleSetUserAssign(e.target.value)}
                value={userAssign?.id || ""}
                className="mt-1 w-full p-2 border rounded-md shadow-sm"
              >
                <option value="">-- Chọn người dùng --</option>
                {userHaveSeat.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>

            </div>

            {
              seatUser && seatUser.length > 1 && (
                <select
                  onChange={(e) => setSeatSelected(e.target.value)}
                  value={seatSelected || ""}
                  className="mt-1 w-full p-2 border rounded-md shadow-sm"
                >
                  <option value="">-- Ghế --</option>
                  {seatUser.map((seatU, index) => (
                    <option value={seatU.id} className=""> {index + 1} -- {seatU.name}</option>
                  ))}
                </select>
              )
            }


            {/* Nút xác nhận */}
            <div className="pt-2">
              <button
                disabled={processAssign}
                onClick={() => {
                  if (!userAssign) return alert("Vui lòng chọn người dùng!");
                  handleSwitchSeat()
                }}
                className="w-full p-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-all
                 disabled:opacity-[0.5] disabled:pointer-events-none"
              >
                ✅ Xác nhận
              </button>
            </div>
          </div>
        </div>
      </Popup>

    </>

  );
};

export default Seat;