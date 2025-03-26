

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth.context';
import Header from '../Layout';

const ProtectedRoute = ({ isHeader = true, allowedRoles }) => {
    const { getUser } = useAuth();
    const user = getUser()
    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/error" replace />;
    }

    return <>
        {isHeader && <Header />}
        <Outlet />
    </>;
};

export default ProtectedRoute