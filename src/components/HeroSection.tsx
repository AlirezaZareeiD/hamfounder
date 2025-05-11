
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-slate-900 -z-10">
        {/* Decorative elements */}
        <div className="absolute right-[10%] top-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute left-[15%] bottom-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 mb-6">
            اکوسیستم جهانی نوآوران ایرانی برای ساختن آینده، با هم
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            فراتر از یک پلتفرم صرف برای یافتن هم‌بنیان‌گذار. به جامعه‌ای پویا بپیوندید که تمام مسیر کارآفرینی شما را پشتیبانی می‌کند—از ایده تا تأثیرگذاری جهانی. با قدرت شبکه جهانی ایرانیان، یاد بگیرید، رشد کنید و موفق شوید.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="default" 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
            >
              کشف اکوسیستم
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-400 text-gray-300 hover:bg-gray-800/50"
            >
              پیوستن به دسترسی اولیه
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
