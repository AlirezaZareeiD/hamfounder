import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/layouts/Layout';


// Importing all necessary icons for the main content
import {
  Shield, Users, Gavel, Mail, Globe, CheckCircle, ArrowLeft
} from 'lucide-react';




const TermsOfService = () => {
  const sections = [
    {
      id: 1,
      title: "Acceptance of Terms",
      icon: CheckCircle,
      content: (
        <div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Welcome to Hamfounder. By accessing or using the Hamfounder platform and services (the "Services"),
            you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree
            to these Terms, you may not use the Services.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            These Terms constitute a legally binding agreement between you and Hamfounder, a California-based company.
            Our Services are provided to you conditioned on your acceptance without modification of these Terms.
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: "The Hamfounder Platform & Mission",
      icon: Globe,
      content: (
        <div>
          <p className="text-muted-foreground leading-relaxed">
            Hamfounder is a purpose-driven ecosystem designed to unlock the "Global Iranians Advantage." We provide
            a curated, high-signal, low-noise environment for Iranian-descent entrepreneurs, mentors, and investors
            to connect, collaborate, and build transformative ventures. Our mission is to facilitate a "brain circulation"
            and economic impact by fostering a trusted, global community.
          </p>
        </div>
      )
    },
    {
      id: 3,
      title: "Eligibility & Account Registration",
      icon: Users,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">3.1. Eligibility</h4>
            <p className="text-muted-foreground leading-relaxed">
              To use the Services, you must be at least 18 years of age and a member of the Iranian-descent community
              or have a demonstrable connection to the Iranian entrepreneurial ecosystem, as determined by our
              multi-layered Trust & Verification Engine. By using the Services, you represent and warrant that you
              meet these eligibility requirements.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">3.2. Account Creation</h4>
            <p className="text-muted-foreground leading-relaxed">
              You agree to provide accurate, current, and complete information during the registration process and
              to update such information to keep it accurate, current, and complete. We reserve the right to suspend
              or terminate your account if any information provided is found to be inaccurate, not current, or incomplete.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">3.3. Vetting & Curation</h4>
            <p className="text-muted-foreground leading-relaxed">
              Hamfounder maintains a highly curated community. Your access to certain hubs (e.g., Hamfounder Global
              Leaders Network - HGLN, Hamfounder Strategic Investors Network - HSIN) is subject to our rigorous vetting
              process. We reserve the right, in our sole discretion, to accept or reject any application for membership
              and to revoke access to any member who fails to uphold our community standards.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Community Rules & Prohibited Conduct",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            You agree not to engage in any of the following prohibited activities:
          </p>
          <div className="grid gap-3">
            {[
              { title: "Trust & Integrity", desc: "Misrepresenting your identity, qualifications, or achievements. Impersonating any person or entity." },
              { title: "Community Conduct", desc: "Harassing, bullying, or intimidating other members. Posting content that is defamatory, obscene, or racially, ethnically, or otherwise objectionable." },
              { title: "Malicious Activity", desc: "Engaging in spamming, sending unsolicited advertisements, or transmitting viruses, worms, or other malicious code." },
              { title: "Intellectual Property", desc: "Violating the intellectual property rights of others." },
              { title: "Confidentiality", desc: "Disclosing confidential information shared within the platform without explicit consent." },
              { title: "Legal Compliance", desc: "Violating any applicable law, rule, or regulation, including but not limited to laws regarding financial transactions, intellectual property, and privacy." }
            ].map((rule, index) => (
              <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                <h5 className="font-medium text-foreground mb-1">{rule.title}</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">{rule.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to remove any content or terminate any account that violates these rules,
            without a refund for any paid Services.
          </p>
        </div>
      )
    },
    {
      id: 5,
      title: "Intellectual Property Rights",
      icon: Gavel,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">5.1. Platform Content</h4>
            <p className="text-muted-foreground leading-relaxed">
              All content on the Hamfounder platform, including text, graphics, logos, and software, is the exclusive
              property of Hamfounder or its licensors and is protected by intellectual property laws.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">5.2. User-Generated Content (UGC)</h4>
            <p className="text-muted-foreground leading-relaxed">
              You retain all rights to any content you post on the Services ("User Content"). By posting User Content,
              you grant Hamfounder a non-exclusive, worldwide, royalty-free, and perpetual license to use, reproduce,
              modify, and display such User Content for the purpose of operating and promoting the Services. This includes
              using your profile information and data to power our matching algorithms and generate aggregated market
              intelligence reports.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Payments & Subscriptions",
      icon: Mail,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">6.1. Subscription Plans</h4>
            <p className="text-muted-foreground leading-relaxed">
              Access to certain features of the Services may require a paid subscription. Details of our subscription
              tiers and pricing are available on the platform. All fees are non-refundable, except as required by law.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">6.2. Transaction Fees</h4>
            <p className="text-muted-foreground leading-relaxed">
              Hamfounder may charge fees on successful transactions facilitated through the Investment & Opportunities Hub.
              You agree to pay all applicable fees and taxes associated with your use of the Services.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Disclaimers & Limitation of Liability",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">7.1. No Guarantees</h4>
            <p className="text-muted-foreground leading-relaxed">
              Hamfounder makes no guarantee that the Services will result in a successful co-founder match, investment,
              or any other specific outcome. The Services are provided "as is" and "as available," and we do not warrant
              that the Services will be uninterrupted or error-free.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">7.2. Limitation of Liability</h4>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, Hamfounder will not be liable for any direct, indirect, incidental,
              special, or consequential damages resulting from your use of or inability to use the Services.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "Governing Law & Dispute Resolution",
      icon: Gavel,
      content: (
        <div>
          <p className="text-muted-foreground leading-relaxed">
            These Terms are governed by the laws of the State of California, without regard to its conflict of law
            principles. Any legal action or proceeding arising under these Terms shall be brought exclusively in
            the federal or state courts located in San Francisco, California.
          </p>
        </div>
      )
    },
    {
      id: 9,
      title: "Changes to Terms",
      icon: CheckCircle,
      content: (
        <div>
          <p className="text-muted-foreground leading-relaxed">
            We may modify these Terms at any time. We will notify you of any material changes by posting the updated
            Terms on the platform. Your continued use of the Services after such changes constitutes your acceptance
            of the new Terms.
          </p>
        </div>
      )
    },
    {
      id: 10,
      title: "Contact Information",
      icon: Mail,
      content: (
        <div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-foreground font-medium">contact@hamfounder.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-foreground font-medium">www.hamfounder.com</span>
            </div>
          </div>
        </div>
      )
    }
  ];


  // A function to scroll to a specific section, similar to the one in the index page
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <Layout isIndex={false} scrollToSection={scrollToSection}>
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Hamfounder <span className="text-primary">Terms of Service</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Effective Date: September 1, 2025
          </p>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <div className="sticky top-24">
                <Card className="p-4">
                  <h3 className="font-semibold mb-4 text-foreground">Quick Navigation</h3>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {sections.map((section, index) => {
                        const IconComponent = section.icon;
                        return (
                          <motion.a
                            key={section.id}
                            href={`#section-${section.id}`}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
                            whileHover={{ x: 4 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToSection(`section-${section.id}`);
                            }}
                          >
                            <IconComponent className="w-4 h-4 text-primary group-hover:text-primary/80 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground leading-tight">
                              {section.title}
                            </span>
                          </motion.a>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            </div>
            <div className="lg:col-span-9">
              <div className="space-y-8">
                {sections.map((section, index) => {
                  const IconComponent = section.icon;
                  return (
                    <motion.div
                      key={section.id}
                      id={`section-${section.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {section.id}
                              </Badge>
                              <h2 className="text-xl font-semibold text-foreground">
                                {section.title}
                              </h2>
                            </div>
                          </div>
                        </div>
                        <div className="pl-12">
                          {section.content}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};


export default TermsOfService;
