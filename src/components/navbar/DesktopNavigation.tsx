
interface DesktopNavigationProps {
  scrollToSection: (sectionId: string) => void;
}

const DesktopNavigation = ({ scrollToSection }: DesktopNavigationProps) => {
  return (
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
          The Blueprint
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
          href="#startup" 
          onClick={(e) => { 
            e.preventDefault(); 
            scrollToSection('startups'); 
          }} 
          className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition"
        >
          Spotlight
        </a>
        <a 
          href="#join" 
          onClick={(e) => { 
            e.preventDefault(); 
            scrollToSection('join'); 
          }} 
          className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition"
        >
          Find a CoFounder
        </a>
      </div>
    </div>
  );
};

export default DesktopNavigation;
