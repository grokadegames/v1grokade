'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import SubmitGameModal from './SubmitGameModal';
import AuthAlert from './AuthAlert';
import FeatureGameGrid from './FeatureGameGrid';

export default function Hero() {
  const sponsorsContainerRef = useRef(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const { isAuthenticated } = useAuth();
  const [isSponsorsHovered, setIsSponsorsHovered] = useState(false);
  
  // Handle Submit Game button click
  const handleSubmitGameClick = (e) => {
    e.preventDefault();
    
    if (isAuthenticated) {
      setShowSubmitModal(true);
    } else {
      setShowAuthAlert(true);
    }
  };

  // Add autoscroll functionality for sponsors
  useEffect(() => {
    const container = sponsorsContainerRef.current;
    if (!container) return;
    
    // Autoscroll functionality
    let scrollInterval;
    
    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (!isSponsorsHovered && container) {
          container.scrollLeft += 1;
          
          // Reset scroll position when reaching the end
          if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
            container.scrollLeft = 0;
          }
        }
      }, 30); // Adjust speed by changing interval time
    };
    
    startAutoScroll();
    
    return () => {
      clearInterval(scrollInterval);
    };
  }, [isSponsorsHovered]);

  // Implement horizontal scrolling for sponsors with hover detection
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
      setIsSponsorsHovered(false);
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
    
    const onMouseEnter = () => {
      setIsSponsorsHovered(true);
    };

    // Add event listeners
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseenter', onMouseEnter);

    // Cleanup
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
        
        {/* Sponsors Bar */}
        <div className="mt-16 border-t border-gray-800 pt-6">
          <div className="flex flex-col mb-4">
            <h3 className="text-grok-purple font-semibold mb-4">SPONSORS</h3>
            <div 
              ref={sponsorsContainerRef}
              className="sponsors-container overflow-x-auto scrollbar-hide cursor-grab"
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