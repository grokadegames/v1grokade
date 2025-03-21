'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { trackGamePlay } from '@/lib/metricsUtil';

export default function GamesPage() {
  const { isAuthenticated } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('production');
  const [sortOption, setSortOption] = useState('newest');

  // Fetch games based on current filters
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const queryParams = new URLSearchParams();
        queryParams.append('stage', activeTab.toUpperCase());
        queryParams.append('sort', sortOption);
        queryParams.append('limit', '1000');
        
        const response = await fetch(`/api/games?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.status}`);
        }
        
        const data = await response.json();
        setGames(data.games || []);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load games. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGames();
  }, [activeTab, sortOption]);

  // Handle play button click
  const handlePlayClick = (e, game) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (game && game.id) {
      // Use the centralized tracking utility
      trackGamePlay(game.id)
        .then(result => {
          console.log('Game play tracked from games page:', result);
          // Update the local play count if available from the API
          if (result && result.metrics && result.metrics.plays !== undefined) {
            setGames(prev => 
              prev.map(g => 
                g.id === game.id 
                  ? {...g, plays: result.metrics.plays}
                  : g
              )
            );
          }
          // Open the game URL
          window.open(game.playUrl, '_blank', 'noopener,noreferrer');
        })
        .catch(error => {
          console.error('Error tracking game play from games page:', error);
          window.open(game.playUrl, '_blank', 'noopener,noreferrer');
        });
    } else if (game && game.playUrl) {
      window.open(game.playUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-grok-darker">
      <AuthNavbar />
      
      <main className="container-custom mx-auto px-4 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Games Directory</h1>
          <p className="text-grok-text-secondary">
            Discover and play games created by our community of developers
          </p>
        </div>
        
        {/* Main content section */}
        <div className="bg-grok-dark rounded-lg overflow-hidden shadow-xl">
          {/* Top section - tabs and filters */}
          <div className="px-4 py-4 border-b border-gray-800">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              {/* Left side - Main tabs */}
              <div className="flex space-x-4 mb-4 md:mb-0">
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'production' 
                      ? 'bg-grok-purple text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveTab('production')}
                >
                  Production Games
                </button>
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'beta' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveTab('beta')}
                >
                  Beta Games
                </button>
              </div>
              
              {/* Right side - Additional filters */}
              <div className="flex flex-wrap gap-2">
                <select 
                  className="bg-gray-800 text-gray-300 px-3 py-2 rounded-md text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-grok-purple"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="popular">Most Viewed</option>
                  <option value="most_played">Most Played</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Games table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              {/* Table header */}
              <thead className="bg-gray-800/40">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12">#</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Game</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Creator</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Plays</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">Views</th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Play</th>
                </tr>
              </thead>
              
              {/* Table body */}
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-gray-400">
                      <div className="flex justify-center items-center">
                        <svg className="animate-spin h-6 w-6 mr-2 text-grok-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading games...
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-red-400">
                      {error}
                    </td>
                  </tr>
                ) : games.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-gray-400">
                      No games found in this category.
                    </td>
                  </tr>
                ) : (
                  games.map((game, index) => (
                    <tr 
                      key={game.id}
                      className="hover:bg-gray-800/50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 text-gray-300 text-sm">{index + 1}</td>
                      <td className="py-4 px-4">
                        <Link href={`/game/${game.id}`} className="group">
                          <div className="flex items-center space-x-3">
                            {/* Game thumbnail */}
                            <div className="h-12 w-12 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                              {game.image ? (
                                <img 
                                  src={game.image} 
                                  alt={game.title} 
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = '/images/default-game-cover.svg';
                                  }}
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-purple-900/30 to-black">
                                  <span className="text-lg font-bold text-grok-purple">
                                    {game.title.slice(0, 1).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Game title and description */}
                            <div className="flex flex-col">
                              <span className="text-white text-sm font-medium group-hover:text-grok-purple transition-colors">
                                {game.title}
                              </span>
                              <span className="text-gray-400 text-xs line-clamp-1">
                                {game.description}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-gray-300 text-sm hidden md:table-cell">
                        {game.tagcategory ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300">
                            {game.tagcategory}
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-300 text-sm hidden md:table-cell">
                        {game.xaccount ? (
                          <a 
                            href={game.xaccount.startsWith('@') 
                              ? `https://x.com/${game.xaccount.substring(1)}` 
                              : game.xaccount.startsWith('http') 
                                ? game.xaccount 
                                : `https://x.com/${game.xaccount}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-grok-purple hover:underline"
                          >
                            {game.xaccount}
                          </a>
                        ) : (
                          <span>{game.creator || 'Unknown'}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-300 text-sm">
                        {game.plays || 0}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-300 text-sm hidden sm:table-cell">
                        {game.views || 0}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <a 
                          href={game.playUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-grok-purple hover:bg-purple-700 transition-colors"
                          onClick={(e) => handlePlayClick(e, game)}
                        >
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5V19L19 12L8 5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 