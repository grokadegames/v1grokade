'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Create the auth context
const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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

      console.log('[Auth] Registration successful, redirecting to login');
      // Redirect to login page after successful registration
      router.push('/login?registered=true');
      return { success: true };
    } catch (error) {
      console.error('[Auth] Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      console.log('[Auth] Attempting logout');
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        console.log('[Auth] Logout successful');
        setUser(null);
        router.push('/');
      } else {
        console.error('[Auth] Logout failed');
      }
    } catch (error) {
      console.error('[Auth] Logout error:', error);
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
        isAuthenticated: !!user 
      }}
      data-auth-provider="true"
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext); 