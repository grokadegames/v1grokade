'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-800 bg-grok-darker">
      <div className="container-custom mx-auto py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <span className="text-grok-purple">GROK</span>
              <span className="text-white">ADE</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/games" className="text-white hover:text-grok-purple transition-colors">Games</Link>
            <Link href="/gigs" className="text-white hover:text-grok-purple transition-colors">Gigs</Link>
            <Link href="/talent" className="text-white hover:text-grok-purple transition-colors">Talent</Link>
            <Link href="/rankings" className="text-white hover:text-grok-purple transition-colors">Rankings</Link>
            <Link href="/competitions" className="text-white hover:text-grok-purple transition-colors">Competitions</Link>
            <Link href="/about" className="text-white hover:text-grok-purple transition-colors">About</Link>
            <Link href="/docs" className="text-white hover:text-grok-purple transition-colors">Docs</Link>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/roadmap" className="bg-black border-2 border-orange-500 text-orange-500 px-4 py-2 rounded-md flex items-center hover:bg-orange-500 hover:text-black transition-colors duration-300">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17H7V13H3V17ZM10 17H14V8H10V17ZM17 17H21V3H17V17Z" fill="currentColor" />
              </svg>
              Roadmap
            </Link>
            <Link href="/login" className="bg-grok-purple text-white px-4 py-2 rounded-md hover:bg-opacity-90">
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-white hover:text-grok-purple focus:outline-none"
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
                className="text-white hover:text-grok-purple transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Games
              </Link>
              <Link 
                href="/gigs" 
                className="text-white hover:text-grok-purple transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Gigs
              </Link>
              <Link 
                href="/talent" 
                className="text-white hover:text-grok-purple transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Talent
              </Link>
              <Link 
                href="/rankings" 
                className="text-white hover:text-grok-purple transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Rankings
              </Link>
              <Link 
                href="/competitions" 
                className="text-white hover:text-grok-purple transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Competitions
              </Link>
              <Link 
                href="/about" 
                className="text-white hover:text-grok-purple transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/docs" 
                className="text-white hover:text-grok-purple transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Docs
              </Link>
              <div className="pt-2 flex flex-col space-y-3">
                <Link 
                  href="/roadmap" 
                  className="bg-black border-2 border-orange-500 text-orange-500 px-4 py-2 rounded-md flex items-center justify-center hover:bg-orange-500 hover:text-black transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 17H7V13H3V17ZM10 17H14V8H10V17ZM17 17H21V3H17V17Z" fill="currentColor" />
                  </svg>
                  Roadmap
                </Link>
                <Link 
                  href="/login" 
                  className="bg-grok-purple text-white px-4 py-2 rounded-md text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 