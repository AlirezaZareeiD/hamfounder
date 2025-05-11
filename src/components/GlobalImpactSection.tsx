
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
            <div className="relative aspect-[4/3] bg-slate-800 rounded-lg overflow-hidden">
              <div className="absolute inset-0">
                {/* World Map SVG */}
                <svg viewBox="0 0 800 500" className="w-full h-full">
                  {/* Base world map paths */}
                  <g fill="#33415c" stroke="#8B5CF6" strokeWidth="0.5">
                    {/* North America */}
                    <path d="M120,70 C150,60 180,50 210,55 C240,60 250,80 270,90 C290,100 300,130 280,150 C260,170 240,180 210,190 C180,200 150,190 120,180 C90,170 70,150 60,130 C50,110 50,90 70,80 C90,70 110,75 120,70 Z" />
                    
                    {/* South America */}
                    <path d="M220,200 C240,190 260,200 270,220 C280,240 290,270 280,300 C270,330 250,350 230,370 C210,390 190,380 180,350 C170,320 175,290 190,260 C205,230 210,205 220,200 Z" />
                    
                    {/* Europe */}
                    <path d="M380,80 C400,70 420,65 440,70 C460,75 480,90 490,110 C500,130 490,150 470,160 C450,170 420,170 400,160 C380,150 360,140 350,120 C340,100 350,85 380,80 Z" />
                    
                    {/* Africa */}
                    <path d="M400,180 C420,170 450,175 470,185 C490,195 510,220 520,250 C530,280 530,310 510,335 C490,360 460,370 430,365 C400,360 380,340 370,310 C360,280 365,240 380,210 C390,190 395,185 400,180 Z" />
                    
                    {/* Asia */}
                    <path d="M500,60 C530,50 560,45 590,50 C620,55 650,70 670,100 C690,130 710,170 700,210 C690,250 670,280 640,300 C610,320 570,330 530,320 C490,310 480,280 470,250 C460,220 450,190 460,160 C470,130 485,75 500,60 Z" />
                    
                    {/* Australia */}
                    <path d="M650,280 C670,270 690,275 710,290 C730,305 740,330 735,350 C730,370 715,385 695,390 C675,395 655,390 640,375 C625,360 620,335 630,315 C640,295 650,285 650,280 Z" />
                  </g>
                  
                  {/* Connection paths */}
                  <g>
                    {/* Major hub connections */}
                    <path d="M330,120 C400,110 470,130 540,90" fill="none" stroke="#D946EF" strokeWidth="1" strokeDasharray="5,3">
                      <animate attributeName="stroke-dashoffset" from="8" to="0" dur="5s" repeatCount="indefinite" />
                    </path>
                    <path d="M330,120 C320,200 400,230 480,210" fill="none" stroke="#D946EF" strokeWidth="1" strokeDasharray="5,3">
                      <animate attributeName="stroke-dashoffset" from="8" to="0" dur="6s" repeatCount="indefinite" />
                    </path>
                    <path d="M540,90 C510,160 570,200 650,150" fill="none" stroke="#D946EF" strokeWidth="1" strokeDasharray="5,3">
                      <animate attributeName="stroke-dashoffset" from="8" to="0" dur="7s" repeatCount="indefinite" />
                    </path>
                    <path d="M540,90 C410,40 270,100 180,70" fill="none" stroke="#D946EF" strokeWidth="1" strokeDasharray="5,3">
                      <animate attributeName="stroke-dashoffset" from="8" to="0" dur="8s" repeatCount="indefinite" />
                    </path>
                  </g>
                  
                  {/* Main activity hubs */}
                  <g>
                    {/* US - Silicon Valley */}
                    <circle cx="140" cy="120" r="12" fill="#D946EF" opacity="0.8">
                      <animate attributeName="r" values="12;14;12" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.9;0.8" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="140" cy="120" r="20" fill="#D946EF" opacity="0.2" />
                    
                    {/* Europe */}
                    <circle cx="400" cy="110" r="10" fill="#D946EF" opacity="0.8">
                      <animate attributeName="r" values="10;12;10" dur="3.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.9;0.8" dur="3.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="400" cy="110" r="18" fill="#D946EF" opacity="0.2" />
                    
                    {/* Tehran - Largest Hub */}
                    <circle cx="540" cy="150" r="15" fill="#D946EF" opacity="0.8">
                      <animate attributeName="r" values="15;17;15" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.9;0.8" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="540" cy="150" r="25" fill="#D946EF" opacity="0.2" />
                    
                    {/* Australia */}
                    <circle cx="680" cy="330" r="8" fill="#D946EF" opacity="0.7">
                      <animate attributeName="r" values="8;9;8" dur="4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.7;0.8;0.7" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="680" cy="330" r="14" fill="#D946EF" opacity="0.2" />
                    
                    {/* Canada */}
                    <circle cx="180" cy="70" r="7" fill="#D946EF" opacity="0.7">
                      <animate attributeName="r" values="7;8;7" dur="3.2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.7;0.8;0.7" dur="3.2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="180" cy="70" r="12" fill="#D946EF" opacity="0.2" />
                    
                    {/* Middle East - Dubai */}
                    <circle cx="520" cy="180" r="8" fill="#D946EF" opacity="0.7">
                      <animate attributeName="r" values="8;9;8" dur="3.7s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.7;0.8;0.7" dur="3.7s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="520" cy="180" r="14" fill="#D946EF" opacity="0.2" />
                    
                    {/* UK */}
                    <circle cx="370" cy="100" r="7" fill="#D946EF" opacity="0.7">
                      <animate attributeName="r" values="7;8;7" dur="3.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.7;0.8;0.7" dur="3.4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="370" cy="100" r="12" fill="#D946EF" opacity="0.2" />
                  </g>
                  
                  {/* Smaller activity points */}
                  {Array.from({ length: 30 }).map((_, i) => {
                    const x = 100 + Math.random() * 600;
                    const y = 50 + Math.random() * 350;
                    const size = 1 + Math.random() * 3;
                    const opacity = 0.3 + Math.random() * 0.3;
                    
                    return (
                      <circle 
                        key={`small-hub-${i}`} 
                        cx={x} 
                        cy={y} 
                        r={size} 
                        fill="#f9a8d4" 
                        opacity={opacity}
                      >
                        <animate 
                          attributeName="opacity" 
                          values={`${opacity};${opacity + 0.2};${opacity}`} 
                          dur={`${2 + Math.random() * 3}s`} 
                          repeatCount="indefinite" 
                        />
                      </circle>
                    );
                  })}
                </svg>
                
                {/* Overlay gradient for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none"></div>
              </div>
              
              {/* Map caption */}
              <div className="absolute bottom-4 left-4 text-white/80 text-sm">
                <span className="font-medium">Iranian Startup Ecosystem</span>
                <p className="text-xs text-white/60">Global distribution and connection points</p>
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
