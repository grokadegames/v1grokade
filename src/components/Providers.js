'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { RoadmapModalProvider } from '@/contexts/RoadmapModalContext';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';
import { SponsorModalProvider } from '@/contexts/SponsorModalContext';
import { ToastProvider } from '@/contexts/ToastContext';
import Toast from '@/components/Toast';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <RoadmapModalProvider>
        <AnalyticsProvider>
          <SponsorModalProvider>
            <ToastProvider>
              {children}
              <Toast />
            </ToastProvider>
          </SponsorModalProvider>
        </AnalyticsProvider>
      </RoadmapModalProvider>
    </AuthProvider>
  );
} 