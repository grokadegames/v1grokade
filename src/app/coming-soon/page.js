'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';

export default function ComingSoon() {
  const searchParams = useSearchParams();
  const feature = searchParams.get('feature') || 'This feature';

  return (
    <div className="min-h-screen bg-gradient-to-b from-grok-dark to-grok-darker flex flex-col">
      <AuthNavbar />
      
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="max-w-lg w-full bg-black bg-opacity-60 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-purple-900">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-grok-purple flex items-center justify-center">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white text-center mb-4">
            {feature} is Coming Soon
          </h1>
          
          <p className="text-gray-300 text-center mb-8">
            We're working hard to bring you an amazing {feature.toLowerCase()} experience. 
            Stay tuned for updates as we develop this exciting new feature!
          </p>
          
          <div className="space-y-6">
            <div className="bg-grok-purple bg-opacity-20 p-4 rounded-lg border border-purple-700">
              <h3 className="text-purple-400 font-semibold mb-2">What to expect:</h3>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                {feature === 'Gigs' && (
                  <>
                    <li>Connect with game developers looking for collaborators</li>
                    <li>Post your own projects and find talented contributors</li>
                    <li>Browse paid opportunities in AI gaming development</li>
                    <li>Simple project management tools for your game projects</li>
                  </>
                )}
                
                {feature === 'Talent' && (
                  <>
                    <li>Create your developer profile to showcase your skills</li>
                    <li>Connect with other AI gaming enthusiasts</li>
                    <li>Find collaborators with complementary skills</li>
                    <li>Get discovered by game studios and project leads</li>
                  </>
                )}
                
                {feature === 'Competitions' && (
                  <>
                    <li>Participate in themed AI game development challenges</li>
                    <li>Win prizes and recognition for your creations</li>
                    <li>Learn from other developers in the community</li>
                    <li>Showcase your games to a wider audience</li>
                  </>
                )}
                
                {(feature !== 'Gigs' && feature !== 'Talent' && feature !== 'Competitions') && (
                  <>
                    <li>New tools to enhance your experience</li>
                    <li>Seamless integration with existing features</li>
                    <li>Community-focused improvements</li>
                    <li>Regular updates and enhancements</li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 mb-4">Want to be notified when we launch?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href="/newsletter" 
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-md transition-colors duration-200"
                >
                  Join Our Newsletter
                </Link>
                <Link 
                  href="/" 
                  className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-md transition-colors duration-200"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 