import { Badge } from '@/components/ui/badge';

interface PricingToggleProps {
  isAnnual: boolean;
  setIsAnnual: (value: boolean) => void;
}

const PricingToggle = ({ isAnnual, setIsAnnual }: PricingToggleProps) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="bg-muted p-1 rounded-lg flex items-center relative">
        <button
          onClick={() => setIsAnnual(false)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative z-10 ${
            !isAnnual
              ? 'text-primary-foreground bg-primary shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsAnnual(true)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative z-10 flex items-center gap-2 ${
            isAnnual
              ? 'text-primary-foreground bg-primary shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Annual
          <Badge variant="secondary" className="text-xs">
            Save 17%
          </Badge>
        </button>
      </div>
    </div>
  );
};

export default PricingToggle;
