
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
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* World Map Visualization */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <div className="relative aspect-[4/3] bg-indigo-900 rounded-lg overflow-hidden">
              {/* World Map SVG with country shapes */}
              <svg 
                viewBox="0 0 1000 600" 
                className="w-full h-full opacity-70"
              >
                <g className="countries">
                  {/* North America */}
                  <path d="M170,120 L250,120 L280,170 L210,240 L160,240 L140,200 Z" fill="#4338ca" stroke="#6366f1" strokeWidth="1"/>
                  
                  {/* South America */}
                  <path d="M240,260 L270,260 L290,370 L240,420 L210,370 Z" fill="#4338ca" stroke="#6366f1" strokeWidth="1"/>
                  
                  {/* Europe */}
                  <path d="M420,140 L500,140 L510,190 L470,210 L420,190 Z" fill="#4338ca" stroke="#6366f1" strokeWidth="1"/>
                  
                  {/* Africa */}
                  <path d="M430,230 L510,230 L540,340 L460,380 L410,330 Z" fill="#4338ca" stroke="#6366f1" strokeWidth="1"/>
                  
                  {/* Asia */}
                  <path d="M530,150 L700,150 L720,230 L660,300 L580,320 L530,260 L520,210 Z" fill="#4338ca" stroke="#6366f1" strokeWidth="1"/>
                  
                  {/* Australia */}
                  <path d="M700,320 L780,320 L790,380 L730,410 L690,380 Z" fill="#4338ca" stroke="#6366f1" strokeWidth="1"/>
                </g>
                
                {/* Connection lines between continents */}
                <g className="connections">
                  <line x1="200" y1="180" x2="450" y2="160" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="5,5">
                    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="3s" repeatCount="indefinite"/>
                  </line>
                  <line x1="600" y1="200" x2="450" y2="160" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="5,5">
                    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="2.5s" repeatCount="indefinite"/>
                  </line>
                  <line x1="250" y1="340" x2="450" y2="160" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="5,5">
                    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="4s" repeatCount="indefinite"/>
                  </line>
                  <line x1="740" y1="350" x2="600" y2="200" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="5,5">
                    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="3.5s" repeatCount="indefinite"/>
                  </line>
                </g>
                
                {/* Population hotspots as circles */}
                <g className="hotspots">
                  {/* North America - Large Hub */}
                  <circle cx="200" cy="180" r="12" fill="#ec4899" opacity="0.7">
                    <animate attributeName="r" values="12;14;12" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;0.9;0.7" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="200" cy="180" r="20" fill="#ec4899" opacity="0.2" />
                  
                  {/* Europe - Medium Hub */}
                  <circle cx="450" cy="160" r="15" fill="#ec4899" opacity="0.7">
                    <animate attributeName="r" values="15;17;15" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;0.9;0.7" dur="2.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="450" cy="160" r="25" fill="#ec4899" opacity="0.2" />
                  
                  {/* Asia - Largest Hub (Iran) */}
                  <circle cx="600" cy="200" r="18" fill="#ec4899" opacity="0.7">
                    <animate attributeName="r" values="18;20;18" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;0.9;0.7" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="600" cy="200" r="30" fill="#ec4899" opacity="0.2" />
                  
                  {/* South America - Small Hub */}
                  <circle cx="250" cy="340" r="8" fill="#ec4899" opacity="0.7">
                    <animate attributeName="r" values="8;10;8" dur="3.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;0.9;0.7" dur="3.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="250" cy="340" r="16" fill="#ec4899" opacity="0.2" />
                  
                  {/* Australia - Small Hub */}
                  <circle cx="740" cy="350" r="8" fill="#ec4899" opacity="0.7">
                    <animate attributeName="r" values="8;10;8" dur="4s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;0.9;0.7" dur="4s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="740" cy="350" r="16" fill="#ec4899" opacity="0.2" />
                  
                  {/* Africa - Small Hub */}
                  <circle cx="470" cy="280" r="6" fill="#ec4899" opacity="0.7">
                    <animate attributeName="r" values="6;8;6" dur="3.8s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;0.9;0.7" dur="3.8s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="470" cy="280" r="12" fill="#ec4899" opacity="0.2" />
                </g>
                
                {/* Small dots representing individual connections */}
                {Array.from({ length: 20 }).map((_, i) => {
                  const x = 150 + Math.random() * 600;
                  const y = 100 + Math.random() * 400;
                  return (
                    <circle 
                      key={i} 
                      cx={x} 
                      cy={y} 
                      r="2" 
                      fill="#f9a8d4" 
                      opacity={Math.random() * 0.5 + 0.3}
                    />
                  );
                })}
              </svg>
              
              {/* Overlay text */}
              <div className="absolute top-4 right-4 text-white bg-indigo-900/80 p-2 rounded">
                <p className="text-sm font-medium">Global Network Visualization</p>
              </div>
              
              {/* Interactive caption */}
              <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-white/70 py-1">
                (Interactive map feature coming soon)
              </div>
            </div>
          </div>
          
          {/* Stats and Content */}
          <div className="w-full md:w-1/2 text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Iran's Global Innovation Network
            </h2>
            
            <p className="text-lg text-gray-300 mb-8">
              Connecting ambitious Iranian minds across continents, fueling collaboration and building world-class ventures together.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white mb-2">{counts.founders.toLocaleString()}+</div>
                <div className="text-sm text-gray-300">Founders & Talents</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white mb-2">{counts.countries}+</div>
                <div className="text-sm text-gray-300">Countries Connected</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white mb-2">{counts.startups}+</div>
                <div className="text-sm text-gray-300">Startups Featured</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white mb-2">{counts.connections.toLocaleString()}+</div>
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
