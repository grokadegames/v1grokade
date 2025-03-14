'use client';

import AuthNavbar from '@/components/AuthNavbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import GameGrid from '@/components/GameGrid';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="bg-gray-900">
      <AuthNavbar />
      <main>
        <Hero />
        <Features />
        <GameGrid />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
