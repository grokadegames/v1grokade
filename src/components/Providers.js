'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { RoadmapModalProvider } from '@/contexts/RoadmapModalContext';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <RoadmapModalProvider>
        {children}
      </RoadmapModalProvider>
    </AuthProvider>
  );
} 