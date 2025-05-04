import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import AuthLayout from './AuthLayout';

const Login = () => {
  const { currentUser, signInWithGoogle, loading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setErrorMessage('');
    try {
      await signInWithGoogle();
      // Navigation will happen automatically due to the useEffect
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setErrorMessage(error.message || 'Failed to sign in with Google');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <AuthLayout 
      title="Vibeloop"
      subtitle="Track your mood, discover music that matches your vibe"
    >
      <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800 dark:text-white">Sign In</h2>
          
          <button
            className="w-full h-12 flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-primary-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-200">Signing in...</span>
              </>
            ) : (
              <>
                <FcGoogle size="24px" />
                <span className="text-gray-700 dark:text-gray-200">Continue with Google</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {errorMessage}
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            By continuing, you agree to Vibeloop's Terms of Service and Privacy Policy.
          </p>
        </div>
      </AuthLayout>
  );
};

export default Login;
