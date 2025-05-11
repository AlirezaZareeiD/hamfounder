
import React from 'react';
import { Globe } from 'lucide-react';

const GlobalImpactSection = () => {
  return (
    <section id="global-network" className="py-16 bg-[#111633]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Map visualization placeholder */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[16/9] bg-[#3B3D8A] rounded-lg shadow-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center text-white text-opacity-80">
                  <Globe className="w-12 h-12 mb-4 text-white opacity-60" />
                  <div className="text-xl font-medium">Global Network Visualization</div>
                </div>
              </div>
              <div className="absolute bottom-0 w-full text-center pb-3 text-white text-opacity-50 text-sm">
                (Interactive map feature coming soon)
              </div>
            </div>
          </div>

          {/* Right side - Content and stats */}
          <div className="w-full lg:w-1/2 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Iran's Global Innovation Network
            </h2>
            <p className="text-lg text-white/80 mb-12">
              Connecting ambitious Iranian minds across continents, fueling 
              collaboration and building world-class ventures together.
            </p>

            {/* Stats in a grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-12">
              <div className="text-center">
                <div className="text-5xl font-extrabold mb-2">10K+</div>
                <div className="text-sm text-gray-300">Founders & Talents</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-extrabold mb-2">50+</div>
                <div className="text-sm text-gray-300">Countries Connected</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-extrabold mb-2">100+</div>
                <div className="text-sm text-gray-300">Startups Featured</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-extrabold mb-2">5K+</div>
                <div className="text-sm text-gray-300">Connections Made</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalImpactSection;
