'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RankingsPreviewPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/rankings');
  }, [router]);
  
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
} 