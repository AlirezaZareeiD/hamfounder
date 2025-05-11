
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

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
  const isMobile = useIsMobile();
  
  const startups: Startup[] = [
    {
      id: 1,
      name: "TechNova",
      description: "AI-powered educational platform making personalized learning accessible across language barriers.",
      logo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      industry: "EdTech",
      founderNames: "Parisa Ahmadi & Sohrab Karimi",
      location: "Tehran & San Francisco"
    },
    {
      id: 2,
      name: "MedScan",
      description: "Revolutionizing medical imaging with affordable AI diagnostics for underserved regions.",
      logo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      industry: "HealthTech",
      founderNames: "Dr. Amir Mohseni & Sara Tabesh",
      location: "Toronto & Mashhad"
    },
    {
      id: 3,
      name: "EcoMobility",
      description: "Sustainable transportation solutions adapting renewable technologies for urban environments.",
      logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      industry: "CleanTech",
      founderNames: "Kaveh Rahnama",
      location: "Berlin & Isfahan"
    },
    {
      id: 4,
      name: "FinEdge",
      description: "Cross-border payment platform overcoming financial barriers for Iranian businesses globally.",
      logo: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      industry: "FinTech",
      founderNames: "Mina Zahedi & Behzad Kiani",
      location: "Dubai & Tehran"
    }
  ];

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };
  
  return (
    <section id="startups" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16 text-[#161d30]">
          Spotlight on Iranian-Led Ventures
        </h2>
        
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
              <CarouselItem key={startup.id} className={`${isMobile ? 'basis-full' : 'md:basis-1/2 lg:basis-1/3'} pl-4`}>
                <Card className="bg-slate-200 border-0 h-full shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="flex flex-col p-6 h-full">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-white flex items-center justify-center rounded-full mr-4 border-2 border-slate-400 overflow-hidden">
                        <img 
                          src={startup.logo} 
                          alt={`${startup.name} logo`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-slate-700">{startup.name}</h3>
                        <p className="text-blue-500 font-medium">{startup.industry}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{startup.description}</p>
                    
                    <div className="mt-auto">
                      <div className="text-sm text-slate-600">
                        <div className="mb-1"><span className="font-medium">Founders:</span> {startup.founderNames}</div>
                        <div><span className="font-medium">Locations:</span> {startup.location}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        <div className="flex justify-center mt-6 space-x-2">
          {startups.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full mx-1 focus:outline-none ${
                index === activeIndex ? 'bg-blue-500' : 'bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StartupSpotlightSection;
