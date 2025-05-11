import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

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
  
  
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-white">
          Spotlight on Iranian-Led Ventures
        </h2>
        
        <p className="text-center text-slate-300 mb-12 max-w-3xl mx-auto">
          Discover the success stories of innovative Iranian founders who are making 
          an impact globally across various industries. These entrepreneurs 
          represent the boundless potential within our community.
        </p>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
          onSelect={(api) => {
            const selectedIndex = api?.selectedScrollSnap() || 0;
            setActiveIndex(selectedIndex);
          }}
        >
          <CarouselContent>
            {startups.map((startup) => (
              <CarouselItem key={startup.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="overflow-hidden rounded-full h-32 w-32 border-4 border-slate-700">
                        <img
                          src={startup.founderImage}
                          alt={`${startup.founderName}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-white">
                          {startup.founderName}
                        </h3>
                        <p className="text-slate-400 mb-2">Founder of {startup.name}</p>
                        
                        <div 
                          className="text-sm p-1 px-3 rounded-full inline-block mb-3"
                          style={{ backgroundColor: getBackgroundColor(startup.category) }}
                        >
                          {startup.category}
                        </div>
                        
                        <p className="text-slate-300 mt-3">
                          {startup.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        <div className="flex justify-center gap-2 mt-8">
          {startups.map((_, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              className={`w-3 h-3 rounded-full p-0 ${
                activeIndex === index 
                  ? 'bg-white border-white' 
                  : 'bg-transparent border-white/30'
              }`}
              onClick={() => {
                const carouselElement = document.querySelector('[role="region"]');
                if (carouselElement) {
                  const scrollSnapElement = carouselElement.querySelector(
                    `[data-carousel-item]:nth-child(${index + 1})`
                  );
                  if (scrollSnapElement) {
                    scrollSnapElement.scrollIntoView({
                      behavior: 'smooth',
                      block: 'nearest',
                      inline: 'center',
                    });
                    setActiveIndex(index);
                  }
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
