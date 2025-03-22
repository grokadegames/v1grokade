'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';

// Sample articles data - same as in the list page
// This would ideally come from a database or CMS
const ARTICLES = [
  {
    slug: 'article-1',
    title: 'Your First Article Title',
    excerpt: 'A brief description of your first article. This should be engaging and make readers want to click through to read the full article.',
    coverImage: 'https://ik.imagekit.io/cbzkrwprl/article-1-cover.jpg',
    author: 'Grokade Team',
    date: 'April 12, 2025',
    content: `
      <p>This is the full content of your first article. You can include multiple paragraphs, formatting, and images.</p>
      
      <h2>Section Heading</h2>
      
      <p>Here's a paragraph with some <strong>bold text</strong> and <em>italic text</em> for emphasis. You can structure your content however you want.</p>
      
      <p>For images, you can include them like this:</p>
      
      <img src="https://ik.imagekit.io/cbzkrwprl/article-1-image-1.jpg" alt="Description of image" class="my-6 rounded-lg w-full" />
      
      <p>Continue with more content, lists, etc.</p>
      
      <ul>
        <li>List item one</li>
        <li>List item two</li>
        <li>List item three</li>
      </ul>
      
      <p>Conclude your article with a strong closing paragraph.</p>
    `
  },
  {
    slug: 'article-2',
    title: 'Your Second Article Title',
    excerpt: 'A brief description of your second article. This should be compelling enough to drive readers to click and read more.',
    coverImage: 'https://ik.imagekit.io/cbzkrwprl/article-2-cover.jpg',
    author: 'Grokade Team',
    date: 'April 19, 2025',
    content: `
      <p>This is the full content of your second article. You can include multiple paragraphs, formatting, and images.</p>
      
      <h2>Section Heading</h2>
      
      <p>Here's a paragraph with some <strong>bold text</strong> and <em>italic text</em> for emphasis. You can structure your content however you want.</p>
      
      <p>For images, you can include them like this:</p>
      
      <img src="https://ik.imagekit.io/cbzkrwprl/article-2-image-1.jpg" alt="Description of image" class="my-6 rounded-lg w-full" />
      
      <p>Continue with more content, lists, etc.</p>
      
      <ul>
        <li>List item one</li>
        <li>List item two</li>
        <li>List item three</li>
      </ul>
      
      <p>Conclude your article with a strong closing paragraph.</p>
    `
  }
];

export default function ArticlePage() {
  const params = useParams();
  const { slug } = params;
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Find the article with the matching slug
    const foundArticle = ARTICLES.find(a => a.slug === slug);
    setArticle(foundArticle);
    setLoading(false);
  }, [slug]);
  
  if (loading) {
    return (
      <div className="bg-grok-darker min-h-screen">
        <AuthNavbar />
        <main className="container-custom mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-grok-card animate-pulse h-8 w-3/4 mb-4 rounded"></div>
            <div className="bg-grok-card animate-pulse h-4 w-1/2 mb-8 rounded"></div>
            <div className="bg-grok-card animate-pulse h-64 w-full mb-8 rounded"></div>
            <div className="bg-grok-card animate-pulse h-4 w-full mb-4 rounded"></div>
            <div className="bg-grok-card animate-pulse h-4 w-full mb-4 rounded"></div>
            <div className="bg-grok-card animate-pulse h-4 w-3/4 mb-8 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!article) {
    return (
      <div className="bg-grok-darker min-h-screen">
        <AuthNavbar />
        <main className="container-custom mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
            <p className="text-gray-300 mb-8">The article you're looking for doesn't exist or has been removed.</p>
            <Link href="/vibe-gaming-weekly" className="btn-primary">
              Back to Articles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="bg-grok-darker min-h-screen">
      <AuthNavbar />
      
      <main className="container-custom mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <Link 
              href="/vibe-gaming-weekly" 
              className="text-purple-500 hover:text-purple-400 mb-4 inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to articles
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-4">{article.title}</h1>
            
            <div className="flex items-center text-sm text-gray-400 mb-6">
              <span>{article.date}</span>
              <span className="mx-2">•</span>
              <span>{article.author}</span>
            </div>
          </div>
          
          {/* Hero Image */}
          {article.coverImage && (
            <div className="mb-8">
              <img 
                src={article.coverImage} 
                alt={article.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          
          {/* Article Content */}
          <div 
            className="prose prose-invert prose-purple prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          {/* Social Sharing */}
          <div className="mt-12 pt-6 border-t border-grok-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-gray-300">Share this article:</div>
              <div className="flex space-x-4">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://grokade.com/vibe-gaming-weekly/${article.slug}`)}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://grokade.com/vibe-gaming-weekly/${article.slug}`)}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://grokade.com/vibe-gaming-weekly/${article.slug}`)}&title=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* More Articles */}
          <div className="mt-12 pt-8 border-t border-grok-border">
            <h3 className="text-xl font-bold text-white mb-6">More Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ARTICLES.filter(a => a.slug !== article.slug).slice(0, 2).map(relatedArticle => (
                <Link 
                  href={`/vibe-gaming-weekly/${relatedArticle.slug}`}
                  key={relatedArticle.slug}
                  className="bg-grok-card border border-grok-border rounded-lg overflow-hidden hover:border-purple-500 transition-colors duration-300"
                >
                  <div className="h-40 overflow-hidden">
                    {relatedArticle.coverImage ? (
                      <img 
                        src={relatedArticle.coverImage} 
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-purple-900/30 to-black">
                        <div className="text-2xl font-bold text-purple-500">
                          {relatedArticle.title.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-white mb-2">{relatedArticle.title}</h4>
                    <div className="text-purple-500 text-sm font-medium">Read article →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 