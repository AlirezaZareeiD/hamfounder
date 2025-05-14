
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileMenu from './MobileMenu';
import DesktopNavigation from './DesktopNavigation';
import UserNavigation from './UserNavigation';

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
          <DesktopNavigation scrollToSection={scrollToSection} />
          
          {/* User Navigation */}
          <UserNavigation />
          
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

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        scrollToSection={scrollToSection} 
      />
    </nav>
  );
};

export default Navbar;
