import React, { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // in ms
  icon?: ReactNode;
}

interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastIdCounter = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${toastIdCounter++}`;
    setToasts(prevToasts => [...prevToasts, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToasts = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToasts must be used within a ToastProvider');
  }
  return context;
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column-reverse', // New toasts appear at the bottom and push older ones up
        gap: '10px',
      }}
    >
      <AnimatePresence initial={false}>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  removeToast: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, removeToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [toast, removeToast]);

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      case 'warning': return 'bg-yellow-500';
      case 'info':
      default: return 'bg-blue-600';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`relative flex items-center p-4 rounded-lg shadow-xl text-white ${getBackgroundColor()} min-w-[250px] max-w-[350px]`}
    >
      {toast.icon && <div className="mr-3 flex-shrink-0">{toast.icon}</div>}
      <p className="text-sm flex-grow">{toast.message}</p>
      <button 
        onClick={() => removeToast(toast.id)} 
        className="ml-3 text-xl font-bold opacity-70 hover:opacity-100 transition-opacity duration-150 focus:outline-none"
        aria-label="Close toast"
      >
        &times;
      </button>
    </motion.div>
  );
};

// Example Usage (typically you'd call addToast from other components):
// const MyComponent = () => {
//   const { addToast } = useToasts();
//   return <button onClick={() => addToast({ message: 'Profile saved!', type: 'success' })}>Save</button>
// };