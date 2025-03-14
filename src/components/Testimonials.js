'use client';

import { useState } from 'react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "TechCorp",
      content: "Grokade has completely transformed my learning experience. The AI coach provides personalized feedback that has helped me improve my coding skills significantly faster than traditional methods.",
      avatar: "SJ",
      avatarBg: "bg-primary",
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "InnovateCo",
      content: "I've tried many learning platforms, but Grokade stands out with its AI-powered approach. The platform adapts to my learning style and provides real-time feedback that has accelerated my progress.",
      avatar: "MC",
      avatarBg: "bg-secondary",
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist",
      company: "DataDrive",
      content: "The interactive exercises and personalized coaching have made complex data science concepts much more accessible. Grokade has been instrumental in helping me advance my career.",
      avatar: "ER",
      avatarBg: "bg-dark",
    },
    {
      name: "James Wilson",
      role: "Marketing Director",
      company: "GrowthLabs",
      content: "As someone who needs to continuously learn new marketing techniques, Grokade has been a game-changer. The platform keeps me engaged and the AI coach provides valuable insights.",
      avatar: "JW",
      avatarBg: "bg-primary",
    },
    {
      name: "Lisa Park",
      role: "UX Designer",
      company: "DesignHub",
      content: "I love how Grokade adapts to my learning pace. The AI feedback on my design projects has helped me identify areas for improvement that I wouldn't have noticed otherwise.",
      avatar: "LP",
      avatarBg: "bg-secondary",
    },
    {
      name: "Thomas Brown",
      role: "Business Analyst",
      company: "StrategyPlus",
      content: "The learning experience on Grokade is unparalleled. The platform's ability to identify my knowledge gaps and provide targeted content has made my learning journey much more efficient.",
      avatar: "TB",
      avatarBg: "bg-dark",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const showTestimonials = (start, end) => {
    return testimonials.slice(start, end).map((testimonial, index) => (
      <div 
        key={index} 
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 rounded-full ${testimonial.avatarBg} text-white flex items-center justify-center font-bold`}>
            {testimonial.avatar}
          </div>
          <div className="ml-3">
            <h3 className="font-bold text-dark">{testimonial.name}</h3>
            <p className="text-gray-text text-sm">{testimonial.role}, {testimonial.company}</p>
          </div>
        </div>
        <p className="text-gray-text mb-4">
          &ldquo;{testimonial.content}&rdquo;
        </p>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-text text-lg max-w-2xl mx-auto">
            Join thousands of satisfied learners who have transformed their skills with Grokade.
          </p>
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {showTestimonials(0, 3)}
        </div>

        {/* Mobile View with Pagination */}
        <div className="md:hidden">
          <div className="mb-6">
            {showTestimonials(activeIndex, activeIndex + 1)}
          </div>
          <div className="flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 rounded-full ${
                  index === activeIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="btn-primary">
            View All Testimonials
          </button>
        </div>
      </div>
    </div>
  );
} 