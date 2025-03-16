'use client';

import Link from 'next/link';
import { useState } from 'react';
import { trackGamePlay } from '@/lib/metricsUtil';

export default function GameCard({ game, onMetricsUpdate }) {
  const [localPlays, setLocalPlays] = useState(game?.plays || 0);
  
  // Default game object if none provided
  const defaultGame = {
    id: 'brick-breaker',
    title: 'Brick Breaker',
    creator: 'Grokade Team',
    description: 'Classic brick breaking game with paddle and power-ups',
    plays: 120,
    views: 240,
    isLive: true,
    image: null,
    playUrl: '#'
  };

  // Use provided game or default
  game = game || defaultGame;
  
  // Format the date if available using native JavaScript
  const formattedDate = game.createdAt 
    ? formatRelativeTime(new Date(game.createdAt))
    : 'Just now';
  
  // Simple function to format relative time without external dependencies
  function formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 30) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
  }

  // Handle play button click
  const handlePlayClick = (e) => {
    e.preventDefault();
    
    if (game && game.id) {
      trackGamePlay(game.id)
        .then(result => {
          console.log('Game play tracked from card:', result);
          // Update the local plays count if available from API
          if (result && result.metrics && result.metrics.plays !== undefined) {
            setLocalPlays(result.metrics.plays);
            // If there's a callback for metrics updates, call it
            if (onMetricsUpdate) {
              onMetricsUpdate(game.id, { plays: result.metrics.plays });
            }
          }
          window.open(game.playUrl, '_blank');
        })
        .catch(error => {
          console.error('Error tracking game play from card:', error);
          window.open(game.playUrl, '_blank');
        });
    } else if (game && game.playUrl) {
      window.open(game.playUrl, '_blank');
    }
  };

  return (
    <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-md overflow-hidden shadow-lg h-full flex flex-col group">
      <div className="relative">
        {/* Game thumbnail/image */}
        <div className="h-40 bg-black bg-opacity-60 flex items-center justify-center overflow-hidden">
          {(() => {
            // Default image path - using SVG now
            const defaultImageUrl = '/images/default-game-cover.svg';
            
            return game.image ? (
              <img 
                src={game.image} 
                alt={game.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(`[GameCard] Failed to load image for game ${game.id}:`, game.image);
                  e.target.style.display = 'none';
                  // Replace with stylish fallback
                  e.target.parentNode.innerHTML = `
                    <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900/30 to-black">
                      <div class="text-4xl font-bold text-grok-purple mb-2">
                        ${game.title.slice(0, 1).toUpperCase()}
                      </div>
                      <div class="text-sm text-grok-purple/80 text-center px-4">
                        ${game.title}
                      </div>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900/30 to-black">
                <div className="text-4xl font-bold text-grok-purple mb-2">
                  {game.title.slice(0, 1).toUpperCase()}
                </div>
                <div className="text-sm text-grok-purple/80 text-center px-4">
                  {game.title}
                </div>
              </div>
            );
          })()}
          
          {/* Live indicator */}
          {game.isLive && (
            <div className="absolute top-2 right-2 z-10">
              <span className="bg-grok-live text-grok-dark text-xs font-semibold px-2 py-1 rounded">LIVE</span>
            </div>
          )}
          
          {/* Play count overlay - now on left side */}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 rounded-md px-2 py-1 flex items-center z-20">
            {/* Play button icon */}
            <svg className="w-4 h-4 mr-1 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5V19L19 12L8 5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-white text-xs">{localPlays}</span>
          </div>
          
          {/* View count overlay - now on right side */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 rounded-md px-2 py-1 flex items-center z-20">
            {/* Eye icon for views */}
            <svg className="w-4 h-4 mr-1 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4C5 4 1 12 1 12C1 12 5 20 12 20C19 20 23 12 23 12C23 12 19 4 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-white text-xs">{game.views ?? 0}</span>
          </div>
        </div>
      </div>
    
      <div className="p-4 flex flex-col flex-grow relative">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-white font-semibold">{game.title}</h3>
        </div>
        <div className="text-xs text-grok-text-secondary mb-2">
          By: {game.creator}
        </div>
        <p className="text-grok-text-secondary text-sm mb-4 flex-grow">
          {game.description}
        </p>
        
        <div className="flex justify-end items-center text-xs text-grok-text-secondary">
          <div className="flex items-center">
            {/* Clock icon for time */}
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6L12 12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {formattedDate}
          </div>
        </div>
        
        {/* Slide-up action buttons overlay for the content section */}
        <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center px-4 gap-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
          <Link 
            href={`/game/${game.id}`}
            className="w-full text-center bg-grok-purple hover:bg-purple-700 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm"
          >
            View Game
          </Link>
          <a 
            href={game.playUrl || '#'} 
            onClick={handlePlayClick}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center bg-grok-purple hover:bg-purple-700 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm"
          >
            Play Now
          </a>
        </div>
      </div>
    </div>
  );
} 