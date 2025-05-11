
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
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Title on the left for larger screens, top for mobile */}
          <div className="w-full md:w-1/3 text-left mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              An Expansive<br />Global Network
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-white mb-2">{counts.founders.toLocaleString()}+</div>
                <div className="text-sm text-gray-300">Founders & Talents</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-extrabold text-white mb-2">{counts.countries}+</div>
                <div className="text-sm text-gray-300">Countries Connected</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-extrabold text-white mb-2">{counts.startups}+</div>
                <div className="text-sm text-gray-300">Startups Featured</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-extrabold text-white mb-2">{counts.connections.toLocaleString()}+</div>
                <div className="text-sm text-gray-300">Connections Made</div>
              </div>
            </div>

            {/* Legend for the map */}
            <div className="mt-8 pl-4">
              <div className="flex items-center space-y-2 flex-col items-start">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#D94867] opacity-20 mr-1"></div>
                    <div className="w-8 h-8 rounded-full bg-[#D94867] opacity-40 mr-1"></div>
                    <div className="w-6 h-6 rounded-full bg-[#D94867] opacity-60 mr-1"></div>
                    <div className="w-4 h-4 rounded-full bg-[#D94867] opacity-80 mr-1"></div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  <div className="flex items-center space-x-4">
                    <span>400</span>
                    <span>1000</span>
                    <span>2000</span>
                    <span>4000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Static World Map Visualization */}
          <div className="w-full md:w-2/3">
            <div className="relative aspect-[16/10] bg-transparent rounded-lg overflow-hidden">
              {/* Static World Map with Hotspots */}
              <div className="absolute inset-0">
                {/* Base world map - light gray */}
                <svg viewBox="0 0 1200 600" className="w-full h-full">
                  {/* World map base */}
                  <rect x="0" y="0" width="1200" height="600" fill="transparent" />
                  
                  {/* World Map - Using simplified path for continents */}
                  <g fill="#D1D5DB" opacity="0.5">
                    {/* North America */}
                    <path d="M180,80 C220,70 260,65 300,75 C340,85 370,120 390,160 C410,200 420,245 400,285 C380,325 350,350 310,370 C270,390 225,395 180,380 C135,365 100,330 80,290 C60,250 55,205 70,160 C85,120 120,90 180,80 Z" />
                    
                    {/* South America */}
                    <path d="M305,380 C330,370 355,375 375,390 C395,405 410,430 420,460 C430,490 435,525 430,560 C425,595 410,630 385,655 C360,680 330,690 300,685 C270,680 245,660 225,635 C205,610 195,580 190,545 C185,510 190,470 205,435 C220,400 245,385 305,380 Z" />
                    
                    {/* Europe */}
                    <path d="M500,100 C530,90 560,85 590,95 C620,105 645,125 660,150 C675,175 680,205 675,235 C670,265 655,290 630,310 C605,330 575,340 545,335 C515,330 490,315 470,290 C450,265 440,235 445,200 C450,170 470,140 500,100 Z" />
                    
                    {/* Africa */}
                    <path d="M550,240 C580,230 610,235 635,250 C660,265 680,290 695,320 C710,350 720,385 720,420 C720,455 710,490 690,520 C670,550 640,570 610,580 C580,590 550,590 520,575 C490,560 465,535 450,505 C435,475 430,440 440,405 C450,370 470,340 500,315 C530,290 550,240 550,240 Z" />
                    
                    {/* Asia */}
                    <path d="M700,100 C740,85 780,80 820,85 C860,90 900,105 935,130 C970,155 1000,190 1020,230 C1040,270 1050,315 1045,360 C1040,405 1020,445 990,480 C960,515 920,540 880,555 C840,570 800,575 760,565 C720,555 685,535 655,505 C625,475 605,440 595,400 C585,360 585,315 600,275 C615,235 640,200 675,170 C710,140 700,100 700,100 Z" />
                    
                    {/* Australia */}
                    <path d="M970,460 C990,450 1015,445 1040,450 C1065,455 1090,470 1110,490 C1130,510 1145,535 1150,565 C1155,595 1150,625 1135,650 C1120,675 1095,695 1065,705 C1035,715 1005,715 975,705 C945,695 920,675 900,650 C880,625 870,595 870,565 C870,535 880,505 900,480 C920,455 945,440 970,460 Z" />
                  </g>
                  
                  {/* Major activity hotspots - red circles with varying sizes based on activity */}
                  {/* North America - Silicon Valley */}
                  <circle cx="220" cy="200" r="70" fill="#D94867" opacity="0.7" />
                  
                  {/* Europe */}
                  <circle cx="570" cy="180" r="60" fill="#D94867" opacity="0.7" />
                  <circle cx="520" cy="170" r="25" fill="#D94867" opacity="0.8" />
                  <circle cx="540" cy="150" r="15" fill="#D94867" opacity="0.8" />
                  <circle cx="590" cy="190" r="20" fill="#D94867" opacity="0.8" />
                  <circle cx="610" cy="210" r="12" fill="#D94867" opacity="0.8" />
                  <circle cx="550" cy="200" r="18" fill="#D94867" opacity="0.8" />
                  
                  {/* Middle East and Iran */}
                  <circle cx="720" cy="260" r="80" fill="#D94867" opacity="0.7" />
                  <circle cx="680" cy="230" r="15" fill="#D94867" opacity="0.8" />
                  <circle cx="700" cy="250" r="20" fill="#D94867" opacity="0.8" />
                  
                  {/* Asia */}
                  <circle cx="950" cy="250" r="50" fill="#D94867" opacity="0.7" />
                  <circle cx="920" cy="220" r="12" fill="#D94867" opacity="0.8" />
                  <circle cx="940" cy="240" r="15" fill="#D94867" opacity="0.8" />
                  <circle cx="970" cy="260" r="10" fill="#D94867" opacity="0.8" />
                  
                  {/* Australia */}
                  <circle cx="980" cy="500" r="30" fill="#D94867" opacity="0.7" />
                  
                  {/* Africa */}
                  <circle cx="600" cy="400" r="20" fill="#D94867" opacity="0.7" />
                  <circle cx="580" cy="350" r="15" fill="#D94867" opacity="0.8" />
                  <circle cx="550" cy="450" r="10" fill="#D94867" opacity="0.8" />
                  <circle cx="620" cy="420" r="12" fill="#D94867" opacity="0.8" />
                  
                  {/* South America */}
                  <circle cx="330" cy="480" r="25" fill="#D94867" opacity="0.7" />
                  <circle cx="350" cy="450" r="10" fill="#D94867" opacity="0.8" />
                  <circle cx="310" cy="510" r="12" fill="#D94867" opacity="0.8" />
                  
                  {/* Smaller activity points */}
                  {Array.from({ length: 40 }).map((_, i) => {
                    const x = 150 + Math.random() * 900;
                    const y = 100 + Math.random() * 400;
                    const size = 2 + Math.random() * 8;
                    
                    return (
                      <circle 
                        key={`small-hub-${i}`} 
                        cx={x} 
                        cy={y} 
                        r={size} 
                        fill="#D94867" 
                        opacity={0.5 + Math.random() * 0.3}
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalImpactSection;
