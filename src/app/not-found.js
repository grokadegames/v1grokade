'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-extrabold text-white">Page Not Found</h1>
          <p className="mt-2 text-sm text-gray-400">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex justify-center mt-6">
          <Link 
            href="/" 
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
} 