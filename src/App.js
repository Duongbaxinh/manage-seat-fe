import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import FloorManagement from "./pages/FloorManagement";
import HallManagement from "./pages/HallManagement";
import SeatManagement from "./pages/SeatManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import RoomManage from "./pages/RoomManage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogin = (email, password) => {
    // Add authentication logic here
    console.log("Logging in with:", email, password);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        /> */}
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute onLogout={handleLogout} />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/floor-management" element={<FloorManagement />} />
          <Route path="/hall-management" element={<HallManagement />} />
          <Route path="/seat-management/:id" element={<SeatManagement />} />
          <Route path="/room-management" element={<RoomManage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
