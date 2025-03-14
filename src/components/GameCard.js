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
    isLive: true,
    image: null
  };

  // Use provided game or default
  game = game || defaultGame;

  return (
    <div className="bg-grok-card rounded-md overflow-hidden shadow-lg h-full flex flex-col">
      <div className="relative">
        {/* Game thumbnail/image */}
        <div className="h-40 bg-grok-darker flex items-center justify-center">
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
        <div className="flex justify-between items-center text-xs text-grok-text-secondary mt-auto">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {game.plays} plays
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V16M12 8L8 12M12 8L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Just now
          </div>
        </div>
      </div>
    </div>
  );
} 