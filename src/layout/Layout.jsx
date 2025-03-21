import React from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";

const Layout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className=" bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold">Management System</span>
            </div>
            <div className="flex items-center space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-500 font-medium"
                    : "text-gray-600 hover:text-gray-800"
                }
                end
              >
                Home
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-500 font-medium"
                    : "text-gray-600 hover:text-gray-800"
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/floor-management"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-500 font-medium"
                    : "text-gray-600 hover:text-gray-800"
                }
              >
                Floor Management
              </NavLink>
              <NavLink
                to="/hall-management"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-500 font-medium"
                    : "text-gray-600 hover:text-gray-800"
                }
              >
                Hall Management
              </NavLink>
              <NavLink
                to="/room-management"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-500 font-medium"
                    : "text-gray-600 hover:text-gray-800"
                }
              >
                Room Management
              </NavLink>
              <NavLink
                to="/seat-management"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-500 font-medium"
                    : "text-gray-600 hover:text-gray-800"
                }
              >
                Seat Management
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Help
              </button>
            </div>
          </div>
        </div>
      </nav>

    </div>
  );
};

export default Layout;
