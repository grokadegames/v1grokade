'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function WelcomeNotification() {
  const [showNotification, setShowNotification] = useState(false);
  const { user } = useAuth();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check if user just registered
    const isNewRegistration = searchParams.get('registered') === 'true';
    
    if (isNewRegistration && user) {
      setShowNotification(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams, user]);
  
  if (!showNotification) return null;
  
  return (
    <div className="fixed bottom-4 right-4 max-w-md p-4 bg-green-600 text-white rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">
            Welcome to Grokade, {user?.displayName}!
          </p>
          <p className="mt-1 text-sm">
            Your account has been created successfully. Enjoy exploring games!
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => setShowNotification(false)}
            className="bg-green-700 rounded-md inline-flex text-gray-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 