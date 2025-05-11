
import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

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
            An Expansive Global Network
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Connecting ambitious Iranian minds across continents, fostering collaboration and building world-class businesses together.
          </p>
        </div>
        
        <div className="relative w-full aspect-[16/9] mb-12">
          <div className="absolute inset-0 bg-slate-800/50 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              {/* World map visualization with enhanced connection points */}
              <div className="w-full h-full relative">
                {/* World map background */}
                <svg className="w-full h-full absolute inset-0" viewBox="0 0 1200 600">
                  <path 
                    d="M150,50 L1050,50 L1050,550 L150,550 Z" 
                    fill="none" 
                    stroke="#4a5568" 
                    strokeWidth="0.5"
                  />
                  <path 
                    d="M150,50 C250,130 450,170 550,190 C650,210 750,240 850,270 C950,300 1000,320 1050,350"
                    fill="none" 
                    stroke="#4a5568" 
                    strokeWidth="0.5"
                  />
                  
                  {/* Simplified world map paths */}
                  <path 
                    d="M200,150 C240,140 280,145 320,160 C360,175 395,200 430,210 C470,220 510,215 550,200 C590,185 620,160 660,150 C700,140 740,145 780,160 C820,175 855,200 890,210 C930,220 970,215 1010,200" 
                    fill="none" 
                    stroke="#4a5568" 
                    strokeWidth="0.5"
                  />
                  
                  <path 
                    d="M200,250 C240,240 280,245 320,260 C360,275 395,300 430,310 C470,320 510,315 550,300 C590,285 620,260 660,250 C700,240 740,245 780,260 C820,275 855,300 890,310 C930,320 970,315 1010,300" 
                    fill="none" 
                    stroke="#4a5568" 
                    strokeWidth="0.5"
                  />
                  
                  <path 
                    d="M200,350 C240,340 280,345 320,360 C360,375 395,400 430,410 C470,420 510,415 550,400 C590,385 620,360 660,350 C700,340 740,345 780,360 C820,375 855,400 890,410 C930,420 970,415 1010,400" 
                    fill="none" 
                    stroke="#4a5568" 
                    strokeWidth="0.5"
                  />
                </svg>
                
                {/* Map overlay with network points */}
                {/* North America */}
                <div className="absolute w-24 h-24 bg-rose-500/20 rounded-full animate-pulse" style={{ left: '20%', top: '30%' }}>
                  <div className="absolute w-16 h-16 bg-rose-500/30 rounded-full" style={{ left: '4px', top: '4px' }}></div>
                  <div className="absolute w-8 h-8 bg-rose-500/40 rounded-full" style={{ left: '8px', top: '8px' }}></div>
                  <div className="absolute w-4 h-4 bg-rose-600 rounded-full" style={{ left: '10px', top: '10px' }}></div>
                </div>

                {/* Europe */}
                <div className="absolute w-36 h-36 bg-rose-500/20 rounded-full animate-pulse" style={{ left: '48%', top: '25%' }}>
                  <div className="absolute w-28 h-28 bg-rose-500/30 rounded-full" style={{ left: '4px', top: '4px' }}></div>
                  <div className="absolute w-16 h-16 bg-rose-500/40 rounded-full" style={{ left: '10px', top: '10px' }}></div>
                  <div className="absolute w-8 h-8 bg-rose-600 rounded-full" style={{ left: '14px', top: '14px' }}></div>
                </div>
                
                {/* Middle East */}
                <div className="absolute w-48 h-48 bg-rose-500/20 rounded-full animate-pulse" style={{ left: '55%', top: '35%' }}>
                  <div className="absolute w-36 h-36 bg-rose-500/30 rounded-full" style={{ left: '6px', top: '6px' }}></div>
                  <div className="absolute w-24 h-24 bg-rose-500/40 rounded-full" style={{ left: '12px', top: '12px' }}></div>
                  <div className="absolute w-12 h-12 bg-rose-600 rounded-full" style={{ left: '18px', top: '18px' }}></div>
                </div>
                
                {/* Australia */}
                <div className="absolute w-16 h-16 bg-rose-500/20 rounded-full animate-pulse" style={{ left: '80%', top: '70%' }}>
                  <div className="absolute w-12 h-12 bg-rose-500/30 rounded-full" style={{ left: '2px', top: '2px' }}></div>
                  <div className="absolute w-8 h-8 bg-rose-500/40 rounded-full" style={{ left: '4px', top: '4px' }}></div>
                  <div className="absolute w-4 h-4 bg-rose-600 rounded-full" style={{ left: '6px', top: '6px' }}></div>
                </div>
                
                {/* Asia */}
                <div className="absolute w-20 h-20 bg-rose-500/20 rounded-full animate-pulse" style={{ left: '70%', top: '30%' }}>
                  <div className="absolute w-16 h-16 bg-rose-500/30 rounded-full" style={{ left: '2px', top: '2px' }}></div>
                  <div className="absolute w-10 h-10 bg-rose-500/40 rounded-full" style={{ left: '5px', top: '5px' }}></div>
                  <div className="absolute w-6 h-6 bg-rose-600 rounded-full" style={{ left: '7px', top: '7px' }}></div>
                </div>
                
                {/* South America */}
                <div className="absolute w-20 h-20 bg-rose-500/20 rounded-full animate-pulse" style={{ left: '30%', top: '60%' }}>
                  <div className="absolute w-16 h-16 bg-rose-500/30 rounded-full" style={{ left: '2px', top: '2px' }}></div>
                  <div className="absolute w-10 h-10 bg-rose-500/40 rounded-full" style={{ left: '5px', top: '5px' }}></div>
                  <div className="absolute w-6 h-6 bg-rose-600 rounded-full" style={{ left: '7px', top: '7px' }}></div>
                </div>
                
                {/* Small network points scattered around */}
                {Array.from({ length: 30 }).map((_, i) => {
                  const size = Math.floor(Math.random() * 8) + 4;
                  const left = `${Math.floor(Math.random() * 80) + 10}%`;
                  const top = `${Math.floor(Math.random() * 70) + 15}%`;
                  return (
                    <div 
                      key={i}
                      className="absolute bg-rose-500/60 rounded-full"
                      style={{ 
                        width: `${size}px`, 
                        height: `${size}px`, 
                        left, 
                        top,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: `${Math.random() * 3 + 2}s`
                      }}
                    />
                  );
                })}
                
                {/* Legend */}
                <div className="absolute left-8 bottom-8 bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                  <div className="text-white text-sm font-medium mb-2">Network Size</div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 relative">
                      <svg viewBox="0 0 100 100" width="48" height="48">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(225, 29, 72, 0.2)" strokeWidth="1" />
                        <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(225, 29, 72, 0.2)" strokeWidth="1" />
                        <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(225, 29, 72, 0.2)" strokeWidth="1" />
                        <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(225, 29, 72, 0.2)" strokeWidth="1" />
                      </svg>
                    </div>
                    <div className="flex flex-col text-xs text-gray-400">
                      <span>4000</span>
                      <span>2000</span>
                      <span>1000</span>
                      <span>400</span>
                    </div>
                  </div>
                </div>

                {/* Connection lines with animation */}
                <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                  <line x1="20%" y1="30%" x2="55%" y2="35%" stroke="rgba(225, 29, 72, 0.4)" strokeWidth="1" strokeDasharray="5,5">
                    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="3s" repeatCount="indefinite" />
                  </line>
                  <line x1="48%" y1="25%" x2="55%" y2="35%" stroke="rgba(225, 29, 72, 0.4)" strokeWidth="1" strokeDasharray="5,5">
                    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="2s" repeatCount="indefinite" />
                  </line>
                  <line x1="70%" y1="30%" x2="55%" y2="35%" stroke="rgba(225, 29, 72, 0.4)" strokeWidth="1" strokeDasharray="5,5">
                    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="2.5s" repeatCount="indefinite" />
                  </line>
                  <line x1="80%" y1="70%" x2="55%" y2="35%" stroke="rgba(225, 29, 72, 0.4)" strokeWidth="1" strokeDasharray="5,5">
                    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="3.5s" repeatCount="indefinite" />
                  </line>
                  <line x1="30%" y1="60%" x2="55%" y2="35%" stroke="rgba(225, 29, 72, 0.4)" strokeWidth="1" strokeDasharray="5,5">
                    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="3s" repeatCount="indefinite" />
                  </line>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
            <div className="text-3xl md:text-4xl font-bold text-rose-400 mb-2">{counts.founders.toLocaleString()}+</div>
            <div className="text-sm text-gray-300">Founders & Talents</div>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
            <div className="text-3xl md:text-4xl font-bold text-rose-400 mb-2">{counts.countries}</div>
            <div className="text-sm text-gray-300">Connected Countries</div>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
            <div className="text-3xl md:text-4xl font-bold text-rose-400 mb-2">{counts.startups}</div>
            <div className="text-sm text-gray-300">Featured Startups</div>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
            <div className="text-3xl md:text-4xl font-bold text-rose-400 mb-2">{counts.connections.toLocaleString()}+</div>
            <div className="text-sm text-gray-300">Connections Made</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalImpactSection;
