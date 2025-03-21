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
import UserPasswordTool from '@/components/admin/UserPasswordTool';
import UserDisplayNameForm from '@/components/dashboard/UserDisplayNameForm';
import AchievementItem from '@/components/dashboard/AchievementItem';

export default function Dashboard() {
  const { user, loading, logout, isAuthenticated, isLoggingOut, isAdmin } = useAuth();
  const router = useRouter();
  const profileImageUploaderRef = useRef(null);
  const [imageUpdated, setImageUpdated] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  const [activeTab, setActiveTab] = useState('profile');
  const [achievements, setAchievements] = useState({});
  const [achievementsLoaded, setAchievementsLoaded] = useState(false);

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left sidebar - user info and profile */}
              <div className="lg:col-span-1 flex flex-col">
                {/* Profile sections grouped together */}
                <div className="bg-gray-900 rounded-xl p-6 mb-6">
                  <h2 className="text-xl font-bold text-white mb-4">Your Profile</h2>
                  
                  {/* User profile card */}
                  <div className="flex items-center mb-6">
                    <div 
                      className="w-16 h-16 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center text-white text-2xl font-bold mr-4 cursor-pointer"
                      onClick={() => document.getElementById('hidden-file-input')?.click()}
                    >
                      {user?.profileImageUrl ? (
                        <img 
                          src={`${user.profileImageUrl}?t=${imageTimestamp}`} 
                          alt={user?.displayName || user?.username} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user?.displayName?.charAt(0) || user?.username?.charAt(0) || '?'
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{user?.displayName || user?.username}</h2>
                      <p className="text-gray-400">@{user?.username}</p>
                      <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
                    </div>
                  </div>
                  
                  {/* Hidden profile image uploader */}
                  <ProfileImageUploader 
                    minimal={true} 
                    id="profile-image-upload" 
                    onUploadSuccess={handleImageUpdate}
                  />
                  
                  {/* Tabs for profile sections */}
                  <div className="border-t border-gray-800 pt-4 mt-4">
                    <div className="flex justify-center space-x-12 mb-4 border-b border-gray-800">
                      <button 
                        onClick={() => setActiveTab('profile')}
                        className={`pb-3 px-3 ${activeTab === 'profile' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
                        title="Personal Info"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => setActiveTab('security')}
                        className={`pb-3 px-3 ${activeTab === 'security' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
                        title="Account Security"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => setActiveTab('image')}
                        className={`pb-3 px-3 ${activeTab === 'image' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
                        title="Profile Image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Tab content */}
                    <div className="py-2">
                      {activeTab === 'profile' && (
                        <>
                          <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                          <p className="text-sm text-gray-400 mb-4">Update your full name that appears on your profile</p>
                          <UserDisplayNameForm />
                          
                          <div className="mt-6">
                            <p className="text-gray-400 mb-1 font-medium">Account Type:</p>
                            <div className="flex flex-wrap gap-2">
                              {(() => {
                                // Create a Set of unique roles
                                const uniqueRoles = new Set();
                                
                                // Add primary role if it exists
                                if (user?.role) {
                                  uniqueRoles.add(user.role);
                                }
                                
                                // Add roles from the roles array if it exists
                                if (user?.roles && Array.isArray(user.roles)) {
                                  user.roles.forEach(roleObj => {
                                    if (roleObj.role) {
                                      uniqueRoles.add(roleObj.role);
                                    }
                                  });
                                }
                                
                                // Convert Set back to array and render
                                return Array.from(uniqueRoles).map(role => (
                                  <span 
                                    key={role} 
                                    className="bg-purple-600/20 text-purple-400 text-xs px-2 py-1 rounded-full"
                                  >
                                    {role}
                                  </span>
                                ));
                              })()}
                            </div>
                          </div>
                        </>
                      )}
                      
                      {activeTab === 'security' && (
                        <>
                          <h3 className="text-lg font-semibold mb-4">Account Security</h3>
                          <ChangePasswordForm />
                        </>
                      )}
                      
                      {activeTab === 'image' && (
                        <>
                          <h3 className="text-lg font-semibold mb-4">Profile Image</h3>
                          <p className="text-gray-400 mb-4">Upload a professional photo for your profile</p>
                          <div className="flex flex-col items-center mb-4">
                            <div 
                              className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 mb-4 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity hover:ring-2 hover:ring-purple-400 relative group"
                              onClick={() => document.getElementById('hidden-file-input')?.click()}
                              title="Click to change profile photo"
                            >
                              {user?.profileImageUrl ? (
                                <img src={`${user.profileImageUrl}?t=${imageTimestamp}`} alt="Current profile" className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-white text-5xl font-bold">
                                  {user?.displayName?.charAt(0) || user?.username?.charAt(0) || '?'}
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                            </div>
                            <p className="text-sm text-gray-400">
                              Click the image above to upload a new photo
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Max size: 5MB. Recommended: Square image.
                            </p>
                            
                            {/* Hidden file input for profile image upload */}
                            <input
                              type="file"
                              id="hidden-file-input"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  // Trigger the upload function from ProfileImageUploader
                                  const fileInput = document.getElementById('profile-image-upload');
                                  if (fileInput) {
                                    const dataTransfer = new DataTransfer();
                                    dataTransfer.items.add(e.target.files[0]);
                                    fileInput.files = dataTransfer.files;
                                    
                                    // Dispatch change event to trigger the onChange handler
                                    const event = new Event('change', { bubbles: true });
                                    fileInput.dispatchEvent(event);
                                  }
                                }
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main content area - right side */}
              <div className="lg:col-span-2">
                {/* Admin Section - Only visible to admins */}
                {isAdmin && (
                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Admin Tools</h2>
                    <UserPasswordTool />
                  </section>
                )}
                
                {/* Achievements Section - Moved to top */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Achievements</h2>
                  <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <AchievementItem
                        id="first_login"
                        title="First Login"
                        description="Welcome to Grokade!"
                        isUnlocked={achievements.first_login}
                        onUnlock={handleAchievementUnlock}
                        icon={null}
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        }
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        }
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        }
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        }
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                        }
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        }
                      />
                      
                      <AchievementItem
                        id="game_creator"
                        title="Game Creator"
                        description="Submit your first game"
                        linkText="Submit a Game"
                        linkUrl="/"
                        isUnlocked={achievements.game_creator}
                        onUnlock={handleAchievementUnlock}
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        }
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        }
                      />
                    </div>
                  </div>
                </div>
                
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