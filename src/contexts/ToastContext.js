'use client';

import { createContext, useContext, useState, useCallback } from 'react';

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Create the context
const ToastContext = createContext({
  showToast: () => {},
  hideToast: () => {},
  toasts: [],
});

// Custom hook to use the toast context
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Generate a unique ID for each toast
  const generateId = () => `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Show a toast notification
  const showToast = useCallback((message, type = TOAST_TYPES.INFO, duration = 5000) => {
    const id = generateId();
    
    // Create new toast
    const newToast = {
      id,
      message,
      type,
      duration,
    };
    
    // Add the toast to the list
    setToasts(prev => [...prev, newToast]);
    
    // Automatically remove the toast after the specified duration
    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }
    
    return id;
  }, []);

  // Hide a specific toast by ID
  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
} 