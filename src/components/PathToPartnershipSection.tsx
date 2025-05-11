
import React from 'react';
import { User, Search, MessageSquare, Rocket } from 'lucide-react';

const PathToPartnershipSection = () => {
  return (
    <section id="how-it-works" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            Your Path to Partnership & Growth
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Four simple steps within our supportive ecosystem to find your co-founder and
            accelerate your startup journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="bg-white dark:bg-slate-800/20 rounded-lg border border-gray-100 dark:border-slate-700 p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-4">
              <User className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Craft Your Story</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Share your vision, expertise, and unique journey. Let potential partners understand who you are
              beyond the resume.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="bg-white dark:bg-slate-800/20 rounded-lg border border-gray-100 dark:border-slate-700 p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-4">
              <Search className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Discover Connections</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Explore profiles intelligently matched based on skills, values, and collaborative potential, both
              locally and globally.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="bg-white dark:bg-slate-800/20 rounded-lg border border-gray-100 dark:border-slate-700 p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-4">
              <MessageSquare className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Engage & Align</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Initiate meaningful conversations, assess synergy, and align on vision and expectations for a strong 
              foundation.
            </p>
          </div>
          
          {/* Step 4 */}
          <div className="bg-white dark:bg-slate-800/20 rounded-lg border border-gray-100 dark:border-slate-700 p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-4">
              <Rocket className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Build & Scale Together</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Leverage community support, shared resources, and your combined strengths to launch and grow
              your world-class venture.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PathToPartnershipSection;
