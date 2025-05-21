
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

  
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
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
