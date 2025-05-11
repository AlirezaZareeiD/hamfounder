
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

const Index = () => {
  const [submitted, setSubmitted] = useState(false);
  
  const handleEmailSubmit = (email: string) => {
    // Here we'll handle email submission in the future
    console.log("Email submitted:", email);
    setSubmitted(true);
    // Reset submission status after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <EcosystemPillarsSection />
        <GlobalImpactSection />
        <OriginStorySection />
        <PathToPartnershipSection />
        <EcosystemAdvantageSection />
        <FounderWisdomSection />
        <StartupSpotlightSection />
        <FinalCTASection onSubmit={handleEmailSubmit} submitted={submitted} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
