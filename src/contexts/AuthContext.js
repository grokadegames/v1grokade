'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Create the auth context
const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in
    async function loadUserFromCookie() {
      try {
        console.log('[Auth] Checking if user is logged in...');
        const response = await fetch('/api/auth/me', {
          // Add cache: 'no-store' to prevent caching issues on Netlify
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('[Auth] User found:', data.user?.username);
          setUser(data.user);
        } else {
          console.log('[Auth] No user logged in');
        }
      } catch (error) {
        console.error('[Auth] Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserFromCookie();
  }, []);

  const login = async (username, password) => {
    try {
      console.log('[Auth] Attempting login for:', username);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ username, password }),
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[Auth] Login failed:', data.message);
        throw new Error(data.message || 'Login failed');
      }

      console.log('[Auth] Login successful, fetching user data');
      
      // Fetch user data after successful login
      const userResponse = await fetch('/api/auth/me', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('[Auth] User data retrieved:', userData.user?.username);
        setUser(userData.user);
        
        // Add a slight delay before redirecting to ensure state has updated
        setTimeout(() => {
          console.log('[Auth] Redirecting to home page');
          router.push('/');
        }, 500);
      } else {
        console.error('[Auth] Failed to fetch user data after login');
      }

      return { success: true };
    } catch (error) {
      console.error('[Auth] Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (username, email, displayName, password) => {
    try {
      console.log('[Auth] Attempting registration for:', username);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, displayName, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[Auth] Registration failed:', data.message);
        throw new Error(data.message || 'Registration failed');
      }

      console.log('[Auth] Registration successful, redirecting to home page');
      // Redirect to home page after successful registration
      router.push('/?registered=true');
      return { success: true };
    } catch (error) {
      console.error('[Auth] Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      console.log('[Auth] Attempting logout');
      
      // Set logging out flag to prevent login redirect
      setIsLoggingOut(true);
      
      // Perform the logout on the server first
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache',
        },
        cache: 'no-store',
      });

      // Clear the user state locally AFTER server request
      setUser(null);
      
      // Log result but continue with redirect regardless
      if (!response.ok) {
        console.error('[Auth] Logout failed on server');
      } else {
        console.log('[Auth] Logout successful on server');
      }
      
      // IMPORTANT: Use replace instead of push to avoid history issues
      console.log('[Auth] Redirecting to home page after logout');
      router.replace('/');
      
      // Reset logging out flag after a delay to ensure redirect completes
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 1000);
    } catch (error) {
      console.error('[Auth] Logout error:', error);
      // Still clear user state and redirect even if server logout fails
      setUser(null);
      router.replace('/');
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 1000);
    }
  };

  // Helper functions for checking user roles
  const isAdmin = !!user && (user.allRoles?.includes('ADMIN') || false);
  const isSponsor = !!user && (user.allRoles?.includes('SPONSOR') || false);
  const isAuthor = !!user && (user.allRoles?.includes('AUTHOR') || false);
  const isEmployer = !!user && (user.allRoles?.includes('EMPLOYER') || false);
  const isApplicant = !!user && (user.allRoles?.includes('APPLICANT') || false);
  const isBasic = !!user && (user.allRoles?.includes('BASIC') || false);

  // Check if user has a specific role
  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.allRoles?.includes(requiredRole) || false;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (requiredRoles) => {
    if (!user || !user.allRoles) return false;
    return requiredRoles.some(role => user.allRoles.includes(role));
  };

  // Check if user has all of the specified roles
  const hasAllRoles = (requiredRoles) => {
    if (!user || !user.allRoles) return false;
    return requiredRoles.every(role => user.allRoles.includes(role));
  };

  // Function to refresh user data
  const refreshUser = async () => {
    try {
      console.log('[Auth] Refreshing user data');
      
      // Make sure we have an auth token before even trying to refresh
      const cookiesStr = document.cookie;
      if (!cookiesStr.includes('auth_token=')) {
        console.log('[Auth] No auth token found, skipping refresh');
        return false;
      }
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('[Auth] User data refreshed:', data.user?.username);
        
        // Only update user state if we actually got valid user data
        if (data.user && data.user.id) {
          // Use function form to ensure we're not depending on stale state
          setUser(currentUser => {
            // Merge the new data with existing data to preserve any fields
            // that might not be returned by the API
            return { ...currentUser, ...data.user };
          });
          return true;
        } else {
          console.warn('[Auth] Refresh returned ok but no valid user data');
          return false;
        }
      } else {
        console.error('[Auth] Failed to refresh user data, status:', response.status);
        // Don't modify user state if refresh fails
        return false;
      }
    } catch (error) {
      console.error('[Auth] Error refreshing user data:', error);
      // Don't modify user state on error
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isLoggingOut,
        // Role helpers
        isAdmin,
        isSponsor,
        isAuthor,
        isEmployer,
        isApplicant,
        isBasic,
        hasRole,
        hasAnyRole,
        hasAllRoles
      }}
      data-auth-provider="true"
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext); 