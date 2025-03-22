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
    slug: 'is-vibe-coded-gaming-a-fad',
    title: 'Is Vibe-Coded Gaming a Fad? Exploring AI\'s Role in Game Development',
    excerpt: 'Discover whether vibe-coded games, powered by AI tools like Cursor and GitHub Copilot, are a fleeting trend or a transformative force in the gaming industry, as explored through the VibeJam competition and viral successes.',
    coverImage: 'https://ik.imagekit.io/cbzkrwprl/vibe-coded-gaming.jpg',
    author: 'James Chmielinski (@aigamelord)',
    date: 'March 22, 2025',
    content: `
      <p>Vibe-coded games, where AI tools generate code based on simple descriptions, are making waves in the gaming world. With a recent competition showcasing over 300 submissions and high-profile successes, it's worth exploring whether this is a passing trend or a scalable industry. Let's break it down for clarity.</p>
      
      <h2>Are Vibe-Coded Games Here to Stay?</h2>
      
      <p>The rapid rise of vibe-coded games, enabled by AI, suggests they're more than a fad. The VibeJam competition, hosted by @levelsio and sponsored by bolt.new, had over 300 games submitted by March 21, 2025, with a deadline of March 25, 2025. This shows significant interest, especially among indie developers. A notable example is Pieter Levels' 3D flight simulator, built in three hours using AI, which went viral with 296,000 players and now earns $72,000 monthly (Automatenow on Levels' Game). This unexpected financial success highlights their commercial potential.</p>
      
      <p>However, whether traditional gaming communities will fully adopt them is uncertain. X posts show mixed reactions, with some praising the fun factor (e.g., @vapormensch calling one "the most fun" vibe-coded game) and others viewing them as "folk art" with value in the process, not the product (X post by @jstn). This controversy suggests a divide, but early engagement is promising.</p>
      
      <h2>Impact on Game Development</h2>
      
      <p>AI is transforming game development, making it faster and more accessible. Industry experts predict AI could manage over half of development within 5 to 10 years (Kevuru Games on AI Disruption). For indie developers, vibe coding lowers barriers, potentially leading to a boom in creative output. This could mean more complex games built quickly, as seen in an X post by @tacobelmin on Multiplayer Poker Game.</p>
      
      <p>We are even getting complex mapping structures as seen in procedural dungeons (X post by @tacobelmin, X post by @odogono):</p>
      
      <img src="https://ik.imagekit.io/cbzkrwprl/procedural-dungeon.jpg" alt="Procedural Dungeons in Vibe-Coded Games" class="my-6 rounded-lg w-full" />
      
      <p>Gaming is a major investment area, and vibe-coded games could attract more funding given their efficiency. While it's unclear where all investment is going, successes like Levels' game suggest venture capitalists are watching. Vibe-coded games might evolve to be consumed like movies—short, engaging bursts—or become sustained experiences as AI improves, potentially redefining player engagement.</p>
      
      <h2>Analyzing Vibe-Coded Games</h2>
      
      <h3>Defining Vibe-Coded Games</h3>
      
      <p>Vibe-coded games are a product of "vibe coding," an AI-assisted approach where developers describe their ideas in plain language, and AI tools like Cursor, GitHub Copilot, and Replit Agent generate the code. This method, gaining traction in 2025, is particularly popular for rapid game prototyping. For instance, Andrew Chen's Substack notes an explosion of vibe-coded games, including flight sims, tank battles, and first-person shooters, highlighting its versatility. The AI Vibe Coded Games Website further showcases browser-playable games, indicating a growing ecosystem.</p>
      
      <h3>The #VibeJam Competition: A Case Study</h3>
      
      <p>The VibeJam competition, hosted by @levelsio (Pieter Levels) and sponsored by bolt.new, is a key indicator of this trend's momentum. As of March 21, 2025, over 300 games were submitted, with the deadline set for March 25, 2025. This high participation rate, detailed in various X posts, suggests a vibrant community of developers, including hobbyists and indie creators, leveraging AI for game development. For example, X post by @NicolasZu describes creating a multiplayer 3D game in 20 hours with 500 prompts and 20 euros, achieving 1.5 million views and 45,000 players, underscoring the accessibility and reach of vibe coding.</p>
      
      <h3>AI's Role in Game Development</h3>
      
      <p>AI is reshaping game development, and vibe coding is a manifestation of this shift. Ars Technica's Article notes that tools like Cursor (40,000 paying users in August 2024) and GitHub Copilot (1.3 million users in February 2024) are driving rapid prototyping, particularly for games. Industry insights, such as Kevuru Games on AI Disruption, predict AI will manage over half of game development within 5 to 10 years, enhancing efficiency in procedural content generation, NPC behavior, and dynamic difficulty adjustment. This aligns with TalentDesk's Guide, which emphasizes AI's role in complementing human creativity, suggesting a sustainable future for AI-driven development.</p>
      
      <h3>Community Reception and Traditional Gamers</h3>
      
      <p>The reception among traditional gaming communities is mixed, as seen in X posts. Positive feedback includes @vapormensch's comment on enjoying a vibe-coded game, while @jstn views them as "folk art," valuing the process over the product. This mixed reception highlights the evolving perception of AI-generated content in gaming.</p>
      
      <h3>Investment and Scalability</h3>
      
      <p>Gaming is a major investment sector, with AI's efficiency likely to attract more funding. Spiceworks' Article notes talent shortages in game development, and AI tools could address this, making vibe-coded games attractive to investors. Levels' game, with early revenue of $1,270 from 9 F-16s and 1 blimp, later scaling to $38,360 from 19 blimps and 12 F-16s, shows financial potential (Automatenow on Levels' Game). However, scalability depends on AI's ability to handle complex games, a challenge noted in Ars Technica's Article, where context size limits complexity.</p>
      
      <h3>Fun Factor and Consumption Patterns</h3>
      
      <p>Vibe-coded games may avoid traditional spending traps like microtransactions in AAA games, focusing on creativity. However, Levels' game includes $29.99 F-16s, suggesting monetization is possible. eLearning Industry's Future of Gaming suggests AI could make games more like movies, with short, immersive bursts, but as AI advances, they could evolve into sustained experiences, potentially redefining player engagement.</p>
      
      <h2>Conclusion and Future Outlook</h2>
      
      <p>Vibe-coded games are not a fad but a scalable industry, driven by AI's transformative potential. The VibeJam competition, with over 300 submissions, and viral successes like Levels' game, indicate strong grounding. While traditional gamers may be divided, AI's role in making development faster and more accessible suggests a future boom in indie games. Investment is likely to follow, and consumption patterns could shift, with games becoming more like movies or evolving into complex experiences. This aligns with Appinventiv's Blog, predicting AI will redefine gaming by 2027, with 64% of US and 70% of UK residents as gamers.</p>
      
      <h3>Key Citations</h3>
      <ul>
        <li>Andrew Chen's Predictions on Vibe Coding</li>
        <li>AI Vibe Coded Games Browser Play</li>
        <li>Ars Technica on Vibe Coding Traction</li>
        <li>Automatenow on Levels' Vibe-Coded Game Success</li>
        <li>Kevuru Games on AI Disrupting Gaming</li>
        <li>TalentDesk's Guide to AI in Game Dev</li>
        <li>Spiceworks on AI and Game Dev Future</li>
        <li>eLearning Industry on AI's Gaming Future</li>
        <li>Appinventiv's Blog on AI in Gaming</li>
        <li>X post by @NicolasZu on Vibe Coding Guide</li>
        <li>X post by @gdangel0 on Vibe-Coded Game</li>
        <li>X post by @jstn on Vibe-Coded Games as Folk Art</li>
        <li>X post by @vapormensch on Fun Vibe-Coded Game</li>
        <li>X post by @tacobelmin on Multiplayer Poker Game</li>
        <li>X post by @odogono on Procedural Dungeon</li>
      </ul>
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