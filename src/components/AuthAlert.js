'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function AuthAlert({ isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match transition duration
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div 
        className={`bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-lg transform transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">Authentication Required</h3>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-gray-300 mb-6">
          Please create an account or login to submit new games. Creating an account helps us manage submissions and provide you with insights on your games.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Link 
            href="/register" 
            className="px-4 py-2 bg-gray-700 text-white rounded-md text-center hover:bg-gray-600 transition-colors"
          >
            Create Account
          </Link>
          <Link 
            href="/login" 
            className="px-4 py-2 bg-purple-600 text-white rounded-md text-center hover:bg-purple-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
} 