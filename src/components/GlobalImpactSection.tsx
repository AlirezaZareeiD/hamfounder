
import { useEffect, useState } from 'react';

const GlobalImpactSection = () => {
  const [counts, setCounts] = useState({
    founders: 0,
    countries: 0,
    startups: 0,
    connections: 0
  });
  
  const targetCounts = {
    founders: 10000,
    countries: 50,
    startups: 100,
    connections: 5000
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCounts(prevCounts => ({
        founders: Math.min(prevCounts.founders + 100, targetCounts.founders),
        countries: Math.min(prevCounts.countries + 1, targetCounts.countries),
        startups: Math.min(prevCounts.startups + 1, targetCounts.startups),
        connections: Math.min(prevCounts.connections + 50, targetCounts.connections)
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section id="global-network" className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Iran's Global Innovation Network
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Connecting ambitious Iranian minds across continents, fueling collaboration and building world-class ventures together.
          </p>
        </div>
        
        <div className="relative w-full aspect-[16/9] mb-12">
          <div className="absolute inset-0 bg-slate-800/50 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              {/* World map visualization with connection points */}
              <div className="w-full h-full bg-blue-900/20 relative">
                {/* North America */}
                <div className="absolute w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ left: '20%', top: '30%' }}></div>
                {/* Europe */}
                <div className="absolute w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ left: '45%', top: '25%' }}></div>
                {/* Middle East */}
                <div className="absolute w-4 h-4 bg-blue-300 rounded-full animate-pulse" style={{ left: '55%', top: '35%' }}></div>
                {/* Australia */}
                <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ left: '80%', top: '70%' }}></div>
                {/* Asia */}
                <div className="absolute w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ left: '70%', top: '30%' }}></div>
                
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full">
                  <line x1="20%" y1="30%" x2="55%" y2="35%" stroke="rgba(96, 165, 250, 0.3)" strokeWidth="1" />
                  <line x1="45%" y1="25%" x2="55%" y2="35%" stroke="rgba(96, 165, 250, 0.3)" strokeWidth="1" />
                  <line x1="70%" y1="30%" x2="55%" y2="35%" stroke="rgba(96, 165, 250, 0.3)" strokeWidth="1" />
                  <line x1="80%" y1="70%" x2="55%" y2="35%" stroke="rgba(96, 165, 250, 0.3)" strokeWidth="1" />
                </svg>
              </div>
            </div>
            <p className="text-gray-400 z-10">Interactive World Map Coming Soon</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{counts.founders.toLocaleString()}+</div>
            <div className="text-sm text-gray-300">Founders & Talents</div>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{counts.countries}</div>
            <div className="text-sm text-gray-300">Countries Connected</div>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{counts.startups}</div>
            <div className="text-sm text-gray-300">Startups Featured</div>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{counts.connections.toLocaleString()}+</div>
            <div className="text-sm text-gray-300">Connections Made</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalImpactSection;
