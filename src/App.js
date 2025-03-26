import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import ProtectedRoute from "./layout/ProtectedRoute";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import RoomManage from "./pages/RoomManage";
import SeatManagement from "./pages/SeatManagement";
import { ROLES } from "./utils/permission";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          element={<ProtectedRoute isHeader allowedRoles={[ROLES.SUPERUSER]} />}
        >
          <Route path="/room-management" element={<RoomManage />} />
        </Route>
        <Route path="/seat-management/:id" element={<SeatManagement />} />
        <Route path="/error" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
