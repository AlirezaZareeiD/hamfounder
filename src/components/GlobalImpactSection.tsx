
import { useEffect, useState } from 'react';

const GlobalImpactSection = () => {
  const [counts, setCounts] = useState({
    founders: 0,
    countries: 0,
    startups: 0,
    connections: 0
  });
  
  const targetCounts = {
    founders: 850,
    countries: 35,
    startups: 120,
    connections: 1500
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCounts(prevCounts => ({
        founders: Math.min(prevCounts.founders + 10, targetCounts.founders),
        countries: Math.min(prevCounts.countries + 1, targetCounts.countries),
        startups: Math.min(prevCounts.startups + 2, targetCounts.startups),
        connections: Math.min(prevCounts.connections + 20, targetCounts.connections)
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section id="global-network" className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          Iran's Global Innovation Network
        </h2>
        
        <div className="relative w-full aspect-[16/9] mb-12">
          {/* World map placeholder - Would be replaced with actual map */}
          <div className="absolute inset-0 bg-slate-800/50 rounded-xl border border-slate-700 flex items-center justify-center">
            <p className="text-gray-400">World Map Visualization Coming Soon</p>
            {/* Random dots representing connection points */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 90 + 5}%`,
                  top: `${Math.random() * 90 + 5}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{counts.founders}+</div>
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
            <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{counts.connections}+</div>
            <div className="text-sm text-gray-300">Connections Made</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalImpactSection;
