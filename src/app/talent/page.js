'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';

// Sample data for featured talent
const featuredTalent = [
  {
    id: 1,
    initials: 'AJ',
    name: 'Alex Johnson',
    title: 'Senior WebGL Developer',
    rating: 4.9,
    reviews: 49,
    skills: ['WebGL', 'Three.js', 'JavaScript', 'Game Optimization'],
    rate: '$65-85/hr',
    location: 'San Francisco, CA',
    featured: true
  },
  {
    id: 2,
    initials: 'SC',
    name: 'Sarah Chen',
    title: 'Game AI Specialist',
    rating: 4.8,
    reviews: 48,
    skills: ['AI', 'Machine Learning', 'JavaScript', 'Python'],
    rate: '$70-90/hr',
    location: 'Remote',
    featured: true
  },
  {
    id: 3,
    initials: 'MR',
    name: 'Miguel Rodriguez',
    title: 'Unity Game Developer',
    rating: 4.7,
    reviews: 47,
    skills: ['Unity', 'C#', '3D Modeling', 'Game Design'],
    rate: '$55-75/hr',
    location: 'Austin, TX',
    featured: true
  }
];

// Talent card component
const TalentCard = ({ talent }) => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <div className="p-6">
        <div className="flex flex-row items-start">
          <div className="relative mr-4">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-white text-xl font-bold border border-purple-600/40">
              <span className="flex justify-center items-center w-full h-full">{talent.initials}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs text-white font-bold border border-gray-900">
              {talent.initials[0]}
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="text-xl font-bold text-white">{talent.name}</h3>
              {talent.featured && (
                <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                  Featured
                </span>
              )}
            </div>
            <p className="text-gray-400">{talent.title}</p>
            <div className="flex items-center mt-1">
              <span className="text-yellow-400">★</span>
              <span className="text-white ml-1 font-semibold">{talent.rating}</span>
              <span className="text-gray-400 ml-1">({talent.reviews} reviews)</span>
            </div>
          </div>
        </div>

        <div className="mt-4 mb-4 flex flex-wrap gap-2">
          {talent.skills.map((skill, index) => (
            <span 
              key={index} 
              className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-4 border-t border-gray-800 pt-4 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-400">Rate:</div>
            <div className="text-white font-medium">{talent.rate}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Location:</div>
            <div className="text-white font-medium">{talent.location}</div>
          </div>
        </div>

        <div className="mt-4 flex space-x-3">
          <a href="#" className="flex-1 text-center text-white bg-transparent border border-gray-700 hover:border-gray-500 font-medium px-4 py-2 rounded transition-colors">
            View Profile
          </a>
          <a href="#" className="flex-1 text-center text-white bg-purple-600 hover:bg-purple-700 font-medium px-4 py-2 rounded transition-colors">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
};

export default function TalentPage() {
  const [activeTab, setActiveTab] = useState('developers');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-950">
      <AuthNavbar />
      
      <main className="container mx-auto max-w-7xl px-4 py-20">
        <h1 className="text-4xl font-bold text-white text-center mb-4">
          Game Development Talent Network
        </h1>
        <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
          Connect with specialized talent for your game projects or showcase your skills to get hired.
        </p>
        
        {/* Search and join section */}
        <div className="mb-12 p-6 bg-gray-900 rounded-lg border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search for talent by skill (e.g., WebGL, Unity, AI)..."
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
                Search
              </button>
              <button className="px-6 py-3 bg-transparent border border-purple-600 hover:bg-purple-700 hover:border-purple-700 text-white font-medium rounded-lg transition-colors">
                Join as Talent
              </button>
            </div>
          </div>
        </div>
        
        {/* Talent categories */}
        <div className="mb-8">
          <div className="inline-flex bg-gray-900 p-1 rounded-lg border border-gray-800">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'developers'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('developers')}
            >
              Developers
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'creatives'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('creatives')}
            >
              Creatives
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'consultants'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('consultants')}
            >
              Consultants
            </button>
          </div>
        </div>
        
        {/* Featured talent section */}
        <div className="mb-16">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Featured Talent</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTalent.map(talent => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </div>
        </div>
        
        {/* Call to action */}
        <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-4">
            Are you a vibe game development expert?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Join our talent network to find opportunities and connect with game developers who need your expertise.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            Create Your Profile
          </button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 