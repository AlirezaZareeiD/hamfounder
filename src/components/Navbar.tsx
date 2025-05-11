
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-background z-50 sticky top-0 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Hamfounder
            </span>
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
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border/40">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#mission"
              className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Mission
            </a>
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#global-network"
              className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Global Network
            </a>
            <a
              href="#startups"
              className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Startups
            </a>
            <a
              href="#find-co-founder"
              className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Co-Founder
            </a>
          </div>
          <div className="pt-4 pb-3 border-t border-border/40">
            <div className="px-2 space-y-1">
              <a
                href="#login"
                className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </a>
              <a
                href="#sign-up"
                className="bg-[#0ea5e9] text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
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
