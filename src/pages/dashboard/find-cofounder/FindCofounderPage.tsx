
import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import CoFounderCircle from '@/components/dashboard/find-cofounder/CoFounderCircle';
import FilterPanel from '@/components/dashboard/find-cofounder/FilterPanel';
import MemberCard from '@/components/dashboard/find-cofounder/MemberCard';
import MemberModal from '@/components/dashboard/find-cofounder/MemberModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, Users, MapPin, TrendingUp, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
  location: string;
  isOnline: boolean;
  bio: string;
  experience: string;
  industry: string;
  rating: number;
  projectsCompleted: number;
  joinedDate: string;
  website?: string;
  linkedIn?: string;
  github?: string;
  achievements: string[];
  lookingFor: string;
}

interface FilterState {
  searchTerm: string;
  industry: string;
  skills: string[];
  experience: string;
  location: string;
  role: string;
}

const FindCofounderPage: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'circles' | 'grid'>('circles');
  
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    industry: '',
    skills: [],
    experience: '',
    location: '',
    role: '',
  });

  // Mock data
  const mockMembers: Member[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=150&h=150&fit=crop&crop=face',
      role: 'Technical Co-Founder',
      skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
      location: 'San Francisco, CA',
      isOnline: true,
      bio: 'Full-stack developer with 8 years of experience building scalable web applications. Looking for a business co-founder to launch an AI-powered fintech startup.',
      experience: 'Senior Level (6-10 years)',
      industry: 'Technology',
      rating: 4.9,
      projectsCompleted: 12,
      joinedDate: 'March 2024',
      achievements: ['Built 3 successful startups', 'Former Google engineer', 'AI/ML expert'],
      lookingFor: 'A business-minded co-founder with experience in finance and fundraising'
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      role: 'Business Co-Founder',
      skills: ['Marketing', 'Sales', 'Product Management', 'Fundraising'],
      location: 'New York, NY',
      isOnline: false,
      bio: 'Former McKinsey consultant with 10+ years in strategy and operations. Successfully raised $50M+ for previous ventures.',
      experience: 'Expert Level (10+ years)',
      industry: 'Healthcare',
      rating: 4.8,
      projectsCompleted: 8,
      joinedDate: 'January 2024',
      achievements: ['Raised $50M+ in funding', 'Ex-McKinsey consultant', 'Healthcare innovation expert'],
      lookingFor: 'Technical co-founder with healthcare technology experience'
    },
    {
      id: '3',
      name: 'Emily Johnson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      role: 'Design Co-Founder',
      skills: ['UI/UX Design', 'Product Design', 'Branding', 'User Research'],
      location: 'London, UK',
      isOnline: true,
      bio: 'Award-winning product designer with experience at top tech companies. Passionate about creating user-centered solutions.',
      experience: 'Mid Level (3-5 years)',
      industry: 'E-commerce',
      rating: 4.7,
      projectsCompleted: 15,
      joinedDate: 'February 2024',
      achievements: ['Design Award winner', 'Former Apple designer', 'Published design book'],
      lookingFor: 'Technical and business co-founders for a design-focused e-commerce platform'
    },
    {
      id: '4',
      name: 'David Park',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      role: 'Marketing Co-Founder',
      skills: ['Digital Marketing', 'Growth Hacking', 'Content Strategy', 'SEO'],
      location: 'Austin, TX',
      isOnline: true,
      bio: 'Growth marketing expert who has scaled multiple startups from 0 to millions of users. Looking to build the next big thing.',
      experience: 'Senior Level (6-10 years)',
      industry: 'Marketing',
      rating: 4.6,
      projectsCompleted: 20,
      joinedDate: 'April 2024',
      achievements: ['Scaled 5 startups to 1M+ users', 'Marketing automation expert', 'Growth hacking pioneer'],
      lookingFor: 'Technical co-founder for a B2B SaaS marketing platform'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      role: 'Technical Co-Founder',
      skills: ['Mobile Development', 'React Native', 'iOS', 'Android'],
      location: 'Seattle, WA',
      isOnline: false,
      bio: 'Mobile app developer with expertise in cross-platform development. Built apps with millions of downloads.',
      experience: 'Senior Level (6-10 years)',
      industry: 'Gaming',
      rating: 4.8,
      projectsCompleted: 18,
      joinedDate: 'May 2024',
      achievements: ['Built apps with 10M+ downloads', 'Mobile gaming expert', 'React Native contributor'],
      lookingFor: 'Business co-founder with gaming industry connections'
    },
    {
      id: '6',
      name: 'James Thompson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      role: 'Business Co-Founder',
      skills: ['Finance', 'Operations', 'Strategy', 'Leadership'],
      location: 'Toronto, CA',
      isOnline: true,
      bio: 'Former investment banker turned entrepreneur. Expert in financial modeling and business strategy.',
      experience: 'Expert Level (10+ years)',
      industry: 'Finance',
      rating: 4.9,
      projectsCompleted: 6,
      joinedDate: 'June 2024',
      achievements: ['Former Goldman Sachs VP', 'Fintech expert', 'MBA from Wharton'],
      lookingFor: 'Technical co-founder for a next-generation fintech platform'
    }
  ];

  const filteredMembers = useMemo(() => {
    return mockMembers.filter(member => {
      if (filters.searchTerm && !member.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
          !member.skills.some(skill => skill.toLowerCase().includes(filters.searchTerm.toLowerCase()))) {
        return false;
      }
      if (filters.industry && member.industry.toLowerCase() !== filters.industry) {
        return false;
      }
      if (filters.role && !member.role.toLowerCase().includes(filters.role)) {
        return false;
      }
      if (filters.experience && member.experience !== filters.experience) {
        return false;
      }
      if (filters.location && !member.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.skills.length > 0 && !filters.skills.some(skill => member.skills.includes(skill))) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const topCoFounders = filteredMembers.filter(member => member.rating >= 4.7);
  const nearbyCoFounders = filteredMembers.filter(member => 
    member.location.includes('San Francisco') || member.location.includes('CA')
  );

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleConnect = (member: Member, message?: string) => {
    toast({
      title: "Connection Request Sent!",
      description: `Your connection request has been sent to ${member.name}.`,
    });
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      industry: '',
      skills: [],
      experience: '',
      location: '',
      role: '',
    });
  };

  const stats = [
    { icon: Users, label: 'Active Co-Founders', value: '2,847' },
    { icon: MapPin, label: 'Cities Worldwide', value: '150+' },
    { icon: TrendingUp, label: 'Successful Matches', value: '1,293' },
    { icon: User, label: 'Online Now', value: '324' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Find Your Perfect Co-Founder</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with talented entrepreneurs who share your vision and complement your skills. 
            Build the startup of your dreams together.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card rounded-lg p-4 text-center">
                <stat.icon className="h-8 w-8 mx-auto text-primary mb-2" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* View Toggle */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {filteredMembers.length} co-founders found
                </span>
                {filters.searchTerm && (
                  <Badge variant="secondary">
                    Search: {filters.searchTerm}
                  </Badge>
                )}
              </div>
              
              <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'circles' | 'grid')}>
                <TabsList>
                  <TabsTrigger value="circles" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Circle View</span>
                  </TabsTrigger>
                  <TabsTrigger value="grid" className="flex items-center space-x-2">
                    <Grid className="h-4 w-4" />
                    <span>Grid View</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Content based on view */}
            {activeView === 'circles' ? (
              <div className="space-y-12">
                {topCoFounders.length > 0 && (
                  <CoFounderCircle
                    members={topCoFounders}
                    onMemberClick={handleMemberClick}
                    title="Top Rated Co-Founders"
                  />
                )}
                
                {nearbyCoFounders.length > 0 && (
                  <CoFounderCircle
                    members={nearbyCoFounders}
                    onMemberClick={handleMemberClick}
                    title="Co-Founders Near You"
                  />
                )}
                
                {filteredMembers.length > 0 && filteredMembers.length !== topCoFounders.length && filteredMembers.length !== nearbyCoFounders.length && (
                  <CoFounderCircle
                    members={filteredMembers}
                    onMemberClick={handleMemberClick}
                    title="All Matching Co-Founders"
                  />
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onViewProfile={handleMemberClick}
                    onConnect={(member) => handleConnect(member)}
                  />
                ))}
              </div>
            )}

            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No co-founders found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms to find more matches.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Member Profile Modal */}
        <MemberModal
          member={selectedMember}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConnect={handleConnect}
        />
      </div>
    </DashboardLayout>
  );
};

export default FindCofounderPage;
