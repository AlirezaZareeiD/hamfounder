import { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import GlobalImpactSection from '@/components/GlobalImpactSection';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/layouts/Layout';
import OurMissionSection from '@/components/OurMissionSection';
// PathToPartnershipSection is commented out
import PathToPartnershipSection from '@/components/PathToPartnershipSection';
// FounderWisdomSection is commented out
// import FounderWisdomSection from '@/components/FounderWisdomSection';
import EcosystemAdvantageSection from '@/components/EcosystemAdvantageSection';
// StartupSpotlightSection is commented out
// import StartupSpotlightSection from '@/components/StartupSpotlightSection';
import FinalCTASection from '@/components/FinalCTASection';
import EcosystemPillarsSection from '@/components/EcosystemPillarsSection';
// PartnersIntegrationsSection is commented out
// import PartnersIntegrationsSection from '@/components/PartnersIntegrationsSection';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import IranEconomicPotentialSection from '@/components/IranEconomicPotentialSection';
import EconomicPotentialSection from '@/components/EconomicPotentialSection';

const Index = () => {
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.substring(1);
      const section = document.getElementById(sectionId);
      if (section) {
        const navbarHeight = 64;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({
          top: sectionTop,
          behavior: 'smooth',
        });
      }
    }
  }, [location.hash]);

  return (
    <>
      <Layout isIndex={true} scrollToSection={scrollToSection}>
        <HeroSection />
        <EconomicPotentialSection />
        <EcosystemAdvantageSection />
        <OurMissionSection />
        <GlobalImpactSection />
        <EcosystemPillarsSection /> 
        {/*
        * These sections were commented out to simplify the landing page.
        * They can be uncommented later if needed.
        */}
         <PathToPartnershipSection />
        {/* <StartupSpotlightSection /> */}
        {/* <PartnersIntegrationsSection /> */}
        {/* <FounderWisdomSection /> */}
        <FinalCTASection />
      </Layout>
      <ScrollToTopButton />
    </>
  );
};

export default Index;