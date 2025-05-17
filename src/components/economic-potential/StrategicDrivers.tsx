
import { useState } from 'react';
import StrategyCard from './StrategyCard';
import { TrendingUp, DollarSign, Users, Briefcase, Rocket, Lightbulb, Building, Handshake, BadgeCheck, Flag } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Strategy {
  title: string;
  icon: LucideIcon;
}

const StrategicDrivers = () => {
  const [openStrategy, setOpenStrategy] = useState<number | null>(null);
  
  // List of strategies with their icons
  const strategies: Strategy[] = [
    { title: "Macroeconomic Stability & Financial Reform", icon: DollarSign },
    { title: "Governance & Business Climate Reform", icon: Building },
    { title: "FDI and Diaspora Investment Channels", icon: Briefcase },
    { title: "Smart Export Acceleration", icon: TrendingUp },
    { title: "Tech & Innovation Ecosystems", icon: Lightbulb },
    { title: "Infrastructure Revamp through Public-Private Partnerships", icon: Handshake },
    { title: "Skills Revolution & Talent Pipeline", icon: Users },
    { title: "AgTech and Resource Sustainability", icon: Rocket },
    { title: "Tourism & Experience Economy Expansion", icon: Flag },
    { title: "National Task Force for Transformational Growth", icon: BadgeCheck }
  ];
  
  const toggleStrategy = (index: number) => {
    setOpenStrategy(openStrategy === index ? null : index);
  };

  return (
    <div className="mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-400">
      <h3 className="text-2xl font-semibold text-center mb-8">
        10 Strategic Drivers of GDP Growth
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategies.map((strategy, index) => (
          <StrategyCard
            key={index}
            number={index + 1}
            title={strategy.title}
            icon={strategy.icon}
            isOpen={openStrategy === index}
            toggleOpen={() => toggleStrategy(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default StrategicDrivers;
