import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { navigation } from '../../constants/navigation'; // Import the navigation constant

interface DesktopNavigationProps {
  scrollToSection: (sectionId: string) => void;
  isIndexPage: boolean; // Add the new prop
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  scrollToSection,
  isIndexPage, // Destructure the prop
}) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('');

  // This effect is primarily for the index page to highlight the active section
  useEffect(() => {
    if (isIndexPage) {
      const handleScroll = () => {
        const sections = navigation
          .filter((item) => item.isInternalLink)
          .map((item) => item.id);
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        for (const sectionId of sections) {
          const section = document.getElementById(sectionId);
          if (section) {
            if (
              section.offsetTop <= scrollPosition &&
              section.offsetTop + section.offsetHeight > scrollPosition
            ) {
              setActiveSection(sectionId);
              break;
            }
          }
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isIndexPage]); // Add isIndexPage to the dependency array

  return (
    <div className="hidden md:flex space-x-4 items-center">
      {navigation.map((item) => (
        <a
          key={item.id}
          href={isIndexPage && item.isInternalLink ? `#${item.id}` : item.href}
          onClick={(e) => {
            if (isIndexPage && item.isInternalLink) {
              e.preventDefault();
              scrollToSection(item.id);
            }
          }}
          className={`text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition ${
            isIndexPage && item.isInternalLink
              ? activeSection === item.id
                ? 'text-foreground'
                : ''
              : location.pathname === item.href
              ? 'text-foreground'
              : ''
          }`}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
};

export default DesktopNavigation;
