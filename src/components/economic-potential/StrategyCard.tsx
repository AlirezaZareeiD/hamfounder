
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface StrategyCardProps {
  number: number;
  title: string;
  icon: LucideIcon;
  isOpen: boolean;
  toggleOpen: () => void;
}

const StrategyCard = ({ number, title, icon: Icon, isOpen, toggleOpen }: StrategyCardProps) => {
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

export default StrategyCard;
