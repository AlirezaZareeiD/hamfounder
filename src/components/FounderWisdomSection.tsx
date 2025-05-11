
import { useState } from 'react';

interface Founder {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  image: string;
}

const FounderWisdomSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const founders: Founder[] = [
    {
      id: 1,
      name: "Maryam Mohammadi",
      role: "Co-Founder & CEO",
      company: "NeuroTech AI",
      quote: "The diaspora connection through Hamfounder gave us access to mentors who helped us navigate both the Iranian and global markets—completely transforming our go-to-market strategy.",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Ali Rahimi",
      role: "Founder",
      company: "EcoSolutions",
      quote: "Finding a technical co-founder with both the skills and cultural understanding was a game-changer. We speak the same language—both literally and figuratively—making our collaboration seamless.",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Sara Ahmadi",
      role: "Co-Founder & CTO",
      company: "FinConnect",
      quote: "As an engineer in Silicon Valley, I wanted to build something meaningful with roots in my heritage. Hamfounder connected me with the perfect business co-founder back in Tehran.",
      image: "/placeholder.svg"
    }
  ];
  
  return (
    <section className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Insights from Leading Iranian Innovators
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {founders.map((founder, index) => (
            <div 
              key={founder.id}
              className={`bg-slate-800/40 rounded-lg p-6 border transition-all ${index === activeIndex ? 'border-blue-500 transform scale-105' : 'border-slate-700'}`}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden mr-4 bg-slate-700">
                  <img 
                    src={founder.image} 
                    alt={founder.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{founder.name}</h3>
                  <p className="text-sm text-gray-400">{founder.role}, {founder.company}</p>
                </div>
              </div>
              
              <blockquote className="text-gray-300 italic">
                "{founder.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FounderWisdomSection;
