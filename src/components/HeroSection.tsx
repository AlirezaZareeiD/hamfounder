
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const navbarHeight = document.querySelector('nav')?.offsetHeight || 0;
      const sectionTop = section.offsetTop - navbarHeight;
     
      window.scrollTo({
        top: sectionTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="top" className="relative min-h-[90vh] sm:min-h-[70vh] flex items-center justify-center text-center">
      {/* Dark background overlay with image */}
      <div className="absolute inset-0 bg-slate-900 z-0">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80')] bg-cover bg-center opacity-30"
        ></div>
      </div>
     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative">
        <div className="text-center py-8 md:py-12 lg:py-16">
          <h1
            ref={headerRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 opacity-0 translate-y-8 transition-all duration-700 ease-out px-2 leading-tight"
          >
            Global Innovators Converge to<br className="hidden sm:block" /> Build the Future.
          </h1>
         
          <p
            ref={descriptionRef}
            className="text-lg sm:text-xl text-white max-w-3xl mx-auto mb-6 sm:mb-10 opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300 px-4"
          >
            More than co-founder matching. Join a dynamic community supporting your entire journey—from idea to global impact. Learn, grow, and succeed with the power of the worldwide Iranian network.
          </p>
         
          <div
            ref={btnContainerRef}
            className="opacity-0 translate-y-8 transition-all duration-700 ease-out delay-400 flex flex-col sm:flex-row justify-center gap-4 px-6"
          >
            <Button
              variant="outline"
              onClick={() => scrollToSection('how-it-works')}
              className="bg-white text-[#2954E8] hover:bg-gray-100 text-base sm:text-lg py-5 sm:py-6 px-6 sm:px-8 rounded-md transform transition-transform duration-300 hover:scale-105 h-auto"
            >
              Discover How
            </Button>
            <Button
              variant="default"
              onClick={() => scrollToSection('join')}
              className="bg-[#18CDAC] hover:bg-[#16b89a] text-white text-base sm:text-lg py-5 sm:py-6 px-6 sm:px-8 rounded-md transform transition-transform duration-300 hover:scale-105 h-auto"
            >
              Join Early Access
            </Button>
            <Button
              asChild
              variant="default"
              className="bg-[#0ea5e9] hover:bg-[#0891d2] text-white text-base sm:text-lg py-5 sm:py-6 px-6 sm:px-8 rounded-md transform transition-transform duration-300 hover:scale-105 h-auto"
            >
            </Button>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-10 cursor-pointer"
        onClick={() => scrollToSection('mission')}
        aria-label="Scroll to next section"
      >
        <ChevronDown className="text-white w-6 h-6 sm:w-8 sm:h-8" />
      </div>
    </section>
  );
};

export default HeroSection;
