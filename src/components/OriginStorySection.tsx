
import React from 'react';

const OriginStorySection = () => {
  return (
    <section id="why-hamfounder" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Story Content */}
          <div className="lg:w-1/2">
            <div className="mb-6 inline-block">
              <span className="bg-blue-500/20 text-blue-400 py-1 px-4 rounded-full text-sm font-medium">Our Vision</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              From Shared Journeys to United Future
            </h2>
            
            <div className="prose prose-lg text-gray-300">
              <p className="mb-4">
                Thousands of miles from home, motivated by dreams, Iranian innovators around the world face unique challenges. Finding the right co-founder, navigating complex ecosystems, accessing global networks... these problems are familiar to us. We've lived them.
              </p>
              
              <p className="mb-4">
                Hamfounder was born from this shared experience. We're more than a platform; we're nurturing a global community rooted in mutual support, shared knowledge, and a firm belief in Iranian potential.
              </p>
              
              <p>
                Our mission is to empower your journey by connecting you with the people and resources needed to build businesses that not only succeed but inspire.
              </p>
            </div>
          </div>
          
          {/* Core Pillars */}
          <div className="lg:w-1/2 bg-slate-800/10 rounded-xl border border-slate-700 p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Why Hamfounder for Iranian Entrepreneurs?</h3>
            
            <div className="space-y-5">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex-shrink-0 flex items-center justify-center mr-4 mt-1">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300">
                  <strong>Deep understanding of shared challenges:</strong> From visa obstacles and sanctions to cultural differences, we recognize the unique challenges Iranian entrepreneurs face.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex-shrink-0 flex items-center justify-center mr-4 mt-1">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300">
                  <strong>Targeted networking:</strong> Connect with individuals who not only have complementary skills but understand shared cultural background and perspective.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex-shrink-0 flex items-center justify-center mr-4 mt-1">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300">
                  <strong>Cultural support:</strong> Resources, guidance, and tools designed for the unique challenges Iranian entrepreneurs face in the global arena.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex-shrink-0 flex items-center justify-center mr-4 mt-1">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300">
                  <strong>From diaspora to global impact:</strong> Turn the worldwide dispersion of Iranians into a powerful advantage, with a network that transcends geographical limitations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OriginStorySection;
