
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
        title: "ایمیل نامعتبر",
        description: "لطفاً یک آدرس ایمیل معتبر وارد کنید.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(email);
    toast({
      title: "موفق!",
      description: "از پیوستن شما به لیست دسترسی زودهنگام سپاسگزاریم.",
      variant: "default"
    });
    setEmail('');
  };
  
  return (
    <section className="py-16 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-background -z-10">
        {/* Decorative elements */}
        <div className="absolute right-[10%] top-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute left-[15%] bottom-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          آماده ساختن میراث خود هستید؟
        </h2>
        
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          به لیست دسترسی زودهنگام ما بپیوندید و اولین کسی باشید که هنگام راه‌اندازی، با هم‌بنیان‌گذار ایده‌آل خود ارتباط برقرار می‌کند.
          با هم، نسل بعدی کسب‌وکارهای پیشرو ایرانی را خواهیم ساخت که جهان را تغییر می‌دهند.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Input
            type="email"
            placeholder="آدرس ایمیل خود را وارد کنید"
            className="flex-grow border-gray-700 bg-slate-800/80 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6"
          >
            ثبت‌نام زودهنگام
          </Button>
        </form>
        
        <p className="text-sm text-gray-400 mt-4">
          ما به حریم خصوصی شما احترام می‌گذاریم. بدون اسپم، فقط به‌روزرسانی درباره راه‌اندازی و جامعه ما.
        </p>
      </div>
    </section>
  );
};

export default FinalCTASection;
