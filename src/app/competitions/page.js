'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';

export default function CompetitionsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div className="bg-grok-darker min-h-screen">
      <AuthNavbar />
      
      <main className="py-20 px-4 container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-white text-center mb-4">Game Competitions</h1>
        <p className="text-center text-grok-text-secondary mb-12">
          Participate in exciting game competitions, showcase your skills, and win prizes.
        </p>
        
        {/* Featured Competition Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-blue-900 rounded-lg overflow-hidden">
            {/* Featured competition content */}
            <div className="bg-blue-900 p-12 flex flex-col items-center justify-center">
              <h2 className="text-3xl font-bold text-white mb-16">Flight Simulator Championship</h2>
            </div>
            
            <div className="bg-blue-950 p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-600 text-white px-3 py-1 text-sm rounded-full">Featured</span>
                <span className="bg-yellow-600 text-white px-3 py-1 text-sm rounded-full">$1,000 Prize Pool</span>
                <span className="bg-green-600 text-white px-3 py-1 text-sm rounded-full">Enrolling Now</span>
              </div>
              
              <p className="text-white mb-6">
                Compete in the ultimate flight challenge at <a href="https://fly.pieter.com" className="text-blue-300 hover:underline">fly.pieter.com</a>. Complete 3 missions with the highest score in the least amount of time to win the top prize. Test your piloting skills in this high-octane competition!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-white mb-2">
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>Deadline</span>
                  </div>
                  <span className="text-white font-medium">June 15, 2023</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-white mb-2">
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M23 21V19C22.9986 17.1771 21.7079 15.5857 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M16 3.13C17.7095 3.58317 19.0017 5.17565 19.0017 7.00065C19.0017 8.82565 17.7095 10.4181 16 10.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>Participants</span>
                  </div>
                  <span className="text-white font-medium">127 / 200</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-white mb-2">
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M20 6L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M14 4L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M10 4L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M4 6L7 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M4 18L7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M14 20L12 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M10 20L12 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M20 18L17 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>Prizes</span>
                  </div>
                  <span className="text-white font-medium">3 Winners</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-white mb-1">Registration Progress</div>
                <div className="w-full bg-blue-800 rounded-full h-2.5">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '64%' }}></div>
                </div>
                <div className="text-right text-xs text-purple-300 mt-1">64% Full</div>
              </div>
              
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-md transition-colors">
                Enter Competition
              </button>
            </div>
          </div>
          
          {/* Right Side Info Cards */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Competition Schedule</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white">Registration Open</h4>
                  <p className="text-grok-text-secondary text-sm">May 1 - June 15, 2023</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white">Development Period</h4>
                  <p className="text-grok-text-secondary text-sm">June 16 - July 31, 2023</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white">Judging</h4>
                  <p className="text-grok-text-secondary text-sm">August 1 - August 15, 2023</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white">Winners Announced</h4>
                  <p className="text-grok-text-secondary text-sm">August 20, 2023</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Prizes</h3>
              
              <div className="space-y-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-black mr-4">1</div>
                  <div>
                    <h4 className="font-semibold text-white">1st Place</h4>
                    <p className="text-green-400">$2,500 + Featured Spotlight</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center font-bold text-black mr-4">2</div>
                  <div>
                    <h4 className="font-semibold text-white">2nd Place</h4>
                    <p className="text-green-400">$1,500 + Featured Listing</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center font-bold text-black mr-4">3</div>
                  <div>
                    <h4 className="font-semibold text-white">3rd Place</h4>
                    <p className="text-green-400">$1,000 + Featured Listing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-8 flex space-x-2 border-b border-gray-800">
          <button 
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'upcoming' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'active' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button 
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'past' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
          <button 
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'myCompetitions' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('myCompetitions')}
          >
            My Competitions
          </button>
        </div>
        
        {/* Competition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* AI Game Challenge */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">AI Game Challenge</h3>
                  <p className="text-sm text-grok-text-secondary">Sponsored by AIGameLabs</p>
                </div>
                <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">Upcoming</span>
              </div>
              
              <p className="text-grok-text-secondary mb-6">
                Create a game with intelligent AI opponents that adapt to player skill levels.
              </p>
              
              <div className="flex justify-between mb-4">
                <div>
                  <div className="text-sm text-grok-text-secondary mb-1">Deadline</div>
                  <div className="font-medium text-white">July 10, 2023</div>
                </div>
                
                <div>
                  <div className="text-sm text-grok-text-secondary mb-1">Prize Pool</div>
                  <div className="font-medium text-purple-400">$800</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-grok-text-secondary mb-1">
                  <span>Registration</span>
                  <span>45 / 100</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded transition-colors">
                Get Notified
              </button>
            </div>
          </div>
          
          {/* Retro Game Jam */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Retro Game Jam</h3>
                  <p className="text-sm text-grok-text-secondary">Sponsored by RetroGaming Alliance</p>
                </div>
                <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">Upcoming</span>
              </div>
              
              <p className="text-grok-text-secondary mb-6">
                Design a game inspired by retro classics with modern twists and innovative gameplay.
              </p>
              
              <div className="flex justify-between mb-4">
                <div>
                  <div className="text-sm text-grok-text-secondary mb-1">Deadline</div>
                  <div className="font-medium text-white">August 5, 2023</div>
                </div>
                
                <div>
                  <div className="text-sm text-grok-text-secondary mb-1">Prize Pool</div>
                  <div className="font-medium text-purple-400">$750</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-grok-text-secondary mb-1">
                  <span>Registration</span>
                  <span>78 / 150</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '52%' }}></div>
                </div>
              </div>
              
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded transition-colors">
                Get Notified
              </button>
            </div>
          </div>
        </div>
        
        {/* Sponsor a Competition Section */}
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Sponsor a Competition</h2>
          <p className="text-grok-text-secondary max-w-2xl mx-auto mb-8">
            Looking to promote your brand to game developers and players? Sponsor a competition and gain visibility.
          </p>
          <button className="bg-transparent border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white font-medium px-6 py-2 rounded transition-colors">
            Become a Sponsor
          </button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 