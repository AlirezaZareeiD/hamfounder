
import { useState, useEffect, useRef } from 'react';

interface CounterAnimationProps {
  targetNumber: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

const CounterAnimation = ({ 
  targetNumber, 
  prefix = "", 
  suffix = "", 
  duration = 2000 
}: CounterAnimationProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number | undefined;
    let animationFrame: number;
    const startValue = 0;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(progress * (targetNumber - startValue) + startValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };
    
    animationFrame = requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [targetNumber, duration, isVisible]);

  return (
    <div ref={counterRef} className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
};

export default CounterAnimation;
