import Link from 'next/link';

export default function CTA() {
  return (
    <div className="bg-primary py-16 md:py-24">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Start Your Learning Journey Today
          </h2>
          <p className="text-white text-opacity-90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are accelerating their skills with AI-powered coaching. Get started for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-white text-primary font-semibold px-8 py-3 rounded-md hover:bg-opacity-90 transition-all"
            >
              Get Started for Free
            </Link>
            <Link 
              href="/demo" 
              className="bg-transparent border border-white text-white font-semibold px-8 py-3 rounded-md hover:bg-white hover:bg-opacity-10 transition-all"
            >
              Request a Demo
            </Link>
          </div>
          <p className="text-white text-opacity-75 mt-6">
            No credit card required. Start learning in minutes.
          </p>
        </div>
      </div>
    </div>
  );
} 