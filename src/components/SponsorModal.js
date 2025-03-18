'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';

export default function SponsorModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg w-full max-w-lg">
        <div className="relative p-6">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 text-white hover:text-gray-300"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-4">Sponsor Grokade</h2>
          
          <div className="mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
            </div>
            <p className="text-white text-center mb-4">
              Contact <a href="https://x.com/GrokadeGames" target="_blank" rel="noopener noreferrer" className="text-purple-400 font-medium hover:underline">@grokadegames</a> on X to discuss basic and premium sponsorship opportunities!
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-white font-semibold mb-2">Why sponsor Grokade?</h3>
            <ul className="text-gray-300 space-y-2">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Connect with the emerging AI gaming community</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Showcase your brand to innovative developers</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Support the future of AI-powered gaming experiences</span>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <a 
              href="https://x.com/GrokadeGames" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition font-medium inline-flex items-center"
              onClick={onClose}
            >
              Please Message us on
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="ml-2 h-5 w-5">
                <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 