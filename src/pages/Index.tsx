import { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import GlobalImpactSection from '@/components/GlobalImpactSection';
import { useLocation } from 'react-router-dom'; // Import useLocation
import Layout from '@/components/layouts/Layout';
import OurMissionSection from '@/components/OurMissionSection';
import PathToPartnershipSection from '@/components/PathToPartnershipSection';
import FounderWisdomSection from '@/components/FounderWisdomSection';
import EcosystemAdvantageSection from '@/components/EcosystemAdvantageSection';
import StartupSpotlightSection from '@/components/StartupSpotlightSection';
import FinalCTASection from '@/components/FinalCTASection';
// Footer import removed as it's now in Layout
// import Footer from '@/components/Footer';
import EcosystemPillarsSection from '@/components/EcosystemPillarsSection'; // Assuming this import is needed
import PartnersIntegrationsSection from '@/components/PartnersIntegrationsSection';
import ScrollToTopButton from '@/components/ScrollToTopButton';
// Kept the EconomicPotentialSection import for now
import IranEconomicPotentialSection from '@/components/IranEconomicPotentialSection';
import EconomicPotentialSection from '@/components/EconomicPotentialSection';

const Index = () => {
  const location = useLocation(); // Use the useLocation hook


  // Fix for scroll position on page load

  // Add the scrollToSection function here
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // You might need to adjust scroll position based on fixed header height
      // This logic is better handled within scrollToSection itself or by adjusting section IDs
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };


  // Add useEffect to handle scrolling to section based on URL hash
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.substring(1); // Remove the '#'
      const section = document.getElementById(sectionId);
      if (section) {
        // Adjust scroll position to account for the fixed navbar height
        // Assuming navbar height is 64px (h-16)
        const navbarHeight = 64; // Or dynamically calculate if needed
        const sectionTop = section.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({
          top: sectionTop,
          behavior: 'smooth',
        });
      }
    }
  }, [location.hash]); // Re-run effect when location.hash changes

  return (
    // Wrap both Layout and ScrollToTopButton in a Fragment
    <>
      <Layout isIndex={true} scrollToSection={scrollToSection}>
        {/* Content sections are direct children of Layout */}
        <HeroSection />
        {/* Replaced EconomicPotentialSection with IranEconomicPotentialSection */}
        <EconomicPotentialSection /> {/* Temporarily using EconomicPotentialSection to ensure the page renders */}
        <GlobalImpactSection />
        <OurMissionSection />
        {/* EcosystemPillarsSection was removed in a previous step - adding it back here */}
        <EcosystemPillarsSection />
        <PathToPartnershipSection />
        <StartupSpotlightSection />
        <PartnersIntegrationsSection />
        <EcosystemAdvantageSection />
        <FounderWisdomSection />
        <FinalCTASection />
        {/* ScrollToTopButton remains outside of Layout as it's typically fixed */}
        {/* Footer is now managed within the Layout component */}
      </Layout>
      {/* ScrollToTopButton should be here, outside of the Layout component */}
      <ScrollToTopButton />
    </> // Closing Fragment tag
  );
};

export default Index;
