import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { ROLES } from "../utils/permission";
import { useNoticeContext } from "../context/notice.context";

const Header = () => {
  const { getUser } = useAuth()
  const { requestApprove } = useNoticeContext()
  const [showInfoUser, setShowInfoUser] = useState(false)
  const user = getUser()

  return (
    <div className="w-full flex items-center justify-between gap-4 px-[30px] bg-white shadow-sm py-3">
      <div className="flex items-center gap-3">
        <img className="relative min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] rounded-full bg-blue-200 items-center justify-center "
          src="/LOGO.png" alt="LOGO" />
        {user.role === ROLES.SUPERUSER && (
          <>
            <Link to={"/room-management"} className="uppercase">DashBoard</Link>
            <div className="relative">
              <Link to={"/approving-diagram"} className="uppercase">Approving seat</Link>
              <div className="absolute -top-2 -right-2 min-w-[10px] min-h-[10px] "> {requestApprove}</div>
            </div>
          </>
        )}</div>
      <div className="relative min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] rounded-full bg-blue-200 items-center justify-center "
        onMouseEnter={() => setShowInfoUser(true)}
        onMouseLeave={() => setShowInfoUser(false)}
      >
        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="logo" className="w-full h-full object-cover rounded-full" />
        {showInfoUser && (<div className="w-[200px] px-3 py-2 absolute z-30 top-auto right-[20px] rounded-md bg-white shadow-md ">
          <h1 className="text-sm font-semibold text-gray-700">Username: {user.username}</h1>
          <h1 className="text-sm font-semibold text-gray-700">Role: {user.role}</h1>
          <h1 className="text-sm font-semibold text-gray-700">Team: {user.team}</h1>
        </div>)}
      </div>
    </div>
  );
};

export default Header;
