'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-lg text-white">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Grokade
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {user?.displayName}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-white mb-4">Dashboard</h1>
          <div className="bg-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Your Profile</h2>
            {user && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Username</p>
                    <p className="text-white">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Display Name</p>
                    <p className="text-white">{user.displayName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Joined</p>
                    <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Your Games</h2>
            <p className="text-gray-400">You haven&apos;t created any games yet. Start creating now!</p>
            <button className="mt-4 w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition">
              Create Game
            </button>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Favorites</h2>
            <p className="text-gray-400">You haven&apos;t added any games to your favorites yet. Let&apos;s start exploring!</p>
            <Link href="/" className="mt-4 block w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition text-center">
              Browse Games
            </Link>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Achievements</h2>
            <p className="text-gray-400">No achievements earned yet.</p>
            <button className="mt-4 w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition">
              View Challenges
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 