import { useState, useEffect } from 'react';

/**
 * Custom hook for tracking the state of a media query.
 * @param {string} query - The media query string.
 * @returns {boolean} - True if the media query matches, false otherwise.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    try {
      mediaQueryList.addEventListener('change', listener);
    } catch (e) {
      // Fallback for older browsers
      mediaQueryList.addListener(listener);
    }
    
    // Re-check on mount in case it changed since initial state was set
    setMatches(mediaQueryList.matches);

    return () => {
      try {
        mediaQueryList.removeEventListener('change', listener);
      } catch (e) {
        // Fallback for older browsers
        mediaQueryList.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}
