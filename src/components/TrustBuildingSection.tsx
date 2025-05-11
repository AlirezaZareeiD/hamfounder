
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, ShieldCheck, UserRoundCheck, Star } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface Advisor {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  linkedIn?: string;
}

interface Testimonial {
  id: number;
  content: string;
  author: string;
  position: string;
  company: string;
  rating: number;
}

const TrustBuildingSection = () => {
  const [activeTab, setActiveTab] = useState<'advisors' | 'testimonials' | 'security'>('advisors');
  
  const advisors: Advisor[] = [
    {
      id: 1,
      name: "Dr. Sarah Khorasani",
      role: "AI Ethics Expert",
      company: "Stanford University",
      image: "/placeholder.svg",
      linkedIn: "https://linkedin.com/"
    },
    {
      id: 2,
      name: "Arman Khalili",
      role: "VC Partner",
      company: "Accel Partners",
      image: "/placeholder.svg",
      linkedIn: "https://linkedin.com/"
    },
    {
      id: 3,
      name: "Mina Rahmani",
      role: "Founder",
      company: "ExitedTech (Acquired)",
      image: "/placeholder.svg",
      linkedIn: "https://linkedin.com/"
    },
    {
      id: 4,
      name: "Kamran Elahian",
      role: "Serial Entrepreneur",
      company: "Global Innovation Catalyst",
      image: "/placeholder.svg",
      linkedIn: "https://linkedin.com/"
    }
  ];

  const testimonials: Testimonial[] = [
    {
      id: 1,
      content: "Hamfounder gave us direct access to a network of Iranian technologists across three continents. We found our technical co-founder in Berlin while we were building from Los Angeles.",
      author: "Darian Shirazian",
      position: "CEO",
      company: "Setak Health",
      rating: 5
    },
    {
      id: 2,
      content: "We faced unique challenges scaling our business globally due to regulatory complexities. The mentors on Hamfounder understood our specific situation and provided strategic guidance that was game-changing.",
      author: "Leila Janah",
      position: "Founder",
      company: "EcoTech Solutions",
      rating: 5
    },
    {
      id: 3,
      content: "After searching for months for a co-founder who understood both technical challenges and our cultural context, Hamfounder connected us with the perfect match within weeks.",
      author: "Arash Ferdowsi",
      position: "CTO",
      company: "NexGen Analytics",
      rating: 4
    }
  ];

  const securityPolicies = [
    {
      id: 1,
      title: "Protected Communications",
      description: "All communications between members are encrypted end-to-end for maximum privacy and security.",
      icon: Shield
    },
    {
      id: 2,
      title: "Verified Identities",
      description: "Our thorough verification process ensures all community members are authentic and trusted.",
      icon: ShieldCheck
    },
    {
      id: 3,
      title: "Data Protection",
      description: "Your information is protected with enterprise-grade security and never shared without your explicit consent.",
      icon: UserRoundCheck
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Trusted by Leaders in the Iranian Founder Community
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Join a network supported by experienced advisors and trusted by successful Iranian entrepreneurs worldwide.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 border-b border-gray-700">
          <button 
            onClick={() => setActiveTab('advisors')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'advisors' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Advisors & Mentors
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'testimonials' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Success Stories
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'security' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Privacy & Security
          </button>
        </div>

        {/* Content for Advisors Tab */}
        {activeTab === 'advisors' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advisors.map((advisor) => (
              <Card key={advisor.id} className="bg-slate-800/40 border-slate-700 hover:border-blue-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-slate-700">
                      <img 
                        src={advisor.image} 
                        alt={advisor.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{advisor.name}</h3>
                    <p className="text-blue-400 mb-1">{advisor.role}</p>
                    <p className="text-gray-400 mb-3">{advisor.company}</p>
                    {advisor.linkedIn && (
                      <a 
                        href={advisor.linkedIn} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-blue-400 flex items-center"
                      >
                        <span className="mr-1">LinkedIn</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Content for Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-slate-800/40 border-slate-700 hover:border-blue-500/50 transition-all h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-500'}`} 
                        fill={i < testimonial.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <blockquote className="text-gray-300 italic flex-grow mb-4">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="mt-auto">
                    <div className="text-white font-semibold">{testimonial.author}</div>
                    <div className="text-gray-400 text-sm">{testimonial.position}, {testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Content for Security Tab */}
        {activeTab === 'security' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {securityPolicies.map((policy) => (
                <Card key={policy.id} className="bg-slate-800/40 border-slate-700 hover:border-blue-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                      <policy.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{policy.title}</h3>
                    <p className="text-gray-300">{policy.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-slate-800/20 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Our Trust Commitment</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  At Hamfounder, we understand the unique challenges Iranian entrepreneurs face in the global landscape. 
                  Our platform is built with security and privacy as core principles, ensuring a safe space for collaboration.
                </p>
                <p>
                  All user data is protected by industry-standard encryption, and we follow strict data protection policies 
                  to ensure your information and ideas remain secure.
                </p>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <span className="text-blue-400 underline cursor-pointer">Learn more about our privacy policy</span>
                  </HoverCardTrigger>
                  <HoverCardContent className="bg-slate-800 border-slate-700 text-gray-300 w-80">
                    <p className="text-sm">
                      Our comprehensive privacy policy details how we collect, use, and protect your data. 
                      We never share your information with third parties without explicit consent, and you maintain 
                      full control over your data at all times.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrustBuildingSection;
