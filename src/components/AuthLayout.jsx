import React from 'react';
import './auth.css';

/**
 * A responsive layout component for authentication pages (login/register)
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to display inside the layout
 * @param {string} props.title - The main title to display
 * @param {string} props.subtitle - Optional subtitle text
 * @returns {JSX.Element}
 */
const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4 auth-container">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary-600 dark:text-primary-400">
            {title || 'Vibeloop'}
          </h1>
          {subtitle && (
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6 transition-all duration-300 hover:shadow-xl animate-fadeIn" style={{animationDelay: '0.2s'}}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;