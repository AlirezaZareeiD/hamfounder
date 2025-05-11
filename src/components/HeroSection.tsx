
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const subHeaderRef = useRef<HTMLHeadingElement>(null);
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
    if (subHeaderRef.current) observer.observe(subHeaderRef.current);
    if (descriptionRef.current) observer.observe(descriptionRef.current);
    if (btnContainerRef.current) observer.observe(btnContainerRef.current);

    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
      if (subHeaderRef.current) observer.unobserve(subHeaderRef.current);
      if (descriptionRef.current) observer.unobserve(descriptionRef.current);
      if (btnContainerRef.current) observer.unobserve(btnContainerRef.current);
    };
  }, []);

  return (
    <section className="relative min-h-[80vh] pt-16 pb-16 flex items-center">
      {/* Dark background overlay */}
      <div className="absolute inset-0 bg-slate-900 z-0">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80')] bg-cover bg-center opacity-30"
        ></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative">
        <div className="text-center py-12 md:py-20">
          <h1 
            ref={headerRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 opacity-0 translate-y-8 transition-all duration-700 ease-out px-2 leading-tight"
          >
            Connect with Entrepreneurs.
          </h1>
          
          <h2 
            ref={subHeaderRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200 px-2 leading-tight"
          >
            Find a Cofounder.
          </h2>
          
          <p
            ref={descriptionRef}
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300 px-2"
          >
            Join our exclusive network of ambitious entrepreneurs and technical talents looking to build the next big thing together. Find your perfect match and start your journey today.
          </p>
          
          <div 
            ref={btnContainerRef}
            className="opacity-0 translate-y-8 transition-all duration-700 ease-out delay-400"
          >
            <Button 
              variant="default" 
              size="lg"
              className="bg-rose-600 hover:bg-rose-700 text-white text-lg py-6 px-8 rounded-md transform transition-transform duration-300 hover:scale-105 w-full md:w-auto"
            >
              Join early access — it's free
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <ChevronDown className="text-white w-8 h-8" />
      </div>
    </section>
  );
};

export default HeroSection;
