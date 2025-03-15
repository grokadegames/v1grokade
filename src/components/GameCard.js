'use client';

import Link from 'next/link';

export default function GameCard({ game }) {
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

  return (
    <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-md overflow-hidden shadow-lg h-full flex flex-col">
      <div className="relative">
        {/* Game thumbnail/image */}
        <div className="h-40 bg-black bg-opacity-60 flex items-center justify-center">
          {game.image ? (
            <img 
              src={game.image} 
              alt={game.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 7L21 7" stroke="currentColor" strokeWidth="2" />
                <path d="M7 21L7 7" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Live indicator */}
        {game.isLive && (
          <div className="absolute top-2 right-2">
            <span className="bg-grok-live text-grok-dark text-xs font-semibold px-2 py-1 rounded">LIVE</span>
          </div>
        )}
        
        {/* View count overlay - left side */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 rounded-md px-2 py-1 flex items-center">
          {/* Eye icon for views */}
          <svg className="w-4 h-4 mr-1 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4C5 4 1 12 1 12C1 12 5 20 12 20C19 20 23 12 23 12C23 12 19 4 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white text-xs">{game.views ?? 0}</span>
        </div>
        
        {/* Play count overlay - right side */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 rounded-md px-2 py-1 flex items-center">
          {/* Play button icon */}
          <svg className="w-4 h-4 mr-1 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5V19L19 12L8 5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white text-xs">{game.plays ?? 0}</span>
        </div>
      </div>
    
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-white font-semibold">{game.title}</h3>
        </div>
        <div className="text-xs text-grok-text-secondary mb-2">
          By: {game.creator}
        </div>
        <p className="text-grok-text-secondary text-sm mb-4 flex-grow">
          {game.description}
        </p>
      </div>
      
      <div className="px-4 pb-4">
        <div className="flex gap-2 mt-4">
          <Link 
            href={`/game/${game.id}`}
            className="flex-1 text-center bg-grok-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            View Game
          </Link>
          <a 
            href={game.playUrl || '#'} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-grok-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            Play Now
          </a>
        </div>
        <div className="flex justify-end items-center text-xs text-grok-text-secondary mt-3">
          <div className="flex items-center">
            {/* Clock icon for time */}
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6L12 12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {formattedDate}
          </div>
        </div>
      </div>
    </div>
  );
} 