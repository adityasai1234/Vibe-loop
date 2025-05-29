import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

interface RequireAuthProps {
  children: JSX.Element;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { currentUser, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    // You might want to show a loading spinner here instead of just null
    // For example, a full-screen loader or a skeleton screen
    return <div className="flex justify-center items-center h-screen">Authenticating...</div>;
  }

  if (!currentUser) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;