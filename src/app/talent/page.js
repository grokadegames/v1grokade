'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import CombinedTrendIndicator from '@/components/CombinedTrendIndicator';

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
  // Determine the initials to show in the circle
  const initials = talent.initials;
  
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white text-xl font-bold">
              {initials}
            </div>
          </div>
          <div className="ml-3">
            <div className="flex items-center">
              <h3 className="text-xl font-medium text-white">{talent.name}</h3>
              {talent.featured && (
                <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded">
                  Featured
                </span>
              )}
            </div>
            <p className="text-gray-300 text-sm">{talent.title}</p>
          </div>
        </div>
        
        <div className="flex items-center mt-2">
          <span className="text-yellow-400">★</span>
          <span className="text-white ml-1 font-medium text-sm">{talent.rating}</span>
          <span className="text-gray-400 ml-1 text-xs">({talent.reviews} reviews)</span>
        </div>

        <div className="flex flex-wrap mt-3 mb-4">
          {talent.skills.slice(0, 4).map((skill, index) => (
            <span 
              key={index} 
              className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded mr-1 mb-1"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4 text-sm">
          <div>
            <div className="text-gray-400">Rate:</div>
            <div className="text-white">{talent.rate}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-400">Location:</div>
            <div className="text-white">{talent.location}</div>
          </div>
        </div>

        <div className="flex gap-2">
          {talent.xaccount ? (
            <a
              href={`https://x.com/${talent.xaccount.replace(/^@/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white bg-transparent hover:bg-gray-800 font-medium text-sm px-4 py-2 rounded transition-colors flex-1 text-center"
            >
              Contact
            </a>
          ) : (
            <button
              disabled
              className="text-gray-400 bg-gray-800 font-medium text-sm px-4 py-2 rounded flex-1 cursor-not-allowed"
            >
              Contact
            </button>
          )}
          <button className="text-white bg-purple-600 hover:bg-purple-500 font-medium text-sm px-4 py-2 rounded transition-colors flex-1">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TalentPage() {
  const [talentProfiles, setTalentProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePeriod, setActivePeriod] = useState('7d');

  const timePeriods = [
    { id: '1d', label: '1d' },
    { id: '7d', label: '7d' },
    { id: '30d', label: '30d' },
  ];
  
  // Fetch talent profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append('skill', searchQuery);
        }
        
        const response = await fetch(`/api/talent/profiles?${params.toString()}`);
        
        if (response.ok) {
          const data = await response.json();
          setTalentProfiles(data.profiles);
        } else {
          console.error('Failed to fetch profiles');
        }
      } catch (error) {
        console.error('Error fetching talent profiles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfiles();
  }, [searchQuery]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is triggered by the effect when searchQuery changes
  };

  return (
    <div className="min-h-screen bg-black">
      <AuthNavbar />
      
      <main className="container mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-bold text-white text-center mb-3">
          Game Development Talent Network
        </h1>
        <p className="text-center text-gray-300 mb-10">
          Connect with specialized talent for your game projects or showcase your skills to get hired.
        </p>
        
        {/* Search and join section */}
        <div className="mb-12 p-4 bg-gray-900 rounded-xl">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Search for talent by skill (e.g., WebGL, Unity, AI)..."
              className="flex-grow px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex gap-2">
              <button 
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Search
              </button>
              <Link 
                href="/dashboard" 
                className="px-4 py-2 bg-transparent border border-purple-600 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center justify-center"
              >
                Join as Talent
              </Link>
            </div>
          </form>
        </div>
        
        {/* Talent categories */}
        <div className="mb-8">
          <div className="inline-flex">
            <button
              className={`px-4 py-2 mr-1 rounded-md text-sm font-medium ${
                activeTab === 'featured'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('featured')}
            >
              Featured Talent
            </button>
            <button
              className={`px-4 py-2 mr-1 rounded-md text-sm font-medium ${
                activeTab === 'developers'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('developers')}
            >
              Developers
            </button>
            <button
              className={`px-4 py-2 mr-1 rounded-md text-sm font-medium ${
                activeTab === 'artists'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('artists')}
            >
              Artists
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'consultants'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('consultants')}
            >
              Consultants
            </button>
          </div>
        </div>
        
        {/* Featured talent section */}
        <div className="mb-12">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : talentProfiles.length === 0 ? (
            <div className="bg-gray-900 rounded-xl p-8 text-center">
              <p className="text-gray-400">No talent profiles found. {searchQuery && 'Try a different search term.'}</p>
              {!searchQuery && (
                <p className="text-gray-400 mt-2">
                  Be the first to <Link href="/dashboard" className="text-purple-500 hover:text-purple-400">add your profile</Link>!
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {talentProfiles.map(talent => (
                <TalentCard key={talent.id} talent={talent} />
              ))}
            </div>
          )}
        </div>
        
        {/* Call to action */}
        <div className="bg-gray-900 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Are you a game development expert?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Join our talent network to find opportunities and connect with game developers who need your expertise.
          </p>
          <Link 
            href="/dashboard"
            className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-5 py-2 rounded-lg transition-colors inline-block"
          >
            Create Your Profile
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 