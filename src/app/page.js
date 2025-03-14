'use client';

import { Suspense } from 'react';
import AuthNavbar from '@/components/AuthNavbar';
import Hero from '@/components/Hero';
import GameGrid from '@/components/GameGrid';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import WelcomeNotification from '@/components/WelcomeNotification';

export default function Home() {
  return (
    <div className="bg-grok-darker">
      <AuthNavbar />
      <main>
        <Hero />
        <GameGrid />
        <CTA />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <WelcomeNotification />
      </Suspense>
    </div>
  );
}
