
const EcosystemAdvantageSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Unlock the Global Iranian Advantage
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Your strategic toolkit for building breakthrough ventures within the global Iranian ecosystem.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Advantage 1 */}
          <div className="bg-slate-800/20 rounded-lg border border-slate-700 p-6 flex items-start">
            <div className="w-16 h-16 rounded-lg bg-blue-500/20 flex items-center justify-center mr-5 flex-shrink-0">
              <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Find Your 10x Partner</h3>
              <p className="text-gray-300">
                Our intelligent matching algorithm connects you with co-founders who complement your skills, 
                share your vision, and understand your cultural context—creating the foundation for exceptional teams.
              </p>
            </div>
          </div>
          
          {/* Advantage 2 */}
          <div className="bg-slate-800/20 rounded-lg border border-slate-700 p-6 flex items-start">
            <div className="w-16 h-16 rounded-lg bg-purple-500/20 flex items-center justify-center mr-5 flex-shrink-0">
              <svg className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Tap the Diaspora Brain Trust</h3>
              <p className="text-gray-300">
                Connect with successful Iranian entrepreneurs and industry experts worldwide who can provide 
                mentorship, open doors, and share insights that bridge both Iranian and global market contexts.
              </p>
            </div>
          </div>
          
          {/* Advantage 3 */}
          <div className="bg-slate-800/20 rounded-lg border border-slate-700 p-6 flex items-start">
            <div className="w-16 h-16 rounded-lg bg-green-500/20 flex items-center justify-center mr-5 flex-shrink-0">
              <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Growth & Resilience Playbook</h3>
              <p className="text-gray-300">
                Access battle-tested strategies for navigating the unique challenges Iranian founders face—from 
                compliance and banking hurdles to market adaptation and international scaling.
              </p>
            </div>
          </div>
          
          {/* Advantage 4 */}
          <div className="bg-slate-800/20 rounded-lg border border-slate-700 p-6 flex items-start">
            <div className="w-16 h-16 rounded-lg bg-orange-500/20 flex items-center justify-center mr-5 flex-shrink-0">
              <svg className="h-8 w-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Funding Pathways Unlocked</h3>
              <p className="text-gray-300">
                Gain visibility with investors who understand the Iranian-founded venture landscape and can help 
                you navigate funding challenges unique to Iranian entrepreneurs globally.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemAdvantageSection;
