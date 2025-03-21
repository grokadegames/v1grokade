'use client';

import { Suspense, useEffect } from 'react';
import AuthNavbar from '@/components/AuthNavbar';
import Hero from '@/components/Hero';
import GameGrid from '@/components/GameGrid';
import Footer from '@/components/Footer';
import WelcomeNotification from '@/components/WelcomeNotification';
import SchemaOrg from '@/components/SchemaOrg';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  
  // Unlock the game browser achievement when page loads
  useEffect(() => {
    if (isAuthenticated) {
      // Unlock game browser achievement
      fetch('/api/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ achievementId: 'game_browser' }),
      }).catch(err => console.error('Error unlocking achievement:', err));
    }
  }, [isAuthenticated]);

  return (
    <div className="bg-grok-darker">
      <SchemaOrg 
        organization={true}
        website={true}
        // Video game marketplace schema - custom implementation
        customSchema={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Grokade - AI Gaming Platform',
          applicationCategory: 'GameApplication',
          operatingSystem: 'Web Browser',
          description: 'Discover AI-built games, join competitions, and connect with game developers. Grokade is the ultimate hub for AI gaming enthusiasts.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        }}
      />
      <AuthNavbar />
      <main className="pt-12">
        <Hero />
        <GameGrid />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <WelcomeNotification />
      </Suspense>
    </div>
  );
}
