'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import { FaLaravel, FaReact, FaNodeJs, FaAws, FaDigitalOcean, FaDatabase, FaStripe, FaGoogle, FaGithub, FaDocker, FaApple, FaNpm, FaPython, FaUbuntu } from 'react-icons/fa';
import { trackGameView, trackGamePlay, trackGameLike, trackGameDislike } from '@/lib/metricsUtil';
import { useAuth } from '@/contexts/AuthContext';
import { useSponsorModal } from '@/contexts/SponsorModalContext';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const sponsorsContainerRef = useRef(null);
  const featuredGamesContainerRef = useRef(null);
  const [isSponsorsHovered, setIsSponsorsHovered] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for right, -1 for left
  const [visibleOverlays, setVisibleOverlays] = useState({}); // Track which overlays are visible
  const { user, isAuthenticated } = useAuth();
  const { openSponsorModal } = useSponsorModal();
  
  // Get gallery images from the game data when available
  const getGalleryImages = (game) => {
    if (!game) return [];
    
    const images = [];
    
    if (game.galleryImage1) images.push(game.galleryImage1);
    if (game.galleryImage2) images.push(game.galleryImage2);
    if (game.galleryImage3) images.push(game.galleryImage3);
    if (game.galleryImage4) images.push(game.galleryImage4);
    
    return images;
  };
  
  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        
        // First try to fetch the specific game by ID
        const gameResponse = await fetch(`/api/games/${params.id}`);
        
        if (gameResponse.ok) {
          const gameData = await gameResponse.json();
          
          if (gameData.game) {
            setGame(gameData.game);
            
            // Set initial like/dislike counts from game metrics
            if (gameData.game.likes !== undefined) setLikeCount(gameData.game.likes);
            if (gameData.game.dislikes !== undefined) setDislikeCount(gameData.game.dislikes);
            
            // Track page view once game is loaded
            if (params.id) {
              trackGameView(params.id)
                .then(result => {
                  console.log('View tracked:', result);
                  // Update view count locally if the API returned updated metrics
                  if (result && result.metrics && result.metrics.views) {
                    setGame(prevGame => ({
                      ...prevGame,
                      views: result.metrics.views
                    }));
                  }
                })
                .catch(error => {
                  console.error('Error tracking view:', error);
                });
            }
            
            // Now fetch all games for featured games section
            const allGamesResponse = await fetch(`/api/games?featured=true&limit=50`);
            
            if (allGamesResponse.ok) {
              const allGamesData = await allGamesResponse.json();
              
              // Filter out the current game and use real data from API
              const gamesWithoutCurrent = allGamesData.games
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
              
              // Already filtered by API, just sort and limit
              const featured = gamesWithoutCurrent
                .sort((a, b) => b.views - a.views)
                .slice(0, 10);
              
              setFeaturedGames(featured);
            }
          } else {
            setError('Game not found');
          }
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
  
  // Add effect to fetch sponsors from API
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch('/api/sponsors/');
        
        if (!response.ok) {
          console.error('Failed to fetch sponsors data');
          return;
        }
        
        const data = await response.json();
        if (data.sponsors && Array.isArray(data.sponsors)) {
          setSponsors(data.sponsors);
        }
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      }
    };
    
    fetchSponsors();
  }, []);
  
  // Enhanced autoscroll functionality for sponsors
  useEffect(() => {
    const container = sponsorsContainerRef.current;
    if (!container) return;
    
    console.log('[Game Detail] Setting up sponsors autoscroll');
    
    // Autoscroll functionality
    let scrollInterval;
    
    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (!isSponsorsHovered && container) {
          // Adjust scroll speed for smoother animation
          container.scrollLeft += scrollDirection * 1.5;
          
          // Calculate the maximum scroll position
          const maxScroll = container.scrollWidth - container.clientWidth;
          
          // Check if we've reached the end or beginning to change direction
          if (container.scrollLeft >= maxScroll - 5 && scrollDirection > 0) {
            console.log('[Game Detail] Reached right edge, scrolling left now');
            setScrollDirection(-1); // Start scrolling left
          } else if (container.scrollLeft <= 5 && scrollDirection < 0) {
            console.log('[Game Detail] Reached left edge, scrolling right now');
            setScrollDirection(1); // Start scrolling right
          }
        }
      }, 20); // Faster interval for smoother animation
    };
    
    // Always reset scroll position and direction when the component mounts
    if (container) {
      container.scrollLeft = 0;
      setScrollDirection(1);
    }
    
    // Start the autoscroll after a delay to ensure DOM is ready and sponsors are loaded
    const initTimeout = setTimeout(() => {
      startAutoScroll();
    }, 1000);
    
    return () => {
      console.log('[Game Detail] Cleaning up sponsors autoscroll');
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
      console.log('[Game Detail] Mouse left sponsor container, resuming autoscroll');
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
      console.log('[Game Detail] Mouse entered sponsor container, pausing autoscroll');
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
  
  // Horizontal scrolling for featured games with improved handling
  useEffect(() => {
    const container = featuredGamesContainerRef.current;
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
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 3; // Increased scroll speed multiplier
      container.scrollLeft = scrollLeft - walk;
    };
    
    // Touch events for mobile support
    const onTouchStart = (e) => {
      isDown = true;
      container.classList.add('active');
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };
    
    const onTouchEnd = () => {
      isDown = false;
      container.classList.remove('active');
    };
    
    const onTouchMove = (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 3;
      container.scrollLeft = scrollLeft - walk;
    };
    
    // Mouse events
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    
    // Touch events
    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchcancel', onTouchEnd);
    container.addEventListener('touchmove', onTouchMove);
    
    // Improved scroll buttons
    const scrollAmount = 300; // Amount to scroll with arrow buttons
    
    // Update scroll methods
    window.scrollFeaturedLeft = () => {
      if (container) {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    };
    
    window.scrollFeaturedRight = () => {
      if (container) {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };
    
    return () => {
      // Mouse cleanup
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      
      // Touch cleanup
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
      container.removeEventListener('touchmove', onTouchMove);
    };
  }, [featuredGames]);

  // Carousel navigation handlers
  const scrollFeaturedLeft = () => {
    if (window.scrollFeaturedLeft) {
      window.scrollFeaturedLeft();
    } else if (featuredGamesContainerRef.current) {
      featuredGamesContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollFeaturedRight = () => {
    if (window.scrollFeaturedRight) {
      window.scrollFeaturedRight();
    } else if (featuredGamesContainerRef.current) {
      featuredGamesContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
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
  
  // Unlock the game explorer achievement when page loads
  useEffect(() => {
    if (isAuthenticated && game) {
      // Unlock game explorer achievement
      fetch('/api/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ achievementId: 'game_explorer' }),
      }).catch(err => console.error('Error unlocking achievement:', err));
    }
  }, [isAuthenticated, game]);
  
  // Track play click and redirect to game URL
  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if the user is on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (game && game.id) {
      trackGamePlay(game.id)
        .then(result => {
          console.log('Play tracked:', result);
          // After tracking, redirect to the game URL
          if (isMobile && game.playUrl) {
            // Use direct location change for mobile to avoid popup blocking
            window.location.href = game.playUrl;
          } else {
            // Use window.open for desktop
            window.open(game.playUrl, '_blank');
          }
        })
        .catch(error => {
          console.error('Error tracking play:', error);
          // Still redirect even if tracking fails
          if (isMobile && game.playUrl) {
            window.location.href = game.playUrl;
          } else if (game.playUrl) {
            window.open(game.playUrl, '_blank');
          }
        });
    } else {
      // If for some reason we don't have the game data, just redirect
      if (game && game.playUrl) {
        if (isMobile) {
          window.location.href = game.playUrl;
        } else {
          window.open(game.playUrl, '_blank');
        }
      }
    }
    
    // Unlock game player achievement if authenticated
    if (isAuthenticated) {
      fetch('/api/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ achievementId: 'game_player' }),
      }).catch(err => console.error('Error unlocking achievement:', err));
    }
  };

  // Calculate rating percentage based on likes and dislikes
  const calculateRating = () => {
    const total = likeCount + dislikeCount;
    if (total === 0) return 'No ratings';
    
    const percentage = Math.round((likeCount / total) * 100);
    return `${percentage}%`;
  };

  const handleLike = () => {
    if (game && game.id) {
      trackGameLike(game.id)
        .then(result => {
          console.log('Like tracked:', result);
          // Update like count with the value from the server response if available
          if (result && result.metrics && result.metrics.likes !== undefined) {
            setLikeCount(result.metrics.likes);
          } else {
            setLikeCount(prev => prev + 1);
          }
        })
        .catch(error => {
          console.error('Error tracking like:', error);
          // Still update UI even if tracking fails
          setLikeCount(prev => prev + 1);
        });
    } else {
      setLikeCount(prev => prev + 1);
    }
  };

  const handleDislike = () => {
    if (game && game.id) {
      trackGameDislike(game.id)
        .then(result => {
          console.log('Dislike tracked:', result);
          // Update dislike count with the value from the server response if available
          if (result && result.metrics && result.metrics.dislikes !== undefined) {
            setDislikeCount(result.metrics.dislikes);
          } else {
            setDislikeCount(prev => prev + 1);
          }
        })
        .catch(error => {
          console.error('Error tracking dislike:', error);
          // Still update UI even if tracking fails
          setDislikeCount(prev => prev + 1);
        });
    } else {
      setDislikeCount(prev => prev + 1);
    }
  };
  
  // Add a new share handler function after the existing handleDislike function
  const handleShare = () => {
    // Get the URL of the current page for sharing
    const gameUrl = typeof window !== 'undefined' ? window.location.href : '';
    
    // Format the author's X account for the share text
    const authorXAccount = game.xaccount ? 
      (game.xaccount.startsWith('@') ? game.xaccount : `@${game.xaccount.replace(/^https?:\/\/(www\.)?x\.com\//i, '').replace('@', '')}`) : 
      '';
    
    // Create the share text with proper formatting
    let shareText = `"${game.title}" created by ${authorXAccount} on @grokadegames is amazing! Built with AI and featured on Grokade.com. Learn more about the game here:`;
    
    // Create the URL to share on X.com with the text and image
    const imageUrl = encodeURIComponent(game.imageUrl || '');
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(gameUrl);
    
    // Open X.com composer in a new window with pre-populated content
    window.open(
      `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      '_blank'
    );
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
  
  // Toggle overlay visibility for a specific game card
  const toggleOverlay = (gameId) => {
    setVisibleOverlays(prev => ({
      ...prev,
      [gameId]: !prev[gameId]
    }));
  };
  
  // Add missing handler functions for sponsor interaction
  const handleSponsorMouseDown = (e) => {
    const container = sponsorsContainerRef.current;
    if (!container) return;
    
    // Set flags for dragging
    container.isDown = true;
    container.classList.add('cursor-grabbing');
    container.startX = e.pageX - container.offsetLeft;
    container.scrollLeft = container.scrollLeft;
  };

  const handleSponsorMouseLeave = () => {
    const container = sponsorsContainerRef.current;
    if (!container) return;
    
    // Reset flags when mouse leaves
    container.isDown = false;
    container.classList.remove('cursor-grabbing');
    setIsSponsorsHovered(false);
  };

  const handleSponsorMouseUp = () => {
    const container = sponsorsContainerRef.current;
    if (!container) return;
    
    // Reset flags when mouse is released
    container.isDown = false;
    container.classList.remove('cursor-grabbing');
  };

  const handleSponsorMouseMove = (e) => {
    const container = sponsorsContainerRef.current;
    if (!container || !container.isDown) return;
    
    // Prevent default behavior while dragging
    e.preventDefault();
    
    // Calculate how far the mouse has moved
    const x = e.pageX - container.offsetLeft;
    const walk = (x - container.startX) * 2;
    
    // Update scroll position
    container.scrollLeft = container.scrollLeft - walk;
    container.startX = e.pageX - container.offsetLeft;
  };
  
  // Add a sponsor click handler
  const handleSponsorClick = (e) => {
    e.preventDefault();
    openSponsorModal();
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
          {/* Game Details Panel - ORDER CHANGED: Now first on mobile */}
          <div className="w-full lg:w-1/3 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6 order-1 lg:order-2">
            <div className="flex flex-col h-full">
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-white break-words">
                  {game.title}
                </h1>
              </div>
              
              {/* Mobile-only Game Preview - Shown right below the title on mobile */}
              <div className="block lg:hidden mb-4 mt-2">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {selectedGalleryImage === 0 && game.imageUrl ? (
                    <img 
                      src={game.imageUrl} 
                      alt={game.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : selectedGalleryImage > 0 && getGalleryImages(game)[selectedGalleryImage - 1] ? (
                    <img 
                      src={getGalleryImages(game)[selectedGalleryImage - 1]} 
                      alt={`${game.title} gallery ${selectedGalleryImage}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-grok-dark">
                      <svg className="w-16 h-16 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M3 7L21 7" stroke="currentColor" strokeWidth="2" />
                        <path d="M7 21L7 7" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <p className="text-gray-400 mt-2 text-sm">No image available</p>
                    </div>
                  )}
                </div>
                
                {/* Mobile-only Gallery Thumbnails */}
                <div className="flex overflow-x-auto gap-2 py-2 mt-2 hide-scrollbar">
                  {/* Thumbnail for main image */}
                  <div 
                    key="main-mobile" 
                    className={`w-20 h-14 flex-shrink-0 rounded-md overflow-hidden cursor-pointer ${selectedGalleryImage === 0 ? 'border-2 border-purple-500' : 'border-2 border-transparent'}`}
                    onClick={() => setSelectedGalleryImage(0)}
                  >
                    {game.imageUrl ? (
                      <img 
                        src={game.imageUrl} 
                        alt={`${game.title} thumbnail`}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-grok-dark flex items-center justify-center">
                        <span className="text-xs text-gray-500">Main</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Gallery images */}
                  {getGalleryImages(game).map((imageUrl, index) => (
                    <div 
                      key={`mobile-gallery-${index}`}
                      className={`w-20 h-14 flex-shrink-0 rounded-md overflow-hidden cursor-pointer ${selectedGalleryImage === index + 1 ? 'border-2 border-purple-500' : 'border-2 border-transparent'}`}
                      onClick={() => setSelectedGalleryImage(index + 1)}
                    >
                      <img 
                        src={imageUrl} 
                        alt={`${game.title} gallery ${index + 1}`}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mb-6">
                {game.description || 'Classic snake game - eat food and grow longer'}
              </p>
              
              <div className="flex flex-col gap-4 mb-6">
                <a 
                  href={game.playUrl || '#'}
                  onClick={handlePlayClick}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 flex justify-center items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                  </svg>
                  Play Game
                </a>
                
                <a 
                  href={game.xaccount ? (game.xaccount.startsWith('http') ? game.xaccount : `https://x.com/${game.xaccount.replace('@', '')}`) : '#'} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-700 text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-slate-600 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Contact Author
                </a>
              </div>
              
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center">
                  <div className="text-purple-500 mr-2">Rating</div>
                  <div className="text-gray-300">{calculateRating()}</div>
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
                {/* Play count - Moved to first position */}
                <div className="flex items-center bg-grok-darker px-4 py-2 rounded-md">
                  <svg className="w-5 h-5 mr-2 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-grok-text-secondary">{game.plays ?? 0} plays</span>
                </div>

                {/* View count - Moved to second position */}
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
                
                <button 
                  onClick={handleShare}
                  className="flex-1 bg-grok-darker text-gray-300 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
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
          
          {/* Game Preview Section - ORDER CHANGED: Now second on mobile, hidden on mobile but visible on desktop */}
          <div className="w-full lg:w-2/3 rounded-lg overflow-hidden order-2 lg:order-1 mt-6 lg:mt-0 hidden lg:block">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {selectedGalleryImage === 0 && game.imageUrl ? (
                <img 
                  src={game.imageUrl} 
                  alt={game.title} 
                  className="w-full h-full object-cover"
                />
              ) : selectedGalleryImage > 0 && getGalleryImages(game)[selectedGalleryImage - 1] ? (
                <img 
                  src={getGalleryImages(game)[selectedGalleryImage - 1]} 
                  alt={`${game.title} gallery ${selectedGalleryImage}`}
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
            
            {/* Game Screenshots Carousel */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4 px-2 md:px-4 py-2 overflow-hidden">
              {/* Thumbnail for main image */}
              <div 
                key="main" 
                className={`w-32 h-24 flex-shrink-0 rounded-md overflow-hidden cursor-pointer ${selectedGalleryImage === 0 ? 'border-2 border-purple-500' : 'border-2 border-transparent'}`}
                onClick={() => setSelectedGalleryImage(0)}
              >
                {game.imageUrl ? (
                  <img 
                    src={game.imageUrl} 
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
              {getGalleryImages(game).map((imageUrl, index) => (
                <div 
                  key={index} 
                  className={`w-32 h-24 flex-shrink-0 rounded-md overflow-hidden cursor-pointer ${selectedGalleryImage === index + 1 ? 'border-2 border-purple-500' : 'border-2 border-transparent'}`}
                  onClick={() => setSelectedGalleryImage(index + 1)}
                >
                  <img 
                    src={imageUrl} 
                    alt={`${game.title} gallery ${index + 1}`}
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Move Sponsors Section to right above Featured Games */}
      <div className="border-t border-gray-800 py-8 mt-8">
        <div className="container-custom mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-white font-semibold">OUR SPONSORS</h2>
            <div className="flex space-x-2">
              <button 
                onClick={handleSponsorClick}
                className="bg-transparent border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white font-medium px-4 py-1 rounded-md transition-colors text-sm"
              >
                Sponsor and Advertise
              </button>
            </div>
          </div>
          
          <p className="text-white text-center mb-6 font-medium">Your sponsorship powers Grokade's growth and spotlights the emerging industry of vibe-coded, AI-crafted games.</p>
          
          <div 
            ref={sponsorsContainerRef}
            className="sponsors-container flex overflow-x-auto gap-3 pb-4 pt-2 px-1 relative cursor-grab hide-scrollbar" 
            onMouseDown={handleSponsorMouseDown}
            onMouseMove={handleSponsorMouseMove}
            onMouseUp={handleSponsorMouseUp}
            onMouseLeave={handleSponsorMouseLeave}
          >
            {sponsors.length > 0 ? (
              sponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center hover:bg-black hover:bg-opacity-70 transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div className="h-12 flex items-center justify-center mb-1">
                    {sponsor.logoUrl ? (
                      <img 
                        src={sponsor.logoUrl} 
                        alt={`${sponsor.name} logo`}
                        className="max-h-10 max-w-[80px] object-contain"
                      />
                    ) : (
                      getSponsorIcon(sponsor.name)
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-white leading-tight">{sponsor.name}</h3>
                  <p className="text-xs text-gray-300 text-center leading-tight">{sponsor.description}</p>
                  <span className="text-xs text-purple-400 mt-1 hover:underline">
                    Visit Sponsor
                  </span>
                </a>
              ))
            ) : (
              // Loading state or fallback when no sponsors are available
              <div className="flex-1 flex justify-center items-center py-8">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-grok-card h-12 w-12"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-grok-card rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-grok-card rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Featured Games Section */}
      {featuredGames.length > 0 && (
        <div className="border-t border-gray-800 py-8">
          <div className="container-custom mx-auto px-0 md:px-4">
            <div className="flex justify-between items-center mb-6 px-4">
              <h2 className="text-xl text-white font-semibold">FEATURED GAMES</h2>
            </div>
            
            <div className="relative w-full overflow-visible">
              <div 
                ref={featuredGamesContainerRef}
                className="games-container overflow-x-auto w-full scrollbar-hide"
                style={{ overscrollBehaviorX: 'contain' }}
              >
                <div className="flex gap-4 pb-4 min-w-max pl-4 pr-8">
                  {featuredGames.map((featuredGame) => (
                    <div key={featuredGame.id} className="w-72 flex-shrink-0">
                      <div 
                        className="bg-black bg-opacity-50 backdrop-blur-sm rounded-md overflow-hidden shadow-lg h-full flex flex-col group min-h-[400px] sm:min-h-[420px] md:min-h-[440px]"
                        onClick={() => toggleOverlay(featuredGame.id)}
                      >
                        <div className="relative">
                          {/* Game thumbnail/image */}
                          <div className="h-48 sm:h-52 md:h-56 lg:h-60 bg-black bg-opacity-60 flex items-center justify-center overflow-hidden">
                            {featuredGame.image ? (
                              <img 
                                src={featuredGame.image} 
                                alt={featuredGame.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900/30 to-black">
                                <div className="text-4xl font-bold text-grok-purple mb-2">
                                  {featuredGame.title.slice(0, 1).toUpperCase()}
                                </div>
                                <div className="text-sm text-grok-purple/80 text-center px-4">
                                  {featuredGame.title}
                                </div>
                              </div>
                            )}
                            
                            {/* Live indicator badge */}
                            {featuredGame.isLive && (
                              <div className="absolute top-2 right-2 z-10">
                                <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">LIVE</span>
                              </div>
                            )}
                            
                            {/* Play count overlay - on left side */}
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 rounded-md px-2 py-1 flex items-center z-20">
                              <svg className="w-4 h-4 mr-1 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5V19L19 12L8 5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span className="text-white text-xs">{featuredGame.plays || 0}</span>
                            </div>
                            
                            {/* View count overlay - on right side */}
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 rounded-md px-2 py-1 flex items-center z-20">
                              <svg className="w-4 h-4 mr-1 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4C5 4 1 12 1 12C1 12 5 20 12 20C19 20 23 12 23 12C23 12 19 4 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span className="text-white text-xs">{featuredGame.views || 0}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 flex flex-col flex-grow relative">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="text-white font-semibold">{featuredGame.title}</h3>
                          </div>
                          <div className="text-xs text-grok-text-secondary mb-2">
                            {featuredGame.xaccount ? (
                              <a 
                                href={`https://x.com/${featuredGame.xaccount.replace('@', '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-purple-400 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {featuredGame.xaccount}
                              </a>
                            ) : (
                              `By: ${featuredGame.creator || 'Unknown'}`
                            )}
                          </div>
                          <p className="text-grok-text-secondary text-sm mb-4 flex-grow line-clamp-3 sm:line-clamp-4">
                            {featuredGame.description || 'No description available'}
                          </p>
                          
                          <div className="flex justify-end items-center text-xs text-grok-text-secondary">
                            <div className="flex items-center">
                              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                                <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span>{formatDate(featuredGame.updatedAt)}</span>
                            </div>
                          </div>
                          
                          {/* Slide-up action buttons overlay */}
                          <div className={`absolute inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center px-4 gap-3 transition-transform duration-300 ease-in-out ${
                            visibleOverlays[featuredGame.id] ? 'transform translate-y-0' : 'transform translate-y-full group-hover:translate-y-0'
                          }`}>
                            <Link 
                              href={`/game/${featuredGame.id}`}
                              className="w-full text-center bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm"
                              onClick={(e) => e.stopPropagation()} // Prevent toggle overlay
                            >
                              View Game
                            </Link>
                            
                            <a 
                              href={featuredGame.xaccount ? (featuredGame.xaccount.startsWith('http') ? featuredGame.xaccount : `https://x.com/${featuredGame.xaccount.replace('@', '')}`) : '#'} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full text-center bg-slate-700 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm hover:bg-slate-600"
                              onClick={(e) => e.stopPropagation()} // Prevent toggle overlay
                            >
                              Contact Author
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Carousel Navigation Arrows */}
              {featuredGames.length > 1 && (
                <div className="flex items-center justify-between absolute top-[30%] w-full -translate-y-1/2 pointer-events-none px-0">
                  <button
                    onClick={scrollFeaturedLeft}
                    className="bg-black bg-opacity-50 hover:bg-opacity-70 p-3 rounded-full shadow-lg pointer-events-auto transition-all z-10"
                    aria-label="Scroll left"
                  >
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={scrollFeaturedRight}
                    className="bg-black bg-opacity-50 hover:bg-opacity-70 p-3 rounded-full shadow-lg pointer-events-auto transition-all z-10"
                    aria-label="Scroll right"
                  >
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            {/* Add CSS to hide scrollbar but maintain functionality */}
            <style jsx>{`
              .games-container {
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;     /* Firefox */
              }
              .games-container::-webkit-scrollbar {
                display: none;             /* Chrome, Safari and Opera */
              }
              .games-container.active {
                cursor: grabbing;
              }
            `}</style>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

// Helper function to provide fallback icons for sponsors without logos
function getSponsorIcon(name) {
  const iconMap = {
    'Laravel': <FaLaravel className="text-3xl text-red-500" />,
    'React': <FaReact className="text-3xl text-blue-400" />,
    'Node.js': <FaNodeJs className="text-3xl text-green-500" />,
    'AWS': <FaAws className="text-3xl text-yellow-500" />,
    'DigitalOcean': <FaDigitalOcean className="text-3xl text-blue-500" />,
    'MongoDB': <FaDatabase className="text-3xl text-purple-500" />,
    'Stripe': <FaStripe className="text-3xl text-purple-600" />,
    'Google Cloud': <FaGoogle className="text-3xl text-blue-500" />,
    'GitHub': <FaGithub className="text-3xl text-white" />,
    'Docker': <FaDocker className="text-3xl text-blue-400" />,
    'Apple': <FaApple className="text-3xl text-gray-200" />,
    'npm': <FaNpm className="text-3xl text-red-600" />,
    'Python': <FaPython className="text-3xl text-yellow-300" />,
    'Ubuntu': <FaUbuntu className="text-3xl text-orange-500" />,
  };
  
  return iconMap[name] || <FaDatabase className="text-3xl text-purple-500" />;
} 