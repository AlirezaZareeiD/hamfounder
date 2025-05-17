
import { useRef, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import EconomicStats from './economic-potential/EconomicStats';
import StrategicDrivers from './economic-potential/StrategicDrivers';
import CallToAction from './economic-potential/CallToAction';
import { motion } from 'framer-motion';

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
    <section id="economic-potential" className="py-20 md:py-28 bg-white overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Title - Fixed padding to properly display the 'g' character */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20 pb-10" // Increased bottom margins significantly
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 mb-10 leading-relaxed">
            Unleashing Iran's Economic Potential
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
            From Startup Dreams to National Impact
          </p>
          <Separator className="mt-14 max-w-xs mx-auto" />
        </motion.div>
        
        {/* Economic Stats Section */}
        <EconomicStats />
        
        {/* Main Content */}
        <div className="mb-20 md:mb-28">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
              <div className="bg-white rounded-xl p-8 shadow-lg shadow-primary/5 border-l-4 border-primary flex flex-col space-y-5">
                <p className="text-xl leading-relaxed text-left">
                  The vision ahead is bold: reaching <span className="text-primary font-semibold">$3 Trillion</span> within the next decade. It may sound audacious, but it's not impossible. The real question isn't if it's achievable—it's how.
                </p>
                
                <p className="text-xl leading-relaxed text-left">
                  At Hamfounder, we believe the answer starts with us: the global Iranian startup ecosystem.
                </p>
              </div>
              
              <div className="flex flex-col justify-center">
                <p className="text-xl leading-relaxed text-left mb-6">
                  Our diaspora holds some of the brightest minds, boldest builders, and most resilient innovators. When united under one shared vision, we have the power to ignite a generational movement.
                </p>
                
                <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg p-5 border-l-4 border-primary">
                  <p className="text-xl font-medium text-left">
                    That's why Hamfounder isn't just about finding co-founders or building startups. It's about building economic transformation through entrepreneurship.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Strategic Drivers Section */}
        <StrategicDrivers />
        
        {/* Call to Action */}
        <CallToAction />
      </div>
    </section>
  );
};

export default IranEconomicPotentialSection;
