
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

/*
Removed unused imports:
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
*/
/* Removed unused interface FinalCTASectionProps and onSubmit, submitted props */
const FinalCTASection = () => {
  /* Removed unused state and handleSubmit function
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(email); // This onSubmit prop is no longer used
    setEmail(''); // This email state is no longer used
  }; */
  return (
    <section id="join" className="py-12 md:py-16 relative bg-[#2d3db7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
          Ready to Build Your Legacy?
        </h2>
        
        <p className="text-base md:text-lg text-white mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
          Join a thriving network of Iranian innovators. Sign up today to access exclusive resources, connect with potential co-founders, and start building your future.
        </p>
        
        <div className="max-w-2xl mx-auto bg-blue-600/40 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg">
          {/* Removed email input related heading */}
          {/* <h3 className="text-white text-lg md:text-xl mb-4 md:mb-6 font-medium">Enter your email for early access:</h3> */}

          {/* Replace form with a Link to the signup page */}
          {/* <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-lg mx-auto"> ... </form> */}
          <div className="flex flex-col items-center"> {/* Added a div for centering */}
            <Link to="/signup"> {/* Link to the signup page */}
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-8 py-3 h-12 text-lg" // Increased text size for prominence
              >
                Join the Community
              </Button>
            </Link>
          </div>

          <div className="text-sm text-white/80 mt-6 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <p>
              Your future CoFounder might be one click away!
            </p>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;


              
   
