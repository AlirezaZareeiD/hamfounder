import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile'; // Assuming this hook works correctly
import MobileMenu from './MobileMenu';
import DesktopNavigation from './DesktopNavigation';
import UserNavigation from './UserNavigation'; // Assuming UserNavigation import path
import { Logo } from '../Logo'; // Change from default import to named import

interface NavbarProps {
  scrollToSection: (sectionId: string) => void; // Keep existing prop
  isIndex: boolean; // Add the isIndex prop
}

const Navbar: React.FC<NavbarProps> = ({
  scrollToSection,
  isIndex, // Destructure the new prop
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile(); // Using your existing hook
  const navbarRef = useRef<HTMLElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Keep your existing scrollToSection logic
  // const scrollToSection = (sectionId: string) => {
  //   const section = document.getElementById(sectionId);
  //   if (section) {
  //     // Add offset for fixed header
  //     const navbarHeight = navbarRef.current?.offsetHeight || 0;
  //     const sectionTop = section.offsetTop - navbarHeight;

  //     window.scrollTo({
  //       top: sectionTop,
  //       behavior: "smooth",
  //     });
  //   }

  //   if (isMobile) {
  //     setIsMenuOpen(false);
  //   }
  // };
  // NOTE: The scrollToSection function should be defined in the parent component (Index.tsx)
  // and passed down as a prop, as we discussed before.
  // I've commented out the local definition to emphasize it should come from props.


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
      className={`bg-background/90 backdrop-blur-md z-50 fixed top-0 left-0 right-0 transition-all duration-300 ${
        isScrolled ? 'shadow-md border-b border-border/40' : 'border-b border-border/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
             {/* Assuming Logo component handles navigation to the top */}
             <Logo />
          </div>

          {/* Navigation based on screen size */}
          {isMobile ? (
            // Mobile view: Show mobile menu button and the MobileMenu component
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
               {/* Mobile Menu (rendered based on isMenuOpen state) */}
              {isMenuOpen && (
                <MobileMenu
                  isOpen={isMenuOpen}
                  onClose={() => setIsMenuOpen(false)}
                  scrollToSection={scrollToSection}
                  isIndex={isIndex}
                />
              )}
            </div>
          ) : (
            // Desktop view: Show desktop navigation and user navigation
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <DesktopNavigation scrollToSection={scrollToSection} isIndex={isIndex} />

              {/* User Navigation */}
              <UserNavigation />
            </div>
          )}
        </div>
      </div>
      {/* The MobileMenu component is now rendered conditionally inside the mobile view block, so we remove this separate rendering */}
      {/*
      {isMobile && (
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          scrollToSection={scrollToSection}
          isIndex={isIndex} // Pass the isIndex prop
        />
      )}
      */}
    </nav>
  );
};

export default Navbar;
