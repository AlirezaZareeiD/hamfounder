import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, getUserProfile } from '@/lib/firebase';
import CoFounderCircle from '@/components/dashboard/find-cofounder/CoFounderCircle';
import FilterPanel from '@/components/dashboard/find-cofounder/FilterPanel';
import MemberCard from '@/components/dashboard/find-cofounder/MemberCard';
import MemberModal from '@/components/dashboard/find-cofounder/MemberModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, Users, Loader2, AlertTriangle, Search } from 'lucide-react';
import CompleteProfileDialog from '@/components/dashboard/find-cofounder/CompleteProfileDialog';
import type { Member } from '@/types';

// Interfaces
interface UserProfile { uid: string; [key: string]: any; }
interface FilterState { 
  searchTerm: string;
  lookingFor: string;
  businessStage: string;
  skills: string;
  location: string;
  role: string;
}

const calculateCompletionPercentage = (profile: UserProfile | null): number => {
    if (!profile) return 0;
    const fields = ['firstName', 'lastName', 'tagline', 'location', 'personalSummary', 'role', 'lookingFor', 'businessStage', 'companyName'];
    const completedFields = fields.filter(field => profile[field] && String(profile[field]).trim() !== '').length;
    const skillsBonus = (profile.skills && profile.skills.length > 0) ? 1 : 0;
    const interestsBonus = (profile.interests && profile.interests.length > 0) ? 1 : 0;
    return Math.round(((completedFields + skillsBonus + interestsBonus) / (fields.length + 2)) * 100);
};

const functions = getFunctions();
const getAllUserProfilesCallable = httpsCallable<unknown, UserProfile[]>(functions, 'getAllUserProfiles');

const fetchAllUsers = async (): Promise<Member[]> => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const profilesData = await getAllUserProfilesCallable();
    
    return profilesData.data
        .filter(p => {
            if (!p.uid || p.uid === user.uid) return false;
            const completion = calculateCompletionPercentage(p as UserProfile);
            return completion >= 100;
        })
        .map(p => ({
            id: p.uid,
            name: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
            avatar: p.profileImageUrl || 'https://via.placeholder.com/150',
            role: p.role || 'Role not set',
            skills: p.skills || [],
            location: p.location || 'Location not set',
            bio: p.personalSummary || 'No bio available.',
            experience: p.businessStage || 'N/A',
            industry: p.industry || 'N/A',
            lookingFor: p.lookingFor || 'N/A',
            website: p.companyWebsiteUrl,
            linkedIn: p.linkedinUrl,
            github: p.github,
            isOnline: false, rating: 4.5, projectsCompleted: 0, joinedDate: '2024', achievements: [],
        }));
};

const FindCofounderPage: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'circles' | 'grid'>('circles');
  const [filters, setFilters] = useState<FilterState>({ searchTerm: '', lookingFor: '', businessStage: '', skills: '', location: '', role: '' });

  const { data: currentUserProfile, isLoading: isProfileLoading } = useQuery({
      queryKey: ['currentUserProfile', auth.currentUser?.uid],
      queryFn: () => getUserProfile(auth.currentUser!.uid),
      enabled: !!auth.currentUser,
  });

  const isProfileComplete = calculateCompletionPercentage(currentUserProfile as UserProfile | null) >= 100;

  const { data: members, isLoading: areMembersLoading, error: membersError } = useQuery<Member[], Error>({ 
    queryKey: ['allUsers'], 
    queryFn: fetchAllUsers,
    enabled: isProfileComplete,
    staleTime: 1000 * 60 * 5,
  });

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({ searchTerm: '', lookingFor: '', businessStage: '', skills: '', location: '', role: '' });
  };

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    
    return members.filter(member => {
        const searchTermLower = filters.searchTerm.toLowerCase();
        const skillsLower = filters.skills.toLowerCase();
        const locationLower = filters.location.toLowerCase();
        const roleLower = filters.role.toLowerCase();

        const matchesSearchTerm = !filters.searchTerm || 
            member.name.toLowerCase().includes(searchTermLower) ||
            member.bio.toLowerCase().includes(searchTermLower) ||
            member.skills.some(skill => skill.toLowerCase().includes(searchTermLower));

        const matchesLookingFor = !filters.lookingFor || member.lookingFor === filters.lookingFor;
        const matchesBusinessStage = !filters.businessStage || member.experience === filters.businessStage;
        const matchesSkills = !filters.skills || member.skills.some(s => s.toLowerCase().includes(skillsLower));
        const matchesLocation = !filters.location || member.location.toLowerCase().includes(locationLower);
        const matchesRole = !filters.role || member.role.toLowerCase().includes(roleLower);
        
        return matchesSearchTerm && matchesLookingFor && matchesBusinessStage && matchesSkills && matchesLocation && matchesRole;
    });
  }, [filters, members]);

  const isLoading = isProfileLoading || (isProfileComplete && areMembersLoading);

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /><span>&nbsp;Loading...</span></div></DashboardLayout>;
  }

  if (!isProfileComplete || !currentUserProfile) {
     return <DashboardLayout><CompleteProfileDialog isOpen={true} onOpenChange={() => {}} /></DashboardLayout>;
  }

  const renderContent = () => {
    if (membersError) {
      return (
          <div className="text-center py-12 text-red-500 bg-red-50 rounded-lg">
              <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Error Fetching Users</h3>
              <p className="text-sm">Could not load co-founder profiles. This might be a network issue or a server problem.</p>
              <p className="text-xs mt-2 font-mono bg-red-100 p-2 rounded">{membersError.message}</p>
          </div>
      );
    }
    
    if (filteredMembers && filteredMembers.length > 0) {
        if (activeView === 'circles') {
            const currentUserForCircle = {
                name: `${currentUserProfile.firstName || ''} ${currentUserProfile.lastName || ''}`.trim(),
                avatar: currentUserProfile.profileImageUrl || ''
            };
            return (
                <div className="space-y-12">
                    <CoFounderCircle 
                        members={filteredMembers} 
                        onMemberClick={handleSelectMember} 
                        title="Available Co-Founders" 
                        currentUser={currentUserForCircle}
                    />
                </div>
            );
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">{filteredMembers.map((member) => (<MemberCard key={member.id} member={member} onViewProfile={handleSelectMember} onConnect={() => {}} />))}</div>
        )
    } else {
        return (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Co-founders Found</h3>
              <p className="text-muted-foreground mb-4">No other users with a 100% complete profile were found, or your filters are too specific.</p>
            </div>
        );
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Find Your Perfect Co-Founder</h1>
            <p className="text-muted-foreground">
              Connect with talented entrepreneurs who share your vision and complement your skills.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1"><FilterPanel filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} /></div>
            <div className="lg:col-span-3 space-y-6">
              
              <div className="space-y-2 bg-card p-4 rounded-lg shadow-sm">
                <Label htmlFor="search" className="font-semibold">Search by Keyword</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, skills, or bio..."
                    value={filters.searchTerm}
                    onChange={(e) => handleFiltersChange({ searchTerm: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">{filteredMembers ? filteredMembers.length : 0} co-founders found</span><Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}><TabsList><TabsTrigger value="circles"><Users className="h-4 w-4 mr-2" />Circle View</TabsTrigger><TabsTrigger value="grid"><Grid className="h-4 w-4 mr-2" />Grid View</TabsTrigger></TabsList></Tabs></div>
              {renderContent()}
            </div>
          </div>
          {selectedMember && <MemberModal member={selectedMember} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConnect={() => {}} />}
      </div>
    </DashboardLayout>
  );
};

export default FindCofounderPage;
