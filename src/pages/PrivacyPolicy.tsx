import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/layouts/Layout';

// Re-importing all necessary icons for the main content
import {
  Shield, Users, Eye, Share, Settings, Globe, AlertCircle, Mail, Database, ArrowLeft
} from 'lucide-react';


const PrivacyPolicy = () => {
  const sections = [
    {
      id: 1,
      title: "Introduction",
      icon: Globe,
      content: (
        <div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Welcome to Hamfounder. We are a purpose-driven movement and a next-generation platform engineered
            to unlock the "Global Iranians Advantage". Our mission is to connect a curated community of Iranian-descent
            entrepreneurs, mentors, and investors to build, scale, and lead groundbreaking ventures.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            This Privacy Policy describes how we collect, use, and share your personal information when you use our services.
            We understand that trust is not just a feature; it is our core product, our "Trust API". We are deeply
            committed to protecting your privacy and ensuring a secure, "high-signal, low-noise" environment for your
            most valuable interactions.
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: "The Information We Collect",
      icon: Database,
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            To fulfill our mission of creating a trusted, high-value ecosystem, we collect information that allows us
            to verify your identity, facilitate connections, and personalize your experience.
          </p>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              A. Information You Provide to Us:
            </h4>
            <div className="space-y-4 pl-6">
              <div>
                <h5 className="font-medium text-foreground mb-2">Profile Information</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When you create a profile, we collect your name, email address, and professional details such as
                  your role, company, location, skills, and entrepreneurial journey. We also collect your public
                  identity and pronouns to enable authentic connections within our community.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground mb-2">Verification Information</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To power our multi-layered Trust Engine, we may collect information to verify your identity,
                  professional credentials, and achievements. This may include professional certifications,
                  public profiles (e.g., LinkedIn), and other information you provide for our vetting process.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground mb-2">Financial & Investment Data</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If you use our Investment & Opportunities Hub, we collect information necessary to facilitate
                  transactions and comply with legal obligations (e.g., KYC/AML). This may include your financial
                  capacity, investment preferences, and transactional data.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground mb-2">Communications & Community Content</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We collect any information you provide in our discussion forums, direct messages, event sign-ups,
                  or feedback surveys. We also collect content you contribute to our Knowledge & Learning Hub.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              B. Information We Collect Automatically:
            </h4>
            <div className="space-y-4 pl-6">
              <div>
                <h5 className="font-medium text-foreground mb-2">Usage Data</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We collect information about your interactions with the platform, such as the hubs you visit,
                  the profiles you view, the content you access, and the searches you perform. This data is used
                  to improve our matching algorithms and personalize your experience.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground mb-2">Device & Location Data</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We collect information from the devices you use to access the platform, including IP address,
                  browser type, and operating system. This is used for security and to provide a seamless user
                  experience, especially on our mobile-first platform.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground mb-2">Cookies & Tracking Technologies</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use cookies and similar technologies to remember your preferences, secure your sessions,
                  and analyze usage to optimize our services.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "How We Use Your Information",
      icon: Settings,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use your information to operate and improve our platform, deliver our unique value propositions,
            and fulfill our core mission. Our use of your data is driven by our commitment to fostering high-value,
            high-impact collaborations.
          </p>
          <div className="grid gap-4">
            {[
              {
                title: "To Facilitate Connections & Matching",
                desc: "Our primary use of your information is to power our AI-powered matching algorithms, connecting you with compatible co-founders, mentors, and investors based on skills, values, and cultural compatibility."
              },
              {
                title: "To Build and Maintain Trust",
                desc: "Your information is used by our Trust & Verification Engine to provide \"curated trust\". This is our mechanism for creating a high-signal environment where members feel secure in pursuing high-value transactions."
              },
              {
                title: "To Personalize Your Experience",
                desc: "We use your data to recommend relevant content, connections, and events. This ensures that the platform feels tailored to your specific needs as a globally-minded Iranian entrepreneur."
              },
              {
                title: "To Communicate With You",
                desc: "We use your information to send you updates about the platform, alert you to new opportunities, and provide customer support."
              },
              {
                title: "For Analytics and Business Insights",
                desc: "We analyze aggregated, anonymized data to understand platform trends, optimize our business model, and create unique \"Diaspora Market Intelligence\" reports for our premium members and partners."
              }
            ].map((item, index) => (
              <div key={index} className="border-l-2 border-primary/20 pl-4 py-3">
                <h5 className="font-medium text-foreground mb-2">{item.title}</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "How We Share Your Information",
      icon: Share,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed mb-4">
            We do not sell your personal information. We only share it with third parties when necessary to
            provide our services and build our community.
          </p>
          <div className="grid gap-4">
            {[
              {
                title: "With Other Users",
                desc: "Your public profile information is shared with other Hamfounder members to facilitate networking and collaboration. This is the foundation of our platform."
              },
              {
                title: "With Service Providers",
                desc: "We work with trusted third-party service providers who assist us with web hosting, analytics, payment processing, and other operational tasks. These providers are bound by confidentiality obligations."
              },
              {
                title: "For Legal Reasons",
                desc: "We may disclose your information if required by law or to protect the rights, property, or safety of Hamfounder, our members, or the public."
              },
              {
                title: "Business Transfers",
                desc: "If Hamfounder is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction."
              }
            ].map((item, index) => (
              <div key={index} className="border-l-2 border-primary/20 pl-4 py-3">
                <h5 className="font-medium text-foreground mb-2">{item.title}</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Your Choices & Controls",
      icon: Users,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed mb-4">
            You have control over your personal information.
          </p>
          <div className="grid gap-4">
            {[
              {
                title: "Profile Settings",
                desc: "You can review and update your profile information at any time. We encourage you to keep your profile accurate to ensure our matching algorithms are effective."
              },
              {
                title: "Communication Preferences",
                desc: "You can opt-out of receiving certain communications from us by following the unsubscribe instructions in our emails or adjusting your notification settings."
              },
              {
                title: "Account Deletion",
                desc: "You can request to delete your account. Upon deletion, we will remove your public profile and anonymize or delete your data as required by law."
              }
            ].map((item, index) => (
              <div key={index} className="border-l-2 border-primary/20 pl-4 py-3">
                <h5 className="font-medium text-foreground mb-2">{item.title}</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Data Security and International Transfers",
      icon: Shield,
      content: (
        <div>
          <p className="text-muted-foreground leading-relaxed">
            We are committed to securing your data. We use a "security by design" approach with technical and
            organizational measures to protect your information from unauthorized access, loss, or misuse. Given
            our global community, your information may be transferred to and processed in countries other than
            your own. We ensure that these transfers comply with applicable data protection laws, such as GDPR,
            to provide the same high level of protection regardless of location.
          </p>
        </div>
      )
    },
    {
      id: 7,
      title: "Your California Privacy Rights",
      icon: AlertCircle,
      content: (
        <div>
          <p className="text-muted-foreground leading-relaxed">
            As our server infrastructure is located in San Francisco, California, our operations are subject to
            the laws of the State of California, primarily the California Consumer Privacy Act (CCPA) and the
            California Privacy Rights Act (CPRA). Hamfounder does not sell or share your personal information
            with third-party companies for their direct marketing purposes. However, under California law,
            California residents have the right to request information from us about whether we have disclosed
            Personal Data to any third parties for the third parties' direct marketing purposes. If you are a
            California resident and wish to make such a request or have questions about our privacy practices,
            please contact our customer support team.
          </p>
        </div>
      )
    },
    {
      id: 8,
      title: "Changes to this Privacy Policy",
      icon: AlertCircle,
      content: (
        <div>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting
            the new policy on this page and updating the "Effective Date" at the top.
          </p>
        </div>
      )
    },
    {
      id: 9,
      title: "Contact Us",
      icon: Mail,
      content: (
        <div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            If you have any questions or concerns about this Privacy Policy, please contact us at:
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
          <p className="text-muted-foreground leading-relaxed mt-6 pt-4 border-t">
            <strong>By using Hamfounder, you agree to the terms of this Privacy Policy.</strong>
          </p>
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
            Hamfounder <span className="text-primary">Privacy Policy</span>
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

export default PrivacyPolicy;