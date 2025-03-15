'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';

export default function GamePage() {
  const params = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would call an API endpoint to get game by ID
        // For now, let's use a simulation since we don't have a getGameById endpoint yet
        
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
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <AuthNavbar />
        <div className="container-custom mx-auto px-4 py-12 pt-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !game) {
    return (
      <div className="min-h-screen bg-black">
        <AuthNavbar />
        <div className="container-custom mx-auto px-4 py-12 pt-16">
          <div className="bg-gray-900 p-8 rounded-lg border-2 border-orange-500">
            <h1 className="text-2xl font-bold text-orange-500 mb-4">Game Not Found</h1>
            <p className="text-grok-text-secondary mb-6">
              {error || "We couldn't find the game you're looking for."}
            </p>
            <Link href="/" className="bg-black border-2 border-orange-500 text-orange-500 px-6 py-2 rounded-md hover:bg-orange-500 hover:text-black transition-colors duration-300">
              Back to Games
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      <AuthNavbar />
      <main className="container-custom mx-auto px-4 py-12 pt-16">
        <div className="bg-gray-900 p-8 rounded-lg">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <div className="h-64 bg-grok-darker flex items-center justify-center rounded-md overflow-hidden">
                {game.image ? (
                  <img 
                    src={game.image} 
                    alt={game.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M3 7L21 7" stroke="currentColor" strokeWidth="2" />
                      <path d="M7 21L7 7" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <a 
                  href={game.playUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-black border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-md hover:bg-orange-500 hover:text-black transition-colors duration-300"
                >
                  Play Game
                </a>
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-orange-500">{game.title}</h1>
                {game.isLive && (
                  <span className="bg-grok-live text-grok-dark text-xs font-semibold px-3 py-1 rounded">LIVE</span>
                )}
              </div>
              
              <div className="text-sm text-grok-text-secondary mb-6">
                Created by: <span className="text-white">{game.creator}</span>
              </div>
              
              <div className="bg-grok-darker p-6 rounded-md mb-8">
                <h2 className="text-xl font-semibold text-orange-500 mb-4">About this Game</h2>
                <p className="text-grok-text-secondary">
                  {game.description}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {/* Play count */}
                <div className="flex items-center bg-grok-darker px-4 py-2 rounded-md">
                  <svg className="w-5 h-5 mr-2 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-grok-text-secondary">{game.plays ?? 0} plays</span>
                </div>

                {/* View count */}
                <div className="flex items-center bg-grok-darker px-4 py-2 rounded-md">
                  <svg className="w-5 h-5 mr-2 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4C5 4 1 12 1 12C1 12 5 20 12 20C19 20 23 12 23 12C23 12 19 4 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-grok-text-secondary">{game.views ?? 0} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 