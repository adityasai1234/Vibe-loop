import { Navigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';

/**
 * PrivateRoute component that redirects to login if user is not authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactElement} - The rendered component
 */
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  // If not authenticated, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // If authenticated, render the protected component
  return children;
};

export default PrivateRoute;
