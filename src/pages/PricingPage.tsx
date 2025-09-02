import { useState } from 'react';
import { Check, ArrowLeft, Star, Users, TrendingUp, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import PricingCard from '@/components/pricing/PricingCard';
import PricingToggle from '@/components/pricing/PricingToggle';
import Footer from '@/components/Footer';
import PricingFAQ from '@/components/pricing/PricingFAQ';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const entrepreneurPlans = [
    {
      name: "Community Access",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for early-stage Iranian entrepreneurs ",
      why: "Why Choose Free? Start your journey with Hamfounder at no cost and experience the power of a culturally integrated, high-signal community.",
      longDescription: "Why Choose Free? Start your journey with Hamfounder at no cost and experience the power of a culturally integrated, high-signal community. This tier is your gateway to understanding the \"Global Iranian Advantage\" and finding your initial footing in a trusted ecosystem.",
      features: [
        "Join a vibrant online and offline community tailored for Iranian entrepreneurs globally.",
        "Basic Startup Resources & Templates: Get foundational knowledge and essential tools to kickstart your entrepreneurial journey.",
        "Monthly Virtual Networking Events: Participate in regular online gatherings to meet like-minded individuals and expand your network.",
        "Monthly virtual networking events",
        "Access to Iranian startup database",
        "Basic mentor matching (1 session/month)"
      ],
      popular: false,
      buttonText: "Start Free"
    },

    {
      name: "Growth",
      price: { monthly: 49, annual: 480 },
      description: "Make a significant impact in global markets.",
      why: "Why Upgrade to Growth? Ready to accelerate your startup's journey? The Growth tier provides the targeted mentorship, investor access, and strategic resources essential for scaling your venture globally.",
      longDescription: "Why Upgrade to Growth? Ready to accelerate your startup's journey? The Growth tier provides the targeted mentorship, investor access, and strategic resources essential for scaling your venture globally. It's an investment in unlocking unparalleled opportunities and leveraging the collective power of the Iranian diaspora.",
      features: [
        "Everything in Starter plan",
        "Find co-founders, mentors, and team members who share cultural understanding and vision.",
        "Weekly mentor sessions with Iranian-American entrepreneurs",
        "Access to Hamfounder's Strategic Investor Network - HSIN",
        "Legal and immigration guidance",
        "Market research tools for Global expansion",
        "Pitch deck review and feedback",
        "Priority support in English & Persian"
       ],
       popular: true,
      buttonText: "Start 14-Day Free Trial"
    },

    {
      name: "Elevate to Scale",
      price: { monthly: 119, annual: 1200 },
      description: " Access to Hamfounder's accelerator programs.",
      why: "Why Elevate to Scale? For founders with audacious global ambitions, the Scale tier is your definitive advantage.",
      longDescription: " Why Elevate to Scale? For founders with audacious global ambitions, the Scale tier is your definitive advantage. It provides the elite network, personalized strategy, and direct access needed to transform your startup into an international powerhouse. This is where the true \"Global Iranian Advantage\" is fully realized, enabling you to lead and innovate on a global stage.",
  features: [
        "Everything in Growth plan",
        "1-on-1 strategic consulting with Hamfounder's veterans",
        "Direct investor introductions and warm leads",
        "Legal support for US incorporation",
        "Access to Hamfounder's accelerator programs",
        "Custom market entry strategies",
        "Dedicated account manager",
        "24/7 priority support"
       ],
       popular: false,
       buttonText: "Contact Sales"
    }
  ];

  const mentorPlans = [
   {
      name: "Community Mentor",
      price: { monthly: 0, annual: 0 },
      description: "Give back to the Iranian entrepreneurial community",
      features: [
        "Basic mentor profile",
        "Access to entrepreneur network",
        "Community recognition",
        "Monthly mentor meetups",
     ],
      popular: false,
      buttonText: "Join as Mentor"
     },
     {
      name: "Expert Mentor",
      price: { monthly: 199, annual: 1980 },
      description: "Professional mentoring with revenue sharing",
      features: [
        "Everything in Community Mentor",
        "Premium mentor profile with verification",
        "Revenue sharing from successful exits",
        "Advanced mentoring and tracking tools",
        "Priority matching with high-potential startups",
        "Exclusive mentor-only events and workshops",
        "Professional development courses"
     ],
      popular: true,
      buttonText: "Become Expert Mentor"
     }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar scrollToSection={() => {}} isIndexPage={false} />
        <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Unlock Your Potentials
             <span className="text-primary"> with Hamfounder's Curated Network</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Experience the power of Trust, Exclusivity, and the Global Iranian Advantage </p>
           
          <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
        </div>

        <section className="mb-16">
           <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">For Entrepreneurs</h2>
            </div>
             <p className="text-muted-foreground max-w-2xl mx-auto">
               From idea to IPO - everything Iranian entrepreneurs need to succeed in Global Markets!
            </p>
          </div>
           
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {entrepreneurPlans.map((plan, index) => (
              <PricingCard 
                key={index} 
                plan={plan} 
                isAnnual={isAnnual}
                category="entrepreneur"
               />
           ))}
         </div>
        </section>

         <section className="mb-16">
         <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">For Mentors</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Share your experience with the next generation of Iranian entrepreneurs
            </p>
         </div>
          
         <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
           {mentorPlans.map((plan, index) => (
             <PricingCard 
                key={index} 
                plan={plan} 
                isAnnual={isAnnual}
                category="mentor"
              />
              ))}
           </div>
        </section>
        <section className="mb-16">
           <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl p-8 md:p-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Investor?</h2>
            </div>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get exclusive access to vetted Iranian startups and high-potential deals in Hamfounder's Startup Ecosystem
            </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8">
                  Request Investor Access
               </Button>
              <p className="text-sm text-muted-foreground">
                Minimum investment: $50K+
              </p>
             </div>
          </div>
        </section>

        {/* FAQ */}
        <PricingFAQ />

      </main>
      <Footer />
    </div>
  );
};

export default Pricing;