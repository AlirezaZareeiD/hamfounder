
import { useEffect, useRef } from 'react';

const OurMissionSection = () => {
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
    <section id="mission" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Side - Vision Content */}
          <div className="lg:w-1/2">
            <div ref={headingRef} className="opacity-0 translate-x-[-50px] transition-all duration-700 ease-out">
              <div className="mb-6 inline-block">
                <span className="bg-blue-100 text-blue-600 py-1 px-4 rounded-full text-sm font-medium">Our Mission</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-500">
                Unlocking the 'Global Iranians Advantage'
              </h2>
            </div>
            
            <div ref={contentRef} className="prose prose-lg text-gray-600 opacity-0 translate-x-[-50px] transition-all duration-700 ease-out delay-200">
              <p className="mb-4">
                The Iranian diaspora—a multi-trillion dollar ecosystem of talent, capital, and knowledge—remains fragmented. A persistent trust deficit and lack of a central nexus prevent high-value collaborations. Finding a culturally-aligned co-founder or a trusted investor is a significant challenge.
              </p>
              
              <p className="mb-4">
                Hamfounder is the solution. We are building a purpose-driven movement and a next-gen platform to empower Iranian-descent entrepreneurs. We are operationalizing trust as our core API to turn the global redistribution of Iranian talent into a strategic asset.
              </p>
            </div>
          </div>
          
          {/* Right Side - Benefits for Iranian Entrepreneurs */}
          <div ref={pillarsRef} className="lg:w-1/2 bg-gray-100 rounded-xl p-8 opacity-0 translate-x-[50px] transition-all duration-700 ease-out delay-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Our Four Integrated Hubs</h3>
            
            <div className="space-y-5">
              {[
                {
                  title: "Innovation & Co-creation:",
                  content: "Find co-founders based on skills, values, and cultural compatibility."
                },
                {
                  title: "Growth & Mentorship:",
                  content: "Access elite diaspora mentors and high-level operational knowledge."
                },
                {
                  title: "Investment & Opportunities:",
                  content: "Connect with a vetted network of diaspora investors in a trusted marketplace."
                },
                {
                  title: "Community & Events:",
                  content: "Foster trust and belonging through online hubs and offline local chapters."
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  ref={el => checkItemsRef.current[index] = el}
                  className={`flex items-start opacity-0 translate-y-8 transition-all duration-500 ease-out`}
                  style={{ transitionDelay: `${400 + index * 150}ms` }}
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mr-4 mt-1">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium">{item.title}</span> {item.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMissionSection;
