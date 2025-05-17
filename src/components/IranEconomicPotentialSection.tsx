
import { useRef, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import EconomicStats from './economic-potential/EconomicStats';
import StrategicDrivers from './economic-potential/StrategicDrivers';
import CallToAction from './economic-potential/CallToAction';

const IranEconomicPotentialSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));
    
    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  
  return (
    <section id="economic-potential" className="py-16 md:py-20 bg-white overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500 mb-3">
            Unleashing Iran's Economic Potential
          </h2>
          <p className="text-lg text-muted-foreground">A Global Call to Action</p>
          <Separator className="mt-8 max-w-xs mx-auto" />
        </div>
        
        {/* Highlighted Intro */}
        <div className="text-center mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-primary">
            From Startup Dreams to National Impact
          </h3>
        </div>
        
        {/* Economic Numbers - Cards with Animation */}
        <EconomicStats />
        
        {/* Main Content */}
        <div className="max-w-3xl mx-auto mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
          <p className="text-lg text-center mb-6">
            The vision ahead is bold: reaching $3 trillion within the next decade. It may sound audacious, but it's not impossible. The real question isn't if it's achievable—it's how.
          </p>
          <p className="text-lg text-center mb-6">
            At Hamfounder, we believe the answer starts with us: the global Iranian startup ecosystem.
          </p>
          <p className="text-lg text-center mb-8">
            Our diaspora holds some of the brightest minds, boldest builders, and most resilient innovators. When united under one shared vision, we have the power to ignite a generational movement—one that redefines what Iran can contribute to the global economy.
          </p>
          <Separator className="my-8 max-w-md mx-auto" />
          <p className="text-lg text-center font-medium">
            That's why Hamfounder isn't just about finding co-founders or building startups. It's about building economic transformation through entrepreneurship.
          </p>
        </div>
        
        {/* 10 Strategic Drivers Section */}
        <StrategicDrivers />
        
        {/* Call to Action */}
        <CallToAction />
      </div>
    </section>
  );
};

export default IranEconomicPotentialSection;
