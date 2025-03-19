'use client';

import { useState, useRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function BadgesContent() {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState('vibecoded');
  const [badgeSize, setBadgeSize] = useState('medium');
  const badgeColor = 'purple'; // Only using purple color
  
  const codeRefs = {
    html: useRef(null),
    markdown: useRef(null),
    bbcode: useRef(null)
  };

  const badges = {
    vibecoded: {
      name: 'Vibe Coded',
      description: 'Showcase your game as using vibe coding technology',
      image: `/images/badges/grokade-vibecoded-${badgeColor}.svg`
    },
    aibuilt: {
      name: 'AI Built',
      description: 'Highlight that your game was built with AI',
      image: `/images/badges/grokade-aibuilt-${badgeColor}.svg`
    }
  };

  const sizes = {
    small: { width: 120, height: 40 },
    medium: { width: 180, height: 60 },
    large: { width: 240, height: 80 }
  };

  const gameSlug = 'your-game-slug';
  const badgeUrl = `https://grokade.com/game/${gameSlug}`;
  const { width, height } = sizes[badgeSize];
  const selectedBadgeImage = badges[selectedBadge].image;

  const handleCopy = (index) => {
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getEmbedCode = (type) => {
    switch(type) {
      case 'html':
        return `<a href="${badgeUrl}" target="_blank" rel="noopener noreferrer" title="Play on Grokade">
  <img src="https://grokade.com${selectedBadgeImage}" alt="Play on Grokade" width="${width}" height="${height}" />
</a>`;
      
      case 'markdown':
        return `[![Play on Grokade](https://grokade.com${selectedBadgeImage})](${badgeUrl})`;
      
      case 'bbcode':
        return `[url=${badgeUrl}][img]https://grokade.com${selectedBadgeImage}[/img][/url]`;
      
      default:
        return '';
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Grokade Game Badges</h1>
      <p className="text-xl text-grok-text-secondary mb-12">
        Add a badge to your game website and let players know your game is on Grokade.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Badge Customization */}
        <div className="lg:col-span-1">
          <div className="bg-grok-dark p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold text-white mb-6">Customize Badge</h2>
            
            <div className="mb-6">
              <label className="block text-white mb-2">Badge Type</label>
              <select 
                value={selectedBadge}
                onChange={e => setSelectedBadge(e.target.value)}
                className="w-full bg-grok-darker text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-grok-purple"
              >
                {Object.entries(badges).map(([key, badge]) => (
                  <option key={key} value={key}>{badge.name}</option>
                ))}
              </select>
              <p className="mt-2 text-grok-text-secondary text-sm">
                {badges[selectedBadge].description}
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-white mb-2">Size</label>
              <select 
                value={badgeSize}
                onChange={e => setBadgeSize(e.target.value)}
                className="w-full bg-grok-darker text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-grok-purple"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-white mb-2">Game Slug</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-grok-darker text-gray-400">
                  grokade.com/game/
                </span>
                <input
                  type="text"
                  className="flex-1 bg-grok-darker text-white border border-gray-700 rounded-r-lg p-3 focus:outline-none focus:ring-2 focus:ring-grok-purple"
                  placeholder="your-game-slug"
                  value={gameSlug}
                  readOnly
                />
              </div>
              <p className="mt-2 text-grok-text-secondary text-sm">
                Replace with your actual game slug from your Grokade game page URL
              </p>
            </div>
          </div>
        </div>

        {/* Badge Preview and Code */}
        <div className="lg:col-span-2">
          <div className="bg-grok-dark p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold text-white mb-6">Preview</h2>
            
            <div className="flex items-center justify-center bg-grok-darker p-8 rounded-lg mb-6">
              <div className="flex items-center justify-center">
                <img 
                  src={selectedBadgeImage} 
                  alt="Grokade Badge Preview" 
                  width={width} 
                  height={height}
                  className="max-w-full"
                />
              </div>
            </div>
            
            <p className="text-grok-text-secondary mb-6">
              This badge will link to your game on Grokade. Copy the code below to add to your website.
            </p>
          </div>
          
          <div className="bg-grok-dark p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Embed Code</h2>
            
            <div className="space-y-6">
              {/* HTML Embed Code */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-white">HTML</h3>
                  <CopyToClipboard text={getEmbedCode('html')} onCopy={() => handleCopy(0)}>
                    <button className="text-grok-purple hover:text-grok-purple-light font-medium">
                      {copiedIndex === 0 ? 'Copied!' : 'Copy'}
                    </button>
                  </CopyToClipboard>
                </div>
                <div className="bg-grok-darker rounded-lg p-4 overflow-auto">
                  <pre className="text-grok-text-secondary text-sm whitespace-pre-wrap" ref={codeRefs.html}>
                    {getEmbedCode('html')}
                  </pre>
                </div>
              </div>
              
              {/* Markdown Embed Code */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-white">Markdown</h3>
                  <CopyToClipboard text={getEmbedCode('markdown')} onCopy={() => handleCopy(1)}>
                    <button className="text-grok-purple hover:text-grok-purple-light font-medium">
                      {copiedIndex === 1 ? 'Copied!' : 'Copy'}
                    </button>
                  </CopyToClipboard>
                </div>
                <div className="bg-grok-darker rounded-lg p-4 overflow-auto">
                  <pre className="text-grok-text-secondary text-sm whitespace-pre-wrap" ref={codeRefs.markdown}>
                    {getEmbedCode('markdown')}
                  </pre>
                </div>
              </div>
              
              {/* BBCode Embed Code */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-white">BBCode (Forums)</h3>
                  <CopyToClipboard text={getEmbedCode('bbcode')} onCopy={() => handleCopy(2)}>
                    <button className="text-grok-purple hover:text-grok-purple-light font-medium">
                      {copiedIndex === 2 ? 'Copied!' : 'Copy'}
                    </button>
                  </CopyToClipboard>
                </div>
                <div className="bg-grok-darker rounded-lg p-4 overflow-auto">
                  <pre className="text-grok-text-secondary text-sm whitespace-pre-wrap" ref={codeRefs.bbcode}>
                    {getEmbedCode('bbcode')}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 p-8 bg-gradient-to-r from-grok-purple to-blue-700 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Why Add Badges to Your Game?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white mb-6">
          <div>
            <h3 className="font-semibold mb-2">Increase Visibility</h3>
            <p>Connect your game to the Grokade ecosystem and gain more players.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Build Credibility</h3>
            <p>Show that your game is part of a curated platform for AI-built games.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Join the Community</h3>
            <p>Be recognized as part of the growing AI game development community.</p>
          </div>
        </div>
        <a href="/developers" className="inline-block bg-white text-grok-purple font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
          Back to Developer Resources
        </a>
      </div>
    </div>
  );
} 