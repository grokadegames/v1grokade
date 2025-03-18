'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { RoadmapModalProvider } from '@/contexts/RoadmapModalContext';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <RoadmapModalProvider>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </RoadmapModalProvider>
    </AuthProvider>
  );
} 