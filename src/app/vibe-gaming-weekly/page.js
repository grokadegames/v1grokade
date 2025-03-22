'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

// Hardcoded list of articles for initial implementation
// Later this could be moved to a database or CMS
const ARTICLES = [
  {
    slug: 'is-vibe-coded-gaming-a-fad',
    title: 'Is Vibe-Coded Gaming a Fad? Exploring AI\'s Role in Game Development',
    excerpt: 'Discover whether vibe-coded games, powered by AI tools like Cursor and GitHub Copilot, are a fleeting trend or a transformative force in the gaming industry, as explored through the VibeJam competition and viral successes.',
    coverImage: 'https://ik.imagekit.io/cbzkrwprl/vibe-coded-gaming.jpg',
    author: 'James Chmielinski (@aigamelord)',
    date: 'March 22, 2025'
  },
  {
    slug: 'article-2',
    title: 'Your Second Article Title',
    excerpt: 'A brief description of your second article. This should be compelling enough to drive readers to click and read more.',
    coverImage: 'https://ik.imagekit.io/cbzkrwprl/article-2-cover.jpg',
    author: 'Grokade Team',
    date: 'April 19, 2025'
  }
];

export default function VibeGamingWeekly() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="bg-grok-darker min-h-screen">
      <AuthNavbar />
      
      <main className="container-custom mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-purple-500">Vibe Gaming</span> Weekly
            </h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              The latest news, insights, and stories from the vibrant world of AI-powered gaming and vibe-coded entertainment.
            </p>
          </div>
          
          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {ARTICLES.map(article => (
              <Link 
                href={`/vibe-gaming-weekly/${article.slug}`}
                key={article.slug}
                className="bg-grok-card border border-grok-border rounded-lg overflow-hidden hover:border-purple-500 transition-colors duration-300"
              >
                <div className="h-56 overflow-hidden">
                  {article.coverImage ? (
                    <img 
                      src={article.coverImage} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-purple-900/30 to-black">
                      <div className="text-2xl font-bold text-purple-500">
                        {article.title.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <span>{article.date}</span>
                    <span className="mx-2">•</span>
                    <span>{article.author}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{article.title}</h2>
                  <p className="text-gray-300 mb-4">{article.excerpt}</p>
                  <div className="text-purple-500 font-medium">Read more →</div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Newsletter Sign-up */}
          <div className="bg-grok-card border border-grok-border rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive the latest Vibe Gaming Weekly articles directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-2 bg-grok-darker border border-grok-border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 