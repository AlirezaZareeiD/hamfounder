import { Link } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  scrollToSection: (sectionId: string) => void;
}

const MobileMenu = ({ isOpen, onClose, scrollToSection }: MobileMenuProps) => {

  // Handler to prevent event bubbling
  const handleClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    scrollToSection(sectionId);
    onClose();
  };

  return (
    <div 
      className={`md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-md z-50 overflow-auto transition-all duration-300 ease-in-out min-h-screen w-screen ${
 isOpen ? 'opacity-100 translate-y-0 animate-fade-in' : 'opacity-0 -translate-y-full pointer-events-none'
 }`}
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      <div className="px-2 pt-2 pb-3 space-y-3 sm:px-3">

        <a
          href="#mission"
          onClick={(e) => handleClick(e, 'mission')}
          className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium border-b border-border/40 shadow-sm"
        >
          Our Mission
        </a>

        <a
          href="#how-it-works"
          onClick={(e) => handleClick(e, 'how-it-works')}
          className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium border-b border-border/40 shadow-sm"
        >
          How It Works
        </a>

        <a
          href="#global-network"
          onClick={(e) => handleClick(e, 'global-network')}
          className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium border-b border-border/40 shadow-sm"
        >
          Global Network
        </a>

        <a
          href="#startups"
          onClick={(e) => handleClick(e, 'startups')}
          className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium border-b border-border/40 shadow-sm"
        >
          Startups
        </a>

        <a
          href="#join"
          onClick={(e) => handleClick(e, 'join')}
          className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium border-b border-border/40 shadow-sm"
        >
          Join Us
        </a>

      </div>

      <div className="pb-8 border-t border-border/40">
        <div className="px-2 space-y-3">

          <Link
            to="/login"
            onClick={() => onClose()}
            className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium border-b border-border/40 shadow-sm"
          >
            Login
          </Link>

          <Link
            to="/signup"
            onClick={() => onClose()}
            className="text-muted-foreground hover:text-foreground block px-3 py-4 rounded-md text-base font-medium"
          >
            Sign Up
          </Link>

        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
