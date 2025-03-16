'use client';

import Link from 'next/link';
import { useState } from 'react';
import { trackGamePlay } from '@/lib/metricsUtil';

export default function GameCard({ game, onMetricsUpdate, className = '', ...props }) {
  const [localPlays, setLocalPlays] = useState(game?.plays || 0);
  const [metrics, setMetrics] = useState({
    views: game?.views || 0,
    plays: game?.plays || 0,
    likes: game?.likes || 0,
    dislikes: game?.dislikes || 0
  });
  
  // Default game object if none provided
  const defaultGame = {
    id: 'brick-breaker',
    title: 'Brick Breaker',
    creator: 'Grokade Team',
    description: 'Classic brick breaking game with paddle and power-ups',
    plays: 120,
    views: 240,
    likes: 50,
    dislikes: 5,
    isLive: true,
    thumbnail: 'https://placehold.co/600x400/222/444?text=Game',
    playUrl: '#',
    tags: 'Arcade'
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
            setMetrics(prevMetrics => ({ 
              ...prevMetrics, 
              plays: result.metrics.plays 
            }));
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
    <div 
      className={`group bg-grok-card-bg rounded-lg overflow-hidden flex flex-col h-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${className}`}
      {...props}
    >
      <div className="aspect-video relative overflow-hidden">
        {/* Game thumbnail */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50"></div>
        <img 
          src={game.thumbnail || defaultGame.thumbnail} 
          alt={game.title} 
          className="w-full h-full object-cover"
        />

        {/* Live indicator if game is live */}
        {game.isLive && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
            <div className="w-2 h-2 rounded-full bg-white mr-1 animate-pulse"></div>
            LIVE
          </div>
        )}

        {/* Overlay with play and view counts */}
        <div className="absolute bottom-0 w-full flex justify-between items-center p-2 text-white">
          <div className="flex items-center space-x-3">
            {/* Views */}
            <div className="flex items-center text-xs bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {game.views || 0}
            </div>

            {/* Plays */}
            <div className="flex items-center text-xs bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3L19 12L5 21V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {localPlays}
            </div>
          </div>

          {/* Likes/Dislikes */}
          <div className="flex items-center space-x-3">
            {/* Likes */}
            <div className="flex items-center text-xs bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {game.likes || 0}
            </div>

            {/* Dislikes */}
            <div className="flex items-center text-xs bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 2H20C20.5304 2 21.0391 2.21071 21.4142 2.58579C21.7893 2.96086 22 3.46957 22 4V11C22 11.5304 21.7893 12.0391 21.4142 12.4142C21.0391 12.7893 20.5304 13 20 13H17M10 15V19C10 19.7956 10.3161 20.5587 10.8787 21.1213C11.4413 21.6839 12.2044 22 13 22L17 13V2H5.72C5.2377 1.99448 4.76962 2.16359 4.40209 2.47599C4.03457 2.78839 3.79225 3.22309 3.72 3.7L2.34 12.7C2.29651 12.9866 2.31583 13.2793 2.39666 13.5577C2.47749 13.8362 2.61791 14.0937 2.8081 14.3125C2.99829 14.5313 3.23385 14.7061 3.49836 14.8248C3.76287 14.9435 4.05014 15.0033 4.34 15H10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {game.dislikes || 0}
            </div>
          </div>
        </div>
      </div>
    
      <div className="p-4 flex flex-col flex-grow relative">
        <h3 className="text-white font-bold text-lg tracking-tight leading-tight mb-1.5 line-clamp-1">{game.title}</h3>
        <div className="flex items-center text-xs mb-2">
          <span className="text-purple-400 font-medium">By: {game.creator}</span>
        </div>
        
        {/* Game type indicator - visual separator */}
        <div className="mb-3 flex">
          <div className="bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-gray-300 border-l-2 border-purple-500">
            {game.tags || 'Game'}
          </div>
        </div>
        
        <p className="text-gray-300 text-sm mb-3 flex-grow line-clamp-2 leading-relaxed">
          {game.description}
        </p>
        
        <div className="flex justify-end items-center text-xs">
          <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5 text-gray-300">
            {/* Clock icon for time */}
            <svg className="w-3 h-3 mr-1.5 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6L12 12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium">{formattedDate}</span>
          </div>
        </div>
        
        {/* Slide-up action buttons overlay for the content section */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/80 flex flex-col justify-center items-center px-4 gap-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-10 backdrop-blur-sm">
          <Link 
            href={`/game/${game.id}`}
            className="w-full text-center bg-grok-purple hover:bg-purple-700 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
          >
            View Game
          </Link>
          <a 
            href={game.playUrl || '#'} 
            onClick={handlePlayClick}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-purple-500/30"
          >
            Play Now
          </a>
        </div>
      </div>
    </div>
  );
} 