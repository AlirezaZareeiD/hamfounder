import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';

interface LayoutProps {
  children: React.ReactNode;
  // Add any other props Navbar or Footer might need, e.g., scrollToSection, isIndex
  // For now, let's assume Navbar needs isIndex and scrollToSection
  isIndex?: boolean;
  scrollToSection?: (sectionId: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isIndex, scrollToSection }) => {
  // We'll pass necessary props down to Navbar and Footer
  // Note: scrollToSection might only be relevant for the index page,
  // consider how to handle this if Layout is used on non-index pages.
  // For now, we'll pass it if provided.

  return (
    <div className="min-h-screen flex flex-col">
      {/* Pass relevant props to Navbar */}
      <Navbar isIndex={isIndex || false} scrollToSection={scrollToSection || (() => {})} />

      {/* Main content area with padding-top */}
      {/* The padding-top class 'pt-16' corresponds to h-16 in Tailwind's default spacing scale */}
      <main className="flex-grow pt-16">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;