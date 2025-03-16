'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import { FaLaravel, FaReact, FaNodeJs, FaAws, FaDigitalOcean, FaDatabase, FaStripe, FaGoogle, FaGithub, FaDocker, FaApple, FaNpm, FaPython, FaUbuntu } from 'react-icons/fa';

export default function GamePage() {
  const params = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(47);
  const [dislikeCount, setDislikeCount] = useState(3);
  const [featuredGames, setFeaturedGames] = useState([]);
  const sponsorsContainerRef = useRef(null);
  const featuredGamesContainerRef = useRef(null);
  const [isSponsorsHovered, setIsSponsorsHovered] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for right, -1 for left
  
  // Example gallery images - in a real app these would come from the API
  const galleryImages = [
    '/images/gallery1.jpg',
    '/images/gallery2.jpg',
    '/images/gallery3.jpg',
    '/images/gallery4.jpg',
  ];
  
  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        // Fetch all games and find the one with matching ID
        const response = await fetch(`/api/games`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch game data');
        }
        
        const data = await response.json();
        const foundGame = data.games.find(g => g.id === params.id);
        
        if (foundGame) {
          // If the game doesn't have views, add a default value
          if (!foundGame.views) {
            foundGame.views = Math.floor(Math.random() * 300) + 100; // Random views between 100-400
          }
          setGame(foundGame);
          
          // Filter out the current game and use real data from API
          // Only fill in missing properties if absolutely necessary
          const gamesWithoutCurrent = data.games
            .filter(g => g.id !== params.id)
            .map(game => ({
              ...game,
              // Only use fallbacks if data is missing
              plays: game.plays || 0,
              views: game.views || 0,
              // Only mark as live if explicitly set to true
              isLive: !!game.isLive,
              creator: game.creator || 'Grokade Developer',
              description: game.description || '',
              // Format dates properly
              updatedAt: game.updatedAt || null
            }));
          
          // Sort by most popular (views) and get top 5
          const featured = gamesWithoutCurrent
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);
          
          setFeaturedGames(featured);
        } else {
          setError('Game not found');
        }
      } catch (err) {
        console.error('Error fetching game:', err);
        setError('Failed to load game data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchGame();
    }
  }, [params.id]);
  
  // Enhanced autoscroll functionality for sponsors
  useEffect(() => {
    const container = sponsorsContainerRef.current;
    if (!container) return;
    
    console.log('[Sponsors] Setting up autoscroll');
    
    // Autoscroll functionality
    let scrollInterval;
    let hasReachedEnd = false;
    let hasReachedStart = true;
    
    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (!isSponsorsHovered && container) {
          // Adjust scroll speed for smoother animation
          container.scrollLeft += scrollDirection * 1.5;
          
          // Calculate the maximum scroll position
          const maxScroll = container.scrollWidth - container.clientWidth;
          
          // Check if we've reached the end or beginning to change direction
          // Use a larger buffer for smoother transition at the end
          if (container.scrollLeft >= maxScroll - 30 && !hasReachedEnd) {
            console.log('[Sponsors] Reached right edge, scrolling left now');
            setScrollDirection(-1); // Start scrolling left
            hasReachedEnd = true;
            hasReachedStart = false;
          } else if (container.scrollLeft <= 20 && !hasReachedStart) {
            console.log('[Sponsors] Reached left edge, scrolling right now');
            setScrollDirection(1); // Start scrolling right
            hasReachedStart = true;
            hasReachedEnd = false;
          }
          
          // Reset flags when we're not at the edges
          if (container.scrollLeft < maxScroll - 50 && container.scrollLeft > 50) {
            hasReachedEnd = false;
            hasReachedStart = false;
          }
        }
      }, 30); // 30ms interval for smooth scrolling
    };
    
    // Always start from the beginning
    container.scrollLeft = 0;
    setScrollDirection(1); // Ensure we start by scrolling right
    
    // Start the autoscroll after a delay to ensure DOM is ready and sponsors are loaded
    const initTimeout = setTimeout(() => {
      startAutoScroll();
    }, 1000); // Longer delay for better initial load
    
    return () => {
      console.log('[Sponsors] Cleaning up autoscroll');
      clearInterval(scrollInterval);
      clearTimeout(initTimeout);
    };
  }, [isSponsorsHovered, scrollDirection]);
  
  // Enhanced horizontal scrolling for sponsors with hover detection
  useEffect(() => {
    const container = sponsorsContainerRef.current;
    if (!container) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    const onMouseDown = (e) => {
      isDown = true;
      container.classList.add('cursor-grabbing');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };
    
    const onMouseLeave = () => {
      isDown = false;
      container.classList.remove('cursor-grabbing');
      setIsSponsorsHovered(false);
      console.log('[Sponsors] Mouse left, resuming autoscroll');
    };
    
    const onMouseUp = () => {
      isDown = false;
      container.classList.remove('cursor-grabbing');
    };
    
    const onMouseMove = (e) => {
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };
    
    const onMouseEnter = () => {
      setIsSponsorsHovered(true);
      console.log('[Sponsors] Mouse entered, pausing autoscroll');
    };
    
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseenter', onMouseEnter);
    
    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);
  
  // Horizontal scrolling for featured games
  useEffect(() => {
    const container = featuredGamesContainerRef.current;
    if (!container) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    const onMouseDown = (e) => {
      isDown = true;
      container.classList.add('cursor-grabbing');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };
    
    const onMouseLeave = () => {
      isDown = false;
      container.classList.remove('cursor-grabbing');
    };
    
    const onMouseUp = () => {
      isDown = false;
      container.classList.remove('cursor-grabbing');
    };
    
    const onMouseMove = (e) => {
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };
    
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    
    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
    };
  }, [featuredGames]);

  // Carousel navigation handlers
  const scrollFeaturedLeft = () => {
    if (featuredGamesContainerRef.current) {
      featuredGamesContainerRef.current.scrollLeft -= 300;
    }
  };

  const scrollFeaturedRight = () => {
    if (featuredGamesContainerRef.current) {
      featuredGamesContainerRef.current.scrollLeft += 300;
    }
  };
  
  // Add sponsor navigation handlers
  const scrollSponsorsLeft = () => {
    if (sponsorsContainerRef.current) {
      sponsorsContainerRef.current.scrollLeft -= 300;
    }
  };

  const scrollSponsorsRight = () => {
    if (sponsorsContainerRef.current) {
      sponsorsContainerRef.current.scrollLeft += 300;
    }
  };
  
  const handleLike = () => {
    setLikeCount(prev => prev + 1);
  };

  const handleDislike = () => {
    setDislikeCount(prev => prev + 1);
  };
  
  // Format date to match production grid format
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently added';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} months ago`;
    } else {
      return `${Math.floor(diffDays / 365)} years ago`;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-grok-dark to-grok-darker">
        <AuthNavbar />
        <div className="container-custom mx-auto px-4 py-12 pt-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-grok-dark to-grok-darker">
        <AuthNavbar />
        <div className="container-custom mx-auto px-4 py-12 pt-12">
          <div className="bg-black bg-opacity-50 backdrop-blur-sm p-8 rounded-lg border-2 border-purple-500">
            <h1 className="text-2xl font-bold text-purple-500 mb-4">Game Not Found</h1>
            <p className="text-grok-text-secondary mb-6">
              {error || "We couldn't find the game you're looking for."}
            </p>
            <Link href="/" className="bg-black border-2 border-purple-500 text-purple-500 px-6 py-2 rounded-md hover:bg-purple-500 hover:text-black transition-colors duration-300">
              Back to Games
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse tags if they exist
  const tagsList = game.tags ? 
    game.tags.split(',').filter(tag => tag !== 'none' && tag.trim() !== '') : 
    [];
    
  // Add "Indie" and "Single Player" as default categories if no tags
  if (tagsList.length === 0) {
    tagsList.push('Action', 'Adventure');
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-grok-dark to-grok-darker">
      <AuthNavbar />
      
      <div className="container-custom mx-auto px-4 py-8 pt-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Game Preview Section (Left Side) */}
          <div className="w-full lg:w-2/3 rounded-lg overflow-hidden">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {selectedGalleryImage === 0 && game.image ? (
                <img 
                  src={game.image} 
                  alt={game.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-grok-dark">
                  <svg className="w-24 h-24 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 7L21 7" stroke="currentColor" strokeWidth="2" />
                    <path d="M7 21L7 7" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <p className="text-gray-400 mt-4">No image available</p>
                </div>
              )}
            </div>
            
            {/* Reaction Buttons - Removed as requested */}
            
            {/* Game Screenshots Carousel */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4 px-2 md:px-4 py-2 overflow-hidden">
              {/* Thumbnail for main image */}
              <div 
                key="main" 
                className={`w-32 h-24 flex-shrink-0 rounded-md overflow-hidden cursor-pointer ${selectedGalleryImage === 0 ? 'border-2 border-purple-500' : 'border-2 border-transparent'}`}
                onClick={() => setSelectedGalleryImage(0)}
              >
                {game.image ? (
                  <img 
                    src={game.image} 
                    alt={`${game.title} thumbnail`}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-grok-dark flex items-center justify-center">
                    <span className="text-xs text-gray-500">No image</span>
                  </div>
                )}
              </div>
              
              {/* Gallery images */}
              {[1, 2, 3, 4].map((_, index) => (
                <div 
                  key={index} 
                  className={`w-32 h-24 flex-shrink-0 rounded-md overflow-hidden cursor-pointer ${selectedGalleryImage === index + 1 ? 'border-2 border-purple-500' : 'border-2 border-transparent'}`}
                  onClick={() => setSelectedGalleryImage(index + 1)}
                >
                  <div className="w-full h-full bg-grok-dark flex items-center justify-center">
                    <span className="text-xs text-gray-500">Gallery {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Game Details Panel (Right Side) - Fix mobile title display */}
          <div className="w-full lg:w-1/3 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6">
            <div className="flex flex-col h-full">
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-white break-words">
                  {game.title}
                </h1>
                <div className="text-sm text-red-500">Not available</div>
              </div>
              
              <p className="text-gray-400 text-sm mb-6">
                {game.description || 'Classic snake game - eat food and grow longer'}
              </p>
              
              <div className="flex flex-col gap-4 mb-6">
                <a 
                  href="#" 
                  className="bg-purple-600 text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-purple-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 5V19L19 12L5 5Z" fill="currentColor" />
                  </svg>
                  Preview Game
                </a>
                
                <a 
                  href={game.playUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-grok-dark border border-gray-700 text-gray-300 py-2 px-4 rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 12L16 12" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 8L12 16" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Play on Official Site
                </a>
              </div>
              
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center">
                  <div className="text-purple-500 mr-2">Rating</div>
                  <div className="text-gray-300">94%</div>
                </div>
                
                {/* Release Date */}
                <div className="flex items-center">
                  <div className="text-purple-500 mr-2">Released</div>
                  <div className="text-gray-300">3/14/2025</div>
                </div>
                
                {/* Tags */}
                <div>
                  <div className="text-purple-500 mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {tagsList.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-sm"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                    <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-sm">
                      Single Player
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Play & View Counts */}
              <div className="flex flex-wrap gap-4 mt-6">
                {/* Play count */}
                <div className="flex items-center bg-grok-darker px-4 py-2 rounded-md">
                  <svg className="w-5 h-5 mr-2 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-grok-text-secondary">{game.plays ?? 0} plays</span>
                </div>

                {/* View count */}
                <div className="flex items-center bg-grok-darker px-4 py-2 rounded-md">
                  <svg className="w-5 h-5 mr-2 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4C5 4 1 12 1 12C1 12 5 20 12 20C19 20 23 12 23 12C23 12 19 4 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-grok-text-secondary">{game.views ?? 0} views</span>
                </div>
              </div>
              
              {/* Social Interaction Buttons */}
              <div className="flex gap-2 mt-6">
                <button 
                  onClick={handleLike}
                  className="flex-1 bg-grok-darker text-gray-300 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {likeCount}
                </button>
                
                <button 
                  onClick={handleDislike}
                  className="flex-1 bg-grok-darker text-gray-300 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 2H20C20.5304 2 21.0391 2.21071 21.4142 2.58579C21.7893 2.96086 22 3.46957 22 4V11C22 11.5304 21.7893 12.0391 21.4142 12.4142C21.0391 12.7893 20.5304 13 20 13H17M10 15V19C10 19.7956 10.3161 20.5587 10.8787 21.1213C11.4413 21.6839 12.2044 22 13 22L17 13V2H5.72C5.23948 1.99453 4.77136 2.16359 4.40376 2.47599C4.03617 2.78839 3.79319 3.22301 3.72 3.7L2.34 12.7C2.29651 12.9866 2.31583 13.2793 2.39666 13.5577C2.47749 13.8362 2.61791 14.0937 2.80815 14.3125C2.99839 14.5313 3.23393 14.7061 3.49843 14.8248C3.76294 14.9435 4.05009 15.0033 4.34 15H10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {dislikeCount}
                </button>
                
                <button className="flex-1 bg-grok-darker text-gray-300 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 6L12 2L8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 2V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Move Sponsors Section to right above Featured Games */}
      <div className="mb-8">
        <div 
          ref={sponsorsContainerRef}
          className="sponsors-container flex overflow-x-auto gap-3 pb-4 pt-2 px-1 relative cursor-grab hide-scrollbar" 
          style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Sponsor 1 */}
          <div className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black bg-opacity-70 mb-1">
              <FaLaravel className="text-3xl text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-white leading-tight">Laravel</h3>
            <p className="text-xs text-gray-300 text-center leading-tight">Backend framework provider</p>
          </div>
          
          {/* Sponsor 2 */}
          <div className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black bg-opacity-70 mb-1">
              <FaReact className="text-3xl text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-white leading-tight">React</h3>
            <p className="text-xs text-gray-300 text-center leading-tight">Frontend library partner</p>
          </div>
          
          {/* Sponsor 3 */}
          <div className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black bg-opacity-70 mb-1">
              <FaNodeJs className="text-3xl text-green-500" />
            </div>
            <h3 className="text-base font-semibold text-white leading-tight">Node.js</h3>
            <p className="text-xs text-gray-300 text-center leading-tight">Server runtime environment</p>
          </div>
          
          {/* Sponsor 4 */}
          <div className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black bg-opacity-70 mb-1">
              <FaAws className="text-3xl text-yellow-500" />
            </div>
            <h3 className="text-base font-semibold text-white leading-tight">AWS</h3>
            <p className="text-xs text-gray-300 text-center leading-tight">Cloud infrastructure partner</p>
          </div>
          
          {/* Sponsor 5 */}
          <div className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black bg-opacity-70 mb-1">
              <FaDigitalOcean className="text-3xl text-blue-500" />
            </div>
            <h3 className="text-base font-semibold text-white leading-tight">DigitalOcean</h3>
            <p className="text-xs text-gray-300 text-center leading-tight">Hosting services provider</p>
          </div>
          
          {/* Sponsor 6 */}
          <div className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black bg-opacity-70 mb-1">
              <FaDatabase className="text-3xl text-purple-500" />
            </div>
            <h3 className="text-base font-semibold text-white leading-tight">MongoDB</h3>
            <p className="text-xs text-gray-300 text-center leading-tight">Database solutions</p>
          </div>
          
          {/* Sponsor 7 */}
          <div className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black bg-opacity-70 mb-1">
              <FaStripe className="text-3xl text-purple-600" />
            </div>
            <h3 className="text-base font-semibold text-white leading-tight">Stripe</h3>
            <p className="text-xs text-gray-300 text-center leading-tight">Payment processing</p>
          </div>
          
          {/* Sponsor 8 */}
          <div className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black bg-opacity-70 mb-1">
              <FaGoogle className="text-3xl text-blue-500" />
            </div>
            <h3 className="text-base font-semibold text-white leading-tight">Google Cloud</h3>
            <p className="text-xs text-gray-300 text-center leading-tight">Cloud services partner</p>
          </div>
          
          {/* Sponsor 9 */}
          <div className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black bg-opacity-70 mb-1">
              <FaGithub className="text-3xl text-white" />
            </div>
            <h3 className="text-base font-semibold text-white leading-tight">GitHub</h3>
            <p className="text-xs text-gray-300 text-center leading-tight">Development platform</p>
          </div>
          
          {/* Sponsor 10 */}
          <div className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black bg-opacity-70 mb-1">
              <FaDocker className="text-3xl text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-white leading-tight">Docker</h3>
            <p className="text-xs text-gray-300 text-center leading-tight">Container platform</p>
          </div>
          
          {/* Sponsor 11 */}
          <div className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black bg-opacity-70 mb-1">
              <FaApple className="text-3xl text-gray-200" />
            </div>
            <h3 className="text-base font-semibold text-white leading-tight">Apple</h3>
            <p className="text-xs text-gray-300 text-center leading-tight">Developer ecosystem</p>
          </div>
          
          {/* Sponsor 12 */}
          <div className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black bg-opacity-70 mb-1">
              <FaNpm className="text-3xl text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-white leading-tight">npm</h3>
            <p className="text-xs text-gray-300 text-center leading-tight">Package registry</p>
          </div>
          
          {/* Sponsor 13 */}
          <div className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black bg-opacity-70 mb-1">
              <FaPython className="text-3xl text-yellow-300" />
            </div>
            <h3 className="text-base font-semibold text-white leading-tight">Python</h3>
            <p className="text-xs text-gray-300 text-center leading-tight">Programming language</p>
          </div>
          
          {/* Sponsor 14 */}
          <div className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black bg-opacity-70 mb-1">
              <FaUbuntu className="text-3xl text-orange-500" />
            </div>
            <h3 className="text-base font-semibold text-white leading-tight">Ubuntu</h3>
            <p className="text-xs text-gray-300 text-center leading-tight">Operating system</p>
          </div>
        </div>
      </div>
      
      {/* Featured Games Section */}
      <div className="border-t border-gray-800 py-8">
        <div className="container-custom mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-white font-semibold">FEATURED GAMES</h2>
          </div>
          
          <div className="relative">
            <div 
              ref={featuredGamesContainerRef}
              className="games-container overflow-x-auto scrollbar-hide cursor-grab"
            >
              <div className="flex gap-4 pb-4 min-w-max">
                {featuredGames.length > 0 ? (
                  featuredGames.map((featuredGame) => (
                    <div key={featuredGame.id} className="game-card-container w-[280px] flex-shrink-0 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className="relative">
                        <div className="aspect-video bg-black bg-opacity-60 flex items-center justify-center">
                          {featuredGame.image ? (
                            <img 
                              src={featuredGame.image} 
                              alt={featuredGame.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M3 7L21 7" stroke="currentColor" strokeWidth="2" />
                                <path d="M7 21L7 7" stroke="currentColor" strokeWidth="2" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* Live Badge - Conditionally shown */}
                        {featuredGame.isLive && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            LIVE
                          </div>
                        )}
                        
                        {/* Play and View Count Badges */}
                        <div className="absolute bottom-2 left-2 flex items-center px-2 py-1 rounded-full bg-black bg-opacity-70 z-20">
                          <svg className="w-3 h-3 mr-1 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                          </svg>
                          <span className="text-white text-xs">{featuredGame.plays || 0}</span>
                        </div>
                        
                        <div className="absolute bottom-2 right-2 flex items-center px-2 py-1 rounded-full bg-black bg-opacity-70 z-20">
                          <svg className="w-3 h-3 mr-1 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4C5 4 1 12 1 12C1 12 5 20 12 20C19 20 23 12 23 12C23 12 19 4 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-white text-xs">{featuredGame.views || 0}</span>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="p-4">
                          <h3 className="text-white font-semibold break-words whitespace-normal line-clamp-2">{featuredGame.title}</h3>
                          <p className="text-gray-400 text-sm truncate">By: {featuredGame.creator || 'Unknown'}</p>
                          
                          <p className="text-gray-400 text-xs mt-2 mb-4 line-clamp-2">
                            {featuredGame.description || 'No description available'}
                          </p>
                          
                          {/* Time indicator with production grid style date format */}
                          <div className="flex items-center mt-3">
                            <svg className="w-3 h-3 text-gray-400 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                              <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-gray-400 text-xs">
                              {formatDate(featuredGame.updatedAt)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Slide-up action buttons overlay - positioned over text content */}
                        <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center px-4 gap-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                          <Link 
                            href={`/game/${featuredGame.id}`}
                            className="w-full text-center bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm"
                          >
                            View Game
                          </Link>
                          
                          <a 
                            href={featuredGame.playUrl || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full text-center bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm"
                          >
                            <svg className="w-4 h-4 mr-1 inline-block" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 5V19L19 12L5 5Z" fill="currentColor" />
                            </svg>
                            Play Now
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-400">No featured games available at the moment.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Carousel Navigation - moved on top of thumbnails with transparent background */}
            {featuredGames.length > 0 && (
              <div className="flex items-center justify-between absolute top-[25%] w-full -translate-y-1/2 pointer-events-none px-2">
                <button
                  onClick={scrollFeaturedLeft}
                  className="bg-black bg-opacity-25 hover:bg-opacity-50 p-2 rounded-full shadow-lg pointer-events-auto transition-all"
                  aria-label="Scroll left"
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={scrollFeaturedRight}
                  className="bg-black bg-opacity-25 hover:bg-opacity-50 p-2 rounded-full shadow-lg pointer-events-auto transition-all"
                  aria-label="Scroll right"
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 