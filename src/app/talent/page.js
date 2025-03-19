'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import SchemaOrg from '@/components/SchemaOrg';
import CombinedTrendIndicator from '@/components/CombinedTrendIndicator';

// Sample data for featured talent
const featuredTalent = [
  {
    id: 1,
    initials: 'AJ',
    name: 'Alex Johnson',
    title: 'Senior WebGL Developer',
    rating: 4.9,
    reviews: 49,
    skills: ['WebGL', 'Three.js', 'JavaScript', 'Game Optimization'],
    rate: '$65-85/hr',
    location: 'San Francisco, CA',
    featured: true,
    specialization: 'AI-built games',
    vibeCodingExpert: true
  },
  {
    id: 2,
    initials: 'SC',
    name: 'Sarah Chen',
    title: 'Game AI Specialist',
    rating: 4.8,
    reviews: 48,
    skills: ['AI', 'Machine Learning', 'JavaScript', 'Python'],
    rate: '$70-90/hr',
    location: 'Remote',
    featured: true,
    specialization: 'Vibe coding',
    vibeCodingExpert: true
  },
  {
    id: 3,
    initials: 'MR',
    name: 'Miguel Rodriguez',
    title: 'Unity Game Developer',
    rating: 4.7,
    reviews: 47,
    skills: ['Unity', 'C#', '3D Modeling', 'Game Design'],
    rate: '$55-75/hr',
    location: 'Austin, TX',
    featured: true,
    specialization: 'AI-driven game mechanics'
  }
];

