'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import SubmitGameModal from './SubmitGameModal';
import AuthAlert from './AuthAlert';
import FeatureGameGrid from './FeatureGameGrid';
import CTA from './CTA';

export default function Hero() {
  const sponsorsContainerRef = useRef(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [sponsors, setSponsors] = useState([]);
  const { isAuthenticated } = useAuth();
  const [isSponsorsHovered, setIsSponsorsHovered] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for right, -1 for left
  
  // Fetch sponsors from the API
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        console.log('[Hero] Fetching sponsors from API...');
        const response = await fetch('/api/sponsors');
        
        if (!response.ok) {
          throw new Error('Failed to fetch sponsors data');
        }
        
        const data = await response.json();
        console.log('[Hero] Received sponsors:', data.sponsors?.length || 0);
        
        if (data.sponsors && data.sponsors.length > 0) {
          setSponsors(data.sponsors);
        }
      } catch (err) {
        console.error('[Hero] Error fetching sponsors:', err);
      }
    };
    
    fetchSponsors();
  }, []);
  
  // Handle Submit Game button click
  const handleSubmitGameClick = (e) => {
    e.preventDefault();
    
    if (isAuthenticated) {
      setShowSubmitModal(true);
    } else {
      setShowAuthAlert(true);
    }
  };

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

  return (
    <div className="py-16 bg-grok-dark border-b border-grok-card">
      <div className="container-custom mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0 text-center lg:text-left">
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
          
          {/* Featured Games Grid */}
          <FeatureGameGrid />
        </div>
        
        {/* Sponsors Bar - Updated version from game detail page */}
        <div className="mt-16 border-t border-gray-800 pt-6">
          <div 
            ref={sponsorsContainerRef}
            className="sponsors-container flex overflow-x-auto gap-3 pb-4 pt-2 px-1 relative cursor-grab hide-scrollbar" 
            style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sponsors.length > 0 ? (
              // Map through sponsors from the API
              sponsors.map((sponsor) => (
                <div 
                  key={sponsor.id}
                  className="sponsor-card flex-shrink-0 min-w-[160px] w-[160px] rounded-lg p-2 py-1.5 backdrop-blur-sm bg-black bg-opacity-50 flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black bg-opacity-70 mb-1">
                    <img 
                      src={sponsor.logoUrl} 
                      alt={`${sponsor.name} logo`} 
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <h3 className="text-base font-semibold text-white leading-tight">{sponsor.name}</h3>
                  <p className="text-xs text-gray-300 text-center leading-tight">{sponsor.description}</p>
                </div>
              ))
            ) : (
              // Loading state or fallback
              <div className="w-full text-center py-4 text-gray-400">Loading sponsors...</div>
            )}
          </div>
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