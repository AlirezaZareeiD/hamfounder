
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection = () => {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnContainerRef = useRef<HTMLDivElement>(null);
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
    if (descRef.current) observer.observe(descRef.current);
    if (btnContainerRef.current) observer.observe(btnContainerRef.current);

    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
      if (descRef.current) observer.unobserve(descRef.current);
      if (btnContainerRef.current) observer.unobserve(btnContainerRef.current);
    };
  }, []);

  return (
    <section className="relative pt-12 pb-16 md:pt-24 md:pb-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-slate-900 -z-10">
        {/* Decorative elements */}
        <div className="absolute right-[10%] top-1/3 w-44 md:w-64 h-44 md:h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute left-[15%] bottom-1/4 w-52 md:w-72 h-52 md:h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          <h1 
            ref={headerRef}
            className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl lg:text-6xl'} font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 mb-6 opacity-0 translate-y-8 transition-all duration-700 ease-out px-2`}
          >
            Hamfounder: Connecting Iranian Innovators Worldwide
          </h1>
          
          <p 
            ref={descRef}
            className="text-base md:text-lg lg:text-xl text-gray-300 mb-8 md:mb-10 max-w-3xl mx-auto opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300 px-3"
          >
            A powerful network connecting co-founders, mentors, and investors across the Iranian diaspora. Great ideas become reality with the right partners.
          </p>
          
          <div 
            ref={btnContainerRef}
            className="flex flex-col sm:flex-row justify-center gap-4 opacity-0 translate-y-8 transition-all duration-700 ease-out delay-500 px-4"
          >
            <Button 
              variant="default" 
              size={isMobile ? "default" : "lg"} 
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 transform transition-transform duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Explore Ecosystem
            </Button>
            <Button 
              variant="outline" 
              size={isMobile ? "default" : "lg"}
              className="border-gray-400 text-gray-300 hover:bg-gray-800/50 transform transition-transform duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Early Access
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
