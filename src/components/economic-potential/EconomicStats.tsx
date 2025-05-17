
import CounterAnimation from './CounterAnimation';

const EconomicStats = () => {
  return (
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
  );
};

export default EconomicStats;
