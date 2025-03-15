import Link from 'next/link';

export default function CTA() {
  return (
    <div className="bg-primary py-16 md:py-24">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Stay Ahead in Gaming Innovation
          </h2>
          <p className="text-white text-opacity-90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest AI-driven gaming insights, updates on projects, and exclusive tips for creators. Plus, follow us on X for real-time discussions and community buzz!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/newsletter" 
              className="bg-white text-primary font-semibold px-8 py-3 rounded-md hover:bg-opacity-90 transition-all"
            >
              Subscribe Now
            </Link>
            <a 
              href="https://twitter.com/GrokadeGames" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border border-white text-white font-semibold px-8 py-3 rounded-md hover:bg-white hover:bg-opacity-10 transition-all"
            >
              Follow Us on X @GrokadeGames
            </a>
          </div>
          <p className="text-white text-opacity-75 mt-6">
            Join our growing community—no spam, just value.
          </p>
        </div>
      </div>
    </div>
  );
} 