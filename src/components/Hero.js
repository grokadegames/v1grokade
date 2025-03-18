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

  // Manual scrolling for sponsors container
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
    };
    
    const onMouseUp = () => {
      isDown = false;
      container.classList.remove('cursor-grabbing');
    };
    
    const onMouseMove = (e) => {
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5; // Reduced multiplier for smoother scrolling
      container.scrollLeft = scrollLeft - walk;
    };
    
    // Touch event handlers for mobile - improved for smoother scrolling
    const onTouchStart = (e) => {
      isDown = true;
      // Don't add cursor-grabbing class on mobile as it's not visible/relevant
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };
    
    const onTouchEnd = () => {
      isDown = false;
    };
    
    const onTouchMove = (e) => {
      if (!isDown) return;
      
      // Don't prevent default on mobile to allow native scrolling behavior
      // This is crucial for smooth scrolling on touch devices
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 1; // Use 1:1 ratio for natural feel on mobile
      container.scrollLeft = scrollLeft - walk;
    };
    
    // Add mouse event listeners
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    
    // Add touch event listeners for mobile - using passive: true for better performance
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchcancel', onTouchEnd);
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    
    return () => {
      // Remove mouse event listeners
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      
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
          <div className="w-full lg:w-1/2 xl:w-1/2 mb-8 lg:mb-0 text-center lg:text-left lg:pl-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="text-purple-500">AI Gaming</span> Vibe Hub
            </h1>
            <p className="text-gray-300 text-base mb-5 mx-auto lg:mx-0">
              Discover games built with Grok and other AI tools. Attract players, run competitions, hire game devs, or browse our vibegame index.
            </p>
            <div className="flex space-x-4 justify-center lg:justify-start">
              <a href="#games-section" className="btn-primary text-sm">Play Now</a>
              <button onClick={handleSubmitGameClick} className="btn-secondary text-sm">
                Submit Game
              </button>
            </div>
          </div>
          
          {/* Featured Games Grid - Adjusted size for balance */}
          <div className="w-full lg:w-1/2 flex justify-center mt-12 lg:mt-0 lg:pl-4">
            <div className="w-full max-w-2xl">
              <FeatureGameGrid />
            </div>
          </div>
        </div>
        
        {/* Sponsors Bar - Static version without autoscroll */}
        <div className="mt-16 border-t border-gray-800 pt-6">
          <div className="flex flex-col items-center mb-4">
            <a 
              href="https://x.com/messages/compose?recipient_id=grokadegames&text=Hi%2C%20I%27m%20interested%20in%20potentially%20sponsoring%20Grokade%20and%20advertising%20on%20the%20platform." 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white font-medium px-6 py-2 rounded-md transition-colors mb-4"
            >
              Sponsor and Advertise
            </a>
            <p className="text-white text-center mb-4 font-medium">Your sponsorship powers Grokade's growth and spotlights the emerging industry of vibe-coded, AI-crafted games.</p>
          </div>
          
          <div 
            ref={sponsorsContainerRef}
            className="sponsors-container flex overflow-x-auto gap-3 pb-4 pt-2 px-1 relative cursor-grab hide-scrollbar" 
            style={{ 
              overflowX: 'auto', 
              WebkitOverflowScrolling: 'touch', 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollSnapType: 'x proximity',
              scrollBehavior: 'smooth',
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
                  style={{ scrollSnapAlign: 'center' }}
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