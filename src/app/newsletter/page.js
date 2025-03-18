'use client';

import { useState } from 'react';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Connect to the newsletter API endpoint
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }
      
      // Clear errors and set submitted state
      setError('');
      setSubmitted(true);
      setEmail('');
      console.log('Newsletter subscription successful:', data);
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
      setError(err.message || 'There was an error subscribing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <AuthNavbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12 pt-16">
        <div className="w-full max-w-md">
          <div className="bg-gray-900 shadow-lg rounded-lg p-8 border-2 border-orange-500">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-orange-500 mb-2">
                Join Our Newsletter
              </h1>
              <p className="text-gray-400">
                Get the latest updates on AI gaming, new features, and creator tips.
              </p>
            </div>
            
            {submitted ? (
              <div className="text-center">
                <div className="bg-green-600 text-white p-4 rounded-md mb-6">
                  <p className="font-medium">Thanks for subscribing!</p>
                  <p className="text-sm mt-1">
                    We've sent a confirmation email to your inbox.
                  </p>
                </div>
                <Link 
                  href="/"
                  className="inline-block bg-black border-2 border-orange-500 text-orange-500 px-6 py-2 rounded-md hover:bg-orange-500 hover:text-black transition-colors duration-300"
                >
                  Return to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-600 text-white p-3 rounded-md mb-4">
                    {error}
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-orange-500 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="youremail@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex flex-col space-y-4">
                  <button
                    type="submit"
                    className="w-full bg-black border-2 border-orange-500 text-orange-500 py-2 rounded-md hover:bg-orange-500 hover:text-black transition-colors duration-300 flex justify-center items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subscribing...
                      </span>
                    ) : (
                      "Subscribe Now"
                    )}
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      Also follow us on{' '}
                      <a 
                        href="https://twitter.com/GrokadeGames" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-400"
                      >
                        X @GrokadeGames
                      </a>
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 