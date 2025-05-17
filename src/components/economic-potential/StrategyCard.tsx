
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
        className={`overflow-hidden transition-all duration-300 rounded-xl ${
          isOpen || isHovered 
            ? 'border-primary shadow-lg shadow-primary/10 scale-[1.02]' 
            : 'border-slate-200 shadow-sm'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={toggleOpen}
          className="w-full flex items-center justify-between p-6 text-left"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-5">
            <div className={`flex items-center justify-center w-16 h-16 rounded-xl ${
              isOpen || isHovered 
                ? 'bg-primary text-white' 
                : 'bg-slate-100 text-slate-700'
            } transition-colors duration-300`}>
              <Icon size={28} strokeWidth={2} />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold uppercase tracking-wider mb-1 text-primary">
                Driver #{number}
              </div>
              <div className="font-semibold text-xl leading-tight text-slate-800">{title}</div>
            </div>
          </div>
          <div className={`text-slate-400 ${isOpen || isHovered ? 'text-primary' : ''} transition-colors duration-300`}>
            {isOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
          </div>
        </button>
        
        <motion.div 
          className="bg-slate-50"
          initial={false}
          animate={{ 
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {isOpen && (
            <div className="p-6 border-t border-slate-200">
              <p className="text-lg text-slate-600 leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default StrategyCard;
