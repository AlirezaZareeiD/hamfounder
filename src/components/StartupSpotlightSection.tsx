
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Startup {
  id: number;
  name: string;
  founderName: string;
  founderImage: string;
  category: string;
  description: string;
}

const startups: Startup[] = [
  {
    id: 1,
    name: "InnovateTech",
    founderName: "Arash Javan",
    founderImage: "/images/founders/arash_javan.jpg",
    category: "AI & Machine Learning",
    description: "Revolutionizing industries with cutting-edge AI solutions."
  },
  {
    id: 2,
    name: "GreenSolutions",
    founderName: "Leila Hosseini",
    founderImage: "/images/founders/leila_hosseini.jpg",
    category: "Renewable Energy",
    description: "Leading the way in sustainable energy innovations for a greener future."
  },
  {
    id: 3,
    name: "HealthFirst",
    founderName: "Babak Tehrani",
    founderImage: "/images/founders/babak_tehrani.jpg",
    category: "Healthcare Technology",
    description: "Transforming healthcare with advanced technology for better patient outcomes."
  },
  {
    id: 4,
    name: "EduGlobal",
    founderName: "Sara Ahmadi",
    founderImage: "/images/founders/sara_ahmadi.jpg",
    category: "EdTech",
    description: "Making education accessible worldwide through innovative online platforms."
  },
  {
    id: 5,
    name: "AgriSmart",
    founderName: "Khosro Farmani",
    founderImage: "/images/founders/khosro_farmani.jpg",
    category: "Agricultural Technology",
    description: "Enhancing farming practices with smart technology for increased efficiency."
  },
  {
    id: 6,
    name: "FinSecure",
    founderName: "Mina Alavi",
    founderImage: "/images/founders/mina_alavi.jpg",
    category: "FinTech",
    description: "Providing secure and innovative financial solutions for a digital world."
  }
];

const getBackgroundColor = (category: string) => {
  switch (category) {
    case "AI & Machine Learning":
      return "#1e3a8a"; // Deep Blue
    case "Renewable Energy":
      return "#166534"; // Green
    case "Healthcare Technology":
      return "#7c3a31"; // Red
    case "EdTech":
      return "#78350f"; // Orange
    case "Agricultural Technology":
      return "#365314"; // Dark Green
    case "FinTech":
      return "#3730a3"; // Purple
    default:
      return "#4a5568"; // Slate
  }
};

const StartupSpotlightSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: true,
  });

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on('select', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);
  
  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();
  
  return (
    <section id="startups" className="py-16 md:py-24 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-12 text-center text-white">
          Spotlight on Iranian-Led Ventures
        </h2>
        
        <p className="text-center text-slate-300 mb-8 md:mb-12 max-w-3xl mx-auto px-4">
          Discover the success stories of innovative Iranian founders who are making 
          an impact globally across various industries. These entrepreneurs 
          represent the boundless potential within our community.
        </p>
        
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {startups.map((startup) => (
                <div key={startup.id} className="min-w-0 flex-[0_0_90%] sm:flex-[0_0_80%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4">
                  <Card className="h-full bg-slate-800/50 border-slate-700 transform transition-transform hover:scale-[1.01]">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="overflow-hidden rounded-full h-24 w-24 md:h-32 md:w-32 border-4 border-slate-700">
                          <img
                            src={startup.founderImage}
                            alt={`${startup.founderName}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        
                        <div className="text-center">
                          <h3 className="text-lg md:text-xl font-semibold text-white">
                            {startup.founderName}
                          </h3>
                          <p className="text-slate-400 mb-2">Founder of {startup.name}</p>
                          
                          <div 
                            className="text-xs md:text-sm p-1 px-2 md:px-3 rounded-full inline-block mb-3"
                            style={{ backgroundColor: getBackgroundColor(startup.category) }}
                          >
                            {startup.category}
                          </div>
                          
                          <p className="text-slate-300 mt-3 text-sm md:text-base">
                            {startup.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation arrows */}
          <button 
            onClick={scrollPrev} 
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-slate-800/60 hover:bg-slate-700 text-white p-2 rounded-r-lg shadow-lg hidden md:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={scrollNext} 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-slate-800/60 hover:bg-slate-700 text-white p-2 rounded-l-lg shadow-lg hidden md:flex"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        
        {/* Dots navigation - better for mobile */}
        <div className="flex justify-center gap-2 mt-6 md:mt-8">
          {startups.map((_, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full p-0 ${
                activeIndex === index 
                  ? 'bg-white border-white' 
                  : 'bg-transparent border-white/30'
              }`}
              onClick={() => {
                if (emblaApi) {
                  emblaApi.scrollTo(index);
                  setActiveIndex(index);
                }
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StartupSpotlightSection;
