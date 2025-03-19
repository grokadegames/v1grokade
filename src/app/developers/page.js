import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import DevelopersContent from '@/components/DevelopersContent';

export const metadata = {
  title: 'Grokade - Resources for AI Game Developers',
  description: 'Resources, tutorials, tools, and documentation for AI game developers. Learn about WebGL, Three.js, and how to create and publish games with AI.',
}

export default function DevelopersPage() {
  return (
    <div className="bg-grok-darker min-h-screen">
      <AuthNavbar />
      
      <main className="container-custom py-16">
        <DevelopersContent />
      </main>
      
      <Footer />
    </div>
  );
} 