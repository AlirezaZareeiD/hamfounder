
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface FinalCTASectionProps {
  onSubmit: (email: string) => void;
  submitted: boolean;
}

const FinalCTASection = ({ onSubmit, submitted }: FinalCTASectionProps) => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(email);
    setEmail('');
  };
  
  return (
    <section className="py-16 relative bg-[#2d3db7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Ready to Build Your Legacy?
        </h2>
        
        <p className="text-lg text-white mb-12 max-w-3xl mx-auto leading-relaxed">
          The Hamfounder community awaits. Join fellow Iranian innovators, access 
          exclusive resources, find your ideal partners, and start shaping the future 
          today.
        </p>
        
        <div className="max-w-2xl mx-auto bg-blue-600/40 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h3 className="text-white text-xl mb-6 font-medium">Enter your email for early access:</h3>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="you@example.com"
              className="flex-grow border-none bg-white/90 text-slate-800 placeholder:text-slate-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Button 
              type="submit" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-8"
            >
              Get Early Access
            </Button>
          </form>
          
          <p className="text-sm text-white/80 mt-4">
            Get notified when we launch. No spam, guaranteed.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
