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
          window.open(game.playUrl, '_blank');
        })
        .catch(error => {
          console.error('Error tracking featured game play:', error);
          window.open(game.playUrl, '_blank');
        });
    } else if (game && game.playUrl) {
      window.open(game.playUrl, '_blank');
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
            className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1.5 focus:outline-none transition-colors duration-200"
            aria-label="Previous game"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={goToNext} 
            className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1.5 focus:outline-none transition-colors duration-200"
            aria-label="Next game"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <div className="relative w-full aspect-video bg-grok-darker rounded-lg overflow-hidden shadow-xl group">
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
              <div className="text-4xl font-bold text-purple-500">FEATURED</div>
              <h3 className="text-white font-semibold text-xl mt-2">{featuredGame.title}</h3>
            </div>
          )}
        </div>
        
        {/* Status badges and view/play counts - TOP LEVEL INFO */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-2">
          <div className="flex items-center space-x-2">
            <div className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
              FEATURED
            </div>
            <div className="flex items-center bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              <svg className="w-3 h-3 mr-1 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4C5 4 1 12 1 12C1 12 5 20 12 20C19 20 23 12 23 12C23 12 19 4 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{featuredGame.views || 0}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              <svg className="w-3 h-3 mr-1 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
              </svg>
              <span>{featuredGame.plays || 0}</span>
            </div>
            {featuredGame.isLive && (
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                LIVE
              </div>
            )}
          </div>
        </div>
        
        {/* Pagination indicators - BELOW the game container */}
        {featuredGames.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {featuredGames.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full focus:outline-none transition-colors duration-200 ${
                  index === currentIndex ? 'bg-purple-500' : 'bg-gray-400 bg-opacity-50'
                }`}
                aria-label={`Go to game ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Slide-up action buttons overlay - IMPROVED */}
        <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center px-6 gap-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
          <div className="w-full">
            <h3 className="text-white font-semibold break-words whitespace-normal line-clamp-2 text-xl mb-1">{featuredGame.title}</h3>
            <p className="text-gray-400 text-sm truncate">By: {featuredGame.creator || 'Unknown'}</p>
            
            <p className="text-gray-300 text-sm mt-3 mb-4 line-clamp-3">
              {featuredGame.description || 'No description available'}
            </p>
            
            {/* Time indicator */}
            <div className="flex items-center mt-2 mb-6">
              <svg className="w-3 h-3 text-gray-400 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-gray-400 text-xs">
                {formatDate(featuredGame.updatedAt)}
              </span>
            </div>
          </div>
          
          <div className="w-full flex flex-col md:flex-row gap-3 mt-auto">
            <Link 
              href={`/game/${featuredGame.id}`} 
              className="flex-1 text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md transition-colors duration-200 font-medium"
            >
              View Game
            </Link>
            <a 
              href={featuredGame.playUrl || '#'} 
              onClick={(e) => handlePlayClick(e, featuredGame)}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md transition-colors duration-200 font-medium"
            >
              <svg className="w-4 h-4 mr-1 inline-block" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 5V19L19 12L5 5Z" fill="currentColor" />
              </svg>
              Play Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 