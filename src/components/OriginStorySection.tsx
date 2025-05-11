
import React, { useEffect, useRef } from 'react';

const OriginStorySection = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const checkItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === headingRef.current || entry.target === contentRef.current) {
              entry.target.classList.add('opacity-100', 'translate-x-0');
              entry.target.classList.remove('opacity-0', 'translate-x-[-50px]');
            } else if (entry.target === pillarsRef.current) {
              entry.target.classList.add('opacity-100', 'translate-x-0');
              entry.target.classList.remove('opacity-0', 'translate-x-[50px]');
            } else {
              entry.target.classList.add('opacity-100', 'translate-y-0');
              entry.target.classList.remove('opacity-0', 'translate-y-8');
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (headingRef.current) observer.observe(headingRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    if (pillarsRef.current) observer.observe(pillarsRef.current);
    
    checkItemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      if (headingRef.current) observer.unobserve(headingRef.current);
      if (contentRef.current) observer.unobserve(contentRef.current);
      if (pillarsRef.current) observer.unobserve(pillarsRef.current);
      
      checkItemsRef.current.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  return (
    <section id="why-hamfounder" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Story Content */}
          <div className="lg:w-1/2">
            <div ref={headingRef} className="opacity-0 translate-x-[-50px] transition-all duration-700 ease-out">
              <div className="mb-6 inline-block">
                <span className="bg-blue-500/20 text-blue-400 py-1 px-4 rounded-full text-sm font-medium">Our Vision</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                From Shared Journeys to United Future
              </h2>
            </div>
            
            <div ref={contentRef} className="prose prose-lg text-gray-300 opacity-0 translate-x-[-50px] transition-all duration-700 ease-out delay-200">
              <p className="mb-4">
                Thousands of miles from home, motivated by dreams, Iranian innovators around the world face unique challenges. Finding the right co-founder, navigating complex ecosystems, accessing global networks... these problems are familiar to us. We've lived them.
              </p>
              
              <p className="mb-4">
                Hamfounder was born from this shared experience. We're more than a platform; we're nurturing a global community rooted in mutual support, shared knowledge, and a firm belief in Iranian potential.
              </p>
              
              <p>
                Our mission is to empower your journey by connecting you with the people and resources needed to build businesses that not only succeed but inspire.
              </p>
            </div>
          </div>
          
          {/* Core Pillars */}
          <div ref={pillarsRef} className="lg:w-1/2 bg-slate-800/10 rounded-xl border border-slate-700 p-8 opacity-0 translate-x-[50px] transition-all duration-700 ease-out delay-300">
            <h3 className="text-xl font-semibold text-white mb-6">Why Hamfounder for Iranian Entrepreneurs?</h3>
            
            <div className="space-y-5">
              {[
                {
                  title: "Deep understanding of shared challenges:",
                  content: "From visa obstacles and sanctions to cultural differences, we recognize the unique challenges Iranian entrepreneurs face."
                },
                {
                  title: "Targeted networking:",
                  content: "Connect with individuals who not only have complementary skills but understand shared cultural background and perspective."
                },
                {
                  title: "Cultural support:",
                  content: "Resources, guidance, and tools designed for the unique challenges Iranian entrepreneurs face in the global arena."
                },
                {
                  title: "From diaspora to global impact:",
                  content: "Turn the worldwide dispersion of Iranians into a powerful advantage, with a network that transcends geographical limitations."
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  ref={el => checkItemsRef.current[index] = el}
                  className={`flex items-start opacity-0 translate-y-8 transition-all duration-500 ease-out`}
                  style={{ transitionDelay: `${400 + index * 150}ms` }}
                >
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex-shrink-0 flex items-center justify-center mr-4 mt-1">
                    <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-300">
                    <strong>{item.title}</strong> {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OriginStorySection;
