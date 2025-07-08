import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar/Navbar';
import HeroSection from '@/components/HeroSection';
import GlobalImpactSection from '@/components/GlobalImpactSection';
import OurMissionSection from '@/components/OurMissionSection';
import PathToPartnershipSection from '@/components/PathToPartnershipSection';
import FounderWisdomSection from '@/components/FounderWisdomSection';
import EcosystemAdvantageSection from '@/components/EcosystemAdvantageSection';
import StartupSpotlightSection from '@/components/StartupSpotlightSection';
import FinalCTASection from '@/components/FinalCTASection';
import Footer from '@/components/Footer';
import EcosystemPillarsSection from '@/components/EcosystemPillarsSection';
import PartnersIntegrationsSection from '@/components/PartnersIntegrationsSection';
import ScrollToTopButton from '@/components/ScrollToTopButton';
// Kept the EconomicPotentialSection import for now
import IranEconomicPotentialSection from '@/components/IranEconomicPotentialSection';
import EconomicPotentialSection from '@/components/EconomicPotentialSection';

const Index = () => {

  // Fix for scroll position on page load

  // Add the scrollToSection function here
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Pass the scrollToSection function to Navbar */}
      <Navbar scrollToSection={scrollToSection} isIndexPage={true} />
      <main>
        <HeroSection />
        {/* Replaced EconomicPotentialSection with IranEconomicPotentialSection */}
        <EconomicPotentialSection /> {/* Temporarily using EconomicPotentialSection to ensure the page renders */}
        <GlobalImpactSection />
        <OurMissionSection />
        <EcosystemPillarsSection />
        <PathToPartnershipSection />
        <StartupSpotlightSection />
        <PartnersIntegrationsSection />
        <EcosystemAdvantageSection />
        <FounderWisdomSection />
        <FinalCTASection />
      </main>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
};

export default Index;
