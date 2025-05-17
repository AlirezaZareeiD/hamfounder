
import { useRef, useEffect } from 'react';
import CounterAnimation from './CounterAnimation';

const EconomicStats = () => {
  const statRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scale-100', 'opacity-100');
            entry.target.classList.remove('scale-95', 'opacity-0');
          }
        });
      },
      { threshold: 0.2 }
    );

    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => observer.observe(card));

    return () => {
      statCards.forEach(card => observer.unobserve(card));
    };
  }, []);

  return (
    <div ref={statRef} className="relative mb-16 md:mb-24 overflow-hidden">
      {/* Background decorative element */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current GDP */}
        <div className="stat-card transition-all duration-700 transform scale-95 opacity-0 delay-100 bg-white rounded-xl shadow-lg p-8 border border-muted/30 hover:border-primary/20 hover:shadow-xl">
          <div className="flex flex-col h-full">
            <span className="text-sm uppercase tracking-wider text-muted-foreground mb-3 font-medium">Current GDP</span>
            <div className="flex-grow flex items-center justify-center">
              <CounterAnimation 
                targetNumber={404.6} 
                prefix="$" 
                suffix=" Billion"
                highlightColor="text-primary"
                fontSize="text-5xl md:text-6xl lg:text-7xl"
              />
            </div>
            <p className="mt-4 text-muted-foreground text-center font-medium">Only 0.38% of global economy</p>
          </div>
        </div>
        
        {/* Growth Vision */}
        <div className="stat-card transition-all duration-700 transform scale-95 opacity-0 delay-300 bg-gradient-to-br from-primary/80 to-blue-600 text-white rounded-xl shadow-lg p-8 border border-primary/20">
          <div className="flex flex-col h-full">
            <span className="text-sm uppercase tracking-wider text-white/80 mb-3 font-medium">Vision Target</span>
            <div className="flex-grow flex items-center justify-center">
              <CounterAnimation 
                targetNumber={3} 
                prefix="$" 
                suffix=" Trillion" 
                highlightColor="text-white"
                fontSize="text-5xl md:text-6xl lg:text-7xl"
              />
            </div>
            <p className="mt-4 text-white/90 text-center font-medium">Within the next decade</p>
          </div>
        </div>
        
        {/* Growth Multiplier */}
        <div className="stat-card transition-all duration-700 transform scale-95 opacity-0 delay-500 bg-white rounded-xl shadow-lg p-8 border border-muted/30 hover:border-primary/20 hover:shadow-xl">
          <div className="flex flex-col h-full">
            <span className="text-sm uppercase tracking-wider text-muted-foreground mb-3 font-medium">Growth Multiplier</span>
            <div className="flex-grow flex items-center justify-center">
              <CounterAnimation 
                targetNumber={7.5} 
                suffix="x"
                highlightColor="text-primary" 
                fontSize="text-6xl md:text-7xl lg:text-8xl font-bold"
              />
            </div>
            <p className="mt-4 text-muted-foreground text-center font-medium">Increase in economic potential</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EconomicStats;
