'use client';

import { useState, useEffect } from 'react';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function DebugPage() {
  const [endpoint, setEndpoint] = useState('/api/games');
  const [queryParams, setQueryParams] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  
  // Auth Debugging
  const [authUsername, setAuthUsername] = useState('test');
  const [authPassword, setAuthPassword] = useState('password');
  const [authResponse, setAuthResponse] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [clientSideInfo, setClientSideInfo] = useState({});
  
  // List of available endpoints for quick testing
  const availableEndpoints = [
    '/api/games',
    '/api/games?sample=true',
    '/api/debug/db-test',
    '/api/auth/me',
    '/api/test-db',
    '/api/games-test'
  ];
  
  // Get client-side info on mount
  useEffect(() => {
    setClientSideInfo({
      isClient: typeof window !== 'undefined',
      nextData: document.getElementById('__NEXT_DATA__') ? 'Present' : 'Not found',
      userAgent: navigator.userAgent,
      windowLocation: window.location.href,
      cookiesEnabled: navigator.cookieEnabled,
      localStorage: typeof localStorage !== 'undefined' ? 'Available' : 'Not available'
    });
  }, []);
  
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
  
  // Test authentication API directly
  const testAuth = async (action) => {
    setAuthLoading(true);
    setAuthError(null);
    setAuthResponse(null);
    
    try {
      let response, data, url, body;
      
      const startTime = Date.now();
      
      switch(action) {
        case 'login':
          url = '/api/auth/login';
          body = { username: authUsername, password: authPassword };
          break;
        case 'register':
          url = '/api/auth/register';
          body = { 
            username: authUsername, 
            password: authPassword, 
            email: `${authUsername}@example.com`,
            displayName: authUsername 
          };
          break;
        case 'me':
          url = '/api/auth/me';
          break;
        case 'logout':
          url = '/api/auth/logout';
          break;
        default:
          throw new Error('Unknown action');
      }
      
      const fetchOptions = {
        method: action === 'me' ? 'GET' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        cache: 'no-store',
      };
      
      if (body) {
        fetchOptions.body = JSON.stringify(body);
      }
      
      response = await fetch(url, fetchOptions);
      const endTime = Date.now();
      
      try {
        data = await response.json();
      } catch (e) {
        data = { error: 'Failed to parse JSON response', message: e.message };
      }
      
      setAuthResponse({
        action,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
        data,
        duration: `${endTime - startTime}ms`
      });
    } catch (err) {
      console.error('[DEBUG] Auth test error:', err);
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };
  
  const analyzeLoginIssue = () => {
    // Check if we're on the client side
    if (typeof window === 'undefined') return 'Not running in browser';
    
    try {
      // Check the auth context provider
      const authProviderElements = document.querySelectorAll('[data-auth-provider="true"]');
      const nextDataElement = document.getElementById('__NEXT_DATA__');
      const nextData = nextDataElement ? JSON.parse(nextDataElement.textContent) : null;
      
      return {
        authProviderFound: authProviderElements.length > 0,
        nextDataAvailable: !!nextDataElement,
        routerState: nextData?.props?.router || 'Not available',
        pageProps: nextData?.props?.pageProps ? 'Available' : 'Not available',
        buildId: nextData?.buildId || 'Not available',
        runtimeConfig: nextData?.runtimeConfig ? 'Available' : 'Not available'
      };
    } catch (error) {
      return {
        error: error.message,
        stack: error.stack
      };
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <AuthNavbar />
      
      <main className="flex-grow bg-grok-dark text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">API Debug Tool</h1>
          
          {/* Navigation Testing */}
          <div className="bg-grok-card p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Navigation Testing</h2>
            <p className="mb-4">Test navigation to common pages. Click these links to verify routing works correctly.</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Link href="/login" className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition">
                Go to Login Page
              </Link>
              <Link href="/register" className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 transition">
                Go to Register Page
              </Link>
              <Link href="/dashboard" className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition">
                Go to Dashboard
              </Link>
              <Link href="/" className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition">
                Go to Home Page
              </Link>
            </div>
          </div>
          
          {/* Client-Side Information */}
          <div className="bg-grok-card p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Client Environment</h2>
            <pre className="bg-grok-dark p-3 rounded overflow-x-auto text-sm max-h-40">
              {JSON.stringify(clientSideInfo, null, 2)}
            </pre>
          </div>
          
          {/* Auth Testing */}
          <div className="bg-grok-card p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Auth API Testing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2">Username</label>
                <input 
                  type="text"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  className="w-full bg-grok-dark p-2 rounded"
                />
              </div>
              
              <div>
                <label className="block mb-2">Password</label>
                <input 
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-grok-dark p-2 rounded"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => testAuth('login')}
                disabled={authLoading}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Test Login API
              </button>
              <button
                onClick={() => testAuth('register')}
                disabled={authLoading}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
              >
                Test Register API
              </button>
              <button
                onClick={() => testAuth('me')}
                disabled={authLoading}
                className="bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition"
              >
                Test Auth Status API
              </button>
              <button
                onClick={() => testAuth('logout')}
                disabled={authLoading}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
              >
                Test Logout API
              </button>
            </div>
            
            {authLoading && (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {authError && (
              <div className="bg-red-900/30 text-red-200 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">Error</h3>
                <p>{authError}</p>
              </div>
            )}
            
            {authResponse && (
              <div>
                <h3 className="font-semibold mb-2">Response for {authResponse.action}</h3>
                <div className="mb-2">
                  <span className={`text-sm inline-block px-2 py-1 rounded ${
                    authResponse.status >= 200 && authResponse.status < 300 
                      ? 'bg-green-900/40 text-green-300' 
                      : 'bg-red-900/40 text-red-300'
                  }`}>
                    {authResponse.status} {authResponse.statusText} ({authResponse.duration})
                  </span>
                </div>
                <pre className="bg-grok-dark p-3 rounded overflow-x-auto text-sm max-h-60 overflow-y-auto">
                  {JSON.stringify(authResponse.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
          
          {/* API Testing */}
          <div className="bg-grok-card p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">API Endpoint Testing</h2>
            
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
                Test Endpoint
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