'use client';

import { useState } from 'react';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      // In the future, this would connect to a real newsletter API
      // For now, we'll just simulate success
      console.log('Newsletter subscription for:', email);
      
      // Clear errors and set submitted state
      setError('');
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
      setError('There was an error subscribing. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <AuthNavbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 shadow-lg rounded-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
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
                  className="inline-block bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
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
                  <label htmlFor="email" className="block text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="youremail@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div className="flex flex-col space-y-4">
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Subscribe Now
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      Also follow us on{' '}
                      <a 
                        href="https://twitter.com/GrokadeGames" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300"
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