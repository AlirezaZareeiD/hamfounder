
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Network, PlugIcon } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: string;
  link: string;
}

const partners: Partner[] = [
  {
    id: "1",
    name: "TechFund Capital",
    logo: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=300&h=200",
    description: "Early-stage venture capital fund focused on disruptive technology startups.",
    category: "funding",
    link: "#",
  },
  {
    id: "2",
    name: "Growth Accelerator",
    logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=300&h=200",
    description: "12-week program designed to help startups scale their operations and reach.",
    category: "accelerator",
    link: "#",
  },
  {
    id: "3",
    name: "Cloud Solutions",
    logo: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?auto=format&fit=crop&q=80&w=300&h=200",
    description: "Infrastructure and hosting solutions optimized for growing startups.",
    category: "technology",
    link: "#",
  },
  {
    id: "4",
    name: "Marketing Forge",
    logo: "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=300&h=200",
    description: "Growth marketing services tailored for early and mid-stage startups.",
    category: "service",
    link: "#",
  },
  {
    id: "5",
    name: "Legal Partners",
    logo: "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?auto=format&fit=crop&q=80&w=300&h=200",
    description: "Specialized legal services for startups from formation to funding.",
    category: "service",
    link: "#",
  },
  {
    id: "6",
    name: "Data Analytics Platform",
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300&h=200",
    description: "Comprehensive analytics tools to help startups make data-driven decisions.",
    category: "technology",
    link: "#",
  },
  {
    id: "7",
    name: "Seed Investors",
    logo: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=300&h=200",
    description: "Network of angel investors focused on seed-stage funding for innovative startups.",
    category: "funding",
    link: "#",
  },
  {
    id: "8",
    name: "Global Incubator",
    logo: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=300&h=200",
    description: "International startup incubator with programs in major tech hubs worldwide.",
    category: "accelerator",
    link: "#",
  },
];

const categories = [
  { value: "all", label: "All Partners" },
  { value: "funding", label: "Funding" },
  { value: "accelerator", label: "Accelerators" },
  { value: "technology", label: "Technology" },
  { value: "service", label: "Services" },
];

const PartnersIntegrationsSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  
  const filteredPartners = activeCategory === "all" 
    ? partners 
    : partners.filter(partner => partner.category === activeCategory);
  
  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="container px-4 mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Ecosystem Partners</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with our extensive network of partners and integrations to accelerate your startup's growth and success.
          </p>
        </div>
        
        <div className="mb-10 flex justify-center">
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {categories.map(category => (
                <TabsTrigger key={category.value} value={category.value}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPartners.map((partner) => (
            <Card key={partner.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-4 border-b">
                <div className="h-40 overflow-hidden rounded-md mb-4">
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardTitle className="text-xl">{partner.name}</CardTitle>
                <Badge variant="outline" className="mt-2">
                  {categories.find(cat => cat.value === partner.category)?.label}
                </Badge>
              </CardHeader>
              <CardContent className="p-4">
                <CardDescription className="text-sm">{partner.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild variant="outline" className="w-full">
                  <a href={partner.link} className="flex gap-2 items-center">
                    <Network className="w-4 h-4" />
                    <span>Connect</span>
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-4">Become a Partner</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Join our ecosystem of partners and help startups thrive while growing your own business.
          </p>
          <Button size="lg" className="gap-2">
            <PlugIcon className="w-4 h-4" />
            Apply for Partnership
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PartnersIntegrationsSection;
