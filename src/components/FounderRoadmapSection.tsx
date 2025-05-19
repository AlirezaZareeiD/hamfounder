import React, { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const FounderRoadmapSection = () => {
  const [openTab, setOpenTab] = useState("ideation");
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);


  const roadmapPhases = [
    {
      id: "ideation",
      title: "Ideation",
      description: "Develop your vision and validate your idea",
      icon: "💡",
      color: "from-yellow-500 to-amber-500",
      steps: [
        {
          title: "Define Your Vision",
          description: "Clearly articulate the problem you're solving and why it matters.",
          details: [
            "Identify a specific pain point that needs solving",
            "Research existing solutions and their limitations",
            "Define your unique value proposition",
            "Create a one-page vision statement"
          ]
        },
        {
          title: "Market Research",
          description: "Validate your idea through comprehensive market research.",
          details: [
            "Analyze your target market size and growth potential",
            "Identify key competitors and their strengths/weaknesses",
            "Conduct customer interviews (aim for 30+)",
            "Test demand with landing page signups or presales"
          ]
        },
        {
          title: "Build Your MVP Strategy",
          description: "Plan the minimum viable product that will test your core hypothesis.",
          details: [
            "Define the core features needed to solve the primary problem",
            "Create user personas and journey maps",
            "Design simple wireframes or mockups",
            "Establish success metrics for your MVP"
          ]
        }
      ]
    },
    {
      id: "building",
      title: "Building",
      description: "Assemble your team and build your MVP",
      icon: "🔨",
      color: "from-blue-500 to-cyan-500",
      steps: [
        {
          title: "Find Co-Founders",
          description: "Identify and partner with the right co-founders to complement your skills.",
          details: [
            "Determine the key skills and roles needed for your startup",
            "Network through founder communities and events",
            "Assess alignment on vision, values, and commitment",
            "Formalize partnership with clear equity agreements"
          ]
        },
        {
          title: "Develop Your MVP",
          description: "Build the first version of your product focused on core value.",
          details: [
            "Set realistic timelines and milestones",
            "Choose appropriate technology stack",
            "Implement agile development methodology",
            "Continuously gather user feedback during development"
          ]
        },
        {
          title: "Legal Framework",
          description: "Establish the legal foundation for your business.",
          details: [
            "Choose appropriate business structure",
            "Register your company and secure necessary licenses",
            "Create founder agreements and vesting schedules",
            "Protect intellectual property with patents or trademarks"
          ]
        }
      ]
    },
    {
      id: "launching",
      title: "Launching",
      description: "Introduce your product to the market",
      icon: "🚀",
      color: "from-green-500 to-emerald-500",
      steps: [
        {
          title: "Go-to-Market Strategy",
          description: "Develop and execute a plan to reach your first customers.",
          details: [
            "Identify your initial target segment",
            "Create a marketing plan with specific channels",
            "Prepare launch assets (website, social media, etc.)",
            "Establish customer acquisition metrics and goals"
          ]
        },
        {
          title: "User Acquisition",
          description: "Implement strategies to attract and convert your first users.",
          details: [
            "Launch referral or invite programs",
            "Leverage content marketing and SEO",
            "Engage in community building",
            "Optimize conversion funnels with A/B testing"
          ]
        },
        {
          title: "Gather & Implement Feedback",
          description: "Collect and act on early user feedback to improve your product.",
          details: [
            "Implement feedback collection mechanisms",
            "Prioritize feature requests and bug fixes",
            "Establish customer success protocols",
            "Create a product roadmap based on user insights"
          ]
        }
      ]
    },
    {
      id: "scaling",
      title: "Scaling",
      description: "Grow your business and secure funding",
      icon: "📈",
      color: "from-purple-500 to-violet-500",
      steps: [
        {
          title: "Funding Strategy",
          description: "Secure the capital needed to scale your business.",
          details: [
            "Determine funding requirements and timing",
            "Prepare pitch deck and financial projections",
            "Research and approach relevant investors",
            "Explore alternative funding options (grants, accelerators)"
          ]
        },
        {
          title: "Team Expansion",
          description: "Build the team needed to support growth.",
          details: [
            "Create an organizational chart with key positions",
            "Develop hiring processes and onboarding",
            "Establish company culture and values",
            "Implement performance management systems"
          ]
        },
        {
          title: "Operational Scalability",
          description: "Ensure your business can handle increased demand.",
          details: [
            "Optimize and automate key processes",
            "Implement scalable technology infrastructure",
            "Develop partnerships for distribution or supply",
            "Create KPIs and reporting dashboards"
          ]
        }
      ]
    }
  ];

  const checkFadeEffects = () => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
      const atLeftEnd = scrollLeft === 0;
      const atRightEnd = scrollLeft + clientWidth >= scrollWidth - 1;

      setShowLeftFade(!atLeftEnd);
      setShowRightFade(!atRightEnd);
    }
  };

  useEffect(() => {
    checkFadeEffects();
    const handleResize = () => checkFadeEffects();
    window.addEventListener('resize', handleResize);

    const observer = new MutationObserver(checkFadeEffects);
    if (tabsListRef.current) {
      observer.observe(tabsListRef.current, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (tabsListRef.current) {
         observer.disconnect();
       }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      checkFadeEffects();
    };
    tabsListRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      tabsListRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [openTab]);


  return (
    <section id="founder-roadmap" className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Founder Success Roadmap
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto">
            Your step-by-step guide to building and scaling a successful startup,
            from initial idea to sustainable growth.
          </p>
        </div>

        <Tabs defaultValue="ideation" value={openTab} onValueChange={setOpenTab} className="w-full">
          <div className="flex justify-center mb-8 relative">
            {showLeftFade && (
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-800/50 to-transparent z-10 md:hidden"></div>
            )}

            {/* CORRECTED TabsList - h-10 class removed */}
            <TabsList
               ref={tabsListRef}
               className="w-full max-w-full justify-start overflow-x-auto flex-nowrap scrollbar-hide px-4 sm:px-0 bg-transparent
           md:grid md:grid-cols-4 md:overflow-x-visible md:flex-nowrap md:px-0 md:gap-2 md:justify-center"

               onScroll={checkFadeEffects}
            >
              {roadmapPhases.map((phase) => (
                <TabsTrigger
                  key={phase.id}
                  value={phase.id}
                  // Removed hover styles and adjusted padding for centering
                  className="flex items-center justify-center text-center flex-shrink-0 px-4 py-3 h-12
           md:flex md:flex-col md:py-4 md:px-2 md:text-lg md:h-auto md:items-center md:justify-center
           data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg
           transition-colors duration-200"

                             // The !md:items-center and !md:justify-center were added in a previous attempt
                             // If the height fix works, you might revert these to md:items-center and md:justify-center
                             // to rely more on standard Tailwind behavior, but !important ensures centering
                             // if other styles are interfering. Let's keep them for now to see if the height fix is enough.
                >
                  <span className="text-sm sm:text-base whitespace-nowrap leading-none md:leading-none">{phase.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {showRightFade && (
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-800/50 to-transparent z-10 md:hidden"></div>
            )}
          </div>

          {roadmapPhases.map((phase) => (
            <TabsContent key={phase.id} value={phase.id} className="mt-0">
              <div className="mb-10">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 mb-10">
                  <div className="md:w-1/3 w-full text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start mb-3 text-4xl">
                       {phase.icon}
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r ${phase.color}`}>
                      {phase.title} Phase
                    </h3>
                    <p className="text-slate-300 mb-4 text-base sm:text-lg">
                      {phase.description}
                    </p>
                    <Button variant="outline" className="border-slate-600 hover:bg-slate-800 hover:text-white w-full md:w-auto">
                      Download {phase.title} Checklist <ArrowRight className="ml-2" />
                    </Button>
                  </div>

                  <div className="md:w-2/3 w-full space-y-4">
                    {phase.steps.map((step, index) => (
                      <Accordion type="single" collapsible key={index}>
                        <AccordionItem value={`step-${index}`} className="border border-slate-700 rounded-lg mb-4 overflow-hidden">
                          <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-800/50 hover:bg-slate-800 hover:no-underline">
                            <div className="flex items-start text-left flex-col sm:flex-row">
                              <span className="bg-slate-700 text-white rounded-full w-7 h-7 flex items-center justify-center mr-0 sm:mr-4 mb-2 sm:mb-0 text-sm sm:text-base">
                                {index + 1}
                              </span>
                              <div>
                                <h4 className="text-base sm:text-xl font-medium text-white">{step.title}</h4>
                                <p className="text-slate-400 text-xs sm:text-sm">{step.description}</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="bg-slate-800/30 px-4 sm:px-6 py-3 sm:py-4">
                            <ul className="space-y-3">
                              {step.details.map((detail, i) => (
                                <li key={i} className="flex items-start">
                                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-300 text-sm sm:text-base">{detail}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center flex-wrap gap-4">
                              <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800/50 hover:bg-slate-700 w-full sm:w-auto">
                                View Resources
                              </Button>
                              <span className="text-sm text-slate-400">Estimated time: 2-4 weeks</span>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                  </div>
                </div>

                <Card className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 border-slate-700 h-auto">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-medium text-white">Need help with this phase?</CardTitle>
                    <CardDescription className="text-slate-300 text-sm sm:text-base">
                      Access specialized resources and connect with mentors who've been there.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3 bg-slate-800/50 p-4 rounded-md">
                        <div className="bg-blue-500/20 p-2 rounded-full flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-base sm:text-lg">Expert Mentoring</h4>
                          <p className="text-sm text-slate-400">1-on-1 advice from seasoned founders</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 bg-slate-800/50 p-4 rounded-md">
                        <div className="bg-purple-500/20 p-2 rounded-full flex-shrink-0">
                          <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-base sm:text-lg">Resource Library</h4>
                          <p className="text-sm text-slate-400">Templates, guides, and frameworks</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Button variant="secondary" className="bg-slate-700 hover:bg-slate-600 w-full sm:w-auto">
                      Find a Mentor
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full sm:w-auto">
                      Access Resources
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <div className="mt-16 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <Collapsible className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Ready to accelerate your journey?</h3>
                <p className="text-slate-300 text-sm sm:text-base">Join our founder accelerator program for personalized guidance and resources.</p>
              </div>
              <CollapsibleTrigger asChild>
                <Button className="mt-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full md:w-auto">
                  Learn More
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-4 mt-4 border-t border-slate-700 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 p-5 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                    <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg font-medium text-white mb-2">8-Week Program</h4>
                  <p className="text-slate-400 text-sm">Structured curriculum covering all phases of startup development</p>
                </div>
                <div className="bg-slate-800 p-5 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg font-medium text-white mb-2">Startup Cohort</h4>
                  <p className="text-slate-400 text-sm">Network with other founders at your stage for support and collaboration</p>
                </div>
                <div className="bg-slate-800 p-5 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                    <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                  </div>
                  <h4 className="text-base sm:text-lg font-medium text-white mb-2">Investor Access</h4>
                  <p className="text-slate-400 text-sm">Pitch opportunities with our network of angel investors and VCs</p>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full sm:w-auto">
                  Apply for Next Cohort
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        </div>
    </section>
  );
};

export default FounderRoadmapSection;
