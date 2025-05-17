
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, TrendingUp, DollarSign, Users, Briefcase, Rocket, LightBulb, Building, HandShake, LinkIcon, BadgeCheck, Flag } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const CounterAnimation = ({ targetNumber, prefix = "", suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime;
    let animationFrame;
    const startValue = 0;
    
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(progress * (targetNumber - startValue) + startValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };
    
    animationFrame = requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [targetNumber, duration, isVisible]);

  return (
    <div ref={counterRef} className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
};

const StrategyCard = ({ number, title, icon: Icon, isOpen, toggleOpen }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
      <CardContent className="p-0">
        <button
          onClick={toggleOpen}
          className="w-full flex items-center justify-between p-4 text-left"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
              <Icon size={18} />
            </div>
            <div className="font-medium">{title}</div>
          </div>
          <div className="text-muted-foreground">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>
        
        <div 
          className={`overflow-hidden transition-all duration-300 bg-muted/30 ${
            isOpen ? 'max-h-40 p-4' : 'max-h-0'
          }`}
        >
          <p className="text-sm text-muted-foreground">
            Strategic driver #{number} for Iran's economic transformation through connected entrepreneurship and innovation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const IranEconomicPotentialSection = () => {
  const [openStrategy, setOpenStrategy] = useState(null);
  const sectionRef = useRef(null);
  
  // List of strategies with their icons
  const strategies = [
    { title: "Macroeconomic Stability & Financial Reform", icon: DollarSign },
    { title: "Governance & Business Climate Reform", icon: Building },
    { title: "FDI and Diaspora Investment Channels", icon: Briefcase },
    { title: "Smart Export Acceleration", icon: TrendingUp },
    { title: "Tech & Innovation Ecosystems", icon: LightBulb },
    { title: "Infrastructure Revamp through Public-Private Partnerships", icon: HandShake },
    { title: "Skills Revolution & Talent Pipeline", icon: Users },
    { title: "AgTech and Resource Sustainability", icon: Rocket },
    { title: "Tourism & Experience Economy Expansion", icon: Flag },
    { title: "National Task Force for Transformational Growth", icon: BadgeCheck }
  ];
  
  const toggleStrategy = (index) => {
    setOpenStrategy(openStrategy === index ? null : index);
  };
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));
    
    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  
  return (
    <section id="economic-potential" className="py-16 md:py-20 bg-white overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500 mb-3">
            Unleashing Iran's Economic Potential
          </h2>
          <p className="text-lg text-muted-foreground">A Global Call to Action</p>
          <Separator className="mt-8 max-w-xs mx-auto" />
        </div>
        
        {/* Highlighted Intro */}
        <div className="text-center mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-primary">
            From Startup Dreams to National Impact
          </h3>
        </div>
        
        {/* Economic Numbers - Cards with Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 md:mb-16">
          {/* Current GDP */}
          <div className="bg-gradient-to-br from-background to-muted/30 rounded-lg shadow-md p-6 text-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-150">
            <p className="text-sm uppercase text-muted-foreground mb-2">Current GDP</p>
            <CounterAnimation targetNumber={404.6} prefix="$" suffix=" billion" />
            <p className="mt-3 text-muted-foreground">Only 0.38% of global economy</p>
          </div>
          
          {/* Growth Vision */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/20 rounded-lg shadow-md p-6 text-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
            <p className="text-sm uppercase text-muted-foreground mb-2">Vision Target</p>
            <CounterAnimation targetNumber={3} prefix="$" suffix=" trillion" />
            <p className="mt-3 text-muted-foreground">Within the next decade</p>
          </div>
          
          {/* Growth Multiplier */}
          <div className="bg-gradient-to-br from-background to-muted/30 rounded-lg shadow-md p-6 text-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-250">
            <p className="text-sm uppercase text-muted-foreground mb-2">Growth Multiplier</p>
            <CounterAnimation targetNumber={7.5} suffix="x" />
            <p className="mt-3 text-muted-foreground">Increase in economic potential</p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-3xl mx-auto mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
          <p className="text-lg text-center mb-6">
            The vision ahead is bold: reaching $3 trillion within the next decade. It may sound audacious, but it's not impossible. The real question isn't if it's achievable—it's how.
          </p>
          <p className="text-lg text-center mb-6">
            At Hamfounder, we believe the answer starts with us: the global Iranian startup ecosystem.
          </p>
          <p className="text-lg text-center mb-8">
            Our diaspora holds some of the brightest minds, boldest builders, and most resilient innovators. When united under one shared vision, we have the power to ignite a generational movement—one that redefines what Iran can contribute to the global economy.
          </p>
          <Separator className="my-8 max-w-md mx-auto" />
          <p className="text-lg text-center font-medium">
            That's why Hamfounder isn't just about finding co-founders or building startups. It's about building economic transformation through entrepreneurship.
          </p>
        </div>
        
        {/* 10 Strategic Drivers Section */}
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
        
        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-primary rounded-lg p-8 md:p-12 text-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-500">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            We're not just building companies. We're shaping history.
          </h3>
          <p className="text-white/90 text-lg mb-8">
            Join the movement. Help shape the next chapter of Iran's economic story.
          </p>
          <Link to="/signup">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 font-medium text-lg px-8 py-6 h-auto"
            >
              Join the Movement
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default IranEconomicPotentialSection;
