import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const PricingFAQ = () => {
  const faqs = [
    {
      question: "Can I switch between plans?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle, and we'll prorate any differences. Our flexible plans are designed to evolve with your needs as your startup or your engagement with the ecosystem grows."
    },
    {
      question: "Does Hamfounder offer a free trial?",
      answer: "Absolutely! All paid plans come with a 14-day free trial. No credit card is required to start your trial, making it easy to experience the platform risk-free."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely, you have complete control. You can cancel your subscription at any time directly from your account settings. You'll continue to have full access until the end of your current billing period, ensuring you get the most out of your membership."
    },
    {
      question: "What is your refund policy?",
      answer: "We stand by the value we provide. We offer a pro-rata refund for annual subscriptions if you choose to cancel before the end of your term. Your satisfaction and the value you receive from Hamfounder are our top priorities."
    },
    {
      question: "Do you offer student discounts?",
      answer: "Yes, we believe in supporting the next generation of innovators. We offer 50% off Growth plans for eligible students and recent graduates. Please contact our support team with your student ID for verification and to unlock this special rate."
    },
    {
      question: "What payment methods are supported for users in Iran?",
      answer: "We understand the unique challenges and are actively working to implement accessible payment solutions for users within Iran, taking into consideration current limitations. Our goal is to provide secure and reliable payment gateways that comply with relevant regulations while facilitating seamless participation from within the country. Please contact our support team for the most up-to-date information on supported payment methods in your region."
    },
    {
      question: "What is the member vetting process?",
      answer: "Our rigorous vetting process is designed to ensure the highest quality and authenticity of our network. It involves a comprehensive review of applications based on experience, achievements, and alignment with Hamfounder's core values. For HGLN (Hamfounder Global Leaders Network) and HSIN (Hamfounder Strategic Investor Network) members, the process is even more extensive, including verification of credentials and a thorough review of their investment or mentorship track record. This meticulous process maintains the exclusivity and trustworthiness of the Hamfounder network, fostering a high-signal, low-noise environment."
    },
    {
      question: "How is trust built and maintained on Hamfounder?",
      answer: "Trust is the cornerstone of the Hamfounder ecosystem. We employ a rigorous, multi-layered trust and verification engine for all members, with an even higher standard for our HGLN mentors and HSIN investors. This includes robust identity verification, background checks where applicable, and a dynamic community-driven feedback system. Our unique hybrid online-offline model further cultivates deep, authentic trust through invaluable in-person interactions at local chapter meetings and exclusive events. This comprehensive approach ensures a high-integrity, collaborative environment."
    },
    {
      question: "What makes this platform specific to Iranian entrepreneurs globally?",
      answer: "Hamfounder is uniquely tailored for Iranian-born entrepreneurs worldwide. We provide culturally-aware mentorship that understands your background, full Persian language support for seamless communication, expert immigration guidance for navigating global opportunities, and a powerful network specifically designed for Iranian entrepreneurs building and scaling ventures in Silicon Valley and beyond. We bridge the gap between your heritage and global success."
    },
    {
      question: "How does the mentor revenue sharing work?",
      answer: "Our expert mentors are directly invested in your success. They receive a percentage of successful exits from startups they've mentored, typically ranging from 0.1% to 0.5% depending on their level of involvement and impact. This performance-based model ensures that our mentors are highly motivated to guide you towards significant achievements."
    },
    {
      question: "How does Hamfounder handle sanctions/legal complexities for cross-border collaborations?",
      answer: "Hamfounder operates strictly within international legal frameworks. We focus on facilitating legitimate value transfer through knowledge exchange, mentorship, and connections that fully comply with all applicable regulations. While we connect global talent, it's crucial to understand that direct financial transactions related to sanctioned activities are not facilitated on the platform. We strongly encourage all members to consult with legal counsel regarding specific cross-border activities. Our platform provides a trusted and compliant environment for identifying partners and opportunities, significantly mitigating the risks associated with navigating complex international landscapes."
    }
  ];

  return (
    <section className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">
          Everything you need to know about HamFounder's pricing and features
        </p>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default PricingFAQ;
