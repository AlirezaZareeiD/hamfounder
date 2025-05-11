
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const subHeaderRef = useRef<HTMLHeadingElement>(null);
  const btnContainerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    if (subHeaderRef.current) observer.observe(subHeaderRef.current);
    if (btnContainerRef.current) observer.observe(btnContainerRef.current);
    if (statsRef.current) observer.observe(statsRef.current);

    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
      if (subHeaderRef.current) observer.unobserve(subHeaderRef.current);
      if (btnContainerRef.current) observer.unobserve(btnContainerRef.current);
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  return (
    <section className="relative min-h-screen pt-16 pb-16 flex items-center overflow-hidden">
      {/* Dark overlay background with image */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900 to-slate-900/90 -z-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80')] bg-cover bg-center mix-blend-overlay opacity-60"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center md:text-left py-12 md:py-20">
          <h1 
            ref={headerRef}
            className={`${isMobile ? 'text-4xl' : 'text-5xl md:text-6xl lg:text-7xl'} font-bold text-white mb-4 opacity-0 translate-y-8 transition-all duration-700 ease-out px-2 leading-tight`}
          >
            Connect with Entrepreneurs.
          </h1>
          
          <h2 
            ref={subHeaderRef}
            className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl lg:text-6xl'} font-bold text-white mb-8 md:mb-12 opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200 px-2 leading-tight`}
          >
            Find a Cofounder.
          </h2>
          
          <div 
            ref={btnContainerRef}
            className="opacity-0 translate-y-8 transition-all duration-700 ease-out delay-400 mb-16"
          >
            <Button 
              variant="default" 
              size="lg"
              className="bg-rose-600 hover:bg-rose-700 text-white text-lg py-6 px-8 rounded-md transform transition-transform duration-300 hover:scale-105 w-full md:w-auto"
            >
              Join early access — it's free
            </Button>
          </div>

          <div ref={statsRef} className="opacity-0 translate-y-8 transition-all duration-700 ease-out delay-600">
            <p className="text-gray-400 mb-6">as featured in</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-16">
              <div className="bg-gray-800/50 rounded-md px-4 py-2">
                <span className="text-white">Product Hunt</span>
              </div>
              <div className="bg-gray-800/50 rounded-md px-4 py-2">
                <span className="text-white">TechCrunch</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-white text-4xl font-bold mb-2">10,000+</h3>
                <p className="text-gray-400">Registered Innovators</p>
              </div>
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-white text-4xl font-bold mb-2">40 : 60</h3>
                <div className="flex justify-center md:justify-start text-gray-400">
                  <span className="w-1/2">Technical</span>
                  <span className="w-1/2">Non-Tech</span>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-white text-4xl font-bold mb-2">45 : 55</h3>
                <div className="flex justify-center md:justify-start text-gray-400">
                  <span className="w-1/2">Exploring</span>
                  <span className="w-1/2">Committed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-white w-8 h-8" />
      </div>
    </section>
  );
};

export default HeroSection;
