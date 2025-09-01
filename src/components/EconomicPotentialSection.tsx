import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, DollarSign, TrendingUp, Globe, Settings, Layers, Shield, Book, Lightbulb, Home, TrendingDown } from 'lucide-react';

const useCounter = (end: number, duration: number): number => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startCount = 0;
    const totalDuration = duration;

    const stepFunc = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = timestamp - startTimestamp;

      const easing = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const easedProgress = easing(Math.min(progress / totalDuration, 1));

      let currentCount;
      if (end === 404.6) {
        currentCount = startCount + easedProgress * (end - startCount);
        setCount(parseFloat(currentCount.toFixed(1)));
      } else {
        currentCount = Math.round(startCount + easedProgress * (end - startCount));
        setCount(currentCount);
      }

      if (progress < totalDuration) {
        requestAnimationFrame(stepFunc);
      }
    };

    requestAnimationFrame(stepFunc);

    return () => {
      // Clean up on component unmount if needed
    };
  }, [end, duration]);


  return count;
};


const EconomicPotentialSection: React.FC = () => {
  const strategicDrivers = [
    { id: 1, text: "Macroeconomic Stability & Financial Reform", description: "Creating the foundations for sustainable growth through monetary policy reform, inflation control, and modern financial infrastructure that supports business innovation.", icon: <Layers size={24} /> },
    { id: 2, text: "Governance & Business Climate Reform", description: "Streamlining regulatory frameworks and reducing bureaucratic friction to enable faster company formation, easier capital flows, and smoother business operations.", icon: <Shield size={24} /> },
    { id: 3, text: "FDI and Diaspora Investment Channels", description: "Building structured pathways for global Iranian capital to flow back into the country through transparent, secure investment vehicles and cross-border partnerships.", icon: <Globe size={24} /> },
    { id: 4, text: "Smart Export Acceleration", description: "Identifying and developing high-value export categories where Iran can compete globally, focusing on knowledge-intensive products and services.", icon: <TrendingUp size={24} /> },
    { id: 5, text: "Tech & Innovation Ecosystems", description: "Cultivating regional tech hubs that connect universities, startups, investors and industry to create innovation clusters that drive economic growth.", icon: <Lightbulb size={24} /> },
    { id: 6, text: "Infrastructure Revamp through Public-Private Partnerships", description: "Modernizing critical infrastructure through innovative public-private partnership models that leverage both government resources and private sector efficiency.", icon: <Home size={24} /> },
    { id: 7, text: "Skills Revolution & Talent Pipeline", description: "Transforming education and professional development to prepare Iran's workforce for high-growth global industries and future economic opportunities.", icon: <Book size={24} /> },
    { id: 8, text: "AgTech and Resource Sustainability", description: "Revolutionizing agricultural productivity and resource management through technology-driven solutions that ensure long-term sustainability.", icon: <Settings size={24} /> },
    { id: 9, text: "Tourism & Experience Economy Expansion", description: "Developing Iran's immense potential in cultural, historical and experiential tourism to create jobs and generate foreign exchange.", icon: <Globe size={24} /> },
    { id: 10, text: "National Task Force for Transformational Growth", description: "Establishing a cross-sector coordinating body to align public and private initiatives toward the shared vision of transformational economic growth.", icon: <Shield size={24} /> }
  ];

  const [openDriverId, setOpenDriverId] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleToggle = (id: number) => {
    setOpenDriverId(openDriverId === id ? null : id);
  };

  const currentGdpAnimated = useCounter(404.6, 2000);
  const targetGdpAnimated = useCounter(3, 3000);
  const growthMultiplierAnimated = useCounter(7, 2500);

  return (
    <section className="py-16 bg-gray-50 dark:bg-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Titles - Centered and with Gradient Color */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-400 dark:from-blue-700 dark:to-blue-300 leading-tight">
          Global Innovators Converge to Build the Future.
          </h2>
          <h3 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Where Global Founders Ignite a Nation’s Future
          </h3>
        </div>

        {/* --- START OF MOVED SECTION --- */}
        {/* Vision and Movement Section - Corrected Styles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
          {/* The Vision Card - Light Background */}
          <div className="bg-white dark:bg-slate-700 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-slate-600">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our North Star</h3>
            <p className="text-gray-700 dark:text-gray-200 mb-4">
              We’ve set our sights on a bold destination: elevating Iran’s GDP from $404 billion to ${targetGdpAnimated} trillion within the next decade. It’s an ambitious leap—but not an impossible one. The real question isn’t it's achievable—it's how.
            </p>
            <p className="text-gray-700 dark:text-gray-200">
              At Hamfounder, we believe the answer begins with us: connecting visionary Iranian minds across continents, sparking deep collaboration, and building ventures that can shape a stronger, more prosperous future for all.
            </p>
          </div>

          {/* The Movement Card - Darker Background */}
          <div className="bg-slate-900 text-white p-8 rounded-lg shadow-xl border border-gray-200 dark:border-slate-600">
            <h3 className="text-2xl font-bold mb-4 text-blue-300 dark:text-blue-300">The Movement</h3>
            <p className="text-slate-300 mb-4">
              Our diaspora holds some of the brightest minds, boldest builders, and most resilient innovators. When united under one shared vision, we have the power to ignite a generational movement.
            </p>
            <p className="text-slate-300">
              That's why Hamfounder isn’t just about finding co-founders or building startups. It’s about building economic transformation through entrepreneurship. We’re aligning the power of our global community with 10 strategic drivers of GDP growth:
            </p>
          </div>
        </div>
        {/* --- END OF MOVED SECTION --- */}

        {/* GDP Numbers Section */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {/* Current GDP Card */}
          <div className="bg-white dark:bg-slate-700 p-6 rounded-lg shadow-xl flex-1 min-w-[280px] max-w-xs border border-gray-200 dark:border-slate-600 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300">CURRENT GDP</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">${currentGdpAnimated} Billion</p>
            <p className="text-md text-gray-500 dark:text-gray-400">Only 0.38% of global economy</p>
          </div>

          {/* Vision Target Card - with Gradient Background */}
          <div className="relative flex-1 min-w-[280px] max-w-xs overflow-hidden rounded-lg shadow-xl border border-gray-200 dark:border-slate-600 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
            <div className="relative z-10 p-6 text-white">
              <p className="text-lg text-blue-100">VISION TARGET</p>
              <p className="text-5xl font-bold">${targetGdpAnimated} Trillion</p>
              <p className="text-md text-blue-100">Within the next decade</p>
            </div>
          </div>

          {/* Growth Multiplier Card */}
          <div className="bg-white dark:bg-slate-700 p-6 rounded-lg shadow-xl flex-1 min-w-[280px] max-w-xs border border-gray-200 dark:border-slate-600 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300">GROWTH MULTIPLIER</p>
            <p className="text-6xl font-bold text-gray-900 dark:text-white">{growthMultiplierAnimated}x</p>
            <p className="text-md text-gray-500 dark:text-gray-400">Increase in economic potential</p>
          </div>
        </div>

        {/* Call to Action Section (New Section) - with Gradient Background */}
        <div className="mb-12 max-w-5xl mx-auto p-8 rounded-lg shadow-xl text-left bg-gradient-to-r from-blue-400 to-blue-900 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 md:mr-8 flex-grow">
              <h3 className="text-2xl font-bold mb-2">We're not just building companies.<br/>We're shaping history.</h3>
              <p className="text-blue-100">
                Join the movement. Help shape the next chapter of Iran's economic story.
              </p>
            </div>
            <a href="/signup" className="inline-block bg-white hover:bg-gray-200 text-blue-800 font-bold py-3 px-8 rounded-lg text-lg transition duration-300 flex-shrink-0">
              Join the movement
            </a>
          </div>
        </div>

        {/* 10 Strategic Drivers Title - Centered with lines */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600 mr-4"></div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex-shrink-0">
            10 Strategic Drivers
          </h3>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600 ml-4"></div>
        </div>

        {/* Strategic Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {strategicDrivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-white dark:bg-slate-700 p-6 rounded-lg shadow transform transition duration-300 hover:shadow-xl text-left border border-gray-200 dark:border-slate-600 group"
            >
              <div className="flex items-start space-x-4 cursor-pointer" onClick={() => handleToggle(driver.id)}>
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-lg font-bold transition-colors duration-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 group-hover:text-blue-700 dark:group-hover:text-blue-200">
                  {driver.icon}
                </div>
                <div className="flex-grow">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {driver.text}
                  </p>
                </div>
                <div className="flex-shrink-0 mt-1 transform transition-transform duration-300">
                  {openDriverId === driver.id ? <ChevronUp className="text-gray-500 dark:text-gray-300" size={24} /> : <ChevronDown className="text-gray-500 dark:text-gray-300" size={24} />}
                </div>
              </div>

              <div
                ref={el => contentRefs.current[driver.id] = el}
                style={{
                  maxHeight: openDriverId === driver.id ? `${contentRefs.current[driver.id]?.scrollHeight || 0}px` : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.5s ease-in-out',
                }}
                className="mt-4 text-gray-600 dark:text-gray-300"
              >
                <p>{driver.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EconomicPotentialSection;