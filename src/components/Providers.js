'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { RoadmapModalProvider } from '@/contexts/RoadmapModalContext';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';
import { SponsorModalProvider } from '@/contexts/SponsorModalContext';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <RoadmapModalProvider>
        <AnalyticsProvider>
          <SponsorModalProvider>
            {children}
          </SponsorModalProvider>
        </AnalyticsProvider>
      </RoadmapModalProvider>
    </AuthProvider>
  );
} 