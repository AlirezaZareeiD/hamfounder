import React, { useState, useMemo, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import CoFounderCircle from '@/components/dashboard/find-cofounder/CoFounderCircle';
import FilterPanel from '@/components/dashboard/find-cofounder/FilterPanel';
import MemberCard from '@/components/dashboard/find-cofounder/MemberCard';
import MemberModal from '@/components/dashboard/find-cofounder/MemberModal';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, Users, Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, db, getUserProfile } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, getDocs, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import CompleteProfileDialog from '@/components/dashboard/find-cofounder/CompleteProfileDialog';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination";
import { Member } from '@/types';
import { Input } from '@/components/ui/input';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  tagline?: string;
  location?: string;
  personalSummary?: string;
  role?: string;
  lookingFor?: string;
  businessStage?: string;
  companyName?: string;
  skills?: string[];
  interests?: string[];
  profileImageUrl?: string;
  industry?: string;
  Industry?: string; // For backwards compatibility
  projectsCompleted?: number;
  isOnline?: boolean;
  rating?: number;
  joinedDate?: any;
  achievements?: string[];
}

export type ConnectionStatus = 'connected' | 'pending_sent' | 'pending_received' | 'none';

interface FilterState {
  searchTerm: string;
  lookingFor: string;
  businessStage: string;
  skills: string;
  location: string;
  role: string;
}

const ITEMS_PER_PAGE = 9;

const isProfile100PercentComplete = (profile: UserProfile | null): boolean => {
  if (!profile) return false;
  const requiredTextFields: (keyof UserProfile)[] = ['firstName', 'lastName', 'tagline', 'location', 'personalSummary', 'role', 'lookingFor', 'businessStage', 'companyName'];
  for (const field of requiredTextFields) {
    const value = profile[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) return false;
  }
  if (!profile.skills || profile.skills.length === 0) return false;
  if (!profile.interests || profile.interests.length === 0) return false;
  return true;
};

