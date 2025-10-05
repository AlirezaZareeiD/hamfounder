
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Award, Lock, Eye, Fingerprint } from 'lucide-react';

const frameworkSections = [
    {
        id: 1, title: "The Spirit of Our Engagement", fullTitle: "The Spirit of Our Engagement (Ethical Commitment)", icon: Award,
        content: <p className="text-muted-foreground leading-relaxed">Our shared exploration requires the highest standards of integrity, in line with the culture of professional ecosystems like Y Combinator. By proceeding, you commit to treating this process and the shared information with the highest degree of ethical consideration, discretion, and professional courtesy. This commitment is a prerequisite for any potential partnership.</p>
    },
    {
        id: 2, title: "Confidential Information (CI)", fullTitle: "Confidential Information (CI)", icon: Shield,
        content: <p className="text-muted-foreground leading-relaxed">"Confidential Information" includes all non-public, proprietary, or commercially sensitive data provided by Hamfounder in this secure Knowledge Base (including, but not limited to: the Business Model Canvas, Technical Architecture, Platform Roadmap, IP strategy, and unique competitive differentiators).
</p>
    },
    {
        id: 3, title: "Non-Disclosure & Limited Use", fullTitle: "Obligation of Non-Disclosure and Limited Use", icon: Lock,
        content: (
            <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed"><span className="font-semibold text-foreground">Non-Disclosure:</span> You shall keep all CI strictly confidential and shall not, at any time, disclose, publish, or share any CI with any third party, whether verbally, digitally, or in writing.
                </p>
                <p className="text-muted-foreground leading-relaxed"><span className="font-semibold text-foreground">Limited Use (The Permitted Purpose):</span> You shall use the CI solely for the purpose of evaluating and discussing a potential co-founder partnership with Hamfounder. You are strictly prohibited from using the CI to develop, compete with, or assist any third party in developing or competing with the Hamfounder platform or business, now or in the future.
                </p>
            </div>
        )
    },
    {
        id: 4, title: "IP Protection & Survival", fullTitle: "Intellectual Property Protection and Survival", icon: Eye,
        content: <p className="text-muted-foreground leading-relaxed">You acknowledge that the unique strategic vision, processes, and proprietary assets contained in these documents are Hamfounder’s exclusive Intellectual Property (IP). This obligation of confidentiality and limited use survives the termination of our co-founder discussions.
</p>
    },
    {
        id: 5, title: "Digital Acknowledgment", fullTitle: "Digital Acknowledgment and Acceptance", icon: Fingerprint,
        content: <p className="text-muted-foreground leading-relaxed">By checking the 'I Acknowledge and Accept the terms' box and proceeding, you legally confirm that you have read, understand, and agree to be fully bound by all terms and conditions of this Professional Trust Framework. Your digital consent is recorded and grants you immediate, limited-time access to the Confidential Knowledge Base.
</p>
    }
];

interface NdaAcceptanceFormProps {
  onAccept: () => void;
}

export const NdaAcceptanceForm: React.FC<NdaAcceptanceFormProps> = ({ onAccept }) => {
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAcceptClick = async () => {
      setIsLoading(true);
      await onAccept();
      // No need to setIsLoading(false) as the component will unmount
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Co-founder Exploration Professional Trust Framework</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">(A Confidentiality and Good Faith Acknowledgment for Hamfounder)</p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 xl:gap-12">
            <div className="lg:col-span-3">
              <div className="sticky top-24">
                <Card className="p-4 shadow-sm"><h3 className="font-semibold mb-4 text-foreground px-2">Framework Sections</h3><ScrollArea className="h-[400px]"><div className="space-y-1 pr-2">
                    {frameworkSections.map((section, index) => (<motion.a key={section.id} href={`#section-${section.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer" whileHover={{ x: 4 }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} onClick={(e) => { e.preventDefault(); scrollToSection(`section-${section.id}`); }}>
                        <section.icon className="w-4 h-4 text-primary group-hover:text-primary/80 flex-shrink-0 ml-1" />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground leading-tight">{section.title}</span>
                    </motion.a>))}
                </div></ScrollArea></Card>
              </div>
            </div>

            <div className="lg:col-span-9">
              <div className="space-y-8">
                <Card className="bg-amber-50/60 border-amber-200/70 p-6 shadow-none"><CardHeader><CardTitle className="text-lg text-amber-900">Founders’ Note</CardTitle></CardHeader><CardContent><p className="text-amber-800/90 leading-relaxed italic">
                Hamfounder is built on a foundation of mutual trust, professional excellence, and a strategic vision to unlock the "Global Iranians Advantage." This Framework outlines the essential principles for sharing highly strategic and proprietary information with you during our mutual co-founder exploration.
                Access to the Confidential Knowledge Base is strictly conditioned upon your explicit acceptance of the terms below via digital consent.

                </p></CardContent></Card>

                {frameworkSections.map((section, index) => (<motion.div key={section.id} id={`section-${section.id}`} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <Card className="p-6 sm:p-8 transition-all duration-300 group hover:shadow-lg"><div className="flex items-start gap-4 mb-4"><div className="p-2.5 rounded-lg bg-primary/10"><section.icon className="w-5 h-5 text-primary" /></div><div className="flex-1 pt-1"><h2 className="text-xl font-semibold text-foreground">{section.fullTitle}</h2></div><Badge variant="outline" className="text-xs font-mono">{String(section.id).padStart(2, '0')}</Badge></div><div className="pl-[52px] pt-2">{section.content}</div></Card>
                </motion.div>))}

                <Card className="mt-8 sticky bottom-4 shadow-xl shadow-background/20 ring-1 ring-black/5">
                    <CardFooter className="flex-col sm:flex-row items-center justify-center gap-4 p-6">
                        <div className="flex items-center space-x-3">
                            <Checkbox id="acknowledge-terms" checked={isAcknowledged} onCheckedChange={(checked) => setIsAcknowledged(checked === true)} className="h-5 w-5"/>
                            <label htmlFor="acknowledge-terms" className="text-sm font-medium leading-none text-gray-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">I Acknowledge and Accept the terms.</label>
                        </div>
                        <Button onClick={handleAcceptClick} disabled={!isAcknowledged || isLoading} size="lg" className="w-full sm:w-auto">
                            {isLoading ? 'Processing...' : 'Accept & Proceed'}
                        </Button>
                    </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
};
