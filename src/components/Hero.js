'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import SubmitGameModal from './SubmitGameModal';
import AuthAlert from './AuthAlert';
import FeatureGameGrid from './FeatureGameGrid';
import CTA from './CTA';
import { FaLaravel, FaReact, FaNodeJs, FaAws, FaDigitalOcean, FaDatabase, FaStripe, FaGoogle, FaGithub, FaDocker, FaApple, FaNpm, FaPython, FaUbuntu } from 'react-icons/fa';

export default function Hero() {
  const sponsorsContainerRef = useRef(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const { isAuthenticated } = useAuth();
  const [isSponsorsHovered, setIsSponsorsHovered] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for right, -1 for left
  const [sponsors, setSponsors] = useState([]);
  
  // Handle Submit Game button click
  const handleSubmitGameClick = (e) => {
    e.preventDefault();
    
    if (isAuthenticated) {
      setShowSubmitModal(true);
    } else {
      setShowAuthAlert(true);
    }
  };

  // Fetch sponsors from API
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
    
    console.log('[Home Page] Setting up sponsors autoscroll');
    
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
            console.log('[Home Page] Reached right edge, scrolling left now');
            setScrollDirection(-1); // Start scrolling left
          } else if (container.scrollLeft <= 5 && scrollDirection < 0) {
            console.log('[Home Page] Reached left edge, scrolling right now');
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
      console.log('[Home Page] Cleaning up sponsors autoscroll');
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
    
    // Mouse event handlers
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
      console.log('[Home Page] Mouse left sponsor container, resuming autoscroll');
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
      console.log('[Home Page] Mouse entered sponsor container, pausing autoscroll');
    };
    
    // Touch event handlers for mobile
    const onTouchStart = (e) => {
      isDown = true;
      container.classList.add('cursor-grabbing');
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      setIsSponsorsHovered(true); // Pause autoscroll during touch
    };
    
    const onTouchEnd = () => {
      isDown = false;
      container.classList.remove('cursor-grabbing');
      setIsSponsorsHovered(false); // Resume autoscroll after touch
      console.log('[Home Page] Touch ended on sponsor container, resuming autoscroll');
    };
    
    const onTouchMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };
    
    // Add mouse event listeners
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseenter', onMouseEnter);
    
    // Add touch event listeners for mobile
    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchcancel', onTouchEnd);
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    
    return () => {
      // Remove mouse event listeners
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseenter', onMouseEnter);
      
      // Remove touch event listeners
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
      container.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <div className="py-16 bg-grok-dark border-b border-grok-card">
      <div className="container-custom mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-2/5 mb-8 lg:mb-0 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-purple-500">AI Gaming</span> Vibe Hub
            </h1>
            <p className="text-gray-300 text-lg mb-6 mx-auto lg:mx-0 max-w-xl">
              Discover games built with Grok and other AI tools. Attract players, run competitions, hire game devs, or browse our vibegame index.
            </p>
            <div className="flex space-x-4 justify-center lg:justify-start">
              <a href="#games-section" className="btn-primary">Play Now</a>
              <button onClick={handleSubmitGameClick} className="btn-secondary">
                Submit Game
              </button>
            </div>
          </div>
          
          {/* Featured Games Grid - Larger size for desktop */}
          <div className="w-full flex justify-center mt-8 lg:mt-0">
            <FeatureGameGrid />
          </div>
        </div>
        
        {/* Sponsors Bar - Updated version from game detail page */}
        <div className="mt-16 border-t border-gray-800 pt-6">
          <div 
            ref={sponsorsContainerRef}
            className="sponsors-container flex overflow-x-auto gap-3 pb-4 pt-2 px-1 relative cursor-grab hide-scrollbar" 
            style={{ 
              overflowX: 'auto', 
              WebkitOverflowScrolling: 'touch', 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
              position: 'relative'
            }}
          >
            {sponsors.length > 0 ? (
              sponsors.map((sponsor) => (
                <a 
                  key={sponsor.id}
                  href={sponsor.website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center hover:bg-black hover:bg-opacity-70 transition-all relative group overflow-hidden"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black bg-opacity-70 mb-1">
                    {sponsor.logoUrl ? (
                      <img 
                        src={sponsor.logoUrl} 
                        alt={`${sponsor.name} logo`}
                        className="w-10 h-10 object-contain" 
                      />
                    ) : (
                      getSponsorIcon(sponsor.name)
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-white leading-tight">{sponsor.name}</h3>
                  <p className="text-xs text-gray-300 text-center leading-tight">{sponsor.description}</p>
                  
                  {/* Slide-up action button overlay - similar to game cards */}
                  <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center px-4 gap-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                    <div className="text-center bg-white hover:bg-gray-100 text-black font-medium px-4 py-2 rounded-md transition-colors duration-200 text-sm w-full">
                      Visit Sponsor
                    </div>
                  </div>
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
          <p className="text-white text-center mt-4 mb-2 font-medium">Your sponsorship powers Grokade's growth and spotlights the emerging industry of vibe-coded, AI-crafted games.</p>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <CTA />
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-grok-purple opacity-5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-blue-600 opacity-5 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/4"></div>
      </div>
      
      {/* Modals */}
      <SubmitGameModal 
        isOpen={showSubmitModal} 
        onClose={() => setShowSubmitModal(false)} 
      />
      
      <AuthAlert 
        isOpen={showAuthAlert} 
        onClose={() => setShowAuthAlert(false)} 
      />
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