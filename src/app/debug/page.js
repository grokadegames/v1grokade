'use client';

import { useState, useEffect } from 'react';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';

export default function DebugPage() {
  const [endpoint, setEndpoint] = useState('/api/games');
  const [queryParams, setQueryParams] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  
  // List of available endpoints for quick testing
  const availableEndpoints = [
    '/api/games',
    '/api/games?sample=true',
    '/api/debug/db-test',
    '/api/test-db',
    '/api/games-test'
  ];
  
  const fetchEndpoint = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    const url = `${endpoint}${queryParams ? (endpoint.includes('?') ? '&' : '?') + queryParams : ''}`;
    console.log(`[DEBUG] Fetching: ${url}`);
    
    const startTime = Date.now();
    
    try {
      const response = await fetch(url);
      const endTime = Date.now();
      setResponseTime(`${endTime - startTime}ms`);
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = { error: 'Failed to parse JSON response', message: e.message };
      }
      
      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
        data
      });
    } catch (err) {
      console.error('[DEBUG] Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <AuthNavbar />
      
      <main className="flex-grow bg-grok-dark text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">API Debug Tool</h1>
          
          <div className="bg-grok-card p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Test API Endpoint</h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-2">Endpoint</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    className="flex-grow bg-grok-dark p-2 rounded"
                    placeholder="/api/..."
                  />
                  <select 
                    className="bg-grok-dark p-2 rounded"
                    onChange={(e) => setEndpoint(e.target.value)}
                  >
                    <option value="">Select endpoint</option>
                    {availableEndpoints.map(ep => (
                      <option key={ep} value={ep}>{ep}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block mb-2">Additional Query Params</label>
                <input 
                  type="text"
                  value={queryParams}
                  onChange={(e) => setQueryParams(e.target.value)}
                  className="w-full bg-grok-dark p-2 rounded"
                  placeholder="param1=value1&param2=value2"
                />
              </div>
              
              <button
                onClick={fetchEndpoint}
                disabled={loading}
                className="bg-grok-purple text-white py-2 px-4 rounded hover:bg-purple-700 transition"
              >
                {loading ? 'Loading...' : 'Test Endpoint'}
              </button>
            </div>
          </div>
          
          {response && (
            <div className="bg-grok-card p-6 rounded-lg mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Response</h2>
                {responseTime && (
                  <span className="text-sm text-gray-400">Time: {responseTime}</span>
                )}
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Status</h3>
                <div className={`text-sm inline-block px-2 py-1 rounded ${
                  response.status >= 200 && response.status < 300 
                    ? 'bg-green-900/40 text-green-300' 
                    : 'bg-red-900/40 text-red-300'
                }`}>
                  {response.status} {response.statusText}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Headers</h3>
                <pre className="bg-grok-dark p-3 rounded overflow-x-auto text-sm">
                  {JSON.stringify(response.headers, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Data</h3>
                <pre className="bg-grok-dark p-3 rounded overflow-x-auto text-sm max-h-96 overflow-y-auto">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-900/30 text-red-200 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Error</h3>
              <p>{error}</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 