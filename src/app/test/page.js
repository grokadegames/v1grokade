'use client';

import { useState, useEffect } from 'react';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';

export default function TestPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        const response = await fetch('/api/games-test');
        const result = await response.json();
        
        setData(result);
      } catch (err) {
        console.error('Error fetching test data:', err);
        setError('Failed to load data: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <AuthNavbar />
      <main className="container-custom mx-auto px-4 py-12 pt-16">
        <h1 className="text-3xl font-bold text-white mb-6">Database Test Page</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 text-white p-4 rounded-md mb-8">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">API Response</h2>
            <div className="bg-gray-900 p-4 rounded-md">
              <pre className="text-green-400 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
            
            {data?.games && data.games.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-white mb-4">Game Cards Preview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.games.map(game => (
                    <div key={game.id} className="bg-gray-900 p-4 rounded-md">
                      <h3 className="text-white font-bold mb-2">{game.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">Created by: {game.creator}</p>
                      <p className="text-gray-300">{game.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
      </main>
      <Footer />
    </div>
  );
} 