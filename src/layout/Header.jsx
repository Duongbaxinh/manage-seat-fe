import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { useNoticeContext } from "../context/notice.context";
import { handleAxiosError } from "../utils/handleError";
import { ROLES } from "../utils/permission";
import { BsBell } from "react-icons/bs";

const Header = () => {
  const { getUser } = useAuth()
  const { requestApprove } = useNoticeContext()
  const [showInfoUser, setShowInfoUser] = useState(false)
  const navigate = useNavigate()
  const user = getUser()
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const authentication = {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      };
      if (token) {
        await axios.get("https://seatmanage-be-v3.onrender.com/auth/logout", authentication);
        localStorage.removeItem("accessToken");
        navigate("/");
      } else {
        console.error("Token not found in localStorage");
      }
    } catch (error) {
      handleAxiosError(error);
    }
  }

  return (
    <div className="w-full flex items-center justify-between gap-4 px-[30px] bg-white shadow-sm py-3 min-w-[1440px]">
      <div className="flex items-center gap-3">
        <img className="relative min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] rounded-full bg-blue-200 items-center justify-center "
          src="/LOGO.png" alt="LOGO" />
        {user.role === ROLES.SUPERUSER && (
          <>
            <Link to={"/room-management"} className="uppercase">DashBoard</Link>
            <Link to={`/seat-management/${user.room}`} className="capitalize bg-blue-300 p-2 rounded-md text-white font-bold">My Room</Link>
          </>
        )}</div>
      <div className="flex gap-3 items-center">
        {user.role === ROLES.SUPERUSER && (
          <Link className="relative inline-block " to={"/approving-diagram"} >
            <BsBell className="w-6 h-6" />
            {requestApprove > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {requestApprove}
              </span>
            )}
          </Link>
        )}
        <div
          onMouseEnter={() => setShowInfoUser(true)}
          onMouseLeave={() => setShowInfoUser(false)}
          className="flex bg-gray-300 items-center p-1 rounded-md gap-2">
          <h1 className="text-sm font-semibold text-gray-700">{user.username}</h1>
          <div className="relative min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] rounded-full bg-blue-200 items-center justify-center "

          >
            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="logo" className="w-full h-full object-cover rounded-full" />
            {showInfoUser && (<div className="w-[200px] px-3 py-2 absolute z-30 top-6 right-[20px] rounded-md bg-white shadow-md ">
              <h1 className="text-sm font-semibold text-gray-700">Username: {user.username}</h1>
              <h1 className="text-sm font-semibold text-gray-700">Role: {user.role}</h1>
              <button onClick={handleLogout} className="text-sm font-semibold text-gray-700">Log-out</button>
            </div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
