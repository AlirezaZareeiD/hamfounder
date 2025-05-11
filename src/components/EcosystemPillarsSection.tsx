
import { Globe, BookOpen, Rocket, Award } from 'lucide-react';

const EcosystemPillarsSection = () => {
  const pillars = [
    {
      icon: Globe,
      title: "ارتباط",
      description: "استعدادهای جهانی را به هم متصل کنید و شکاف پراکندگی دیاسپورا را پر کنید. هم‌بنیان‌گذاران، مربیان و اعضای تیمی پیدا کنید که درک فرهنگی و چشم‌انداز مشترک دارند."
    },
    {
      icon: BookOpen,
      title: "یادگیری",
      description: "به دانش مشترک و منابع مربیگری دسترسی پیدا کنید که به طور خاص برای کارآفرینان ایرانی که با چالش‌های منحصر به فرد جهانی مواجه هستند، طراحی شده‌اند."
    },
    {
      icon: Rocket,
      title: "ساختن",
      description: "با بهره‌گیری از اکوسیستم حمایتی و تخصص جمعی ما، کسب‌وکارهای تاثیرگذار در سطح جهانی ایجاد کنید."
    },
    {
      icon: Award,
      title: "رشد",
      description: "کسب‌وکار خود را با منابع استراتژیک و ارتباطات طراحی شده برای بنیان‌گذاران ایرانی که در حال گسترش بین‌المللی هستند، توسعه دهید."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            چهار رکن اکوسیستم همفاندر
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            پلتفرم یکپارچه ما فراتر از تطبیق هم‌بنیان‌گذار است و کل مسیر کارآفرینی شما را پشتیبانی می‌کند.
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
