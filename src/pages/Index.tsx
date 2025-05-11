
import { useState } from 'react';
import Navbar from '@/components/Navbar';
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
import OriginStorySection from '@/components/OriginStorySection';
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
  
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <OurMissionSection />
        <GlobalImpactSection />
        <EcosystemPillarsSection />
        <FounderRoadmapSection />
        <PathToPartnershipSection />
        <TrustBuildingSection />
        <EcosystemAdvantageSection />
        <FounderWisdomSection />
        <PartnersIntegrationsSection />
        <StartupSpotlightSection />
        <FinalCTASection onSubmit={handleEmailSubmit} submitted={submitted} />
      </main>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
};

export default Index;
