'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function RoadmapModal({ isOpen, onClose }) {
  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-grok-dark border border-purple-500/50 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="p-8">
          {/* Modal Header */}
          <p className="text-gray-300 mb-4">
            This is the Grokade development roadmap, outlining our progress and future plans.
          </p>
          <h2 className="text-3xl font-bold text-purple-500 mb-8">Development Roadmap</h2>

          {/* Welcome Section */}
          <div className="bg-purple-900/30 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Welcome to Grokade</h3>
            <p className="text-gray-300">
              An AI gaming platform that showcases games built with AI tools like Grok. We connect developers with players, 
              facilitate competitions, and build a vibrant community of AI game enthusiasts. Powered by Next.js, PostgreSQL, and Tailwind CSS.
            </p>
          </div>

          {/* Game Discovery Section */}
          <div className="mb-8 relative pl-8 border-l-2 border-green-500">
            <div className="absolute -left-2 top-0">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500"></span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-white">Game Discovery & Showcase System</h3>
              <span className="bg-green-500 text-black px-2 py-0.5 rounded text-xs font-bold">LIVE</span>
            </div>
            <p className="text-gray-300 mb-3">The core platform for discovering and playing AI-crafted games</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-green-900/50 border border-green-500 text-green-100 px-3 py-1 rounded-full text-sm">Game Library</span>
              <span className="bg-green-900/50 border border-green-500 text-green-100 px-3 py-1 rounded-full text-sm">Game Detail Pages</span>
              <span className="bg-green-900/50 border border-green-500 text-green-100 px-3 py-1 rounded-full text-sm">Game Metrics</span>
            </div>
          </div>

          {/* User Authentication Section */}
          <div className="mb-8 relative pl-8 border-l-2 border-green-500">
            <div className="absolute -left-2 top-0">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500"></span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-white">User Authentication & Profiles</h3>
              <span className="bg-green-500 text-black px-2 py-0.5 rounded text-xs font-bold">LIVE</span>
            </div>
            <p className="text-gray-300 mb-3">Secure account system with personalized profiles</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-green-900/50 border border-green-500 text-green-100 px-3 py-1 rounded-full text-sm">User Registration</span>
              <span className="bg-green-900/50 border border-green-500 text-green-100 px-3 py-1 rounded-full text-sm">Login System</span>
              <span className="bg-green-900/50 border border-green-500 text-green-100 px-3 py-1 rounded-full text-sm">Dashboard</span>
            </div>
          </div>

          {/* Game Gallery System */}
          <div className="mb-8 relative pl-8 border-l-2 border-green-500">
            <div className="absolute -left-2 top-0">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500"></span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-white">Game Gallery System</h3>
              <span className="bg-green-500 text-black px-2 py-0.5 rounded text-xs font-bold">LIVE</span>
            </div>
            <p className="text-gray-300 mb-3">Enhanced game presentation with multiple screenshots</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-green-900/50 border border-green-500 text-green-100 px-3 py-1 rounded-full text-sm">Gallery Images</span>
              <span className="bg-green-900/50 border border-green-500 text-green-100 px-3 py-1 rounded-full text-sm">Responsive Display</span>
              <span className="bg-green-900/50 border border-green-500 text-green-100 px-3 py-1 rounded-full text-sm">Thumbnail Management</span>
            </div>
          </div>

          {/* Competition Platform */}
          <div className="mb-8 relative pl-8 border-l-2 border-yellow-500">
            <div className="absolute -left-2 top-0">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500"></span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-white">Competition Platform</h3>
              <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold">NEXT</span>
            </div>
            <p className="text-gray-300 mb-3">Platform for AI gaming tournaments and challenges</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-yellow-900/50 border border-yellow-500 text-yellow-100 px-3 py-1 rounded-full text-sm">Competition Listing</span>
              <span className="bg-yellow-900/50 border border-yellow-500 text-yellow-100 px-3 py-1 rounded-full text-sm">Registration</span>
              <span className="bg-yellow-900/50 border border-yellow-500 text-yellow-100 px-3 py-1 rounded-full text-sm">Prize System</span>
            </div>
          </div>

          {/* Performance Rankings */}
          <div className="mb-8 relative pl-8 border-l-2 border-green-500">
            <div className="absolute -left-2 top-0">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500"></span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-white">Performance Rankings</h3>
              <span className="bg-green-500 text-black px-2 py-0.5 rounded text-xs font-bold">LIVE</span>
            </div>
            <p className="text-gray-300 mb-3">Comprehensive leaderboards for games and creators</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-green-900/50 border border-green-500 text-green-100 px-3 py-1 rounded-full text-sm">Popularity Rankings</span>
              <span className="bg-green-900/50 border border-green-500 text-green-100 px-3 py-1 rounded-full text-sm">Quality Rankings</span>
              <span className="bg-green-900/50 border border-green-500 text-green-100 px-3 py-1 rounded-full text-sm">Creator Leaderboards</span>
            </div>
          </div>

          {/* Advanced Analytics */}
          <div className="mb-8 relative pl-8 border-l-2 border-yellow-500">
            <div className="absolute -left-2 top-0">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500"></span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-white">Advanced Analytics</h3>
              <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold">NEXT</span>
            </div>
            <p className="text-gray-300 mb-3">Enhanced data insights for games and platform activity</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-yellow-900/50 border border-yellow-500 text-yellow-100 px-3 py-1 rounded-full text-sm">Game Performance Tracking</span>
              <span className="bg-yellow-900/50 border border-yellow-500 text-yellow-100 px-3 py-1 rounded-full text-sm">Analytics Dashboard</span>
              <span className="bg-yellow-900/50 border border-yellow-500 text-yellow-100 px-3 py-1 rounded-full text-sm">Engagement Metrics</span>
            </div>
          </div>

          {/* Sponsorship System */}
          <div className="mb-8 relative pl-8 border-l-2 border-yellow-500">
            <div className="absolute -left-2 top-0">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500"></span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-white">Sponsorship System</h3>
              <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold">NEXT</span>
            </div>
            <p className="text-gray-300 mb-3">Platform sponsorship integration with featured placement and analytics</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-yellow-900/50 border border-yellow-500 text-yellow-100 px-3 py-1 rounded-full text-sm">Sponsor Management</span>
              <span className="bg-yellow-900/50 border border-yellow-500 text-yellow-100 px-3 py-1 rounded-full text-sm">Featured Placement</span>
              <span className="bg-yellow-900/50 border border-yellow-500 text-yellow-100 px-3 py-1 rounded-full text-sm">Sponsor Analytics</span>
            </div>
          </div>

          {/* Talent & Gigs */}
          <div className="mb-8 relative pl-8 border-l-2 border-yellow-500">
            <div className="absolute -left-2 top-0">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500"></span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-white">Talent & Gigs Marketplace</h3>
              <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold">NEXT</span>
            </div>
            <p className="text-gray-300 mb-3">Connect developers with opportunities</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-yellow-900/50 border border-yellow-500 text-yellow-100 px-3 py-1 rounded-full text-sm">Talent Profiles</span>
              <span className="bg-yellow-900/50 border border-yellow-500 text-yellow-100 px-3 py-1 rounded-full text-sm">Gig Listings</span>
              <span className="bg-yellow-900/50 border border-yellow-500 text-yellow-100 px-3 py-1 rounded-full text-sm">Networking</span>
            </div>
          </div>

          {/* Tournament & League */}
          <div className="mb-8 relative pl-8 border-l-2 border-purple-500">
            <div className="absolute -left-2 top-0">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-500"></span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-white">Tournament & League System</h3>
              <span className="bg-purple-500 text-white px-2 py-0.5 rounded text-xs font-bold">COMING SOON</span>
            </div>
            <p className="text-gray-300 mb-3">Comprehensive esports-like structure for organizing gaming competitions</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-purple-900/50 border border-purple-500 text-purple-100 px-3 py-1 rounded-full text-sm">League Divisions</span>
              <span className="bg-purple-900/50 border border-purple-500 text-purple-100 px-3 py-1 rounded-full text-sm">Tournament Brackets</span>
              <span className="bg-purple-900/50 border border-purple-500 text-purple-100 px-3 py-1 rounded-full text-sm">Season Rewards</span>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-gray-400 text-sm mt-6">
            Roadmap is subject to change based on community feedback.
          </p>
        </div>
      </div>
    </div>
  );
} 