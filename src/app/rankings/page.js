'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import CombinedTrendIndicator from '@/components/CombinedTrendIndicator';

export default function RankingsPage() {
  const [activityGames, setActivityGames] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityLimit, setActivityLimit] = useState(10);
  const [activityPeriod, setActivityPeriod] = useState('24h');
  const [activitySortBy, setActivitySortBy] = useState('views');

  const activityTimePeriods = [
    { id: '24h', label: '24h' },
    { id: '7d', label: '7d' },
    { id: '30d', label: '30d' },
    { id: '90d', label: '90d' },
    { id: '1y', label: '1y' },
  ];

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setActivityLoading(true);
        const response = await fetch(`/api/rankings/activity?period=${activityPeriod}`);
        
        if (response.ok) {
          const data = await response.json();
          setActivityGames(data);
        }
      } catch (error) {
        console.error('Error fetching activity data:', error);
      } finally {
        setActivityLoading(false);
      }
    };
    
    fetchActivityData();
  }, [activityPeriod]);

  const showMoreActivity = () => {
    setActivityLimit(prev => prev + 10);
  };

  const sortActivityGames = (games, sortBy) => {
    return [...games].sort((a, b) => {
      return b.activityMetrics[sortBy] - a.activityMetrics[sortBy];
    });
  };

  const handleActivitySort = (sortBy) => {
    setActivitySortBy(sortBy);
  };

  const sortedActivityGames = activityGames.length > 0 ? sortActivityGames(activityGames, activitySortBy) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <AuthNavbar hideSearchBar includeEnrollment />
      
      <main className="flex-grow py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient-purple-pink text-center pb-6">
          Game Rankings
        </h1>
          
          {/* Activity Rankings Section */}
          <div>
            <div className="bg-gradient-to-r from-purple-800 to-purple-600 rounded-t-xl px-6 py-4">
              <h3 className="text-xl font-bold text-white text-center">Activity Rankings</h3>
              <p className="text-purple-100 text-sm text-center">
              Based on activity in the last {activityPeriod === '24h' ? '24 hours' : 
                activityPeriod === '7d' ? '7 days' : 
                activityPeriod === '30d' ? '30 days' : 
                activityPeriod === '90d' ? '90 days' : '1 year'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
            <div className="bg-gray-900 p-1 rounded-lg inline-flex flex-wrap justify-center mb-2 sm:mb-0">
              <button 
                onClick={() => handleActivitySort('views')}
                className={`px-4 py-2 rounded-md text-sm ${
                  activitySortBy === 'views' 
                      ? 'bg-purple-600 text-white' 
                    : 'text-grok-text-secondary hover:text-white'
                }`}
              >
                Views
              </button>
              <button 
                onClick={() => handleActivitySort('plays')}
                className={`px-4 py-2 rounded-md text-sm ${
                  activitySortBy === 'plays' 
                      ? 'bg-purple-600 text-white' 
                    : 'text-grok-text-secondary hover:text-white'
                }`}
              >
                Plays
              </button>
              <button 
                onClick={() => handleActivitySort('likes')}
                className={`px-4 py-2 rounded-md text-sm ${
                  activitySortBy === 'likes' 
                      ? 'bg-purple-600 text-white' 
                    : 'text-grok-text-secondary hover:text-white'
                }`}
              >
                Likes
              </button>
              <button 
                onClick={() => handleActivitySort('dislikes')}
                className={`px-4 py-2 rounded-md text-sm ${
                  activitySortBy === 'dislikes' 
                      ? 'bg-purple-600 text-white' 
                    : 'text-grok-text-secondary hover:text-white'
                }`}
              >
                Dislikes
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg inline-flex">
              {activityTimePeriods.map(period => (
                <button
                  key={period.id}
                  onClick={() => setActivityPeriod(period.id)}
                  className={`px-3 py-1.5 text-xs ${
                    activityPeriod === period.id
                      ? 'bg-gray-700 text-white rounded-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Information note about activity data */}
          <div className="text-center mb-6">
            <p className="text-xs text-gray-400 bg-gray-900/50 inline-block px-3 py-1 rounded-md">
              Note: Activity data is updated daily and represents cumulative metrics for the selected time period.
            </p>
          </div>

          {/* Mobile helper text for horizontal scrolling */}
          <div className="text-center mb-4 sm:hidden">
            <p className="text-xs text-gray-400 italic">
              ← Swipe horizontally to see more →
            </p>
          </div>

          {activityLoading && (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}

          {!activityLoading && (
              <div className="bg-gradient-to-b from-purple-900/20 to-black rounded-xl overflow-hidden">
              <div className="overflow-x-auto overflow-y-visible -mx-4 sm:mx-0 pb-4 touch-pan-x">
                <div className="w-full min-w-[500px]">
                  <table className="w-full table-auto">
                    <thead>
                        <tr className="border-b border-purple-900/50">
                        <th className="w-[60px] px-3 py-3 text-center text-xs text-gray-400">Rank</th>
                        <th className="px-3 py-3 text-left text-xs text-gray-400">Game</th>
                        <th className="w-[80px] px-3 py-3 text-center text-xs text-gray-400">Views</th>
                        <th className="w-[80px] px-3 py-3 text-center text-xs text-gray-400">Plays</th>
                        <th className="w-[80px] px-3 py-3 text-center text-xs text-gray-400">Likes</th>
                        <th className="w-[80px] px-3 py-3 text-center text-xs text-gray-400">Dislikes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedActivityGames.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                              No activity data available for the selected period
                          </td>
                        </tr>
                      ) : (
                        sortedActivityGames.slice(0, activityLimit).map((game, index) => (
                            <tr key={game.id} className="border-b border-purple-900/30 hover:bg-purple-900/10 transition-colors">
                            <td className="px-3 py-3 text-center">
                              <span className="text-xs text-white font-bold">
                                {index + 1}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center space-x-2">
                                <a href={`/game/${game.id}`} className="flex-shrink-0">
                                  {game.imageUrl ? (
                                    <img src={game.imageUrl} alt={game.title} className="w-7 h-7 sm:w-10 sm:h-10 rounded-md object-cover hover:opacity-80 transition-opacity" />
                                  ) : (
                                    <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-md bg-gray-900 flex items-center justify-center">
                                      <span className="text-xs text-gray-400">No img</span>
                                    </div>
                                  )}
                                </a>
                                <div className="min-w-0 max-w-[120px] sm:max-w-none">
                                    <Link href={`/game/${game.id}`} className="text-white text-xs sm:text-base font-medium hover:text-purple-400 transition-colors truncate block">
                                    {game.title}
                                  </Link>
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
                            <td className="px-3 py-3 text-center">
                                <span className={`text-xs ${activitySortBy === 'views' ? 'text-white font-bold' : 'text-gray-400'}`}>
                                {game.activityMetrics.views.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                                <span className={`text-xs ${activitySortBy === 'plays' ? 'text-white font-bold' : 'text-gray-400'}`}>
                                {game.activityMetrics.plays.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                                <span className={`text-xs ${activitySortBy === 'likes' ? 'text-white font-bold' : 'text-gray-400'}`}>
                                {game.activityMetrics.likes.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                                <span className={`text-xs ${activitySortBy === 'dislikes' ? 'text-white font-bold' : 'text-gray-400'}`}>
                                {game.activityMetrics.dislikes.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {sortedActivityGames.length > activityLimit && (
                <div className="py-4 text-center">
                  <button 
                    onClick={showMoreActivity}
                      className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Show More
                  </button>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 