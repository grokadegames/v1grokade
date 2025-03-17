'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RoadmapRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the home page
    router.push('/');
  }, [router]);
  
  return (
    <div className="min-h-screen bg-grok-darker flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Redirecting...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
      </div>
    </div>
  );
} 