import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { GoogleIcon } from '../components/icons/GoogleIcon'; // Assuming you'll create this

const LoginPage: React.FC = () => {
  const { currentUser, signInWithGoogle, loading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/'; // Get redirect location or default to home

  useEffect(() => {
    if (!loading && currentUser) {
      // If user is already logged in, redirect them from where they came or to home
      // This also handles the case where a user lands on /login but is already authenticated
      navigate(from, { replace: true });
    }
  }, [currentUser, loading, navigate, from]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Navigation will be handled by AuthContext or useEffect above
      // after currentUser state updates and username check is complete.
    } catch (error) {
      console.error('Google Sign-In Failed:', error);
      // You might want to show a toast notification here
      // e.g., toast.error('Sign-in failed. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading...</div>;
  }
  
  // If user is already logged in (e.g. due to async nature of auth state), don't render login button
  // This check is mostly for the brief moment before useEffect redirects
  if (currentUser) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Redirecting...</div>;
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
          disabled={loading} // Disable button while auth state is loading
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:opacity-70 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          <GoogleIcon className="w-5 h-5 mr-3" />
          Sign in with Google
        </button>
        {loading && <p className="mt-4 text-sm text-gray-400">Attempting to sign you in...</p>}
      </div>
    </div>
  );
};

export default LoginPage;
