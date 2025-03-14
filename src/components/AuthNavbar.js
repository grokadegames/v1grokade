'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="border-b border-gray-800 bg-gray-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <span className="text-purple-500">GROK</span>
              <span className="text-white">ADE</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/games" className="text-white hover:text-purple-500 transition-colors">Games</Link>
            <Link href="/gigs" className="text-white hover:text-purple-500 transition-colors">Gigs</Link>
            <Link href="/talent" className="text-white hover:text-purple-500 transition-colors">Talent</Link>
            <Link href="/rankings" className="text-white hover:text-purple-500 transition-colors">Rankings</Link>
            <Link href="/competitions" className="text-white hover:text-purple-500 transition-colors">Competitions</Link>
            <Link href="/about" className="text-white hover:text-purple-500 transition-colors">About</Link>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                  Dashboard
                </Link>
                <button 
                  onClick={logout}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-white hover:text-purple-500 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/games" 
                className="text-white hover:text-purple-500 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Games
              </Link>
              <Link 
                href="/gigs" 
                className="text-white hover:text-purple-500 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Gigs
              </Link>
              <Link 
                href="/talent" 
                className="text-white hover:text-purple-500 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Talent
              </Link>
              <Link 
                href="/rankings" 
                className="text-white hover:text-purple-500 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Rankings
              </Link>
              <Link 
                href="/competitions" 
                className="text-white hover:text-purple-500 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Competitions
              </Link>
              <Link 
                href="/about" 
                className="text-white hover:text-purple-500 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="pt-2 flex flex-col space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="bg-gray-800 text-white px-4 py-2 rounded-md text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md text-center"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link 
                    href="/login" 
                    className="bg-purple-600 text-white px-4 py-2 rounded-md text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 