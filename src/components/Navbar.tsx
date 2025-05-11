
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  // Close mobile menu when clicking on a navigation link
  const handleNavLinkClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };
  
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

  return (
    <nav className={`bg-background/80 backdrop-blur-md z-50 sticky top-0 transition-all duration-300 ${
      isScrolled ? 'shadow-md border-b border-border/40' : 'border-b border-border/40'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Hamfounder
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <a href="#mission" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition">
                Our Mission
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition">
                How It Works
              </a>
              <a href="#global-network" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition">
                Global Network
              </a>
              <a href="#startups" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition">
                Startups
              </a>
              <a href="#find-co-founder" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition">
                Find Co-Founder
              </a>
            </div>
          </div>
          
          {/* User Navigation */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-3">
              <a href="#login" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition">
                Login
              </a>
              <a
                href="#sign-up"
                className="bg-[#0ea5e9] hover:bg-[#0891d2] text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Sign Up
              </a>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Improved animation and touch targets */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border/40 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#mission"
              className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium"
              onClick={handleNavLinkClick}
            >
              Our Mission
            </a>
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium"
              onClick={handleNavLinkClick}
            >
              How It Works
            </a>
            <a
              href="#global-network"
              className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium"
              onClick={handleNavLinkClick}
            >
              Global Network
            </a>
            <a
              href="#startups"
              className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium"
              onClick={handleNavLinkClick}
            >
              Startups
            </a>
            <a
              href="#find-co-founder"
              className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium"
              onClick={handleNavLinkClick}
            >
              Find Co-Founder
            </a>
          </div>
          <div className="pt-4 pb-5 border-t border-border/40">
            <div className="px-2 space-y-3">
              <a
                href="#login"
                className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium"
                onClick={handleNavLinkClick}
              >
                Login
              </a>
              <a
                href="#sign-up"
                className="bg-[#0ea5e9] text-white block px-3 py-4 rounded-md text-base font-medium my-2 mx-3 text-center"
                onClick={handleNavLinkClick}
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
