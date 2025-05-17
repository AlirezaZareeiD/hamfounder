
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
    <section id="economic-potential" className="py-20 md:py-28 bg-white overflow-visible" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Restoring the original section title */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 leading-tight">
            Unleashing Iran's <span className="text-primary">Economic Potential</span>
          </h2>
          <p className="text-xl md:text-2xl text-center text-slate-600 max-w-3xl mx-auto">
            From current GDP of $404 Billion to a vision of $3 Trillion through strategic economic transformation
          </p>
        </div>
        
        {/* Economic Stats Section */}
        <EconomicStats />
        
        {/* Vision Content - Apple-inspired cards layout */}
        <div className="mb-20 md:mb-28">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl p-8 md:p-10 bg-gradient-to-br from-slate-50 to-white shadow-xl border border-slate-100"
              >
                <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-slate-800">The Vision</h3>
                <p className="text-xl leading-relaxed text-slate-700 mb-6">
                  The vision ahead is bold: reaching <span className="text-primary font-semibold">$3 Trillion</span> within the next decade. It may sound audacious, but it's not impossible. The real question isn't if it's achievable—it's how.
                </p>
                
                <p className="text-xl leading-relaxed text-slate-700">
                  At Hamfounder, we believe the answer starts with us: the global Iranian startup ecosystem.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-2xl p-8 md:p-10 bg-gradient-to-br from-primary/[0.03] to-blue-500/[0.03] shadow-xl border border-primary/10"
              >
                <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-slate-800">The Movement</h3>
                <p className="text-xl leading-relaxed text-slate-700 mb-6">
                  Our diaspora holds some of the brightest minds, boldest builders, and most resilient innovators. When united under one shared vision, we have the power to ignite a generational movement.
                </p>
                
                <div className="rounded-xl p-6 bg-slate-800 text-white">
                  <p className="text-xl font-medium">
                    That's why Hamfounder isn't just about finding co-founders or building startups. It's about building economic transformation through entrepreneurship.
                  </p>
                </div>
              </motion.div>
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
