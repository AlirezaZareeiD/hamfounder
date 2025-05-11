
import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Function to update the state based on window width
    const updateSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Initial check
    updateSize();
    
    // Add event listener
    window.addEventListener("resize", updateSize);
    
    // Use matchMedia as a fallback for more reliability
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(mql.matches);
    };
    
    // Modern browsers support addEventListener on MediaQueryList
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      // Older browsers use deprecated addListener
      // @ts-ignore (for older browsers compatibility)
      mql.addListener(onChange);
    }
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", updateSize);
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        // @ts-ignore (for older browsers compatibility)
        mql.removeListener(onChange);
      }
    };
  }, []);

  return !!isMobile;
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT);
    };
    
    updateSize();
    window.addEventListener("resize", updateSize);
    
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return !!isTablet;
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < MOBILE_BREAKPOINT) {
        setBreakpoint('mobile');
      } else if (width < TABLET_BREAKPOINT) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };
    
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
}
