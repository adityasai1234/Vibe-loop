import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { GoogleIcon } from '../components/icons/GoogleIcon'; // Assuming you'll create this

const LoginPage: React.FC = () => {
  const { currentUser, signInWithGoogle, loading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the path the user was trying to access, or default to '/'
  const from = location.state?.from || '/';

  useEffect(() => {
    // If user is already logged in, redirect them
    if (!loading && currentUser) {
      // If they have a username, send them to their intended destination
      if (currentUser.displayName) {
        navigate(from, { replace: true });
      } else {
        // If they don't have a username, send them to choose one
        navigate('/choose-username', { 
          state: { from },
          replace: true 
        });
      }
    }
  }, [currentUser, loading, navigate, from]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Navigation will be handled by the useEffect above
    } catch (error) {
      console.error('Google Sign-In Failed:', error);
      // You might want to show a toast notification here
    }
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // If user is already logged in, show loading while redirecting
  if (currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm p-8 space-y-8 bg-gray-800 rounded-lg shadow-xl text-center">
        <h1 className="text-4xl font-bold text-purple-400">VibeLoop</h1>
        <p className="text-gray-300">
          Sign in to continue to your personalized music experience.
        </p>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:opacity-70 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          <GoogleIcon className="w-5 h-5 mr-3" />
          Sign in with Google
        </button>
        {loading && (
          <p className="mt-4 text-sm text-gray-400">
            Signing you in...
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