const FindCofounderPage: React.FC = () => {
  const [user, loadingAuth] = useAuthState(auth);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [members, setMembers] = useState<Member[]>([]);
  const [connectionStatusMap, setConnectionStatusMap] = useState<Map<string, ConnectionStatus>>(new Map());
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'circles' | 'grid'>('circles');
  const [filters, setFilters] = useState<FilterState>({ searchTerm: '', lookingFor: '', businessStage: '', skills: '', location: '', role: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const checkCurrentUserProfile = async () => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setCurrentUserProfile(profile as UserProfile);
      } else if (!loadingAuth) {
        setIsLoading(false);
      }
    };
    checkCurrentUserProfile();
  }, [user, loadingAuth]);

  useEffect(() => {
    if (!currentUserProfile || !user) return;

    if (!isProfile100PercentComplete(currentUserProfile)) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const projectsQuery = query(collection(db, 'projects'), where("isPrivate", "==", false));
        const projectsSnapshot = await getDocs(projectsQuery);
        const projectCounts = new Map<string, number>();
        projectsSnapshot.forEach(doc => {
            const projectData = doc.data();
            if (projectData.ownerId) {
                projectCounts.set(projectData.ownerId, (projectCounts.get(projectData.ownerId) || 0) + 1);
            }
        });

        const profilesQuery = query(collection(db, 'userProfiles'));
        const profilesSnapshot = await getDocs(profilesQuery);
       
        const completeMembers = profilesSnapshot.docs
          .filter(doc => doc.id !== user.uid)
          .filter(doc => isProfile100PercentComplete(doc.data() as UserProfile))
          .map(doc => {
            const data = doc.data() as any; // Use any to access all fields from firestore
            return {
              id: doc.id,
              name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
              avatar: data.profileImageUrl || '',
              profileImageUrl: data.profileImageUrl || '',
              role: data.role || '',
              skills: data.skills || [],
              location: data.location || '',
              bio: data.personalSummary || '',
              experience: data.businessStage || 'N/A',
              industry: data.industry || data.Industry || 'N/A',
              lookingFor: data.lookingFor || 'N/A',
              projectsCompleted: projectCounts.get(doc.id) || 0,
              isOnline: data.isOnline || false,
              rating: data.rating || 0,
              joinedDate: data.joinedDate ? new Date(data.joinedDate.seconds * 1000).toLocaleDateString() : 'N/A',
              achievements: data.achievements || [],
              interests: data.interests || [],
              companyWebsiteUrl: data.companyWebsiteUrl || null,
              linkedinUrl: data.linkedinUrl || null,
              twitterUrl: data.twitterUrl || null
            };
          });
       
        setMembers(completeMembers);

        const sentRequestsQuery = query(collection(db, 'connection_requests'), where('senderId', '==', user.uid));
        const receivedRequestsQuery = query(collection(db, 'connection_requests'), where('receiverId', '==', user.uid));
        const matchesQuery = query(collection(db, 'matches'), where('userIds', 'array-contains', user.uid));
        const [sent, received, matches] = await Promise.all([getDocs(sentRequestsQuery), getDocs(receivedRequestsQuery), getDocs(matchesQuery)]);
        const newStatusMap = new Map<string, ConnectionStatus>();
        sent.forEach(doc => newStatusMap.set(doc.data().receiverId, 'pending_sent'));
        received.forEach(doc => newStatusMap.set(doc.data().senderId, 'pending_received'));
        matches.forEach(doc => { const otherId = doc.data().userIds.find((id: string) => id !== user.uid); if (otherId) newStatusMap.set(otherId, 'connected'); });
        setConnectionStatusMap(newStatusMap);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast({ variant: 'destructive', title: 'Failed to load data' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUserProfile, user, toast]);

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const searchTermLower = filters.searchTerm.toLowerCase();
      const skillsLower = filters.skills.toLowerCase();
      const locationLower = filters.location.toLowerCase();
      const roleLower = filters.role.toLowerCase();

      const matchesSearchTerm = !filters.searchTerm || member.name.toLowerCase().includes(searchTermLower) || member.bio.toLowerCase().includes(searchTermLower);
      const matchesLookingFor = !filters.lookingFor || member.lookingFor === filters.lookingFor;
      const matchesBusinessStage = !filters.businessStage || member.experience === filters.businessStage;
      const matchesSkills = !filters.skills || member.skills.some(s => s.toLowerCase().includes(skillsLower));
      const matchesLocation = !filters.location || member.location.toLowerCase().includes(locationLower);
      const matchesRole = !filters.role || member.role.toLowerCase().includes(roleLower);

      return matchesSearchTerm && matchesLookingFor && matchesBusinessStage && matchesSkills && matchesLocation && matchesRole;
    });
  }, [filters, members]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMembers, currentPage]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);

  const handleSelectMember = (member: Member) => { setSelectedMember(member); setIsModalOpen(true); };
  const handleFilterChange = (newFilters: Partial<FilterState>) => { setFilters(prev => ({...prev, ...newFilters})); setCurrentPage(1); };
  const handleClearFilters = () => { setFilters({ searchTerm: '', lookingFor: '', businessStage: '', skills: '', location: '', role: '' }); setCurrentPage(1); };
  const handleMoreMembersClick = () => setActiveView('grid');
  const handleConnect = useCallback(async (member: Member, message?: string) => {
    if (!user) return;
    setIsModalOpen(false);
    const status = connectionStatusMap.get(member.id) || 'none';
    if (status === 'connected') { navigate(`/dashboard/messages?chatId=${[user.uid, member.id].sort().join('_')}`); return; }
    if (status !== 'none') { toast({ title: 'Request already pending' }); return; }
    try {
      await addDoc(collection(db, 'connection_requests'), { senderId: user.uid, receiverId: member.id, status: 'pending', message: message || null, createdAt: serverTimestamp() });
      setConnectionStatusMap(prev => new Map(prev).set(member.id, 'pending_sent'));
      toast({ title: 'Request Sent!' });
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast({ variant: 'destructive', title: 'Failed to send request' });
    }
  }, [user, connectionStatusMap, toast, navigate]);

  if (loadingAuth || isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div></DashboardLayout>;
  }

  if (!user || !isProfile100PercentComplete(currentUserProfile)) {
    return <DashboardLayout><CompleteProfileDialog isOpen={true} onOpenChange={() => {}} /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Find Your Perfect Co-Founder</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or keyword..."
              className="pl-9 w-full md:w-1/2 lg:w-1/3"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{filteredMembers.length} co-founders found</span>
              <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'circles' | 'grid')}>
                <TabsList>
                  <TabsTrigger value="circles"><Users className="h-4 w-4 mr-2" />Circle View</TabsTrigger>
                  <TabsTrigger value="grid"><Grid className="h-4 w-4 mr-2" />Grid View</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {activeView === 'circles' && currentUserProfile && (
                <CoFounderCircle
                    members={filteredMembers.slice(0, 18)}
                    currentUser={{
                      id: user.uid,
                      name: `${currentUserProfile.firstName} ${currentUserProfile.lastName}`,
                      avatar: currentUserProfile.profileImageUrl || ''
                    }}
                    onMemberClick={handleSelectMember}
                    onMoreMembersClick={handleMoreMembersClick}
                    title="Available Co-Founders"
                />
            )}
            {activeView === 'grid' && (
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedMembers.map((member) => (
                        <MemberCard
                            key={member.id}
                            member={member}
                            onViewProfile={handleSelectMember}
                            onConnect={handleConnect}
                            connectionStatus={connectionStatusMap.get(member.id) || 'none'}
                        />
                    ))}
                 </div>
                 {totalPages > 1 && (
                    <Pagination>
                        <PaginationContent>
                           <PaginationItem><PaginationPrevious href="#" onClick={(e) => {e.preventDefault(); setCurrentPage(p => Math.max(1, p-1))}} /></PaginationItem>
                           {[...Array(totalPages)].map((_, i) => <PaginationItem key={i}><PaginationLink href="#" isActive={i+1 === currentPage} onClick={(e) => {e.preventDefault(); setCurrentPage(i+1)}}>{i+1}</PaginationLink></PaginationItem>)}
                           <PaginationItem><PaginationNext href="#" onClick={(e) => {e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p+1))}} /></PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
              </div>
            )}
          </div>
        </div>

        {selectedMember && (
          <MemberModal
            member={selectedMember}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConnect={handleConnect}
            connectionStatus={connectionStatusMap.get(selectedMember.id) || 'none'}
            projectsCount={selectedMember.projectsCompleted || 0}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default FindCofounderPage;
