
import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar/Navbar';
import HeroSection from '@/components/HeroSection';
import IranEconomicPotentialSection from '@/components/IranEconomicPotentialSection';
import GlobalImpactSection from '@/components/GlobalImpactSection';
import OurMissionSection from '@/components/OurMissionSection';
import PathToPartnershipSection from '@/components/PathToPartnershipSection';
import FounderWisdomSection from '@/components/FounderWisdomSection';
import EcosystemAdvantageSection from '@/components/EcosystemAdvantageSection';
import StartupSpotlightSection from '@/components/StartupSpotlightSection';
import FinalCTASection from '@/components/FinalCTASection';
import Footer from '@/components/Footer';
import EcosystemPillarsSection from '@/components/EcosystemPillarsSection';
import TrustBuildingSection from '@/components/TrustBuildingSection';
import PartnersIntegrationsSection from '@/components/PartnersIntegrationsSection';
import FounderRoadmapSection from '@/components/FounderRoadmapSection';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [submitted, setSubmitted] = useState(false);
  
  const handleEmailSubmit = (email: string) => {
    // Handle email submission
    console.log("Email submitted:", email);
    setSubmitted(true);
    
    // Show success toast notification
    toast({
      title: "Success!",
      description: "Thank you for joining our early access list.",
    });
    
    // Reset submission status after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };
  
  // Fix for scroll position on page load
  useEffect(() => {
    // Smooth scroll to top when page loads
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
    
    // Add ID to the body element for better section navigation
    document.body.id = 'top';
    
    // Fix for iOS touch screen issues with fixed position elements
    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const isScrollableElement = (
        target.closest('nav') || 
        target.closest('#mobile-menu')
      );
      
      if (isScrollableElement) {
        e.stopPropagation();
      }
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <IranEconomicPotentialSection />
        <OurMissionSection />
        <GlobalImpactSection />
        <PathToPartnershipSection />
        <EcosystemPillarsSection />
        <FounderRoadmapSection />
        <StartupSpotlightSection />
        <TrustBuildingSection />
        <EcosystemAdvantageSection />
        <FounderWisdomSection />
        <PartnersIntegrationsSection />
        <FinalCTASection onSubmit={handleEmailSubmit} submitted={submitted} />
      </main>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
};

export default Index;
