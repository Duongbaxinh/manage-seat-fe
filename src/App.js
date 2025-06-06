import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';

import ProtectedRoute from './layout/ProtectedRoute';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import RoomManage from './pages/RoomManage';
import SeatManagement from './pages/SeatManagement';
import { ROLES } from './utils/permission';
import ApprovingDiagram from './pages/ApprovingDiagram';
import ViewDraftDiagram from './pages/ViewDiagramDraft';
import ContainerLayout from './layout/ContainerLayout';
import UserManagement from './pages/UserManage';
import TeamManage from './pages/TeamManage';
import ProjectManage from './pages/ProjectManage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute allowedRoles={[ROLES.SUPERUSER]} />}>
          <Route
            path="/room-management"
            element={
              <ContainerLayout isHeader isSidebar>
                <RoomManage />
              </ContainerLayout>
            }
          />
          <Route
            path="/team-management"
            element={
              <ContainerLayout isHeader isSidebar>
                <TeamManage />
              </ContainerLayout>
            }
          />
          <Route
            path="/account-management"
            element={
              <ContainerLayout isHeader isSidebar>
                <UserManagement />
              </ContainerLayout>
            }
          />
          <Route
            path="/project-management"
            element={
              <ContainerLayout isHeader isSidebar>
                <ProjectManage />
              </ContainerLayout>
            }
          />
          <Route
            path="/approving-diagram"
            element={
              <ContainerLayout isHeader>
                <ApprovingDiagram />
              </ContainerLayout>
            }
          />
          <Route
            path="/view-diagram/:roomId"
            element={
              <ContainerLayout isHeader>
                <ViewDraftDiagram />
              </ContainerLayout>
            }
          />
        </Route>
        <Route path="/seat-management/:roomId" element={<SeatManagement />} />
        <Route path="/error" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
