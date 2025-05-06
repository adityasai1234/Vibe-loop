<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Music } from 'lucide-react';
import { SDK_VERSION } from 'firebase/app';
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Music } from 'lucide-react';
>>>>>>> df7f7b8e62a410df9d50c733ab46acc1b4d53e8e

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp, error, loading } = useAuthStore();
  const navigate = useNavigate();

<<<<<<< HEAD
  // Set default credentials for admin
  useEffect(() => {
    if (isLogin) {
      setEmail('admin@gmail.com');
      setPassword('admin123');
    }
  }, [isLogin]);

=======
>>>>>>> df7f7b8e62a410df9d50c733ab46acc1b4d53e8e
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8 bg-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl backdrop-blur-xl">
        <div className="text-center">
          <div className="flex justify-center text-primary-500 mb-4">
            <Music size={40} className="sm:size-48" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-400">
=======
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white/5 p-8 rounded-2xl backdrop-blur-xl">
        <div className="text-center">
          <div className="flex justify-center text-primary-500 mb-4">
            <Music size={48} />
          </div>
          <h2 className="text-3xl font-bold text-white">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </h2>
          <p className="mt-2 text-gray-400">
>>>>>>> df7f7b8e62a410df9d50c733ab46acc1b4d53e8e
            {isLogin 
              ? 'Sign in to continue your musical journey' 
              : 'Start your musical journey today'}
          </p>
        </div>

<<<<<<< HEAD
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3 sm:space-y-4">
=======
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
>>>>>>> df7f7b8e62a410df9d50c733ab46acc1b4d53e8e
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
<<<<<<< HEAD
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
=======
                className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
>>>>>>> df7f7b8e62a410df9d50c733ab46acc1b4d53e8e
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
=======
                className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
>>>>>>> df7f7b8e62a410df9d50c733ab46acc1b4d53e8e
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
<<<<<<< HEAD
            className="w-full py-2 sm:py-3 px-4 border border-transparent rounded-lg text-sm sm:text-base text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
=======
            className="w-full py-3 px-4 border border-transparent rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>>>>>>> df7f7b8e62a410df9d50c733ab46acc1b4d53e8e
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
<<<<<<< HEAD
              className="text-primary-400 hover:text-primary-300 text-xs sm:text-sm"
=======
              className="text-primary-400 hover:text-primary-300 text-sm"
>>>>>>> df7f7b8e62a410df9d50c733ab46acc1b4d53e8e
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> df7f7b8e62a410df9d50c733ab46acc1b4d53e8e
