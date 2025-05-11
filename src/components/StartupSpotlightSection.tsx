
import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Startup {
  id: number;
  name: string;
  description: string;
  logo: string;
  industry: string;
  founderNames: string;
  location: string;
}

const StartupSpotlightSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const startups: Startup[] = [
    {
      id: 1,
      name: "TechNova",
      description: "AI-powered educational platform making personalized learning accessible across language barriers.",
      logo: "/placeholder.svg",
      industry: "EdTech",
      founderNames: "Parisa Ahmadi & Sohrab Karimi",
      location: "Tehran & San Francisco"
    },
    {
      id: 2,
      name: "MedScan",
      description: "Revolutionizing medical imaging with affordable AI diagnostics for underserved regions.",
      logo: "/placeholder.svg",
      industry: "HealthTech",
      founderNames: "Dr. Amir Mohseni & Sara Tabesh",
      location: "Toronto & Mashhad"
    },
    {
      id: 3,
      name: "EcoMobility",
      description: "Sustainable transportation solutions adapting renewable technologies for urban environments.",
      logo: "/placeholder.svg",
      industry: "CleanTech",
      founderNames: "Kaveh Rahnama",
      location: "Berlin & Isfahan"
    },
    {
      id: 4,
      name: "FinEdge",
      description: "Cross-border payment platform overcoming financial barriers for Iranian businesses globally.",
      logo: "/placeholder.svg",
      industry: "FinTech",
      founderNames: "Mina Zahedi & Behzad Kiani",
      location: "Dubai & Tehran"
    }
  ];
  
  // Touch swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left - next slide
      handleNextSlide();
    }
    
    if (touchStart - touchEnd < -100) {
      // Swipe right - previous slide
      handlePrevSlide();
    }
  };
  
  const handlePrevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? startups.length - 1 : prevIndex - 1));
  };
  
  const handleNextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % startups.length);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % startups.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [startups.length]);
  
  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.clientWidth;
      sliderRef.current.scrollTo({
        left: activeIndex * slideWidth,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);
  
  return (
    <section id="startups" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Spotlight on Iranian-Led Ventures
        </h2>
        
        <div className="relative">
          {/* Slider */}
          <div 
            ref={sliderRef}
            className="overflow-x-hidden whitespace-nowrap scroll-smooth" 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {startups.map((startup) => (
              <div 
                key={startup.id} 
                className={`inline-block w-full ${isMobile ? '' : 'md:w-1/2 lg:w-1/3'} p-4 whitespace-normal`}
                style={{display: 'inline-block', verticalAlign: 'top'}}
              >
                <div className="h-full bg-slate-800/20 rounded-lg border border-slate-700 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 bg-slate-700 flex items-center justify-center">
                      <img 
                        src={startup.logo} 
                        alt={`${startup.name} logo`} 
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{startup.name}</h3>
                      <p className="text-sm text-blue-400">{startup.industry}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    {startup.description}
                  </p>
                  
                  <div className="text-sm text-gray-400">
                    <div className="mb-1"><span className="font-medium">Founders:</span> {startup.founderNames}</div>
                    <div><span className="font-medium">Locations:</span> {startup.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation controls - Touch optimized */}
          {isMobile ? (
            <div className="flex justify-center mt-6 space-x-2">
              {startups.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full mx-1 focus:outline-none ${
                    index === activeIndex ? 'bg-blue-500' : 'bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-between mt-6">
              <div className="flex justify-center space-x-2">
                {startups.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full mx-1 focus:outline-none ${
                      index === activeIndex ? 'bg-blue-500' : 'bg-gray-500'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handlePrevSlide} 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button 
                  onClick={handleNextSlide} 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StartupSpotlightSection;
