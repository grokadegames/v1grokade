'use client';

import { useState } from 'react';
import SchemaOrg from '@/components/SchemaOrg';

export default function DevelopersContent() {
  const [activeTab, setActiveTab] = useState('resources');

  return (
    <>
      <SchemaOrg 
        organization={true}
        // FAQPage schema for developer questions
        faqPage={{
          questions: [
            {
              question: "How do I submit my AI-built game to Grokade?",
              answer: "You can submit your game through our dashboard after registering. We support WebGL games built with Three.js and other web technologies."
            },
            {
              question: "What technologies are supported on Grokade?",
              answer: "Grokade supports WebGL, Three.js, and other web-based game technologies that can run in a browser."
            },
            {
              question: "Can I monetize my AI-built game on Grokade?",
              answer: "Yes, Grokade provides monetization options for developers through our marketplace."
            },
            {
              question: "What resources do you provide for new AI game developers?",
              answer: "We offer tutorials, documentation, code examples, and a vibrant community to help you get started building AI games."
            }
          ]
        }}
      />

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Resources for AI Game Developers</h1>
        <p className="text-xl text-grok-text-secondary mb-12">
          Everything you need to build, publish, and grow your AI-built games on Grokade.
        </p>

        {/* Tabs */}
        <div className="border-b border-gray-800 mb-10">
          <nav className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('resources')}
              className={`pb-4 text-sm font-medium ${
                activeTab === 'resources' 
                  ? 'border-b-2 border-grok-purple text-white' 
                  : 'text-grok-text-secondary hover:text-white'
              }`}
            >
              Resources
            </button>
            <button 
              onClick={() => setActiveTab('tutorials')}
              className={`pb-4 text-sm font-medium ${
                activeTab === 'tutorials' 
                  ? 'border-b-2 border-grok-purple text-white' 
                  : 'text-grok-text-secondary hover:text-white'
              }`}
            >
              Tutorials
            </button>
            <button 
              onClick={() => setActiveTab('tools')}
              className={`pb-4 text-sm font-medium ${
                activeTab === 'tools' 
                  ? 'border-b-2 border-grok-purple text-white' 
                  : 'text-grok-text-secondary hover:text-white'
              }`}
            >
              Tools
            </button>
            <button 
              onClick={() => setActiveTab('api')}
              className={`pb-4 text-sm font-medium ${
                activeTab === 'api' 
                  ? 'border-b-2 border-grok-purple text-white' 
                  : 'text-grok-text-secondary hover:text-white'
              }`}
            >
              API Docs
            </button>
            <button 
              onClick={() => setActiveTab('showcase')}
              className={`pb-4 text-sm font-medium ${
                activeTab === 'showcase' 
                  ? 'border-b-2 border-grok-purple text-white' 
                  : 'text-grok-text-secondary hover:text-white'
              }`}
            >
              Showcase
            </button>
          </nav>
        </div>

        {/* Resources Tab Content */}
        {activeTab === 'resources' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Essential Resources for AI Game Development</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-grok-dark p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Getting Started with WebGL</h3>
                <p className="text-grok-text-secondary mb-4">
                  Learn the fundamentals of WebGL for creating browser-based 3D games.
                </p>
                <a href="https://webglfundamentals.org/" target="_blank" rel="noopener noreferrer" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  Explore WebGL Fundamentals →
                </a>
              </div>
              
              <div className="bg-grok-dark p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Three.js Documentation</h3>
                <p className="text-grok-text-secondary mb-4">
                  Comprehensive guides for Three.js, a popular 3D library for creating WebGL games.
                </p>
                <a href="https://threejs.org/docs/" target="_blank" rel="noopener noreferrer" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  Read Three.js Docs →
                </a>
              </div>
              
              <div className="bg-grok-dark p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">AI Integration Guidelines</h3>
                <p className="text-grok-text-secondary mb-4">
                  Best practices for integrating AI-generated content into your game projects.
                </p>
                <a href="/developers/ai-guidelines" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  View AI Guidelines →
                </a>
              </div>
              
              <div className="bg-grok-dark p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Vibe Coding Resources</h3>
                <p className="text-grok-text-secondary mb-4">
                  Learn about vibe coding and how to use AI to create immersive game experiences.
                </p>
                <a href="/developers/vibe-coding" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  Explore Vibe Coding →
                </a>
              </div>

              <div className="bg-grok-dark p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Grokade Badges</h3>
                <p className="text-grok-text-secondary mb-4">
                  Add badges to your game website or repository to show it's featured on Grokade.
                </p>
                <a href="/developers/badges" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  Get Badge Code →
                </a>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-6">Community Resources</h2>
            <ul className="list-disc pl-6 text-grok-text-secondary space-y-4 mb-12">
              <li>
                <a href="https://discord.gg/grokade" target="_blank" rel="noopener noreferrer" className="text-grok-purple hover:text-grok-purple-light">
                  Grokade Discord Community
                </a>
                <p>Connect with other AI game developers, share knowledge, and get support.</p>
              </li>
              <li>
                <a href="https://github.com/grokade" target="_blank" rel="noopener noreferrer" className="text-grok-purple hover:text-grok-purple-light">
                  Grokade GitHub Repository
                </a>
                <p>Explore open-source examples, starter templates, and community projects.</p>
              </li>
              <li>
                <a href="/blog/game-development" className="text-grok-purple hover:text-grok-purple-light">
                  Developer Blog
                </a>
                <p>Articles, tutorials, and insights from the Grokade development team.</p>
              </li>
            </ul>
          </div>
        )}

        {/* Tutorials Tab Content */}
        {activeTab === 'tutorials' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">AI Game Development Tutorials</h2>
            
            <div className="space-y-8 mb-12">
              <div className="bg-grok-dark p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Creating Your First AI-Generated Game</h3>
                <p className="text-grok-text-secondary mb-4">
                  A step-by-step guide to creating a simple game using AI tools and WebGL.
                </p>
                <a href="/tutorials/first-ai-game" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  Start the Tutorial →
                </a>
              </div>
              
              <div className="bg-grok-dark p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Optimizing WebGL Performance</h3>
                <p className="text-grok-text-secondary mb-4">
                  Learn how to optimize your WebGL games for better performance across devices.
                </p>
                <a href="/tutorials/webgl-optimization" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  View Tutorial →
                </a>
              </div>
              
              <div className="bg-grok-dark p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Integrating AI-Generated Assets</h3>
                <p className="text-grok-text-secondary mb-4">
                  How to seamlessly integrate AI-generated textures, models, and sound in your games.
                </p>
                <a href="/tutorials/ai-assets-integration" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  Read Guide →
                </a>
              </div>
              
              <div className="bg-grok-dark p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Publishing Your Game on Grokade</h3>
                <p className="text-grok-text-secondary mb-4">
                  A complete walkthrough of the publishing process and best practices.
                </p>
                <a href="/tutorials/publishing-guide" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  View Publishing Guide →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tools Tab Content */}
        {activeTab === 'tools' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Developer Tools & SDKs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-grok-dark p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Grokade SDK</h3>
                <p className="text-grok-text-secondary mb-4">
                  Our official SDK for integrating your game with Grokade's platform services.
                </p>
                <a href="/developers/sdk" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  Download SDK →
                </a>
              </div>
              
              <div className="bg-grok-dark p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">WebGL Debugger</h3>
                <p className="text-grok-text-secondary mb-4">
                  Tools for debugging and optimizing your WebGL games.
                </p>
                <a href="/tools/webgl-debugger" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  Try Debugger →
                </a>
              </div>
              
              <div className="bg-grok-dark p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Asset Optimizer</h3>
                <p className="text-grok-text-secondary mb-4">
                  Optimize your game assets for web deployment and faster loading.
                </p>
                <a href="/tools/asset-optimizer" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  Use Optimizer →
                </a>
              </div>
              
              <div className="bg-grok-dark p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Vibe Editor</h3>
                <p className="text-grok-text-secondary mb-4">
                  Create and edit vibe-based game experiences with our specialized editor.
                </p>
                <a href="/tools/vibe-editor" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  Open Vibe Editor →
                </a>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-6">Third-Party Tools We Recommend</h2>
            <ul className="list-disc pl-6 text-grok-text-secondary space-y-4 mb-12">
              <li>
                <a href="https://threejs.org/" target="_blank" rel="noopener noreferrer" className="text-grok-purple hover:text-grok-purple-light">
                  Three.js
                </a>
                <p>A lightweight 3D library for creating WebGL-based games and experiences.</p>
              </li>
              <li>
                <a href="https://www.babylonjs.com/" target="_blank" rel="noopener noreferrer" className="text-grok-purple hover:text-grok-purple-light">
                  Babylon.js
                </a>
                <p>A powerful 3D game engine for web development.</p>
              </li>
              <li>
                <a href="https://pixijs.com/" target="_blank" rel="noopener noreferrer" className="text-grok-purple hover:text-grok-purple-light">
                  PixiJS
                </a>
                <p>2D WebGL renderer with great performance for browser games.</p>
              </li>
            </ul>
          </div>
        )}
        
        {/* API Docs Tab Content */}
        {activeTab === 'api' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Grokade API Documentation</h2>
            <p className="text-grok-text-secondary mb-8">
              Our comprehensive API allows you to integrate with Grokade services and enhance your games.
            </p>
            
            <div className="bg-grok-dark p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">API Overview</h3>
              <p className="text-grok-text-secondary mb-4">
                Get started with the Grokade API - authentication, endpoints, and basic concepts.
              </p>
              <a href="/api/docs" 
                className="text-grok-purple hover:text-grok-purple-light font-medium">
                View API Docs →
              </a>
            </div>
            
            <div className="space-y-6 mb-12">
              <div className="border-l-4 border-grok-purple pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">Authentication</h3>
                <p className="text-grok-text-secondary">Secure your API requests with proper authentication.</p>
                <a href="/api/docs/authentication" className="text-sm text-grok-purple hover:text-grok-purple-light">Learn more</a>
              </div>
              
              <div className="border-l-4 border-grok-purple pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">Game Management</h3>
                <p className="text-grok-text-secondary">Submit, update, and manage your games programmatically.</p>
                <a href="/api/docs/games" className="text-sm text-grok-purple hover:text-grok-purple-light">Learn more</a>
              </div>
              
              <div className="border-l-4 border-grok-purple pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">User Integration</h3>
                <p className="text-grok-text-secondary">Access user profiles, achievements, and progress data.</p>
                <a href="/api/docs/users" className="text-sm text-grok-purple hover:text-grok-purple-light">Learn more</a>
              </div>
              
              <div className="border-l-4 border-grok-purple pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
                <p className="text-grok-text-secondary">Retrieve analytics data for your published games.</p>
                <a href="/api/docs/analytics" className="text-sm text-grok-purple hover:text-grok-purple-light">Learn more</a>
              </div>
            </div>
            
            <div className="bg-grok-dark p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">API Rate Limits</h3>
              <p className="text-grok-text-secondary mb-4">
                Understanding API rate limits and best practices for efficient use.
              </p>
              <a href="/api/docs/rate-limits" 
                className="text-grok-purple hover:text-grok-purple-light font-medium">
                View Rate Limit Guidelines →
              </a>
            </div>
          </div>
        )}
        
        {/* Showcase Tab Content */}
        {activeTab === 'showcase' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Developer Showcase</h2>
            <p className="text-grok-text-secondary mb-8">
              Explore successful games and learn from their developers.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-grok-dark p-6 rounded-lg">
                <div className="aspect-video bg-grok-darker mb-4 flex items-center justify-center">
                  <span className="text-grok-text-secondary">Game Screenshot</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Vibe Quest</h3>
                <p className="text-grok-text-secondary mb-4">
                  An immersive 3D adventure game generated with AI. Learn how the developer achieved 
                  stunning visuals with optimized WebGL.
                </p>
                <a href="/showcase/vibe-quest" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  View Case Study →
                </a>
              </div>
              
              <div className="bg-grok-dark p-6 rounded-lg">
                <div className="aspect-video bg-grok-darker mb-4 flex items-center justify-center">
                  <span className="text-grok-text-secondary">Game Screenshot</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Cosmic Drift</h3>
                <p className="text-grok-text-secondary mb-4">
                  A space exploration game with procedurally generated worlds. Features innovative AI-driven 
                  gameplay mechanics.
                </p>
                <a href="/showcase/cosmic-drift" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  View Case Study →
                </a>
              </div>
              
              <div className="bg-grok-dark p-6 rounded-lg">
                <div className="aspect-video bg-grok-darker mb-4 flex items-center justify-center">
                  <span className="text-grok-text-secondary">Game Screenshot</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Neon Tactics</h3>
                <p className="text-grok-text-secondary mb-4">
                  A tactical strategy game with GPU-accelerated AI opponents. Learn about their 
                  WebGL optimization techniques.
                </p>
                <a href="/showcase/neon-tactics" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  View Case Study →
                </a>
              </div>
              
              <div className="bg-grok-dark p-6 rounded-lg">
                <div className="aspect-video bg-grok-darker mb-4 flex items-center justify-center">
                  <span className="text-grok-text-secondary">Game Screenshot</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Rhythmic Dreams</h3>
                <p className="text-grok-text-secondary mb-4">
                  A music-based game with AI-generated visuals that respond to gameplay. Innovative 
                  use of WebGL shaders.
                </p>
                <a href="/showcase/rhythmic-dreams" 
                  className="text-grok-purple hover:text-grok-purple-light font-medium">
                  View Case Study →
                </a>
              </div>
            </div>
          </div>
        )}
        
        {/* Call to Action */}
        <div className="bg-gradient-to-r from-grok-purple to-blue-700 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Build Your Game?</h2>
          <p className="text-white mb-6 max-w-2xl mx-auto">
            Join our community of AI game developers and bring your creative vision to life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/register" className="bg-white text-grok-purple font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
              Create Developer Account
            </a>
            <a href="/discord" target="_blank" rel="noopener noreferrer" 
              className="bg-transparent border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition">
              Join Our Discord
            </a>
          </div>
        </div>
      </div>
    </>
  );
} 