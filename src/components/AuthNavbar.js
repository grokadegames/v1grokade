'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLoginClick = (e) => {
    e.preventDefault();
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-grok-darker">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold flex items-center">
              <span className="text-purple-500">GROK</span>
              <span className="text-white">ADE</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-purple-500 transition-colors text-sm">Games</Link>
            <Link href="/gigs" className="text-white hover:text-purple-500 transition-colors text-sm">Gigs</Link>
            <Link href="/talent" className="text-white hover:text-purple-500 transition-colors text-sm">Talent</Link>
            <Link href="/rankings" className="text-white hover:text-purple-500 transition-colors text-sm">Rankings</Link>
            <Link href="/competitions" className="text-white hover:text-purple-500 transition-colors text-sm">Competitions</Link>
            <Link href="/about" className="text-white hover:text-purple-500 transition-colors text-sm">About</Link>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/roadmap" className="bg-black border-2 border-orange-500 text-orange-500 px-3 py-1 rounded-md flex items-center hover:bg-orange-500 hover:text-black transition-colors duration-300 text-sm">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17H7V13H3V17ZM10 17H14V8H10V17ZM17 17H21V3H17V17Z" fill="currentColor" />
              </svg>
              Roadmap
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard" className="bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700 text-sm">
                  Dashboard
                </Link>
                <button 
                  onClick={logout}
                  className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLoginClick}
                className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 text-sm"
              >
                Login
              </button>
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
          <div className="md:hidden mt-2 pb-3">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="text-white hover:text-purple-500 transition-colors px-2 py-1 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Games
              </Link>
              <Link 
                href="/gigs" 
                className="text-white hover:text-purple-500 transition-colors px-2 py-1 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Gigs
              </Link>
              <Link 
                href="/talent" 
                className="text-white hover:text-purple-500 transition-colors px-2 py-1 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Talent
              </Link>
              <Link 
                href="/rankings" 
                className="text-white hover:text-purple-500 transition-colors px-2 py-1 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Rankings
              </Link>
              <Link 
                href="/competitions" 
                className="text-white hover:text-purple-500 transition-colors px-2 py-1 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Competitions
              </Link>
              <Link 
                href="/about" 
                className="text-white hover:text-purple-500 transition-colors px-2 py-1 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="pt-2 flex flex-col space-y-2">
                <Link 
                  href="/roadmap" 
                  className="bg-black border-2 border-orange-500 text-orange-500 px-3 py-1 rounded-md flex items-center justify-center hover:bg-orange-500 hover:text-black transition-colors duration-300 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 17H7V13H3V17ZM10 17H14V8H10V17ZM17 17H21V3H17V17Z" fill="currentColor" />
                  </svg>
                  Roadmap
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="bg-gray-800 text-white px-3 py-1 rounded-md text-center text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="bg-purple-600 text-white px-3 py-1 rounded-md text-center text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      router.push('/login');
                    }}
                    className="bg-purple-600 text-white px-3 py-1 rounded-md text-center text-sm"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 