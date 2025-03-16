'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Fallback data in case API fails
const FALLBACK_FEATURED_GAMES = [
  {
    id: 'brick-breaker',
    title: 'Brick Breaker',
    creator: 'Grokade Team',
    description: 'Classic brick breaking game with paddle and power-ups',
    playUrl: 'https://example.com/brick-breaker',
    image: null,
    createdAt: new Date().toISOString(),
    isLive: true,
    plays: 120,
    views: 245,
    featured: true
  },
  {
    id: 'snake',
    title: 'Snake Game',
    creator: 'Grokade Team',
    description: 'Classic snake game - grow as you eat and avoid walls!',
    playUrl: 'https://example.com/snake',
    image: null,
    createdAt: new Date().toISOString(),
    isLive: true,
    plays: 85,
    views: 167,
    featured: true
  },
  {
    id: 'tetris',
    title: 'Tetris',
    creator: 'Grokade Team',
    description: 'The classic block-stacking puzzle game',
    playUrl: 'https://example.com/tetris',
    image: null,
    createdAt: new Date().toISOString(),
    isLive: true,
    plays: 210,
    views: 318,
    featured: true
  }
];

export default function FeatureGameGrid() {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const featuredContainerRef = useRef(null);
  
  // Fetch featured games from the API
  const fetchFeaturedGames = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallback(false);
      
      console.log('[FeatureGameGrid] Fetching featured games from API...');
      
      const response = await fetch('/api/games?featured=true');
      
      if (!response.ok) {
        console.error('[FeatureGameGrid] API response not ok:', response.status);
        throw new Error(`Failed to fetch featured games: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[FeatureGameGrid] Received featured games:', data.games?.length || 0);
      
      if (data.games && data.games.length > 0) {
        setFeaturedGames(data.games);
      } else {
        console.warn('[FeatureGameGrid] No featured games found in API response, using fallback');
        setFeaturedGames(FALLBACK_FEATURED_GAMES);
        setUsingFallback(true);
      }
    } catch (err) {
      console.error('[FeatureGameGrid] Error fetching featured games:', err);
      
      // Use fallback data
      console.log('[FeatureGameGrid] Using fallback featured game data');
      setFeaturedGames(FALLBACK_FEATURED_GAMES);
      setUsingFallback(true);
      setError('Unable to fetch live data. Showing sample featured games instead.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch featured games when component mounts
  useEffect(() => {
    fetchFeaturedGames();
  }, []);
  
  // Implement horizontal scrolling
  useEffect(() => {
    const container = featuredContainerRef.current;
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

  // Featured Game Card component
  const FeaturedGameCard = ({ game }) => {
    return (
      <div className="game-card-container w-full max-w-[320px] sm:max-w-md bg-black bg-opacity-50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg relative mx-auto group">
        {/* Featured Badge */}
        <div className="absolute top-4 right-4 bg-grok-purple text-white text-xs font-semibold px-3 py-1 rounded-md z-10">
          FEATURED
        </div>
        
        {/* Game Icon */}
        <div className="aspect-video bg-black bg-opacity-60 flex items-center justify-center relative overflow-hidden">
          {game.image ? (
            <img 
              src={game.image} 
              alt={game.title} 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="4" rx="1" fill="currentColor" />
                <rect x="2" y="10" width="8" height="4" rx="1" fill="currentColor" />
                <rect x="12" y="10" width="10" height="4" rx="1" fill="currentColor" />
                <rect x="2" y="16" width="14" height="4" rx="1" fill="currentColor" />
                <circle cx="12" cy="20" r="2" fill="currentColor" />
                <path d="M12 18V13" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          )}
          
          {/* View count overlay - left side */}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 rounded-md px-2 py-1 flex items-center z-20">
            {/* Eye icon for views */}
            <svg className="w-4 h-4 mr-1 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4C5 4 1 12 1 12C1 12 5 20 12 20C19 20 23 12 23 12C23 12 19 4 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-white text-xs">{game.views ?? 0}</span>
          </div>
          
          {/* Play count overlay - right side */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 rounded-md px-2 py-1 flex items-center z-20">
            {/* Play button icon */}
            <svg className="w-4 h-4 mr-1 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5V19L19 12L8 5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-white text-xs">{game.plays ?? 0}</span>
          </div>
        </div>
        
        {/* Game Info with hover effect */}
        <div className="relative">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 break-words whitespace-normal line-clamp-2">
              {game.title}
            </h3>
            <p className="text-grok-text-secondary mb-3 sm:mb-4">
              By: {game.creator}
            </p>
          </div>
          
          {/* Slide-up action buttons overlay - positioned over text content */}
          <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center px-4 gap-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
            <Link 
              href={`/game/${game.id}`}
              className="w-full text-center bg-grok-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              View Game
            </Link>
            
            <a 
              href={game.playUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-grok-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Play Now
            </a>
          </div>
        </div>
      </div>
    );
  };

  // State to track the current game index
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  
  // Function to go to the next game
  const nextGame = () => {
    setCurrentGameIndex((prevIndex) => 
      prevIndex === featuredGames.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Function to go to the previous game
  const prevGame = () => {
    setCurrentGameIndex((prevIndex) => 
      prevIndex === 0 ? featuredGames.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="w-full lg:w-1/2 mt-8 lg:mt-0 flex items-center justify-center">
      {loading ? (
        <div className="flex justify-center items-center h-[320px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-grok-purple"></div>
        </div>
      ) : featuredGames.length === 0 ? (
        <div className="text-center text-white">No featured games available</div>
      ) : (
        <div className="relative w-full max-w-[320px] sm:max-w-md">
          {/* Current featured game */}
          <FeaturedGameCard game={featuredGames[currentGameIndex]} />
          
          {/* Navigation arrows - moved on top of image with transparent background */}
          {featuredGames.length > 1 && (
            <div className="flex items-center justify-between absolute top-[25%] w-full -translate-y-1/2 pointer-events-none px-2">
              <button 
                className="bg-black bg-opacity-25 hover:bg-opacity-50 p-2 rounded-full shadow-lg pointer-events-auto transition-all" 
                onClick={prevGame}
                aria-label="Previous game"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                className="bg-black bg-opacity-25 hover:bg-opacity-50 p-2 rounded-full shadow-lg pointer-events-auto transition-all" 
                onClick={nextGame}
                aria-label="Next game"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Game pagination indicators */}
          {featuredGames.length > 1 && (
            <div className="flex justify-center mt-4">
              {featuredGames.map((_, index) => (
                <button 
                  key={index}
                  className={`w-2 h-2 mx-1 rounded-full ${currentGameIndex === index ? 'bg-grok-purple' : 'bg-gray-600'}`}
                  onClick={() => setCurrentGameIndex(index)}
                  aria-label={`Go to game ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 