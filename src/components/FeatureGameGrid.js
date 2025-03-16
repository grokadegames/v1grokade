'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { trackGamePlay } from '@/lib/metricsUtil';

// Featured games grid component for the hero section
export default function FeatureGameGrid() {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  
  // Fetch featured games from the API
  useEffect(() => {
    const fetchFeaturedGames = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/games?limit=3&sort=popular');
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured games');
        }
        
        const data = await response.json();
        if (data.games && data.games.length > 0) {
          setFeaturedGames(data.games.slice(0, 3));
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
  
  if (loading) {
    return (
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  if (featuredGames.length === 0) {
    return null;
  }
  
  const featuredGame = featuredGames[0];
  
  return (
    <div className="w-full lg:w-1/2 flex justify-center">
      <div className="relative w-full max-w-lg aspect-video bg-grok-darker rounded-lg overflow-hidden shadow-lg group">
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
        
        {/* Featured badge */}
        <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
          FEATURED
        </div>
        
        {/* View count */}
        <div className="absolute bottom-2 left-2 flex items-center px-2 py-1 rounded-full bg-black bg-opacity-70 z-20">
          <svg className="w-4 h-4 mr-1 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4C5 4 1 12 1 12C1 12 5 20 12 20C19 20 23 12 23 12C23 12 19 4 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white text-xs">{featuredGame.views || 0}</span>
        </div>
        
        {/* Play count */}
        <div className="absolute bottom-2 right-2 flex items-center px-2 py-1 rounded-full bg-black bg-opacity-70 z-20">
          <svg className="w-4 h-4 mr-1 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
          </svg>
          <span className="text-white text-xs">{featuredGame.plays || 0}</span>
        </div>
        
        {/* Slide-up action buttons overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center px-4 gap-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
          <Link 
            href={`/game/${featuredGame.id}`} 
            className="w-full text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            View Game
          </Link>
          <a 
            href={featuredGame.playUrl || '#'} 
            onClick={(e) => handlePlayClick(e, featuredGame)}
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            Play Now
          </a>
        </div>
      </div>
    </div>
  );
} 