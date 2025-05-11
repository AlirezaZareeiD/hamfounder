
const OurMissionSection = () => {
  return (
    <section id="mission" className="py-16 bg-gradient-to-b from-slate-900 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Narrative Block */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              From Shared Journeys, A United Future.
            </h2>
            
            <div className="prose prose-lg text-gray-300">
              <p className="mb-4">
                Hamfounder was born from a personal struggle—the challenge of finding the right co-founder 
                when building a venture as an Iranian entrepreneur in a global landscape.
              </p>
              
              <p className="mb-4">
                We recognized that across the world, Iranian innovators face unique challenges yet possess 
                extraordinary potential. The missing piece was a dedicated ecosystem that could bring these 
                brilliant minds together, regardless of geography.
              </p>
              
              <p>
                Our mission is to connect Iranian founders, technologists, and visionaries worldwide, 
                creating a powerful network where ideas flourish, teams form naturally, and world-class 
                ventures emerge with the support of a community that truly understands your journey.
              </p>
            </div>
          </div>
          
          {/* Core Pillars Block */}
          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Connect & Discover</h3>
              <p className="text-gray-300">Find complementary co-founders and team members across borders.</p>
            </div>
            
            <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Learn & Grow</h3>
              <p className="text-gray-300">Access knowledge and mentorship from those who've walked your path.</p>
            </div>
            
            <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Build & Scale</h3>
              <p className="text-gray-300">Leverage the collective experience to overcome common challenges.</p>
            </div>
            
            <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
              <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Global Impact</h3>
              <p className="text-gray-300">Create ventures that showcase Iranian talent on the world stage.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMissionSection;
