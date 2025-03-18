'use client';

import { createContext, useContext, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { trackPageView } from '@/utils/analyticsTracker';

// Create the analytics context
const AnalyticsContext = createContext({});

export function AnalyticsProvider({ children }) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  
  // Track page view when the pathname changes or user authentication state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Don't track page views during development to avoid flooding the database
      if (process.env.NODE_ENV === 'production') {
        trackPageView(pathname, isAuthenticated ? user?.id : null);
      }
    }
  }, [pathname, isAuthenticated, user]);
  
  return (
    <AnalyticsContext.Provider value={{}}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// Custom hook to use the analytics context
export const useAnalytics = () => useContext(AnalyticsContext); 