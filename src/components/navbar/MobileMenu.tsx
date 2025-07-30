import { useLocation } from 'react-router-dom';
import { navigation } from '../../constants/navigation'; // Import the navigation constant

interface MobileMenuProps {
  isOpen: boolean; // Now controlled by parent
  onClose: () => void; // Function to close menu, provided by parent
  scrollToSection: (sectionId: string) => void;
  isIndex: boolean; // Add the new prop
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen, // Destructure the prop
  onClose, // Destructure the prop
  scrollToSection,
  isIndex, // Destructure the prop
}) => {
  const location = useLocation();

  const handleLinkClick = (item: {
    id: string;
    href: string;
    isInternalLink: boolean;
  }) => {
    if (isIndex && item.isInternalLink) {
      scrollToSection(item.id);
    } else {
      // For external links or internal links on other pages,
      // navigation will be handled by react-router-dom
    }
    // Close the menu after clicking a link by calling the onClose prop
    onClose();
  };

  return (
    <div>
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-background shadow-md z-50">
          <nav className="flex flex-col items-center py-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.isInternalLink ? `/#${item.id}` : item.href}
                onClick={() => handleLinkClick(item)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition ${
                  isIndex && item.isInternalLink
                    ? 'text-muted-foreground hover:text-foreground'
                    : location.pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </a>
            ))}
            {/* Add Login and Sign Up links */} 
            <a
              href="/login"
              className={`block px-3 py-2 rounded-md text-base font-medium transition ${
                location.pathname === '/login'
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={onClose} // Close menu on click
            >
              Login
            </a>
            <a
              href="/signup"
              className={`block px-3 py-2 rounded-md text-base font-medium transition ${
                location.pathname === '/signup'
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={onClose} // Close menu on click
            >
              Sign Up
            </a>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
