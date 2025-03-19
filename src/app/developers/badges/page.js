import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import BadgesContent from '@/components/BadgesContent';

export const metadata = {
  title: 'Grokade Badges - Link Your Game to Grokade',
  description: 'Add a Grokade badge to your game website and let players know your game is featured on the AI Gaming Vibe Hub. Get embed codes and showcase badges.',
}

export default function BadgesPage() {
  return (
    <div className="bg-grok-darker min-h-screen">
      <AuthNavbar />
      
      <main className="container-custom py-16">
        <BadgesContent />
      </main>
      
      <Footer />
    </div>
  );
} 