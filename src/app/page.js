import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import GameGrid from '../components/GameGrid';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-grok-dark">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <GameGrid />
      </main>
      <Footer />
    </div>
  );
}
