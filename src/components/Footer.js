'use client';

import Link from 'next/link';
import { useRoadmapModal } from '@/contexts/RoadmapModalContext';

export default function Footer() {
  const { openRoadmapModal } = useRoadmapModal();
  
  return (
    <footer className="bg-grok-darker pt-16 pb-12">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row justify-between mb-16">
          {/* Logo and description */}
          <div className="mb-10 lg:mb-0 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            <Link href="/" className="inline-block mb-6">
              <div className="text-2xl font-bold flex items-center justify-center lg:justify-start">
                <span className="text-grok-purple">GROK</span>
                <span className="text-white">ADE</span>
              </div>
            </Link>
            <p className="text-grok-text-secondary mb-6">
              Discover games built with Grok and other AI tools. Attract players, 
              run competitions, hire game devs, or browse our vibegame index.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
            {/* Column 1: Platform */}
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-grok-text-secondary hover:text-white transition-colors">Games</Link></li>
                <li><Link href="/gigs" className="text-grok-text-secondary hover:text-white transition-colors">Gigs</Link></li>
                <li><Link href="/talent" className="text-grok-text-secondary hover:text-white transition-colors">Talent</Link></li>
                <li><Link href="/rankings" className="text-grok-text-secondary hover:text-white transition-colors">Rankings</Link></li>
                <li><Link href="/competitions" className="text-grok-text-secondary hover:text-white transition-colors">Competitions</Link></li>
              </ul>
            </div>

            {/* Column 2: Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-grok-text-secondary hover:text-white transition-colors">About</Link></li>
                <li><button onClick={openRoadmapModal} className="text-grok-text-secondary hover:text-white transition-colors text-left w-full">Roadmap</button></li>
                <li><Link href="/discord" className="text-grok-text-secondary hover:text-white transition-colors">Discord</Link></li>
                <li><Link href="/x" className="text-grok-text-secondary hover:text-white transition-colors">X</Link></li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/documentation" className="text-grok-text-secondary hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/feedback" className="text-grok-text-secondary hover:text-white transition-colors">Feedback</Link></li>
                <li><Link href="/github" className="text-grok-text-secondary hover:text-white transition-colors">GitHub</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-grok-text-secondary text-sm">
            © {new Date().getFullYear()} Grokade. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 