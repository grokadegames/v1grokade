'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import WorkProfileActivation from '@/components/dashboard/WorkProfileActivation';
import TalentProfileForm from '@/components/dashboard/TalentProfileForm';
import ProfileImageUpload, { ProfileImageUpload as ProfileImageUploader } from '@/components/dashboard/ProfileImageUpload';

export default function Dashboard() {
  const { user, loading, logout, isAuthenticated, isLoggingOut } = useAuth();
  const router = useRouter();
  const profileImageUploaderRef = useRef(null);
  const [imageUpdated, setImageUpdated] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());

  // Force profile image to reload when updated
  const handleImageUpdate = useCallback(() => {
    setImageUpdated(true);
    setImageTimestamp(Date.now());
    // Force a refresh after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoggingOut) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router, isLoggingOut]);

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

  if (!isAuthenticated && !isLoggingOut) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-grok-dark text-white">
      <AuthNavbar />
      <div className="container mx-auto px-4 pt-16 pb-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left sidebar - user info and profile */}
              <div className="lg:col-span-1 flex flex-col">
                {/* Profile sections grouped together */}
                <div className="bg-gray-900 rounded-xl p-6 mb-6">
                  <h2 className="text-xl font-bold text-white mb-4">Your Profile</h2>
                  
                  {/* User profile card */}
                  <div className="flex items-center mb-6">
                    <div 
                      className="w-16 h-16 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center text-white text-2xl font-bold mr-4 cursor-pointer hover:opacity-80 transition-opacity hover:ring-2 hover:ring-purple-400 relative group"
                      onClick={() => document.getElementById('profile-image-upload').click()}
                      title="Click to change profile photo"
                    >
                      {user?.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt={user?.displayName || user?.username} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user?.displayName?.charAt(0) || user?.username?.charAt(0) || '?'
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{user?.displayName || user?.username}</h2>
                      <p className="text-gray-400">@{user?.username}</p>
                    </div>
                  </div>
                  
                  {/* Hidden profile image uploader */}
                  <ProfileImageUploader 
                    minimal={true} 
                    id="profile-image-upload" 
                    onUploadSuccess={handleImageUpdate}
                  />
                  
                  {/* Account details */}
                  <div className="border-t border-gray-800 pt-4 mt-4">
                    <p className="text-gray-400 mb-1">Email:</p>
                    <p className="text-white mb-4">{user?.email}</p>
                    
                    <p className="text-gray-400 mb-1">Account Type:</p>
                    <div className="flex flex-wrap gap-2">
                      {user?.role && (
                        <span className="bg-purple-600/20 text-purple-400 text-xs px-2 py-1 rounded-full">
                          {user.role}
                        </span>
                      )}
                      {user?.roles?.map(role => (
                        <span 
                          key={role.role} 
                          className="bg-purple-600/20 text-purple-400 text-xs px-2 py-1 rounded-full"
                        >
                          {role.role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Account Security Section - moved to sidebar */}
                <div className="bg-gray-900 rounded-xl p-6 mb-6">
                  <h2 className="text-xl font-bold text-white mb-3">Account Security</h2>
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
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 w-full"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
                
                {/* Profile Image Upload */}
                <ProfileImageUpload />
              </div>
              
              {/* Main content area - right side */}
              <div className="lg:col-span-2">
                {/* Work Profile Section */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Work Profile</h2>
                  
                  {/* Work Profile Activation */}
                  <WorkProfileActivation />
                  
                  {/* Talent Profile Form */}
                  <TalentProfileForm />
                </section>
                
                {/* Content Sections grouped by type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {/* Games Section */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Your Games</h2>
                    <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl h-full">
                      <p className="text-center py-8 text-grok-text-secondary">
                        You haven't added any games yet. 
                        <button className="text-purple-500 hover:text-purple-400 ml-2">
                          Submit your first game
                        </button>
                      </p>
                    </div>
                  </div>
                  
                  {/* Favorites Section */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Favorites</h2>
                    <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl h-full">
                      <p className="text-center py-8 text-grok-text-secondary">
                        You haven't favorited any games yet. 
                        <button className="text-purple-500 hover:text-purple-400 ml-2">
                          Explore games
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Visual separator */}
                <div className="border-t border-gray-800 my-8"></div>
                
                {/* Achievements Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Achievements</h2>
                  <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="font-medium mb-1">First Login</h3>
                        <p className="text-xs text-grok-text-secondary">Welcome to Grokade!</p>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-lg text-center opacity-40 hover:opacity-60 transition-opacity">
                        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h3 className="font-medium mb-1">Rankings Explorer</h3>
                        <p className="text-xs text-grok-text-secondary">Visit the rankings page to see top performing games</p>
                        <Link href="/rankings" className="mt-2 text-xs text-purple-400 hover:text-purple-300 inline-block">
                          View Rankings
                        </Link>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-lg text-center opacity-40 hover:opacity-60 transition-opacity">
                        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </div>
                        <h3 className="font-medium mb-1">Game Browser</h3>
                        <p className="text-xs text-grok-text-secondary">Browse through the games on Grokade</p>
                        <Link href="/" className="mt-2 text-xs text-purple-400 hover:text-purple-300 inline-block">
                          Browse Games
                        </Link>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-lg text-center opacity-40 hover:opacity-60 transition-opacity">
                        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <h3 className="font-medium mb-1">Game Explorer</h3>
                        <p className="text-xs text-grok-text-secondary">View a game's details page</p>
                        <Link href="/game/bbbf2d80-4dba-4faf-a777-09cb88159bc1" className="mt-2 text-xs text-purple-400 hover:text-purple-300 inline-block">
                          Try a Game
                        </Link>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-lg text-center opacity-40 hover:opacity-60 transition-opacity">
                        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="font-medium mb-1">Game Player</h3>
                        <p className="text-xs text-grok-text-secondary">Play a game from the game detail page</p>
                        <Link href="/game/bbbf2d80-4dba-4faf-a777-09cb88159bc1" className="mt-2 text-xs text-purple-400 hover:text-purple-300 inline-block">
                          Play Now
                        </Link>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-lg text-center opacity-40 hover:opacity-60 transition-opacity">
                        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                        </div>
                        <h3 className="font-medium mb-1">Game Reviewer</h3>
                        <p className="text-xs text-grok-text-secondary">Like or dislike a game on the game detail page</p>
                        <Link href="/game/bbbf2d80-4dba-4faf-a777-09cb88159bc1" className="mt-2 text-xs text-purple-400 hover:text-purple-300 inline-block">
                          Rate a Game
                        </Link>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-lg text-center opacity-40 hover:opacity-60 transition-opacity">
                        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="font-medium mb-1">Game Networker</h3>
                        <p className="text-xs text-grok-text-secondary">Contact a game's author after liking their game</p>
                        <Link href="/game/bbbf2d80-4dba-4faf-a777-09cb88159bc1" className="mt-2 text-xs text-purple-400 hover:text-purple-300 inline-block">
                          Find Authors
                        </Link>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-lg text-center opacity-40 hover:opacity-60 transition-opacity">
                        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <h3 className="font-medium mb-1">Game Creator</h3>
                        <p className="text-xs text-grok-text-secondary">Submit your first game</p>
                        <Link href="/submit" className="mt-2 text-xs text-purple-400 hover:text-purple-300 inline-block">
                          Submit a Game
                        </Link>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-lg text-center opacity-40 hover:opacity-60 transition-opacity">
                        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                        <h3 className="font-medium mb-1">First Favorite</h3>
                        <p className="text-xs text-grok-text-secondary">Add a game to favorites</p>
                        <Link href="/game/bbbf2d80-4dba-4faf-a777-09cb88159bc1" className="mt-2 text-xs text-purple-400 hover:text-purple-300 inline-block">
                          Find Favorites
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
} 