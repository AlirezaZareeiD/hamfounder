
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection = () => {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
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
    if (descriptionRef.current) observer.observe(descriptionRef.current);
    if (btnContainerRef.current) observer.observe(btnContainerRef.current);

    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
      if (descriptionRef.current) observer.unobserve(descriptionRef.current);
      if (btnContainerRef.current) observer.unobserve(btnContainerRef.current);
    };
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-[#2954E8] text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative">
        <div className="text-center py-12 md:py-16">
          <h1 
            ref={headerRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 opacity-0 translate-y-8 transition-all duration-700 ease-out px-2 leading-tight"
          >
            Global Innovators Converge<br />to Build the Future.
          </h1>
          
          <p
            ref={descriptionRef}
            className="text-xl text-white max-w-3xl mx-auto mb-10 opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300 px-2"
          >
            More than co-founder matching. Join a dynamic community supporting your entire journey—from idea to global impact. Learn, grow, and succeed with the power of the worldwide Iranian network.
          </p>
          
          <div 
            ref={btnContainerRef}
            className="opacity-0 translate-y-8 transition-all duration-700 ease-out delay-400 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white text-[#2954E8] hover:bg-gray-100 text-lg py-6 px-8 rounded-md transform transition-transform duration-300 hover:scale-105"
            >
              Discover How
            </Button>
            <Button 
              variant="default" 
              size="lg"
              className="bg-[#18CDAC] hover:bg-[#16b89a] text-white text-lg py-6 px-8 rounded-md transform transition-transform duration-300 hover:scale-105"
            >
              Join Early Access
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
