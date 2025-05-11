
import React from 'react';

const OriginStorySection = () => {
  return (
    <section id="why-hamfounder" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Story Content */}
          <div className="lg:w-1/2">
            <div className="mb-6 inline-block">
              <span className="bg-blue-500/20 text-blue-400 py-1 px-4 rounded-full text-sm font-medium">بینش ما</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              از سفرهای مشترک تا آینده‌ای متحد
            </h2>
            
            <div className="prose prose-lg text-gray-300">
              <p className="mb-4">
                هزاران کیلومتر دور از خانه، با انگیزه رویاها، نوآوران ایرانی در سراسر جهان با چالش‌های منحصر به فردی روبرو هستند. یافتن هم‌بنیان‌گذار مناسب، هدایت در اکوسیستم‌های پیچیده، دسترسی به شبکه‌های جهانی... این مشکلات برای ما آشناست. ما آن را تجربه کرده‌ایم.
              </p>
              
              <p className="mb-4">
                هم‌فاندر از این تجربه مشترک متولد شد. ما فراتر از یک پلتفرم هستیم؛ ما یک جامعه جهانی را پرورش می‌دهیم که ریشه در حمایت متقابل، دانش مشترک و اعتقاد راسخ به پتانسیل ایرانیان دارد.
              </p>
              
              <p>
                ماموریت ما توانمندسازی مسیر شماست، با اتصال شما به افراد و منابع مورد نیاز برای ساختن کسب‌وکارهایی که نه تنها موفق می‌شوند، بلکه الهام‌بخش هستند.
              </p>
            </div>
          </div>
          
          {/* Core Pillars */}
          <div className="lg:w-1/2 bg-slate-800/10 rounded-xl border border-slate-700 p-8">
            <h3 className="text-xl font-semibold text-white mb-6">چرا هم‌فاندر برای کارآفرینان ایرانی؟</h3>
            
            <div className="space-y-5">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex-shrink-0 flex items-center justify-center mr-4 mt-1">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300">
                  <strong>درک عمیق چالش‌های مشترک:</strong> از موانع ویزا و تحریم‌ها تا تفاوت‌های فرهنگی، ما چالش‌های منحصر به فردی که کارآفرینان ایرانی با آن مواجه هستند را می‌شناسیم.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex-shrink-0 flex items-center justify-center mr-4 mt-1">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300">
                  <strong>شبکه‌سازی هدفمند:</strong> با افرادی ارتباط برقرار کنید که نه تنها مهارت‌های مکمل دارند، بلکه زمینه فرهنگی و دیدگاه مشترک را درک می‌کنند.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex-shrink-0 flex items-center justify-center mr-4 mt-1">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300">
                  <strong>پشتیبانی فرهنگی:</strong> منابع، راهنمایی و ابزارهای طراحی شده برای چالش‌های منحصر به فردی که کارآفرینان ایرانی در عرصه جهانی با آن روبرو هستند.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex-shrink-0 flex items-center justify-center mr-4 mt-1">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300">
                  <strong>از دیاسپورا تا تأثیر جهانی:</strong> پراکندگی جهانی ایرانیان را به یک مزیت قدرتمند تبدیل کنید، با شبکه‌ای که از محدودیت‌های جغرافیایی فراتر می‌رود.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OriginStorySection;
