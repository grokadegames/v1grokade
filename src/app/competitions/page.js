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
          <div className="lg:col-span-2 bg-purple-900 rounded-lg overflow-hidden">
            {/* Featured competition content */}
            <div className="bg-purple-900 p-12 flex flex-col items-center justify-center">
              <h2 className="text-3xl font-bold text-white mb-8">🌟 2025 Vibe Coding Game Jam</h2>
              <p className="text-white text-center mb-4">
                Run by <a href="https://x.com/levelsio" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">@levelsio</a>
              </p>
            </div>
            
            <div className="bg-purple-950 p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-600 text-white px-3 py-1 text-sm rounded-full">Featured</span>
                <span className="bg-green-600 text-white px-3 py-1 text-sm rounded-full">Enrolling Now</span>
              </div>
              
              <p className="text-white mb-6">
                Deadline to enter: <span className="font-semibold">25 March 2025</span>, so you have 7 days
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <span className="text-purple-300 mr-2">•</span>
                  <p className="text-white">Anyone can enter with their game</p>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-300 mr-2">•</span>
                  <p className="text-white">At least 80% code has to be written by AI</p>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-300 mr-2">•</span>
                  <p className="text-white">Game has to be accessible on web without any login or signup and free-to-play (preferrably its own domain or subdomain)</p>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-300 mr-2">•</span>
                  <p className="text-white">Game has to be multiplayer by default</p>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-300 mr-2">•</span>
                  <p className="text-white">Can use any engine but usually ThreeJS is recommended</p>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-300 mr-2">•</span>
                  <p className="text-white font-semibold">NO loading screens and heavy downloads (!!!) has to be almost instantly in the game (except maybe ask username if you want)</p>
                </div>
              </div>

              <p className="text-white mb-4">
                The jury: me, and I will ask some real game dev people to jury too
              </p>
              
              <p className="text-white mb-6">
                Gold, silver and bronze winners will be tweeted out and if companies want to sponsor prizes that works too. General sponsors welcome too, just DM me!
              </p>
              
              <p className="text-white mb-6">
                I hope this will help give the best vibe coded games more distribution!
              </p>
              
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSdB8LEZIoYuh4_tO89s2DbMT7nqyDvJGrgrrUoBquLA4XCBRA/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-md transition-colors text-center"
              >
                Enter Competition
              </a>
            </div>
          </div>
          
          {/* Right Side Info Cards */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Competition Details</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white">Registration Open</h4>
                  <p className="text-grok-text-secondary text-sm">March 18 - March 25, 2025</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white">Submission Deadline</h4>
                  <p className="text-grok-text-secondary text-sm">March 25, 2025</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white">Judging</h4>
                  <p className="text-grok-text-secondary text-sm">After March 25, 2025</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white">Track Games</h4>
                  <p className="text-grok-text-secondary text-sm">
                    <a href="https://twitter.com/hashtag/vibejam" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      #vibejam
                    </a>
                  </p>
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
                    <p className="text-green-400">Gold Medal + Featured Spotlight</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center font-bold text-black mr-4">2</div>
                  <div>
                    <h4 className="font-semibold text-white">2nd Place</h4>
                    <p className="text-green-400">Silver Medal + Featured Listing</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center font-bold text-black mr-4">3</div>
                  <div>
                    <h4 className="font-semibold text-white">3rd Place</h4>
                    <p className="text-green-400">Bronze Medal + Featured Listing</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-800">
                  <p className="text-white text-sm">
                    Sponsorship opportunities available. Contact <a href="https://x.com/levelsio" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">@levelsio</a> for details.
                  </p>
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