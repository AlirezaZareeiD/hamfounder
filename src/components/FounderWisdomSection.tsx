
import { useState, useRef, useEffect } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { MessageSquareQuote, Star } from 'lucide-react';

interface Founder {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  image: string;
}

interface TestimonialCategory {
  id: string;
  label: string;
  founders: Founder[];
}

const FounderWisdomSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Enhanced founder data with more testimonials and better quality images
  const testimonialCategories: TestimonialCategory[] = [
    {
      id: "all",
      label: "All Testimonials",
      founders: [
        {
          id: 1,
          name: "Maryam Mohammadi",
          role: "Co-Founder & CEO",
          company: "NeuroTech AI",
          quote: "The diaspora connection through Hamfounder gave us access to mentors who helped us navigate both the Iranian and global markets—completely transforming our go-to-market strategy.",
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        },
        {
          id: 2,
          name: "Ali Rahimi",
          role: "Founder",
          company: "EcoSolutions",
          quote: "Finding a technical co-founder with both the skills and cultural understanding was a game-changer. We speak the same language—both literally and figuratively—making our collaboration seamless.",
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        },
        {
          id: 3,
          name: "Sara Ahmadi",
          role: "Co-Founder & CTO",
          company: "FinConnect",
          quote: "As an engineer in Silicon Valley, I wanted to build something meaningful with roots in my heritage. Hamfounder connected me with the perfect business co-founder back in Tehran.",
          image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        },
        {
          id: 4,
          name: "Armin Kazemi",
          role: "Founder & CEO",
          company: "Medtech Solutions",
          quote: "The guidance I received through Hamfounder's mentor network helped me pivot our product to better serve both local Iranian and international markets. We've now secured Series A funding!",
          image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        }
      ]
    },
    {
      id: "tech",
      label: "Tech Founders",
      founders: [
        {
          id: 5,
          name: "Farshid Ghaffari",
          role: "CTO",
          company: "DataFlow Systems",
          quote: "Being able to connect with Iranian tech founders who've succeeded globally provided insights that would have taken years to learn otherwise. Our tech stack improved immensely.",
          image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        },
        {
          id: 3,
          name: "Sara Ahmadi",
          role: "Co-Founder & CTO",
          company: "FinConnect",
          quote: "As an engineer in Silicon Valley, I wanted to build something meaningful with roots in my heritage. Hamfounder connected me with the perfect business co-founder back in Tehran.",
          image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        }
      ]
    },
    {
      id: "business",
      label: "Business Leaders",
      founders: [
        {
          id: 1,
          name: "Maryam Mohammadi",
          role: "Co-Founder & CEO",
          company: "NeuroTech AI",
          quote: "The diaspora connection through Hamfounder gave us access to mentors who helped us navigate both the Iranian and global markets—completely transforming our go-to-market strategy.",
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        },
        {
          id: 6,
          name: "Leila Hosseini",
          role: "CEO",
          company: "GlobalMarket",
          quote: "Hamfounder's network helped me understand regulatory challenges for Iranian entrepreneurs expanding globally. Their guidance was invaluable in our international growth.",
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        }
      ]
    },
    {
      id: "diaspora",
      label: "Diaspora Network",
      founders: [
        {
          id: 7,
          name: "Kian Tehrani",
          role: "Founder",
          company: "Bridge Ventures",
          quote: "As part of the Iranian diaspora in Canada, I wanted to give back to my community. Through Hamfounder, I've been able to mentor and invest in promising startups from Iran.",
          image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        },
        {
          id: 2,
          name: "Ali Rahimi",
          role: "Founder",
          company: "EcoSolutions",
          quote: "Finding a technical co-founder with both the skills and cultural understanding was a game-changer. We speak the same language—both literally and figuratively—making our collaboration seamless.",
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        }
      ]
    }
  ];

  // Get current founders based on active tab
  const currentFounders = testimonialCategories.find(cat => cat.id === activeTab)?.founders || [];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Insights from Leading Iranian Innovators
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Learn from the experiences of successful founders who've navigated the unique challenges 
            of building in and for the Iranian ecosystem.
          </p>
        </div>

        {/* Tabs for filtering testimonials */}
        <div className="mb-12">
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-slate-800/50 w-full max-w-3xl mx-auto">
              {testimonialCategories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Carousel for testimonials */}
        <div className="relative px-4 md:px-10">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {currentFounders.map((founder) => (
                <CarouselItem key={founder.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="bg-slate-800/40 border-slate-700 hover:border-blue-500/50 transition-all h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="mb-6 flex items-start">
                        <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-slate-700 flex-shrink-0">
                          <img 
                            src={founder.image} 
                            alt={founder.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{founder.name}</h3>
                          <p className="text-blue-400 text-sm">{founder.role}</p>
                          <p className="text-gray-400 text-sm">{founder.company}</p>
                        </div>
                      </div>
                      
                      <div className="flex-grow flex flex-col">
                        <div className="text-yellow-500 mb-3 flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        
                        <blockquote className="text-gray-300 italic relative flex-grow">
                          <MessageSquareQuote className="absolute -top-2 -left-1 text-blue-500/20 h-8 w-8" />
                          <p className="pl-6">"{founder.quote}"</p>
                        </blockquote>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-8 flex justify-center gap-2">
              <CarouselPrevious className="relative static left-0 translate-y-0 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-blue-400" />
              <CarouselNext className="relative static right-0 translate-y-0 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-blue-400" />
            </div>
          </Carousel>
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <p className="text-white text-lg mb-4">
            Have a founder story to share?
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Submit Your Story
          </button>
        </div>
      </div>
    </section>
  );
};

export default FounderWisdomSection;
