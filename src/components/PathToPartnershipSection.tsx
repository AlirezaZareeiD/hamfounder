
const PathToPartnershipSection = () => {
  return (
    <section id="how-it-works" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Your Path to Partnership and Growth
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="bg-slate-800/20 rounded-lg border border-slate-700 p-6 relative">
            <span className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
            <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <svg className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Craft Your Story</h3>
            <p className="text-gray-300">
              Create your profile highlighting your vision, skills, and the complementary talents you're seeking. 
              Share your journey and goals to attract the right partners.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="bg-slate-800/20 rounded-lg border border-slate-700 p-6 relative">
            <span className="absolute -top-3 -left-3 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
            <div className="h-14 w-14 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <svg className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Discover Connections</h3>
            <p className="text-gray-300">
              Explore our intelligent matching system to find potential co-founders with complementary skills, 
              shared values, and aligned vision for building impactful businesses.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="bg-slate-800/20 rounded-lg border border-slate-700 p-6 relative">
            <span className="absolute -top-3 -left-3 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
            <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <svg className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Engage & Align</h3>
            <p className="text-gray-300">
              Connect with potential co-founders through our secure communication platform. Discover synergies,
              align on values, and test compatibility before committing.
            </p>
          </div>
          
          {/* Step 4 */}
          <div className="bg-slate-800/20 rounded-lg border border-slate-700 p-6 relative">
            <span className="absolute -top-3 -left-3 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">4</span>
            <div className="h-14 w-14 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
              <svg className="h-7 w-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Build & Scale</h3>
            <p className="text-gray-300">
              Transform your partnership into a thriving business with ongoing access to our community,
              resources, mentorship, and potential investment opportunities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PathToPartnershipSection;
