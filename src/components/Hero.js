'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
  const sponsorsContainerRef = useRef(null);
  const [featuredGame, setFeaturedGame] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch a featured game
  useEffect(() => {
    const fetchFeaturedGame = async () => {
      try {
        const response = await fetch('/api/games?limit=1');
        if (response.ok) {
          const data = await response.json();
          if (data.games && data.games.length > 0) {
            setFeaturedGame(data.games[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching featured game:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedGame();
  }, []);

  useEffect(() => {
    const container = sponsorsContainerRef.current;
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
    <div className="py-16 bg-grok-dark border-b border-grok-card">
      <div className="container-custom mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-purple-500">AI Gaming</span> Vibe Hub
            </h1>
            <p className="text-gray-300 text-lg mb-6">
              Discover, play, and master hundreds of games designed to challenge your skills and entertain. Join our community of gamers today!
            </p>
            <div className="flex space-x-4">
              <a href="#games-section" className="btn-primary">Play Now</a>
              <Link href="/submit" className="btn-secondary">Submit Game</Link>
            </div>
          </div>
          
          {/* Featured Game */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="w-full max-w-[320px] sm:max-w-md bg-grok-card rounded-lg overflow-hidden shadow-lg relative">
              {/* Featured Badge */}
              <div className="absolute top-4 right-4 bg-grok-purple text-white text-xs font-semibold px-3 py-1 rounded-md z-10">
                FEATURED
              </div>
              
              {/* Game Icon */}
              <div className="aspect-video bg-grok-darker flex items-center justify-center">
                {featuredGame && featuredGame.image ? (
                  <img 
                    src={featuredGame.image} 
                    alt={featuredGame.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-grok-card rounded-full flex items-center justify-center">
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
              </div>
              
              {/* Game Info */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                  {loading ? 'Loading...' : (featuredGame ? featuredGame.title : 'Brick Breaker')}
                </h3>
                <p className="text-grok-text-secondary mb-3 sm:mb-4">
                  {loading ? '' : (featuredGame ? `By: ${featuredGame.creator}` : 'Featured Game')}
                </p>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  {featuredGame && (
                    <Link 
                      href={`/game/${featuredGame.id}`}
                      className="px-4 py-2 bg-grok-purple text-white rounded-md text-center hover:bg-purple-700 transition-colors duration-200 text-sm"
                    >
                      View Game
                    </Link>
                  )}
                  
                  <a 
                    href={featuredGame ? featuredGame.playUrl : '#games-section'} 
                    target={featuredGame ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-transparent border border-grok-purple text-white rounded-md text-center hover:bg-grok-purple/10 transition-colors duration-200 text-sm"
                  >
                    Play Now
                  </a>
                </div>
                
                <div className="mt-6 flex justify-between items-center text-xs text-grok-text-secondary">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {featuredGame ? (featuredGame.plays || 0) : 0} plays
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" fill="currentColor" />
                      <path d="M15.5 10C16.3284 10 17 9.32843 17 8.5C17 7.67157 16.3284 7 15.5 7C14.6716 7 14 7.67157 14 8.5C14 9.32843 14.6716 10 15.5 10Z" fill="currentColor" />
                      <path d="M12 17C14.2091 17 16 15.2091 16 13H8C8 15.2091 9.79086 17 12 17Z" fill="currentColor" />
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {featuredGame && featuredGame.createdAt ? 'New' : 'Featured'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sponsors Bar */}
        <div className="mt-16 border-t border-gray-800 pt-6">
          <div className="flex flex-col mb-4">
            <h3 className="text-grok-purple font-semibold mb-4">SPONSORS</h3>
            <div 
              ref={sponsorsContainerRef}
              className="sponsors-container overflow-x-auto scrollbar-hide"
            >
              <div className="flex gap-4 pb-4 min-w-max">
                {/* Sponsor 1 */}
                <div className="flex items-center bg-grok-card px-4 py-3 rounded min-w-[180px]">
                  <div className="w-8 h-8 bg-grok-darker rounded flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-grok-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-white font-medium">Sponsor 1</span>
                </div>
                
                {/* Sponsor 2 */}
                <div className="flex items-center bg-grok-card px-4 py-3 rounded min-w-[180px]">
                  <div className="w-8 h-8 bg-grok-darker rounded flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-grok-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 4H7V6H17V4Z" fill="currentColor" />
                      <path d="M17 8H7V10H17V8Z" fill="currentColor" />
                      <path d="M7 12H9V14H7V12Z" fill="currentColor" />
                      <path d="M13 12H11V14H13V12Z" fill="currentColor" />
                      <path d="M17 12H15V14H17V12Z" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Sponsor 2</span>
                </div>
                
                {/* Sponsor 3 */}
                <div className="flex items-center bg-grok-card px-4 py-3 rounded min-w-[180px]">
                  <div className="w-8 h-8 bg-grok-darker rounded flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-grok-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 8V16M12 8L16 12M12 8L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-white font-medium">Sponsor 3</span>
                </div>
                
                {/* Sponsor 4 */}
                <div className="flex items-center bg-grok-card px-4 py-3 rounded min-w-[180px]">
                  <div className="w-8 h-8 bg-grok-darker rounded flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-grok-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-white font-medium">Sponsor 4</span>
                </div>
                
                {/* Sponsor 5 */}
                <div className="flex items-center bg-grok-card px-4 py-3 rounded min-w-[180px]">
                  <div className="w-8 h-8 bg-grok-darker rounded flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-grok-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-white font-medium">Sponsor 5</span>
                </div>
                
                {/* Sponsor 6 */}
                <div className="flex items-center bg-grok-card px-4 py-3 rounded min-w-[180px]">
                  <div className="w-8 h-8 bg-grok-darker rounded flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-grok-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M12 8L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Sponsor 6</span>
                </div>
                
                {/* Sponsor 7 */}
                <div className="flex items-center bg-grok-card px-4 py-3 rounded min-w-[180px]">
                  <div className="w-8 h-8 bg-grok-darker rounded flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-grok-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-white font-medium">Sponsor 7</span>
                </div>
                
                {/* Sponsor 8 */}
                <div className="flex items-center bg-grok-card px-4 py-3 rounded min-w-[180px]">
                  <div className="w-8 h-8 bg-grok-darker rounded flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-grok-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6H20M4 12H12M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Sponsor 8</span>
                </div>
                
                {/* Sponsor 9 */}
                <div className="flex items-center bg-grok-card px-4 py-3 rounded min-w-[180px]">
                  <div className="w-8 h-8 bg-grok-darker rounded flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-grok-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 8L12 13L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-white font-medium">Sponsor 9</span>
                </div>
                
                {/* Sponsor 10 */}
                <div className="flex items-center bg-grok-card px-4 py-3 rounded min-w-[180px]">
                  <div className="w-8 h-8 bg-grok-darker rounded flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-grok-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-white font-medium">Sponsor 10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-grok-purple opacity-5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-blue-600 opacity-5 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/4"></div>
      </div>
    </div>
  );
} 