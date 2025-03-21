'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import WorkProfileActivation from '@/components/dashboard/WorkProfileActivation';
import TalentProfileForm from '@/components/dashboard/TalentProfileForm';
import ProfileImageUpload, { ProfileImageUpload as ProfileImageUploader } from '@/components/dashboard/ProfileImageUpload';
import UserPasswordTool from '@/components/admin/UserPasswordTool';
import AchievementItem from '@/components/dashboard/AchievementItem';
import { HiUserCircle } from 'react-icons/hi';

// Main dashboard page component
export default function Dashboard() {
  const { user, loading, logout, isAuthenticated, isLoggingOut, isAdmin, refreshUser, setUser, hasRole } = useAuth();
  const router = useRouter();
  const profileImageUploaderRef = useRef(null);
  const [imageUpdated, setImageUpdated] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  const [activeTab, setActiveTab] = useState('profile');
  const [achievements, setAchievements] = useState({});
  const [achievementsLoaded, setAchievementsLoaded] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [nameUpdateStatus, setNameUpdateStatus] = useState({ 
    loading: false, 
    error: null,
    success: false,
    message: null
  });
  const displayNameInputRef = useRef(null);

  // Force profile image to reload when updated
  const handleImageUpdate = useCallback(() => {
    setImageUpdated(true);
    setImageTimestamp(Date.now());
    // Force a refresh after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }, []);

  // Load user's achievements
  useEffect(() => {
    async function loadAchievements() {
      if (!isAuthenticated) return;
      
      try {
        const response = await fetch('/api/achievements');
        if (response.ok) {
          const data = await response.json();
          setAchievements(data.achievements || {});
        }
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setAchievementsLoaded(true);
      }
    }
    
    loadAchievements();
  }, [isAuthenticated]);

  // Function to handle achievement unlocks
  const handleAchievementUnlock = useCallback((achievementId) => {
    setAchievements(prev => ({
      ...prev,
      [achievementId]: true
    }));
  }, []);

  // Unlock "first_login" achievement on first visit
  useEffect(() => {
    async function unlockFirstLoginAchievement() {
      if (isAuthenticated && achievementsLoaded && !achievements.first_login) {
        try {
          await fetch('/api/achievements', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ achievementId: 'first_login' }),
          });
          
          handleAchievementUnlock('first_login');
        } catch (error) {
          console.error('Error unlocking first login achievement:', error);
        }
      }
    }
    
    unlockFirstLoginAchievement();
  }, [isAuthenticated, achievementsLoaded, achievements.first_login, handleAchievementUnlock]);

  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoggingOut) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router, isLoggingOut]);

  // Initialize display name when user data is loaded
  useEffect(() => {
    if (user?.displayName) {
      setNewDisplayName(user.displayName);
    }
  }, [user?.displayName]);
  
  // Focus the input when entering edit mode
  useEffect(() => {
    if (isEditingName && displayNameInputRef.current) {
      displayNameInputRef.current.focus();
    }
  }, [isEditingName]);
  
  // Function to handle saving the display name
  const handleSaveDisplayName = async () => {
    // Simple validation
    const trimmedName = newDisplayName.trim();
    
    if (!trimmedName) {
      setNameUpdateStatus({ loading: false, error: 'Display name cannot be empty' });
      return;
    }
    
    setNameUpdateStatus({ loading: true, error: null });
    
    try {
      // Send update request to API
      const response = await fetch('/api/users/displayname', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: trimmedName }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update display name');
      }
      
      // Success - update local UI 
      setNameUpdateStatus({ loading: false, error: null, success: true, message: 'Display name updated successfully!' });
      setIsEditingName(false);
      
      // Refresh user data after a short delay
      setTimeout(() => {
        refreshUser();
      }, 500);
      
      // Clear success message after a delay
      setTimeout(() => {
        setNameUpdateStatus({ loading: false, error: null, success: false, message: null });
      }, 3000);
      
    } catch (error) {
      console.error('Error updating display name:', error);
      setNameUpdateStatus({ loading: false, error: error.message || 'An error occurred', success: false, message: null });
    }
  };

  // Add a loading state for logout process
  if (isLoggingOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-lg text-white">Logging out...</p>
        </div>
      </div>
    );
  }

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
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <div className="container mx-auto px-4 pt-16 pb-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left sidebar - user info and profile */}
              <div className="lg:col-span-1 flex flex-col">
                {/* Profile sections grouped together */}
                <div className="bg-gray-900 rounded-xl p-5 mb-6">
                  {/* User profile header - more compact */}
                  <div className="flex items-center mb-3">
                    <div 
                      className="w-14 h-14 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center text-white text-xl font-bold mr-3 cursor-pointer"
                      onClick={() => profileImageUploaderRef.current && profileImageUploaderRef.current()}
                    >
                      {user?.profileImageUrl ? (
                        <img 
                          src={`${user.profileImageUrl}?t=${imageTimestamp}`} 
                          alt={user?.displayName || user?.username} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>
                          {typeof user?.displayName === 'string' && user.displayName.length > 0 
                            ? user.displayName.charAt(0) 
                            : typeof user?.username === 'string' && user.username.length > 0 
                              ? user.username.charAt(0) 
                              : '?'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {isEditingName ? (
                        <div className="relative">
                          <input
                            ref={displayNameInputRef}
                            type="text"
                            value={newDisplayName}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                            className="text-lg font-bold bg-transparent text-white border-b border-purple-500 focus:outline-none focus:border-purple-300 w-full"
                            placeholder="Your display name"
                            maxLength={50}
                            aria-label="Edit display name"
                          />
                          <div className="flex mt-2 space-x-2">
                            <button
                              onClick={() => {
                                if (newDisplayName.trim()) {
                                  handleSaveDisplayName();
                                }
                              }}
                              disabled={nameUpdateStatus.loading}
                              className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded"
                            >
                              {nameUpdateStatus.loading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={() => {
                                setIsEditingName(false);
                                setNewDisplayName(user?.displayName || '');
                                setNameUpdateStatus({ loading: false, error: null, success: false, message: null });
                              }}
                              className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                          {nameUpdateStatus.loading && (
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                              <div className="animate-spin h-4 w-4 border-2 border-purple-500 rounded-full border-t-transparent"></div>
                            </div>
                          )}
                          {nameUpdateStatus.error && (
                            <p className="text-red-400 text-xs mt-1">{nameUpdateStatus.error}</p>
                          )}
                          {nameUpdateStatus.success && (
                            <p className="text-green-400 text-xs mt-1">{nameUpdateStatus.message}</p>
                          )}
                        </div>
                      ) : (
                        <h2 
                          className="text-lg font-bold text-white hover:text-purple-300 cursor-pointer group relative truncate"
                          onClick={() => setIsEditingName(true)}
                          title={user?.displayName || user?.username}
                        >
                          {user?.displayName || user?.username}
                          <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400 text-xs">
                            ✏️
                          </span>
                          {nameUpdateStatus.success && (
                            <span className="ml-1 text-green-400 text-xs animate-fadeOut">
                              ✓
                            </span>
                          )}
                        </h2>
                      )}
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-gray-400 text-sm truncate">@{user?.username}</p>
                        <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hidden profile image uploader */}
                  <ProfileImageUploader 
                    minimal={true} 
                    triggerRef={profileImageUploaderRef}
                    onUploadSuccess={handleImageUpdate}
                  />
                  
                  {/* Status indicators - now horizontal badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></div>
                      Active
                    </div>
                    
                    {user.allRoles && user.allRoles.map((role, index) => {
                      // Skip showing BASIC role if user has other roles
                      if (role === 'BASIC' && user.allRoles.length > 1) return null;
                      
                      // Define colors and icons for each role type
                      const roleConfig = {
                        ADMIN: { bg: "bg-purple-500/20", text: "text-purple-400", dot: "bg-purple-400" },
                        AUTHOR: { bg: "bg-blue-500/20", text: "text-blue-400", dot: "bg-blue-400" },
                        APPLICANT: { bg: "bg-yellow-500/20", text: "text-yellow-400", dot: "bg-yellow-400" },
                        EMPLOYER: { bg: "bg-green-500/20", text: "text-green-400", dot: "bg-green-400" }, 
                        SPONSOR: { bg: "bg-pink-500/20", text: "text-pink-400", dot: "bg-pink-400" },
                        BASIC: { bg: "bg-gray-500/20", text: "text-gray-400", dot: "bg-gray-400" }
                      };
                      
                      const config = roleConfig[role] || roleConfig.BASIC;
                      
                      return (
                        <div 
                          key={`role-${index}`} 
                          className={`px-2 py-1 rounded-full ${config.bg} ${config.text} text-xs font-medium flex items-center`}
                        >
                          <div className={`w-2 h-2 rounded-full ${config.dot} mr-1.5`}></div>
                          {role.charAt(0) + role.slice(1).toLowerCase()}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Tabs for profile sections - cleaner design */}
                  <div className="border-t border-gray-800 pt-3 mt-2">
                    <div className="flex justify-around mb-3">
                      <button 
                        onClick={() => setActiveTab('profile')}
                        className={`flex flex-col items-center ${activeTab === 'profile' ? 'text-purple-500' : 'text-gray-400 hover:text-white'}`}
                        title="Personal Info"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-xs mt-1">Profile</span>
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('security')}
                        className={`flex flex-col items-center ${activeTab === 'security' ? 'text-purple-500' : 'text-gray-400 hover:text-white'}`}
                        title="Account Security"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-xs mt-1">Security</span>
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('image')}
                        className={`flex flex-col items-center ${activeTab === 'image' ? 'text-purple-500' : 'text-gray-400 hover:text-white'}`}
                        title="Profile Image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs mt-1">Image</span>
                      </button>
                    </div>
                    
                    {/* Tab contents - more compact */}
                    <div className="mt-3">
                      {/* Profile Info */}
                      <div className={`${activeTab === 'profile' ? 'block' : 'hidden'}`}>
                        <div className="mb-3">
                          <WorkProfileActivation />
                        </div>
                      </div>
                      
                      {/* Security settings */}
                      <div className={`${activeTab === 'security' ? 'block' : 'hidden'}`}>
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <h3 className="text-sm font-medium mb-2">Change Password</h3>
                          <ChangePasswordForm />
                  </div>
                </div>
                
                      {/* Profile Image Tab */}
                      {activeTab === 'image' && (
                        <div className="p-4 rounded-xl bg-gray-800/30">
                          <ProfileImageUpload />
                    </div>
                      )}
                    </div>
                    </div>
                </div>
              </div>
              
              {/* Main content area - right side */}
              <div className="lg:col-span-2">
                {/* Achievements Section - Moved to top */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Achievements</h2>
                  <div className="bg-black bg-opacity-50 backdrop-blur-sm p-4 rounded-xl">
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
                      <AchievementItem
                        id="first_login"
                        title="First Login"
                        description="Welcome to Grokade!"
                        isUnlocked={achievements.first_login}
                        onUnlock={handleAchievementUnlock}
                        icon={null}
                        compact={true}
                      />
                      
                      <AchievementItem
                        id="rankings_explorer"
                        title="Rankings Explorer"
                        description="Visit the rankings page to see top performing games"
                        linkText="View Rankings"
                        linkUrl="/rankings"
                        isUnlocked={achievements.rankings_explorer}
                        onUnlock={handleAchievementUnlock}
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        }
                        compact={true}
                      />
                      
                      <AchievementItem
                        id="game_browser"
                        title="Game Browser"
                        description="Browse through the games on Grokade"
                        linkText="Browse Games"
                        linkUrl="/"
                        isUnlocked={achievements.game_browser}
                        onUnlock={handleAchievementUnlock}
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        }
                        compact={true}
                      />
                      
                      <AchievementItem
                        id="game_explorer"
                        title="Game Explorer"
                        description="View a game's details page"
                        linkText="Try a Game"
                        linkUrl="/game/bbbf2d80-4dba-4faf-a777-09cb88159bc1"
                        isUnlocked={achievements.game_explorer}
                        onUnlock={handleAchievementUnlock}
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        }
                        compact={true}
                      />
                      
                      <AchievementItem
                        id="game_player"
                        title="Game Player"
                        description="Play a game from the game detail page"
                        linkText="Play Now"
                        linkUrl="/game/bbbf2d80-4dba-4faf-a777-09cb88159bc1"
                        isUnlocked={achievements.game_player}
                        onUnlock={handleAchievementUnlock}
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        }
                        compact={true}
                      />
                      
                      <AchievementItem
                        id="game_reviewer"
                        title="Game Reviewer"
                        description="Like or dislike a game on the game detail page"
                        linkText="Rate a Game"
                        linkUrl="/game/bbbf2d80-4dba-4faf-a777-09cb88159bc1"
                        isUnlocked={achievements.game_reviewer}
                        onUnlock={handleAchievementUnlock}
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                        }
                        compact={true}
                      />
                      
                      <AchievementItem
                        id="game_networker"
                        title="Game Networker"
                        description="Contact a game's author after liking their game"
                        linkText="Find Authors"
                        linkUrl="/game/bbbf2d80-4dba-4faf-a777-09cb88159bc1"
                        isUnlocked={achievements.game_networker}
                        onUnlock={handleAchievementUnlock}
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        }
                        compact={true}
                      />
                      
                      <AchievementItem
                        id="game_creator"
                        title="Game Creator"
                        description="Submit your first game"
                        linkText="Submit a Game"
                        linkUrl="/submit"
                        isUnlocked={achievements.game_creator}
                        onUnlock={handleAchievementUnlock}
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        }
                        compact={true}
                      />
                      
                      <AchievementItem
                        id="first_favorite"
                        title="First Favorite"
                        description="Add a game to favorites"
                        linkText="Find Favorites"
                        linkUrl="/game/bbbf2d80-4dba-4faf-a777-09cb88159bc1"
                        isUnlocked={achievements.first_favorite}
                        onUnlock={handleAchievementUnlock}
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        }
                        compact={true}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Admin Section - Only visible to admins */}
                {hasRole('ADMIN') && (
                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Admin Tools</h2>
                    <UserPasswordTool />
                  </section>
                )}
                
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
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
} 