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
                            <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm ${
                              index < 4 ? 'bg-gray-800' : 'bg-gray-950'
                            } text-white font-bold`}>
                              {index + 1}
                            </span>
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
                                width={960}
                                height={40}
                                showPeriods={[activePeriod]}
                                activePeriod={activePeriod}
                              />
                            </div>
                          </td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm text-gray-400">
                            {game.metrics?.views.toLocaleString()}
                          </td>
                          <td className="hidden sm:table-cell px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm text-gray-400">{game.metrics?.plays.toLocaleString()}</td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm text-white">{(game.popularityScore || 0).toLocaleString()}</td>
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
                            <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm ${
                              index < 4 ? 'bg-gray-800' : 'bg-gray-950'
                            } text-white font-bold`}>
                              {index + 1}
                            </span>
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
                                width={960}
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
                              <span className="font-semibold text-white">
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
                            <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm ${
                              index < 4 ? 'bg-gray-800' : 'bg-gray-950'
                            } text-white font-bold`}>
                              {index + 1}
                            </span>
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
                                width={960}
                                height={40}
                                showPeriods={[activePeriod]}
                                activePeriod={activePeriod}
                              />
                            </div>
                          </td>
                          <td className="hidden sm:table-cell px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm text-gray-400">{creator.gameCount.toLocaleString()}</td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-right text-xs sm:text-sm text-white">{(creator.creatorScore || 0).toLocaleString()}</td>
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