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
  // Remove local isOpen state
  // const [isOpen, setIsOpen] = useState(false);

  // Remove local toggleMenu function
  // const toggleMenu = () => {
  //   setIsOpen(!isOpen);
  // };

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
    // Add a single parent div here to wrap the conditional rendering
    <div>
      {/* The mobile menu button is now rendered in Navbar.tsx */}

      {/* Conditionally render the menu content based on the isOpen prop */}
      {isOpen && (
        // The positioning and styling of this div are important for the overlay
        <div className="absolute top-16 left-0 w-full bg-background shadow-md z-50">
          <nav className="flex flex-col items-center py-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={isIndex && item.isInternalLink ? `#${item.id}` : item.href}
                onClick={() => handleLinkClick(item)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition ${
                  isIndex && item.isInternalLink
                    ? // You might need to manage active section state in MobileMenu as well if you want highlighting
                      // For now, I'll remove the activeSection check as it's not managed locally
                      // activeSection === item.id
                      // ? 'text-foreground'
                      // :
                      'text-muted-foreground hover:text-foreground'
                    : location.pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div> // Close the parent div here
  );
};

export default MobileMenu;
