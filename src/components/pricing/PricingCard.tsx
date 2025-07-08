import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface PricingPlan {
  name: string;
  price: { monthly: number; annual: number };
  description: string;
  features: string[];
  popular: boolean;
  longDescription?: string; // Add the optional longDescription property
  buttonText: string;
}

interface PricingCardProps {
  plan: PricingPlan;
  isAnnual: boolean;
  category: 'entrepreneur' | 'mentor';
}

const PricingCard = ({ plan, isAnnual, category }: PricingCardProps) => {
  const price = isAnnual ? plan.price.annual : plan.price.monthly;
  const monthlyPrice = isAnnual ? plan.price.annual / 12 : plan.price.monthly;
  
  const getCardClassName = () => {
    if (plan.popular) {
      return "relative border-2 border-primary shadow-lg scale-105 bg-card";
    }
    if (plan.name === "Enterprise") {
      return "relative border border-muted bg-gradient-to-b from-card to-muted/20";
    }
    return "relative border border-muted bg-card hover:border-primary/50 transition-all duration-300";
  };

  const getButtonVariant = () => {
    if (plan.popular) return "default";
    if (plan.price.monthly === 0) return "outline";
    if (plan.name === "Enterprise") return "secondary";
    return "outline";
  };

  return (
    <Card className={getCardClassName()}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-4 py-1 flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        <CardDescription className="text-sm">{plan.description}</CardDescription>
        
        <div className="mt-4">
          {plan.price.monthly === 0 ? (
            <div className="text-3xl font-bold">Free</div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-3xl font-bold">
                ${Math.round(monthlyPrice)}
              </span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
          )}
          
          {isAnnual && plan.price.monthly > 0 && (
            <div className="text-sm text-muted-foreground mt-1">
              ${price} annually (2 months free)
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </CardContent>
      
      {/* Add the longDescription section here */}
      {plan.longDescription && (
        <div className="px-6 pb-6 text-center text-sm text-muted-foreground italic leading-relaxed">
          {plan.longDescription}
        </div>
      )}
      <CardFooter className="pt-4">
        <Button 
          className="w-full" 
          variant={getButtonVariant()}
          size="lg"
        >
          {plan.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
