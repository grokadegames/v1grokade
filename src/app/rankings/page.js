'use client';

import { useState, useEffect } from 'react';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import CombinedTrendIndicator from '@/components/CombinedTrendIndicator';

export default function RankingsPage() {
  const [popularityGames, setPopularityGames] = useState([]);
  const [qualityGames, setQualityGames] = useState([]);
  const [creatorRanking, setCreatorRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('popularity');
  const [popularityLimit, setPopularityLimit] = useState(10);
  const [qualityLimit, setQualityLimit] = useState(10);
  const [creatorLimit, setCreatorLimit] = useState(10);
  const [activePeriod, setActivePeriod] = useState('1d');

  const timePeriods = [
    { id: '1d', label: '1d' },
    { id: '7d', label: '7d' },
    { id: '30d', label: '30d' },
  ];

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/rankings');
        const data = await response.json();
        
        if (data.popularityRanking) {
          setPopularityGames(data.popularityRanking);
        }
        
        if (data.qualityRanking) {
          setQualityGames(data.qualityRanking);
        }

        if (data.creatorRanking) {
          setCreatorRanking(data.creatorRanking);
        }
      } catch (error) {
        console.error('Error fetching rankings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRankings();
  }, []);

  const showMorePopularity = () => {
    setPopularityLimit(prev => prev + 10);
  };

  const showMoreQuality = () => {
    setQualityLimit(prev => prev + 10);
  };

  const showMoreCreators = () => {
    setCreatorLimit(prev => prev + 10);
  };

  return (
    <div className="min-h-screen bg-black">
      <AuthNavbar />
      
      <main className="container mx-auto max-w-6xl px-4 py-20">
        <h1 className="text-4xl font-bold text-white text-center mb-2">Game Rankings</h1>
        <p className="text-center text-grok-text-secondary mb-6">
          Discover the most popular and highest quality AI games on the platform
        </p>
        
        <div className="mb-4 flex justify-center">
          <div className="bg-gray-900 p-1 rounded-lg inline-flex flex-wrap justify-center">
            <button 
              onClick={() => setActiveTab('popularity')}
              className={`px-4 py-2 rounded-md text-sm ${
                activeTab === 'popularity' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-grok-text-secondary hover:text-white'
              }`}
            >
              Popularity Ranking
            </button>
            <button 
              onClick={() => setActiveTab('quality')}
              className={`px-4 py-2 rounded-md text-sm ${
                activeTab === 'quality' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-grok-text-secondary hover:text-white'
              }`}
            >
              Quality Ranking
            </button>
            <button 
              onClick={() => setActiveTab('creators')}
              className={`px-4 py-2 rounded-md text-sm ${
                activeTab === 'creators' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-grok-text-secondary hover:text-white'
              }`}
            >
              Creator Ranking
            </button>
          </div>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="bg-gray-900 rounded-lg inline-flex">
            {timePeriods.map(period => (
              <button
                key={period.id}
                onClick={() => setActivePeriod(period.id)}
                className={`px-3 py-1.5 text-xs ${
                  activePeriod === period.id
                    ? 'bg-gray-700 text-white rounded-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
        
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
        
        {!loading && activeTab === 'popularity' && (
          <div className="bg-black rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-900 to-purple-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Popularity Rankings</h2>
              <p className="text-purple-100 text-sm">Based on total views and plays</p>
            </div>
            
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm text-gray-400">Rank</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm text-gray-400">Game</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-gray-400">Last {activePeriod}</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-gray-400">Views</th>
                      <th className="hidden sm:table-cell px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-gray-400">Plays</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-gray-400">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularityGames.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                          No ranking data available
                        </td>
                      </tr>
                    ) : (
                      popularityGames.slice(0, popularityLimit).map((game, index) => (
                        <tr key={game.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                          <td className="px-2 sm:px-6 py-2 sm:py-4">
                            {index === 0 ? (
                              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="20" cy="20" r="19" fill="url(#platinumGradient)" stroke="#E5E4E2" strokeWidth="1"/>
                                  <circle cx="20" cy="20" r="16" fill="url(#platinumInnerGradient)" stroke="#A9A8A7" strokeWidth="0.5"/>
                                  <text x="20" y="25" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#000" textAnchor="middle">1</text>
                                  <defs>
                                    <radialGradient id="platinumGradient" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25">
                                      <stop offset="0%" stopColor="#FFFFFF" />
                                      <stop offset="50%" stopColor="#E5E4E2" />
                                      <stop offset="100%" stopColor="#9A9A9A" />
                                    </radialGradient>
                                    <linearGradient id="platinumInnerGradient" x1="0" y1="0" x2="1" y2="1">
                                      <stop offset="0%" stopColor="#FFFFFF" />
                                      <stop offset="50%" stopColor="#E5E4E2" />
                                      <stop offset="100%" stopColor="#C0C0C0" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </div>
                            ) : index === 1 ? (
                              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="20" cy="20" r="19" fill="url(#silverGradient)" stroke="#C0C0C0" strokeWidth="1"/>
                                  <circle cx="20" cy="20" r="16" fill="url(#silverInnerGradient)" stroke="#A0A0A0" strokeWidth="0.5"/>
                                  <text x="20" y="25" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#000" textAnchor="middle">2</text>
                                  <defs>
                                    <radialGradient id="silverGradient" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25">
                                      <stop offset="0%" stopColor="#FFFFFF" />
                                      <stop offset="50%" stopColor="#E0E0E0" />
                                      <stop offset="100%" stopColor="#B0B0B0" />
                                    </radialGradient>
                                    <linearGradient id="silverInnerGradient" x1="0" y1="0" x2="1" y2="1">
                                      <stop offset="0%" stopColor="#FFFFFF" />
                                      <stop offset="100%" stopColor="#C0C0C0" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </div>
                            ) : index === 2 ? (
                              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="20" cy="20" r="19" fill="url(#bronzeGradient)" stroke="#CD7F32" strokeWidth="1"/>
                                  <circle cx="20" cy="20" r="16" fill="url(#bronzeInnerGradient)" stroke="#A56025" strokeWidth="0.5"/>
                                  <text x="20" y="25" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#000" textAnchor="middle">3</text>
                                  <defs>
                                    <radialGradient id="bronzeGradient" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25">
                                      <stop offset="0%" stopColor="#FFC68C" />
                                      <stop offset="50%" stopColor="#CD7F32" />
                                      <stop offset="100%" stopColor="#A56025" />
                                    </radialGradient>
                                    <linearGradient id="bronzeInnerGradient" x1="0" y1="0" x2="1" y2="1">
                                      <stop offset="0%" stopColor="#FFC68C" />
                                      <stop offset="100%" stopColor="#CD7F32" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </div>
                            ) : index === 3 ? (
                              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="20" cy="20" r="19" fill="url(#goldGradient)" stroke="#FFD700" strokeWidth="1"/>
                                  <circle cx="20" cy="20" r="16" fill="url(#goldInnerGradient)" stroke="#E5C100" strokeWidth="0.5"/>
                                  <text x="20" y="25" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#000" textAnchor="middle">4</text>
                                  <defs>
                                    <radialGradient id="goldGradient" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25">
                                      <stop offset="0%" stopColor="#FFF7C2" />
                                      <stop offset="50%" stopColor="#FFD700" />
                                      <stop offset="100%" stopColor="#E5A100" />
                                    </radialGradient>
                                    <linearGradient id="goldInnerGradient" x1="0" y1="0" x2="1" y2="1">
                                      <stop offset="0%" stopColor="#FFF7C2" />
                                      <stop offset="100%" stopColor="#FFD700" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </div>
                            ) : (
                              <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm bg-gray-950 text-white font-bold">
                                {index + 1}
                              </span>
                            )}
                          </td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <a href={`/game/${game.id}`} className="flex-shrink-0">
                                {game.imageUrl ? (
                                  <img src={game.imageUrl} alt={game.title} className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover hover:opacity-80 transition-opacity" />
                                ) : (
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-gray-900 flex items-center justify-center">
                                    <span className="text-xs text-gray-400">No img</span>
                                  </div>
                                )}
                              </a>
                              <div className="min-w-0">
                                <a href={`/game/${game.id}`} className="text-white text-sm sm:text-base font-medium hover:text-purple-400 transition-colors truncate block">
                                  {game.title}
                                </a>
                                <p className="text-xs text-gray-400 truncate">
                                  {game.xaccount ? (
                                    <a 
                                      href={`https://x.com/${game.xaccount.replace(/^@/, '').replace(/^https?:\/\/(www\.)?x\.com\//i, '')}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="hover:text-purple-400 transition-colors"
                                    >
                                      @{game.xaccount.replace(/^@/, '').replace(/^https?:\/\/(www\.)?x\.com\//i, '')}
                                    </a>
                                  ) : (
                                    `by ${game.author?.username || 'Unknown'}`
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 w-[128px] sm:w-[160px]">
                            <div className="h-10 w-full flex items-center">
                              <CombinedTrendIndicator
                                entityId={game.id}
                                entityType="game"
                                rankingType="popularity"
                                width={480}
                                height={40}
                                showPeriods={[activePeriod]}
                                activePeriod={activePeriod}
                              />
                            </div>
                          </td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm font-semibold text-white">
                            {game.metrics?.views.toLocaleString()}
                          </td>
                          <td className="hidden sm:table-cell px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm text-gray-400">{game.metrics?.plays.toLocaleString()}</td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm font-semibold text-white">{(game.popularityScore || 0).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {popularityGames.length > popularityLimit && (
              <div className="py-4 text-center">
                <button 
                  onClick={showMorePopularity}
                  className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Show More
                </button>
              </div>
            )}
          </div>
        )}
        
        {!loading && activeTab === 'quality' && (
          <div className="bg-black rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-700 to-fuchsia-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Quality Rankings</h2>
              <p className="text-purple-100 text-sm">Based on likes and dislikes ratio</p>
            </div>
            
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm text-gray-400">Rank</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm text-gray-400">Game</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-gray-400">Last {activePeriod}</th>
                      <th className="hidden sm:table-cell px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-gray-400">Likes</th>
                      <th className="hidden sm:table-cell px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-gray-400">Dislikes</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-gray-400">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qualityGames.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                          No ranking data available
                        </td>
                      </tr>
                    ) : (
                      qualityGames.slice(0, qualityLimit).map((game, index) => (
                        <tr key={game.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                          <td className="px-2 sm:px-6 py-2 sm:py-4">
                            {index === 0 ? (
                              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="20" cy="20" r="19" fill="url(#platinumGradient2)" stroke="#E5E4E2" strokeWidth="1"/>
                                  <circle cx="20" cy="20" r="16" fill="url(#platinumInnerGradient2)" stroke="#A9A8A7" strokeWidth="0.5"/>
                                  <text x="20" y="25" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#000" textAnchor="middle">1</text>
                                  <defs>
                                    <radialGradient id="platinumGradient2" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25">
                                      <stop offset="0%" stopColor="#FFFFFF" />
                                      <stop offset="50%" stopColor="#E5E4E2" />
                                      <stop offset="100%" stopColor="#9A9A9A" />
                                    </radialGradient>
                                    <linearGradient id="platinumInnerGradient2" x1="0" y1="0" x2="1" y2="1">
                                      <stop offset="0%" stopColor="#FFFFFF" />
                                      <stop offset="50%" stopColor="#E5E4E2" />
                                      <stop offset="100%" stopColor="#C0C0C0" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </div>
                            ) : index === 1 ? (
                              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="20" cy="20" r="19" fill="url(#silverGradient)" stroke="#C0C0C0" strokeWidth="1"/>
                                  <circle cx="20" cy="20" r="16" fill="url(#silverInnerGradient)" stroke="#A0A0A0" strokeWidth="0.5"/>
                                  <text x="20" y="25" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#000" textAnchor="middle">2</text>
                                  <defs>
                                    <radialGradient id="silverGradient" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25">
                                      <stop offset="0%" stopColor="#FFFFFF" />
                                      <stop offset="50%" stopColor="#E0E0E0" />
                                      <stop offset="100%" stopColor="#B0B0B0" />
                                    </radialGradient>
                                    <linearGradient id="silverInnerGradient" x1="0" y1="0" x2="1" y2="1">
                                      <stop offset="0%" stopColor="#FFFFFF" />
                                      <stop offset="100%" stopColor="#C0C0C0" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </div>
                            ) : index === 2 ? (
                              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="20" cy="20" r="19" fill="url(#bronzeGradient)" stroke="#CD7F32" strokeWidth="1"/>
                                  <circle cx="20" cy="20" r="16" fill="url(#bronzeInnerGradient)" stroke="#A56025" strokeWidth="0.5"/>
                                  <text x="20" y="25" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#000" textAnchor="middle">3</text>
                                  <defs>
                                    <radialGradient id="bronzeGradient" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25">
                                      <stop offset="0%" stopColor="#FFC68C" />
                                      <stop offset="50%" stopColor="#CD7F32" />
                                      <stop offset="100%" stopColor="#A56025" />
                                    </radialGradient>
                                    <linearGradient id="bronzeInnerGradient" x1="0" y1="0" x2="1" y2="1">
                                      <stop offset="0%" stopColor="#FFC68C" />
                                      <stop offset="100%" stopColor="#CD7F32" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </div>
                            ) : index === 3 ? (
                              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="20" cy="20" r="19" fill="url(#goldGradient)" stroke="#FFD700" strokeWidth="1"/>
                                  <circle cx="20" cy="20" r="16" fill="url(#goldInnerGradient)" stroke="#E5C100" strokeWidth="0.5"/>
                                  <text x="20" y="25" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#000" textAnchor="middle">4</text>
                                  <defs>
                                    <radialGradient id="goldGradient" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25">
                                      <stop offset="0%" stopColor="#FFF7C2" />
                                      <stop offset="50%" stopColor="#FFD700" />
                                      <stop offset="100%" stopColor="#E5A100" />
                                    </radialGradient>
                                    <linearGradient id="goldInnerGradient" x1="0" y1="0" x2="1" y2="1">
                                      <stop offset="0%" stopColor="#FFF7C2" />
                                      <stop offset="100%" stopColor="#FFD700" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </div>
                            ) : (
                              <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm bg-gray-950 text-white font-bold">
                                {index + 1}
                              </span>
                            )}
                          </td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <a href={`/game/${game.id}`} className="flex-shrink-0">
                                {game.imageUrl ? (
                                  <img src={game.imageUrl} alt={game.title} className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover hover:opacity-80 transition-opacity" />
                                ) : (
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-gray-900 flex items-center justify-center">
                                    <span className="text-xs text-gray-400">No img</span>
                                  </div>
                                )}
                              </a>
                              <div className="min-w-0">
                                <a href={`/game/${game.id}`} className="text-white text-sm sm:text-base font-medium hover:text-purple-400 transition-colors truncate block">
                                  {game.title}
                                </a>
                                <p className="text-xs text-gray-400 truncate">
                                  {game.xaccount ? (
                                    <a 
                                      href={`https://x.com/${game.xaccount.replace(/^@/, '').replace(/^https?:\/\/(www\.)?x\.com\//i, '')}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="hover:text-purple-400 transition-colors"
                                    >
                                      @{game.xaccount.replace(/^@/, '').replace(/^https?:\/\/(www\.)?x\.com\//i, '')}
                                    </a>
                                  ) : (
                                    `by ${game.author?.username || 'Unknown'}`
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 w-[128px] sm:w-[160px]">
                            <div className="h-10 w-full flex items-center">
                              <CombinedTrendIndicator
                                entityId={game.id}
                                entityType="game"
                                rankingType="quality"
                                width={480}
                                height={40}
                                showPeriods={[activePeriod]}
                                activePeriod={activePeriod}
                              />
                            </div>
                          </td>
                          <td className="hidden sm:table-cell px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm text-gray-400">{game.metrics?.likes.toLocaleString()}</td>
                          <td className="hidden sm:table-cell px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm text-gray-400">{game.metrics?.dislikes.toLocaleString()}</td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm">
                            <div className="flex items-center justify-end gap-2">
                              <span className={`font-semibold ${
                                game.qualityScore > 0.8 ? 'text-green-400' : 
                                game.qualityScore > 0.5 ? 'text-yellow-400' : 
                                'text-red-400'
                              }`}>
                                {(game.qualityScore * 100).toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {qualityGames.length > qualityLimit && (
              <div className="py-4 text-center">
                <button 
                  onClick={showMoreQuality}
                  className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Show More
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === 'creators' && (
          <div className="bg-black rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-fuchsia-600 to-pink-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Creator Rankings</h2>
              <p className="text-purple-100 text-sm">Based on number of games published</p>
            </div>
            
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm text-gray-400">Rank</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm text-gray-400">Creator</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-gray-400">Last {activePeriod}</th>
                      <th className="hidden sm:table-cell px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-gray-400">Games</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-gray-400">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creatorRanking.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                          No ranking data available
                        </td>
                      </tr>
                    ) : (
                      creatorRanking.slice(0, creatorLimit).map((creator, index) => (
                        <tr key={creator.xaccount} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                          <td className="px-2 sm:px-6 py-2 sm:py-4">
                            {index === 0 ? (
                              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="20" cy="20" r="19" fill="url(#platinumGradient2)" stroke="#E5E4E2" strokeWidth="1"/>
                                  <circle cx="20" cy="20" r="16" fill="url(#platinumInnerGradient2)" stroke="#A9A8A7" strokeWidth="0.5"/>
                                  <text x="20" y="25" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#000" textAnchor="middle">1</text>
                                  <defs>
                                    <radialGradient id="platinumGradient2" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25">
                                      <stop offset="0%" stopColor="#FFFFFF" />
                                      <stop offset="50%" stopColor="#E5E4E2" />
                                      <stop offset="100%" stopColor="#9A9A9A" />
                                    </radialGradient>
                                    <linearGradient id="platinumInnerGradient2" x1="0" y1="0" x2="1" y2="1">
                                      <stop offset="0%" stopColor="#FFFFFF" />
                                      <stop offset="50%" stopColor="#E5E4E2" />
                                      <stop offset="100%" stopColor="#C0C0C0" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </div>
                            ) : index === 1 ? (
                              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="20" cy="20" r="19" fill="url(#silverGradient)" stroke="#C0C0C0" strokeWidth="1"/>
                                  <circle cx="20" cy="20" r="16" fill="url(#silverInnerGradient)" stroke="#A0A0A0" strokeWidth="0.5"/>
                                  <text x="20" y="25" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#000" textAnchor="middle">2</text>
                                  <defs>
                                    <radialGradient id="silverGradient" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25">
                                      <stop offset="0%" stopColor="#FFFFFF" />
                                      <stop offset="50%" stopColor="#E0E0E0" />
                                      <stop offset="100%" stopColor="#B0B0B0" />
                                    </radialGradient>
                                    <linearGradient id="silverInnerGradient" x1="0" y1="0" x2="1" y2="1">
                                      <stop offset="0%" stopColor="#FFFFFF" />
                                      <stop offset="100%" stopColor="#C0C0C0" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </div>
                            ) : index === 2 ? (
                              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="20" cy="20" r="19" fill="url(#bronzeGradient)" stroke="#CD7F32" strokeWidth="1"/>
                                  <circle cx="20" cy="20" r="16" fill="url(#bronzeInnerGradient)" stroke="#A56025" strokeWidth="0.5"/>
                                  <text x="20" y="25" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#000" textAnchor="middle">3</text>
                                  <defs>
                                    <radialGradient id="bronzeGradient" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25">
                                      <stop offset="0%" stopColor="#FFC68C" />
                                      <stop offset="50%" stopColor="#CD7F32" />
                                      <stop offset="100%" stopColor="#A56025" />
                                    </radialGradient>
                                    <linearGradient id="bronzeInnerGradient" x1="0" y1="0" x2="1" y2="1">
                                      <stop offset="0%" stopColor="#FFC68C" />
                                      <stop offset="100%" stopColor="#CD7F32" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </div>
                            ) : index === 3 ? (
                              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="20" cy="20" r="19" fill="url(#goldGradient)" stroke="#FFD700" strokeWidth="1"/>
                                  <circle cx="20" cy="20" r="16" fill="url(#goldInnerGradient)" stroke="#E5C100" strokeWidth="0.5"/>
                                  <text x="20" y="25" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#000" textAnchor="middle">4</text>
                                  <defs>
                                    <radialGradient id="goldGradient" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25">
                                      <stop offset="0%" stopColor="#FFF7C2" />
                                      <stop offset="50%" stopColor="#FFD700" />
                                      <stop offset="100%" stopColor="#E5A100" />
                                    </radialGradient>
                                    <linearGradient id="goldInnerGradient" x1="0" y1="0" x2="1" y2="1">
                                      <stop offset="0%" stopColor="#FFF7C2" />
                                      <stop offset="100%" stopColor="#FFD700" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </div>
                            ) : (
                              <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm bg-gray-950 text-white font-bold">
                                {index + 1}
                              </span>
                            )}
                          </td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <a href={creator.topGame ? `/game/${creator.topGame.id}` : '#'} className="flex-shrink-0">
                                {creator.topGame?.imageUrl ? (
                                  <img src={creator.topGame.imageUrl} alt={creator.topGame.title} className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover hover:opacity-80 transition-opacity" />
                                ) : (
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-gray-900 flex items-center justify-center">
                                    <span className="text-xs text-gray-400">No img</span>
                                  </div>
                                )}
                              </a>
                              <div className="min-w-0">
                                <a 
                                  href={`https://x.com/${creator.xaccount.replace(/^@/, '').replace(/^https?:\/\/(www\.)?x\.com\//i, '')}`} 
                                  target="_blank"
                                  rel="noopener noreferrer" 
                                  className="text-white text-sm sm:text-base font-medium hover:text-green-400 transition-colors truncate block"
                                >
                                  @{creator.xaccount.replace(/^@/, '').replace(/^https?:\/\/(www\.)?x\.com\//i, '')}
                                </a>
                                {creator.topGame && (
                                  <p className="text-xs text-gray-400 truncate">
                                    Top: <a href={`/game/${creator.topGame.id}`} className="hover:text-green-400 transition-colors">{creator.topGame.title}</a>
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 w-[128px] sm:w-[160px]">
                            <div className="h-10 w-full flex items-center">
                              <CombinedTrendIndicator
                                entityId={creator.xaccount}
                                entityType="creator"
                                rankingType="creator"
                                width={480}
                                height={40}
                                showPeriods={[activePeriod]}
                                activePeriod={activePeriod}
                              />
                            </div>
                          </td>
                          <td className="hidden sm:table-cell px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm text-gray-400">{creator.gameCount.toLocaleString()}</td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm font-semibold text-white">{(creator.creatorScore || 0).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {creatorRanking.length > creatorLimit && (
              <div className="py-4 text-center">
                <button 
                  onClick={showMoreCreators}
                  className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Show More
                </button>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 