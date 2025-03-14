'use client';

import AuthNavbar from '@/components/AuthNavbar';
import Hero from '@/components/Hero';
import GameGrid from '@/components/GameGrid';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="bg-gray-900">
      <AuthNavbar />
      <main>
        <Hero />
        <GameGrid />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
