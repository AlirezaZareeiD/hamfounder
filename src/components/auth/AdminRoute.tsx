
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

interface AdminRouteProps {
  children: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    // You can return a loading spinner here if you want
    return null;
  }

  if (user?.email === 'alireza.zareidowlatabadi@gmail.com') {
    return children;
  }

  return <Navigate to="/404" replace />;
};

export default AdminRoute;
