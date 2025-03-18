'use client';

import { useState, useEffect } from 'react';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';

export default function RankingsPage() {
  const [popularityGames, setPopularityGames] = useState([]);
  const [qualityGames, setQualityGames] = useState([]);
  const [creatorRanking, setCreatorRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('popularity');
  const [popularityLimit, setPopularityLimit] = useState(10);
  const [qualityLimit, setQualityLimit] = useState(10);
  const [creatorLimit, setCreatorLimit] = useState(10);

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
    <div className="min-h-screen bg-grok-darker">
      <AuthNavbar />
      
      <main className="container mx-auto max-w-6xl px-4 py-20">
        <h1 className="text-4xl font-bold text-white text-center mb-2">Game Rankings</h1>
        <p className="text-center text-grok-text-secondary mb-10">
          Discover the most popular and highest quality AI games on the platform
        </p>
        
        {/* Tabs for switching between ranking types */}
        <div className="mb-8 flex justify-center">
          <div className="bg-grok-dark p-1 rounded-lg inline-flex flex-wrap justify-center">
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
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
        
        {/* Popularity Rankings */}
        {!loading && activeTab === 'popularity' && (
          <div className="bg-grok-card rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-900 to-purple-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Popularity Rankings</h2>
              <p className="text-purple-100 text-sm">Based on total views and plays</p>
            </div>
            
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-grok-border">
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm text-grok-text-secondary">Rank</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm text-grok-text-secondary">Game</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-grok-text-secondary">Views</th>
                      <th className="hidden sm:table-cell px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-grok-text-secondary">Plays</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-grok-text-secondary">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularityGames.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-grok-text-secondary">
                          No ranking data available
                        </td>
                      </tr>
                    ) : (
                      popularityGames.slice(0, popularityLimit).map((game, index) => (
                        <tr key={game.id} className="border-b border-grok-border hover:bg-grok-dark/50 transition-colors">
                          <td className="px-2 sm:px-6 py-2 sm:py-4">
                            <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm ${
                              index === 0 ? 'bg-yellow-500' :
                              index === 1 ? 'bg-gray-300' :
                              index === 2 ? 'bg-amber-700' :
                              'bg-grok-darker'
                            } ${index < 3 ? 'text-black' : 'text-white'} font-bold`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <a href={`/game/${game.id}`} className="flex-shrink-0">
                                {game.imageUrl ? (
                                  <img src={game.imageUrl} alt={game.title} className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover hover:opacity-80 transition-opacity" />
                                ) : (
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-grok-dark flex items-center justify-center">
                                    <span className="text-xs text-grok-text-secondary">No img</span>
                                  </div>
                                )}
                              </a>
                              <div className="min-w-0">
                                <a href={`/game/${game.id}`} className="text-white text-sm sm:text-base font-medium hover:text-purple-400 transition-colors truncate block">
                                  {game.title}
                                </a>
                                <p className="text-xs text-grok-text-secondary truncate">
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
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm text-grok-text-secondary">{game.metrics?.views.toLocaleString()}</td>
                          <td className="hidden sm:table-cell px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm text-grok-text-secondary">{game.metrics?.plays.toLocaleString()}</td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm font-semibold text-white">{(game.popularityScore || 0).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Show More Button for Popularity */}
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
        
        {/* Quality Rankings */}
        {!loading && activeTab === 'quality' && (
          <div className="bg-grok-card rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-700 to-fuchsia-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Quality Rankings</h2>
              <p className="text-purple-100 text-sm">Based on likes and dislikes ratio</p>
            </div>
            
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-grok-border">
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm text-grok-text-secondary">Rank</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm text-grok-text-secondary">Game</th>
                      <th className="hidden sm:table-cell px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-grok-text-secondary">Likes</th>
                      <th className="hidden sm:table-cell px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-grok-text-secondary">Dislikes</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-grok-text-secondary">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qualityGames.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-grok-text-secondary">
                          No ranking data available
                        </td>
                      </tr>
                    ) : (
                      qualityGames.slice(0, qualityLimit).map((game, index) => (
                        <tr key={game.id} className="border-b border-grok-border hover:bg-grok-dark/50 transition-colors">
                          <td className="px-2 sm:px-6 py-2 sm:py-4">
                            <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm ${
                              index === 0 ? 'bg-yellow-500' :
                              index === 1 ? 'bg-gray-300' :
                              index === 2 ? 'bg-amber-700' :
                              'bg-grok-darker'
                            } ${index < 3 ? 'text-black' : 'text-white'} font-bold`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <a href={`/game/${game.id}`} className="flex-shrink-0">
                                {game.imageUrl ? (
                                  <img src={game.imageUrl} alt={game.title} className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover hover:opacity-80 transition-opacity" />
                                ) : (
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-grok-dark flex items-center justify-center">
                                    <span className="text-xs text-grok-text-secondary">No img</span>
                                  </div>
                                )}
                              </a>
                              <div className="min-w-0">
                                <a href={`/game/${game.id}`} className="text-white text-sm sm:text-base font-medium hover:text-purple-400 transition-colors truncate block">
                                  {game.title}
                                </a>
                                <p className="text-xs text-grok-text-secondary truncate">
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
                          <td className="hidden sm:table-cell px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm text-grok-text-secondary">{game.metrics?.likes.toLocaleString()}</td>
                          <td className="hidden sm:table-cell px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm text-grok-text-secondary">{game.metrics?.dislikes.toLocaleString()}</td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm">
                            <span className={`font-semibold ${
                              game.qualityScore > 0.8 ? 'text-green-400' : 
                              game.qualityScore > 0.5 ? 'text-yellow-400' : 
                              'text-red-400'
                            }`}>
                              {(game.qualityScore * 100).toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Show More Button for Quality */}
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

        {/* Creator Rankings */}
        {!loading && activeTab === 'creators' && (
          <div className="bg-grok-card rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-fuchsia-600 to-pink-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Creator Rankings</h2>
              <p className="text-purple-100 text-sm">Based on number of games published</p>
            </div>
            
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-grok-border">
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm text-grok-text-secondary">Rank</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm text-grok-text-secondary">Creator</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-grok-text-secondary">Games</th>
                      <th className="hidden sm:table-cell px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-grok-text-secondary">Views</th>
                      <th className="hidden sm:table-cell px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm text-grok-text-secondary">Plays</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creatorRanking.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-grok-text-secondary">
                          No ranking data available
                        </td>
                      </tr>
                    ) : (
                      creatorRanking.slice(0, creatorLimit).map((creator, index) => (
                        <tr key={creator.xaccount} className="border-b border-grok-border hover:bg-grok-dark/50 transition-colors">
                          <td className="px-2 sm:px-6 py-2 sm:py-4">
                            <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm ${
                              index === 0 ? 'bg-yellow-500' :
                              index === 1 ? 'bg-gray-300' :
                              index === 2 ? 'bg-amber-700' :
                              'bg-grok-darker'
                            } ${index < 3 ? 'text-black' : 'text-white'} font-bold`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <a href={creator.topGame ? `/game/${creator.topGame.id}` : '#'} className="flex-shrink-0">
                                {creator.topGame?.imageUrl ? (
                                  <img src={creator.topGame.imageUrl} alt={creator.topGame.title} className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover hover:opacity-80 transition-opacity" />
                                ) : (
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-grok-dark flex items-center justify-center">
                                    <span className="text-xs text-grok-text-secondary">No img</span>
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
                                  <p className="text-xs text-grok-text-secondary truncate">
                                    Top: <a href={`/game/${creator.topGame.id}`} className="hover:text-green-400 transition-colors">{creator.topGame.title}</a>
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm font-semibold text-white">{creator.gameCount.toLocaleString()}</td>
                          <td className="hidden sm:table-cell px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm text-grok-text-secondary">{creator.totalViews.toLocaleString()}</td>
                          <td className="hidden sm:table-cell px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm text-grok-text-secondary">{creator.totalPlays.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Show More Button for Creators */}
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