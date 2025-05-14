
import { Link } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  scrollToSection: (sectionId: string) => void;
}

const MobileMenu = ({ isOpen, onClose, scrollToSection }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
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
            onClick={() => onClose()}
            className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={() => onClose()}
            className="bg-[#0ea5e9] text-white block px-3 py-4 rounded-md text-base font-medium my-2 mx-3 text-center"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
