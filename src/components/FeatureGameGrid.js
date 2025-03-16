'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { trackGamePlay } from '@/lib/metricsUtil';

// Featured games grid component for the hero section
export default function FeatureGameGrid() {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  
  // Format the date if available using native JavaScript
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };
  
  // Fetch featured games from the API
  useEffect(() => {
    const fetchFeaturedGames = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/games?limit=5&sort=popular&featured=true');
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured games');
        }
        
        const data = await response.json();
        if (data.games && data.games.length > 0) {
          setFeaturedGames(data.games);
        } else {
          // Fallback data
          setFeaturedGames([
            {
              id: 'featured-game-1',
              title: 'Featured Game',
              creator: 'Grokade Team',
              description: 'A featured game with amazing gameplay',
              image: null,
              plays: 248,
              views: 471,
              isLive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              playUrl: 'https://example.com/play/featured-game-1'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching featured games:', error);
        // Use fallback data
        setFeaturedGames([
          {
            id: 'featured-game-1',
            title: 'Featured Game',
            creator: 'Grokade Team',
            description: 'A featured game with amazing gameplay',
            image: null,
            plays: 248,
            views: 471,
            isLive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            playUrl: 'https://example.com/play/featured-game-1'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedGames();
  }, []);
  
  // Handle play button click
  const handlePlayClick = (e, game) => {
    e.preventDefault();
    
    if (game && game.id) {
      trackGamePlay(game.id)
        .then(result => {
          console.log('Featured game play tracked:', result);
          // Update the local play count if available from the API
          if (result && result.metrics && result.metrics.plays !== undefined) {
            setFeaturedGames(prev => 
              prev.map(g => 
                g.id === game.id 
                  ? {...g, plays: result.metrics.plays}
                  : g
              )
            );
          }
          // Use window.location.href instead of window.open for better mobile compatibility
          window.location.href = game.playUrl;
        })
        .catch(error => {
          console.error('Error tracking featured game play:', error);
          window.location.href = game.playUrl;
        });
    } else if (game && game.playUrl) {
      window.location.href = game.playUrl;
    }
  };
  
  // Navigation handlers
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredGames.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === featuredGames.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  if (loading) {
    return (
      <div className="w-full lg:w-3/5 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  if (featuredGames.length === 0) {
    return null;
  }
  
  const featuredGame = featuredGames[currentIndex];
  
  return (
    <div className="w-full relative">
      {/* Navigation buttons - MOVED OUTSIDE the game container */}
      {featuredGames.length > 1 && (
        <>
          <button 
            onClick={goToPrevious} 
            className="absolute left-[-25px] top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1.5 focus:outline-none transition-colors duration-200"
            aria-label="Previous game"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={goToNext} 
            className="absolute right-[-25px] top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1.5 focus:outline-none transition-colors duration-200"
            aria-label="Next game"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <div className="relative w-full md:w-11/12 mx-auto aspect-video bg-grok-darker rounded-lg overflow-hidden shadow-xl group">
        {/* Featured game image */}
        <div className="w-full h-full bg-black bg-opacity-60 flex items-center justify-center">
          {featuredGame.image ? (
            <img 
              src={featuredGame.image} 
              alt={featuredGame.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-purple-500">FEATURED</div>
              <h3 className="text-white font-semibold text-lg mt-2">{featuredGame.title}</h3>
            </div>
          )}
        </div>
        
        {/* Status badges - TOP LEVEL INFO (removed metrics) */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-1.5">
          <div className="flex items-center space-x-1.5">
            <div className="bg-purple-600 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center">
              FEATURED
            </div>
          </div>
          
          <div className="flex items-center space-x-1.5">
            {featuredGame.isLive && (
              <div className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                LIVE
              </div>
            )}
          </div>
        </div>
        
        {/* Play count overlay - on left side of thumbnail */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 rounded-md px-2 py-1 flex items-center z-20">
          <svg className="w-4 h-4 mr-1 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5V19L19 12L8 5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white text-xs">{featuredGame.plays || 0}</span>
        </div>
        
        {/* View count overlay - on right side of thumbnail */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 rounded-md px-2 py-1 flex items-center z-20">
          <svg className="w-4 h-4 mr-1 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4C5 4 1 12 1 12C1 12 5 20 12 20C19 20 23 12 23 12C23 12 19 4 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white text-xs">{featuredGame.views || 0}</span>
        </div>
        
        {/* Slide-up action buttons overlay - SHOWCASE STYLING */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 to-black/90 flex flex-col justify-between items-center px-6 py-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out overflow-y-auto">
          <div className="w-full">
            {/* Title with enhanced styling */}
            <h3 className="text-white font-bold break-words whitespace-normal line-clamp-2 text-xl mb-2 tracking-tight">{featuredGame.title}</h3>
            <p className="text-purple-300 text-sm font-medium">By: {featuredGame.creator || 'Unknown'}</p>
            
            {/* Description with improved readability */}
            <div className="bg-black/30 backdrop-blur-sm rounded-md px-3 py-2 mt-3 mb-3 border-l-2 border-purple-500">
              <p className="text-gray-200 text-sm leading-relaxed line-clamp-3">
                {featuredGame.description || 'No description available'}
              </p>
            </div>
            
            {/* Metrics data - Styled to stand out and mobile-friendly */}
            <div className="flex items-center justify-between my-3">
              {/* Time indicator - Cleaner look */}
              <div className="flex items-center mb-3 justify-end">
                <svg className="w-3 h-3 text-gray-300 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-gray-300 text-xs font-medium">
                  {formatDate(featuredGame.updatedAt)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action buttons with improved styling for mobile */}
          <div className="w-full flex flex-col gap-2 mt-auto pb-2">
            <Link 
              href={`/game/${featuredGame.id}`} 
              className="w-full text-center bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-md transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
            >
              View Game
            </Link>
            <a 
              href={featuredGame.playUrl || '#'} 
              onClick={(e) => handlePlayClick(e, featuredGame)}
              className="w-full text-center bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-md transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-1.5 inline-block" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 5V19L19 12L5 5Z" fill="currentColor" />
              </svg>
              Play Now
            </a>
          </div>
        </div>
      </div>
      
      {/* Pagination indicators - BACK AT BOTTOM of game container */}
      {featuredGames.length > 1 && (
        <div className="flex justify-center mt-4 mb-2 space-x-3">
          {featuredGames.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full focus:outline-none transition-colors duration-200 ${
                index === currentIndex ? 'bg-purple-500' : 'bg-gray-400 bg-opacity-70'
              }`}
              aria-label={`Go to game ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 