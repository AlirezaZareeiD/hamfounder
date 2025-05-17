
import { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface StrategyCardProps {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  isOpen: boolean;
  toggleOpen: () => void;
}

const StrategyCard = ({ 
  number, 
  title, 
  description,
  icon: Icon, 
  isOpen, 
  toggleOpen 
}: StrategyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: number * 0.1 }}
    >
      <Card 
        className={`overflow-hidden transition-all duration-300 transform ${
          isOpen || isHovered ? 'border-primary shadow-lg shadow-primary/10 scale-[1.01]' : 'border-border shadow-sm'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={toggleOpen}
          className="w-full flex items-center justify-between p-5 text-left"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-14 h-14 rounded-lg ${
              isOpen || isHovered ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
            } transition-colors duration-300`}>
              <Icon size={24} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <div className="text-xs text-muted-foreground font-semibold mb-1">
                DRIVER #{number}
              </div>
              <div className="font-semibold text-lg leading-tight">{title}</div>
            </div>
          </div>
          <div className={`text-muted-foreground ${isOpen || isHovered ? 'text-primary' : ''} transition-colors duration-300`}>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
        
        <motion.div 
          className="bg-muted/5 border-t border-border"
          initial={false}
          animate={{ 
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-5">
            <p className="text-muted-foreground text-left">
              {description}
            </p>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default StrategyCard;
