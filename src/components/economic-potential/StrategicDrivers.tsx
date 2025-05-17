
import { useState } from 'react';
import StrategyCard from './StrategyCard';
import { motion } from 'framer-motion';
import { 
  TrendingUp, DollarSign, Users, Briefcase, 
  Rocket, Lightbulb, Building, Handshake, 
  BadgeCheck, Flag 
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Strategy {
  title: string;
  icon: LucideIcon;
  description: string;
}

const StrategicDrivers = () => {
  const [openStrategy, setOpenStrategy] = useState<number | null>(null);
  
  // List of strategies with their icons and descriptions
  const strategies: Strategy[] = [
    { 
      title: "Macroeconomic Stability & Financial Reform", 
      icon: DollarSign,
      description: "Creating the foundations for sustainable growth through monetary policy reform, inflation control, and modern financial infrastructure that supports business innovation."
    },
    { 
      title: "Governance & Business Climate Reform", 
      icon: Building,
      description: "Streamlining regulatory frameworks and reducing bureaucratic friction to enable faster company formation, easier capital flows, and smoother business operations."
    },
    { 
      title: "FDI and Diaspora Investment Channels", 
      icon: Briefcase,
      description: "Building structured pathways for global Iranian capital to flow back into the country through transparent, secure investment vehicles and cross-border partnerships."
    },
    { 
      title: "Smart Export Acceleration", 
      icon: TrendingUp,
      description: "Identifying and developing high-value export categories where Iran can compete globally, focusing on knowledge-intensive products and services."
    },
    { 
      title: "Tech & Innovation Ecosystems", 
      icon: Lightbulb,
      description: "Cultivating regional tech hubs that connect universities, startups, investors and industry to create innovation clusters that drive economic growth."
    },
    { 
      title: "Infrastructure Revamp through PPPs", 
      icon: Handshake,
      description: "Modernizing critical infrastructure through innovative public-private partnership models that leverage both government resources and private sector efficiency."
    },
    { 
      title: "Skills Revolution & Talent Pipeline", 
      icon: Users,
      description: "Transforming education and professional development to prepare Iran's workforce for high-growth global industries and future economic opportunities."
    },
    { 
      title: "AgTech and Resource Sustainability", 
      icon: Rocket,
      description: "Revolutionizing agricultural productivity and resource management through technology-driven solutions that ensure long-term sustainability."
    },
    { 
      title: "Tourism & Experience Economy Expansion", 
      icon: Flag,
      description: "Developing Iran's immense potential in cultural, historical and experiential tourism to create jobs and generate foreign exchange."
    },
    { 
      title: "National Task Force for Growth", 
      icon: BadgeCheck,
      description: "Establishing a cross-sector coordinating body to align public and private initiatives toward the shared vision of transformational economic growth."
    }
  ];
  
  const toggleStrategy = (index: number) => {
    setOpenStrategy(openStrategy === index ? null : index);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mb-16 md:mb-24"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-10"
      >
        <div className="h-0.5 flex-grow bg-gradient-to-r from-primary/10 to-primary"></div>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap">
          10 Strategic Drivers
        </h3>
        <div className="h-0.5 flex-grow bg-gradient-to-l from-primary/10 to-primary"></div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {strategies.map((strategy, index) => (
          <StrategyCard
            key={index}
            number={index + 1}
            title={strategy.title}
            description={strategy.description}
            icon={strategy.icon}
            isOpen={openStrategy === index}
            toggleOpen={() => toggleStrategy(index)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default StrategicDrivers;
