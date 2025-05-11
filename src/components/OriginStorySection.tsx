
import React from 'react';

const OriginStorySection = () => {
  return (
    <section id="why-hamfounder" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Story Content */}
          <div className="lg:w-1/2">
            <div className="mb-6 inline-block">
              <span className="bg-blue-500/20 text-blue-400 py-1 px-4 rounded-full text-sm font-medium">Our Compass</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              From Shared Journeys, A United Future.
            </h2>
            
            <div className="prose prose-lg text-gray-300">
              <p className="mb-4">
                Thousands of miles from home, driven by dreams, Iranian innovators worldwide face unique hurdles. Finding the right co-founder, navigating complex ecosystems, accessing global networks... it's a familiar struggle. We've lived it.
              </p>
              
              <p className="mb-4">
                Hamfounder was born from this shared experience. We're building more than a platform; we're cultivating a global community rooted in mutual support, shared knowledge, and the relentless belief in Iranian potential.
              </p>
              
              <p>
                Our mission is to empower your journey, connecting you to the people and resources needed to build ventures that don't just succeed, but inspire.
              </p>
            </div>
          </div>
          
          {/* Core Pillars */}
          <div className="lg:w-1/2 bg-slate-800/10 rounded-xl border border-slate-700 p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Core Pillars:</h3>
            
            <div className="space-y-5">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex-shrink-0 flex items-center justify-center mr-4 mt-1">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300">Connect global talent & bridge the diaspora gap.</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex-shrink-0 flex items-center justify-center mr-4 mt-1">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300">Foster growth through shared knowledge & mentorship.</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex-shrink-0 flex items-center justify-center mr-4 mt-1">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300">Empower the creation of world-class, impactful ventures.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OriginStorySection;
