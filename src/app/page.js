'use client';

import { Suspense } from 'react';
import AuthNavbar from '@/components/AuthNavbar';
import Hero from '@/components/Hero';
import GameGrid from '@/components/GameGrid';
import Footer from '@/components/Footer';
import WelcomeNotification from '@/components/WelcomeNotification';

export default function Home() {
  return (
    <div className="bg-grok-darker">
      <AuthNavbar />
      <main className="pt-16">
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
