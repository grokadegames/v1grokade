'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';

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
    <div className="min-h-screen bg-grok-dark text-white">
      <AuthNavbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <button 
                onClick={logout}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Logout
              </button>
            </div>
            
            <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl mb-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-24 h-24 bg-grok-purple rounded-full flex items-center justify-center text-4xl font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user?.name || 'User'}</h2>
                  <p className="text-grok-text-secondary">{user?.email || 'user@example.com'}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-grok-purple text-xs rounded-full">Level 1</span>
                    <span className="px-3 py-1 bg-gray-700 text-xs rounded-full">New Member</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Games Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Games</h2>
              <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl">
                <p className="text-center py-8 text-grok-text-secondary">
                  You haven't added any games yet. 
                  <button className="text-purple-500 hover:text-purple-400 ml-2">
                    Submit your first game
                  </button>
                </p>
              </div>
            </div>
            
            {/* Favorites Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Favorites</h2>
              <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl">
                <p className="text-center py-8 text-grok-text-secondary">
                  You haven't favorited any games yet. 
                  <button className="text-purple-500 hover:text-purple-400 ml-2">
                    Explore games
                  </button>
                </p>
              </div>
            </div>
            
            {/* Achievements Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Achievements</h2>
              <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">First Login</h3>
                    <p className="text-xs text-grok-text-secondary">Welcome to Grokade!</p>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg text-center opacity-40">
                    <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">First Game</h3>
                    <p className="text-xs text-grok-text-secondary">Submit your first game</p>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg text-center opacity-40">
                    <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">First Favorite</h3>
                    <p className="text-xs text-grok-text-secondary">Add a game to favorites</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Account Security Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Account Security</h2>
              <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Password</label>
                    <input 
                      type="password" 
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <input 
                      type="password" 
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
} 