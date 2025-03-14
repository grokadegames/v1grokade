'use client';

import { useState, useRef, useEffect } from 'react';
import GameCard from './GameCard';

export default function GameGrid() {
  const [filter, setFilter] = useState('production');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const gamesContainerRef = useRef(null);
  
  // Fetch games from the API
  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      queryParams.append('sort', sortOrder);
      
      const response = await fetch(`/api/games?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch games');
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
  
  // Fetch games when component mounts or when search/sort changes
  useEffect(() => {
    fetchGames();
  }, [searchTerm, sortOrder]);
  
  // Implement horizontal scrolling
  useEffect(() => {
    const container = gamesContainerRef.current;
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const onMouseDown = (e) => {
      isDown = true;
      container.classList.add('active');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      container.classList.remove('active');
    };

    const onMouseUp = () => {
      isDown = false;
      container.classList.remove('active');
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      container.scrollLeft = scrollLeft - walk;
    };

    // Add event listeners
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);

    // Cleanup
    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div className="py-12 bg-grok-dark" id="games-section">
      <div className="container-custom mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          {/* Left side filters */}
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded-md text-sm ${filter === 'production' ? 'bg-grok-purple text-white' : 'bg-grok-card text-white'}`}
              onClick={() => setFilter('production')}
            >
              Production
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm ${filter === 'beta' ? 'bg-grok-purple text-white' : 'bg-grok-card text-white'}`}
              onClick={() => setFilter('beta')}
            >
              Beta
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm ${filter === 'all' ? 'bg-grok-purple text-white' : 'bg-grok-card text-white'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
          </div>
          
          {/* Right side search and sort */}
          <div className="flex space-x-2 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <input 
                type="text" 
                placeholder="Search games..."
                className="w-full bg-grok-card text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-grok-purple"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-3 top-2.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            
            <select 
              className="bg-grok-card text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-grok-purple"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
        
        {/* Game cards horizontal scroll container */}
        <div className="relative">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-grok-purple"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-white">{error}</p>
            </div>
          ) : games.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-white">No games found. Try a different search term.</p>
            </div>
          ) : (
            <div 
              ref={gamesContainerRef}
              className="games-container overflow-x-auto scrollbar-hide"
            >
              <div className="flex gap-6 pb-4 min-w-max">
                {games.map((game) => (
                  <div key={game.id} className="w-80">
                    <GameCard game={game} />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Optional: Add navigation arrows */}
          {games.length > 0 && (
            <div className="hidden md:flex items-center justify-between absolute top-1/2 w-full -translate-y-1/2 pointer-events-none">
              <button 
                className="bg-grok-card p-2 rounded-full shadow-lg pointer-events-auto" 
                onClick={() => { gamesContainerRef.current.scrollLeft -= 300; }}
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                className="bg-grok-card p-2 rounded-full shadow-lg pointer-events-auto" 
                onClick={() => { gamesContainerRef.current.scrollLeft += 300; }}
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Add some CSS to hide scrollbar but keep functionality */}
        <style jsx>{`
          .games-container {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;     /* Firefox */
          }
          .games-container::-webkit-scrollbar {
            display: none;             /* Chrome, Safari and Opera */
          }
          .games-container.active {
            cursor: grabbing;
          }
        `}</style>
      </div>
    </div>
  );
} 