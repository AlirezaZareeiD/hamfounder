
import { Globe, BookOpen, Rocket, Award } from 'lucide-react';

const EcosystemPillarsSection = () => {
  const pillars = [
    {
      icon: Globe,
      title: "Connect",
      description: "Connect global talent and bridge the diaspora gap. Find co-founders, mentors, and team members who share cultural understanding and vision."
    },
    {
      icon: BookOpen,
      title: "Learn",
      description: "Access shared knowledge and mentoring resources specifically designed for Iranian entrepreneurs facing unique global challenges."
    },
    {
      icon: Rocket,
      title: "Build",
      description: "Create globally impactful businesses by leveraging our supportive ecosystem and collective expertise."
    },
    {
      icon: Award,
      title: "Grow",
      description: "Scale your business with strategic resources and connections designed for Iranian founders expanding internationally."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            The Four Pillars of the Hamfounder Ecosystem
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Our integrated platform goes beyond co-founder matching to support your entire entrepreneurial journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <div 
              key={index} 
              className="bg-slate-800/20 rounded-lg border border-slate-700 p-6 transition-all hover:transform hover:scale-105 hover:border-blue-500/50"
            >
              <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <pillar.icon className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{pillar.title}</h3>
              <p className="text-gray-300">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcosystemPillarsSection;