// Talent card component
const TalentCard = ({ talent }) => {
  // Determine the initials to show in the circle if no profile image
  const initials = talent.initials || talent.name.split(' ').map(n => n[0]).join('');
  
  // Function to render the skills tags
  const renderSkills = (skills) => {
    return skills.map((skill, index) => (
      <span key={index} className="text-xs bg-gray-800 text-gray-200 px-2 py-1 rounded mr-1 mb-1 inline-block">
        {skill}
      </span>
    ));
  };
  
  // Determine if this talent specializes in vibe coding or AI games
  const hasSpecialization = talent.specialization || talent.vibeCodingExpert;

  return (
    <div className="bg-grok-dark rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl border border-gray-800">
      <div className="flex items-start">
        <div className="w-16 h-16 bg-grok-purple rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
          {initials}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white">{talent.name}</h3>
          <p className="text-grok-text-secondary mb-1">{talent.title}</p>
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400 mr-1">
              {'★'.repeat(Math.floor(talent.rating))}
              {talent.rating % 1 !== 0 && '☆'}
              {'☆'.repeat(5 - Math.ceil(talent.rating))}
            </div>
            <span className="text-sm text-grok-text-secondary">({talent.reviews} reviews)</span>
          </div>
          <p className="text-white font-semibold mb-4">{talent.rate}</p>
          
          {/* Specialization badge for vibe coding or AI expertise */}
          {hasSpecialization && (
            <div className="mb-3 bg-grok-purple bg-opacity-20 rounded-full px-3 py-1 inline-block">
              <span className="text-grok-purple text-sm font-medium">
                {talent.vibeCodingExpert ? '✦ Vibe Coding Expert' : `✦ ${talent.specialization}`}
              </span>
            </div>
          )}
          
          <div className="mb-3 flex flex-wrap">
            {renderSkills(talent.skills)}
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-grok-text-secondary">{talent.location}</span>
            <button className="bg-grok-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TalentPage() {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real app, we'd fetch from an API
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);

        // Try to fetch from API first
        try {
          const response = await fetch('/api/talent');
          if (response.ok) {
            const data = await response.json();
            if (data.profiles && data.profiles.length > 0) {
              // Use API data if available
              setProfiles(data.profiles);
              return;
            }
          }
        } catch (error) {
          console.error('Error fetching profiles:', error);
          // Fall back to sample data
        }

        // Fall back to sample data if API not available
        setProfiles([...featuredTalent]);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredProfiles = profiles.filter(profile => {
    const searchLower = searchTerm.toLowerCase();
    return profile.name.toLowerCase().includes(searchLower) ||
      profile.title.toLowerCase().includes(searchLower) ||
      profile.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
      profile.location.toLowerCase().includes(searchLower) ||
      (profile.specialization && profile.specialization.toLowerCase().includes(searchLower));
  });
  
  // Generate person schema for talents (for SEO)
  const generatePersonSchemas = () => {
    return profiles.slice(0, 5).map(talent => ({
      '@type': 'Person',
      name: talent.name,
      jobTitle: talent.title,
      description: `${talent.name} is a ${talent.title} specializing in ${talent.specialization || talent.skills.slice(0, 2).join(' and ')}. Available for hire on Grokade.`,
      ...(talent.vibeCodingExpert && { knowsAbout: 'Vibe Coding, AI Game Development, WebGL, Three.js' })
    }));
  };

  // Generate structured data for talent page
  const talentPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Grokade Talent - AI Game Developers & Vibe Coding Experts',
    description: 'Discover and hire top AI game developers and vibe coding experts on Grokade. Find specialized talent for WebGL, Three.js, and AI-driven game development.',
    url: 'https://grokade.com/talent',
    hasPart: generatePersonSchemas()
  };

  // Create a metadata description that's optimized for SEO
  const metaDescription = "Hire expert AI game developers and vibe coding specialists. Grokade's talent marketplace connects you with top WebGL, Three.js, and game development professionals for your next AI-built game project.";

  // Generate relevant keywords based on talent profiles
  const getMetaKeywords = () => {
    const baseKeywords = ['AI game developers', 'vibe coding experts', 'game development talent', 'WebGL developers', 'Three.js specialists'];
    
    // Add skills from featured talent
    const skillKeywords = profiles
      .flatMap(profile => profile.skills || [])
      .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    
    return [...baseKeywords, ...skillKeywords].join(', ');
  };
  
  return (
    <div className="min-h-screen bg-grok-darker">
      {/* SEO metadata */}
      <Head>
        <title>Grokade Talent - Hire AI Game Developers & Vibe Coding Experts</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={getMetaKeywords()} />
        <link rel="canonical" href="https://grokade.com/talent" />
      </Head>
      
      {/* Schema.org structured data */}
      <SchemaOrg
        customSchema={talentPageSchema}
      />
      
      <AuthNavbar />

      <main className="container-custom mx-auto px-4 py-12 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Grokade Talent</h1>
          <p className="text-xl text-grok-text-secondary max-w-2xl mx-auto">
            Discover and hire top AI game developers and vibe coding experts to bring your game vision to life.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for skills, roles, or expertise in vibe coding and AI game development..."
              className="w-full bg-grok-dark text-white border border-gray-800 rounded-lg p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-grok-purple"
              value={searchTerm}
              onChange={handleSearch}
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Featured Talent</h2>
            <div className="flex items-center">
              <span className="text-grok-text-secondary mr-2">Trending:</span>
              <CombinedTrendIndicator value={15} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(3).fill().map((_, index) => (
                <div key={index} className="bg-grok-dark rounded-lg shadow-lg p-6 animate-pulse">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-gray-700 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded mb-4 w-3/4"></div>
                      <div className="h-3 bg-gray-700 rounded mb-3"></div>
                      <div className="h-5 bg-gray-700 rounded mb-4 w-1/4"></div>
                      <div className="flex flex-wrap mb-3">
                        {Array(4).fill().map((_, i) => (
                          <div key={i} className="h-6 bg-gray-700 rounded mr-1 mb-1 w-16"></div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                        <div className="h-8 bg-gray-700 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              filteredProfiles.map(profile => (
                <TalentCard key={profile.id} talent={profile} />
              ))
            )}
          </div>
          
          {!isLoading && filteredProfiles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-grok-text-secondary text-lg">No talent found matching your search criteria.</p>
            </div>
          )}
        </div>

        <div className="bg-grok-dark rounded-lg p-6 md:p-8 text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Looking for Specialized AI Game Developers?</h2>
          <p className="text-grok-text-secondary mb-6 max-w-2xl mx-auto">
            Grokade connects you with expert talent who specialize in AI-built games and vibe coding technology. Our vetted professionals have experience with WebGL, Three.js, and cutting-edge game development.
          </p>
          <button className="bg-grok-purple hover:bg-purple-700 text-white px-6 py-3 rounded-md font-semibold transition-colors">
            Post a Job
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-grok-dark rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">For Game Studios</h3>
            <p className="text-grok-text-secondary mb-4">
              Find specialized talent to expand your team's capabilities in AI-driven game development and vibe coding technology.
            </p>
            <ul className="text-grok-text-secondary space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-grok-purple mr-2">✓</span>
                <span>Access a pool of pre-vetted AI and WebGL specialists</span>
              </li>
              <li className="flex items-start">
                <span className="text-grok-purple mr-2">✓</span>
                <span>Expand your team's capabilities with vibe coding experts</span>
              </li>
              <li className="flex items-start">
                <span className="text-grok-purple mr-2">✓</span>
                <span>Scale your team up or down based on project needs</span>
              </li>
            </ul>
            <button className="text-grok-purple hover:text-purple-400 font-semibold transition-colors">
              Learn More →
            </button>
          </div>
          
          <div className="bg-grok-dark rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">For Developers</h3>
            <p className="text-grok-text-secondary mb-4">
              Showcase your expertise in AI game development, WebGL, Three.js, or vibe coding to find exciting new projects.
            </p>
            <ul className="text-grok-text-secondary space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-grok-purple mr-2">✓</span>
                <span>Create a profile highlighting your AI game development skills</span>
              </li>
              <li className="flex items-start">
                <span className="text-grok-purple mr-2">✓</span>
                <span>Connect with studios building the future of gaming</span>
              </li>
              <li className="flex items-start">
                <span className="text-grok-purple mr-2">✓</span>
                <span>Find projects that match your expertise and interests</span>
              </li>
            </ul>
            <button className="text-grok-purple hover:text-purple-400 font-semibold transition-colors">
              Join as Talent →
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 