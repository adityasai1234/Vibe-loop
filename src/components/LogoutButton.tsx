import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  variant?: 'icon' | 'text' | 'full';
  className?: string;
  showLoadingState?: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'full',
  className = '',
  showLoadingState = true
}) => {
  const { signOutUser, loading } = useAuthContext();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOutUser();
      // Navigate after successful logout
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // You might want to show a toast notification here
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isLoading = loading || isLoggingOut;

  // Base classes for all variants
  const baseClasses = `
    flex items-center justify-center
    transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
  `;

  // Variant-specific classes
  const variantClasses = {
    icon: `
      p-2 rounded-full
      hover:bg-gray-200 dark:hover:bg-gray-700
      text-gray-600 dark:text-gray-300
    `,
    text: `
      px-3 py-2 rounded-md
      hover:bg-gray-100 dark:hover:bg-gray-800
      text-gray-700 dark:text-gray-200
    `,
    full: `
      px-4 py-2 rounded-md
      bg-purple-600 hover:bg-purple-700
      text-white shadow-sm
    `
  };

  // Loading state classes
  const loadingClasses = isLoading ? 'opacity-50 cursor-wait' : '';

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${loadingClasses}
    ${className}
  `.trim();

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={buttonClasses}
      aria-label="Sign out"
    >
      {variant === 'icon' ? (
        <LogOut className="w-5 h-5" />
      ) : (
        <>
          <LogOut className="w-5 h-5 mr-2" />
          {variant === 'full' && 'Sign Out'}
        </>
      )}
      {showLoadingState && isLoading && (
        <span className="ml-2">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        </span>
      )}
    </button>
  );
};

export default LogoutButton; 