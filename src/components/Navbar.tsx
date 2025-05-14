
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const navbarRef = useRef<HTMLElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Add offset for fixed header
      const navbarHeight = navbarRef.current?.offsetHeight || 0;
      const sectionTop = section.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: sectionTop,
        behavior: "smooth",
      });
    }
    
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen && 
        navbarRef.current && 
        !navbarRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);
  
  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <nav 
      ref={navbarRef}
      className={`bg-background/90 backdrop-blur-md z-50 sticky top-0 transition-all duration-300 ${
        isScrolled ? 'shadow-md border-b border-border/40' : 'border-b border-border/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <a 
              href="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                scrollToSection('top'); 
              }} 
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500"
            >
              Hamfounder
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <a 
                href="#mission" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  scrollToSection('mission'); 
                }} 
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Our Mission
              </a>
              <a 
                href="#how-it-works" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  scrollToSection('how-it-works'); 
                }} 
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition"
              >
                How It Works
              </a>
              <a 
                href="#global-network" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  scrollToSection('global-network'); 
                }} 
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Global Network
              </a>
              <a 
                href="#startups" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  scrollToSection('startups'); 
                }} 
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Startups
              </a>
              <a 
                href="#join" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  scrollToSection('join'); 
                }} 
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Join Us
              </a>
            </div>
          </div>
          
          {/* User Navigation */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-3">
              <Link 
                to="/login" 
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-[#0ea5e9] hover:bg-[#0891d2] text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Improved animation and touch targets */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-md z-50 animate-fade-in overflow-auto">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#mission"
              onClick={(e) => { 
                e.preventDefault(); 
                scrollToSection('mission'); 
              }}
              className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium"
            >
              Our Mission
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => { 
                e.preventDefault(); 
                scrollToSection('how-it-works'); 
              }}
              className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium"
            >
              How It Works
            </a>
            <a
              href="#global-network"
              onClick={(e) => { 
                e.preventDefault(); 
                scrollToSection('global-network'); 
              }}
              className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium"
            >
              Global Network
            </a>
            <a
              href="#startups"
              onClick={(e) => { 
                e.preventDefault(); 
                scrollToSection('startups'); 
              }}
              className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium"
            >
              Startups
            </a>
            <a
              href="#join"
              onClick={(e) => { 
                e.preventDefault(); 
                scrollToSection('join'); 
              }}
              className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium"
            >
              Join Us
            </a>
          </div>
          <div className="pt-4 pb-16 border-t border-border/40">
            <div className="px-2 space-y-3">
              <Link
                to="/login"
                onClick={(e) => { setIsMenuOpen(false); }}
                className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={(e) => { setIsMenuOpen(false); }}
                className="bg-[#0ea5e9] text-white block px-3 py-4 rounded-md text-base font-medium my-2 mx-3 text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
