
import { Globe, BookOpen, Rocket, Award } from 'lucide-react';

const EcosystemPillarsSection = () => {
  const pillars = [
    {
      icon: Globe,
      title: "ارتباط",
      description: "اتصال استعدادهای جهانی و پر کردن شکاف دیاسپورا. یافتن هم‌بنیان‌گذاران، مربیان، و اعضای تیم که درک فرهنگی و چشم‌انداز مشترک دارند."
    },
    {
      icon: BookOpen,
      title: "یادگیری",
      description: "دسترسی به دانش مشترک و منابع مربیگری که به طور خاص برای کارآفرینان ایرانی مواجه با چالش‌های منحصر به فرد جهانی طراحی شده است."
    },
    {
      icon: Rocket,
      title: "ساخت",
      description: "ایجاد کسب‌وکارهای با تأثیر جهانی با بهره‌گیری از اکوسیستم حمایتی و تخصص جمعی ما."
    },
    {
      icon: Award,
      title: "رشد",
      description: "مقیاس‌پذیری کسب‌وکارتان با منابع استراتژیک و ارتباطاتی که برای بنیان‌گذاران ایرانی در حال گسترش بین‌المللی طراحی شده است."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            چهار رکن اساسی اکوسیستم هم‌فاندر
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            پلتفرم یکپارچه ما فراتر از همسان‌سازی بنیان‌گذاران، از کل سفر کارآفرینی شما پشتیبانی می‌کند.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <div 
              key={index} 
              className="bg-slate-800/20 rounded-lg border border-slate-700 p-6 transition-all hover:transform hover:scale-105 hover:border-blue-500/50"
            >
              <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <pillar.icon className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{pillar.title}</h3>
              <p className="text-gray-300">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcosystemPillarsSection;
