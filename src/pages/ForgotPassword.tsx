import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeStore } from '../store/themeStore';
import { Disc3, Mail, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ForgotPassword: React.FC = () => {
  const { isDark } = useThemeStore();
  const { resetPassword, error, isLoading, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const validateForm = () => {
    clearError();
    setLocalError('');
    
    if (!email) {
      setLocalError('Email is required');
      return false;
    }
    
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      // Error is handled in the auth context
      console.error('Password reset failed:', err);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-2"
          >
            <Disc3 size={40} className="text-primary-500" />
          </motion.div>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent"
          >
            VibeLoop
          </motion.h1>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Reset your password
          </motion.p>
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {resetSent ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle size={48} className="text-green-500" />
              </div>
              <h2 className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Reset link sent!
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                We've sent a password reset link to <span className="font-medium">{email}</span>. 
                Please check your email and follow the instructions to reset your password.
              </p>
              <div className="pt-4">
                <Link 
                  to="/login" 
                  className="inline-flex items-center font-medium text-primary-500 hover:text-primary-400 transition-colors duration-300"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to login
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <form className="space-y-6" onSubmit={handleResetPassword}>
                {(error || localError) && (
                  <div className="flex items-center p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-200 rounded-md">
                    <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                    <span>{error || localError}</span>
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${isDark
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending reset link...
                      </span>
                    ) : 'Send reset link'}
                  </button>
                </div>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <Link 
                  to="/login" 
                  className="inline-flex items-center font-medium text-primary-500 hover:text-primary-400 transition-colors duration-300"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to login
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;