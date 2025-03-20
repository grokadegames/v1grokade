'use client';

import { TOAST_TYPES, useToast } from '@/contexts/ToastContext';
import { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function Toast() {
  const { toasts, hideToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onClose={() => hideToast(toast.id)} 
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const [visible, setVisible] = useState(false);
  
  // Animation when the toast appears or disappears
  useEffect(() => {
    setVisible(true);
    
    // Prepare to animate out before removal
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, toast.duration - 300); // Start hide animation a bit before removal
      
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);
  
  // Get the appropriate icon based on the toast type
  const getIcon = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return <CheckCircleIcon className="h-6 w-6 text-green-400" />;
      case TOAST_TYPES.ERROR:
        return <ExclamationCircleIcon className="h-6 w-6 text-red-400" />;
      case TOAST_TYPES.WARNING:
        return <ExclamationCircleIcon className="h-6 w-6 text-yellow-400" />;
      case TOAST_TYPES.INFO:
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-400" />;
    }
  };
  
  // Get the appropriate background color based on the toast type
  const getBgColor = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return 'bg-green-600';
      case TOAST_TYPES.ERROR:
        return 'bg-red-600';
      case TOAST_TYPES.WARNING:
        return 'bg-yellow-600';
      case TOAST_TYPES.INFO:
      default:
        return 'bg-blue-600';
    }
  };
  
  return (
    <div 
      className={`max-w-md p-4 ${getBgColor()} text-white rounded-lg shadow-lg transition-all duration-300 transform ${
        visible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-2 opacity-0'
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">
            {toast.message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300); // Wait for animation to finish
            }}
            className="bg-transparent rounded-md inline-flex text-white hover:text-gray-200 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 