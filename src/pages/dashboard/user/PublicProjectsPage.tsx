
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Query, DocumentData, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Link as LinkIcon, Sparkles, Search, Users, ArrowLeft, AlertCircle, Filter } from 'lucide-react';
import ProjectCard, { Project } from '@/components/dashboard/ProjectCard';
import ProjectCardSkeleton from '@/components/dashboard/ProjectCardSkeleton';

// --- Hardcoded filter options as requested ---
const STAGE_OPTIONS = ['Idea', 'Prototype', 'MVP', 'Early Stage', 'Growth Stage', 'Mature'];
const MVP_STATUS_OPTIONS = ['Idea Stage', 'Concept Validation', 'Low-Code MVP', 'Concierge MVP', 'Wizard of Oz MVP', 'Single-Feature MVP', 'Functional MVP', 'Beta Product', 'Product-Market Fit MVP'];
const MILESTONE_OPTIONS = ['Idea Validation', 'Problem-Solution Fit', 'MVP Launch', 'Early Traction', 'Product-Market Fit', 'Team Milestones', 'Fundraising Milestones', 'Growth Milestones', 'Scalability', 'Exit'];
const FUNDING_STAGE_OPTIONS = ['Bootstrapping', 'Pre-Seed Stage', 'Seed Stage', 'Series A', 'Series B', 'Series C', 'Bridge Financing', 'IPO'];

const PublicProjectsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const [isMarketplaceView, setIsMarketplaceView] = useState(!userId);
  const [userName, setUserName] = useState<string>('');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('updatedAt_desc');
  const [filters, setFilters] = useState<{ stage: string[], mvpStatus: string[], milestones: string[], fundingStage: string[] }>({ stage: [], mvpStatus: [], milestones: [], fundingStage: [] });
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const isCurrentlyMarketplace = !userId;
    if (isCurrentlyMarketplace !== isMarketplaceView) {
        setIsMarketplaceView(isCurrentlyMarketplace);
    }
  }, [userId, isMarketplaceView]);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let projectsQuery: Query;
        if (isMarketplaceView) {
          projectsQuery = query(collection(db, 'projects'), where("isPrivate", "==", false));
        } else {
          if (!userId) {
            setError("User ID is missing.");
            setIsLoading(false);
            return;
          }
          projectsQuery = query(collection(db, 'projects'), where("ownerId", "==", userId), where("isPrivate", "==", false));
        }

        const querySnapshot = await getDocs(projectsQuery);
        const fetchedProjects = querySnapshot.docs.map(doc => {
            const data = doc.data() as DocumentData;
            let updatedAtDate: Date | undefined = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined;
            // Ensure milestones is treated correctly, even if it's null or not an array
            return { 
                id: doc.id, 
                ...data,
                milestones: data.milestones || [], // Default to empty array if not present
                updatedAt: updatedAtDate 
            } as Project;
        });
       
        setProjects(fetchedProjects);

        if (!isMarketplaceView && fetchedProjects.length > 0 && !userName) {
          setUserName(fetchedProjects[0].ownerInfo?.displayName || '');
        }

      } catch (err: any) {
        console.error("Error fetching projects: ", err);
        setError(err.code === 'failed-precondition' ? "Database index required." : "Failed to load projects.");
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    fetchProjects();
  }, [userId, isMarketplaceView, userName]);

  const sortedAndFilteredProjects = useMemo(() => {
    let result = projects.filter(p => {
        const searchTermMatch = !searchTerm ||
            (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.ownerInfo?.displayName && p.ownerInfo.displayName.toLowerCase().includes(searchTerm.toLowerCase()));

        // Corrected filtering logic to handle single string values from DB
        const stageMatch = filters.stage.length === 0 || (p.stage && filters.stage.includes(p.stage));
        const mvpStatusMatch = filters.mvpStatus.length === 0 || (p.mvpStatus && filters.mvpStatus.includes(p.mvpStatus));
        const milestonesMatch = filters.milestones.length === 0 || (p.milestones && Array.isArray(p.milestones) && p.milestones.some(m => filters.milestones.includes(m)));
        const fundingStageMatch = filters.fundingStage.length === 0 || (p.fundingStage && filters.fundingStage.includes(p.fundingStage));

        return searchTermMatch && stageMatch && mvpStatusMatch && milestonesMatch && fundingStageMatch;
    });

    switch (sortOption) {
        case 'name_asc':
            result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            break;
        case 'name_desc':
            result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
            break;
        case 'updatedAt_desc':
        default:
            result.sort((a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0));
            break;
    }

    return result;
  }, [projects, searchTerm, filters, sortOption]);

  const handleViewProject = (projectId: string) => navigate(`/dashboard/projects/${projectId}`);
  const handleToggleView = () => navigate(isMarketplaceView && userId ? `/dashboard/user/${userId}/projects` : '/dashboard/projects');
  const handleClearFilters = () => setFilters({ stage: [], mvpStatus: [], milestones: [], fundingStage: [] });

  const getPageHeader = () => {
    if (isMarketplaceView) return (
      <Card className="w-full mb-12 bg-secondary/50 border-none">
        <CardContent className="p-8 md:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              {userId && (
                <Button onClick={handleToggleView} variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4"/>{`Back to ${userName || 'User'}'s Projects`}
                </Button>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">The Visionary Builders' Marketplace</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">This is the heart of Iranian innovation—a living gallery of ambition, creativity, and resilience. Here, visionary builders showcase their ventures, from early-stage ideas to market-ready products.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-10">
                <div className="bg-background/60 p-6 rounded-lg transition-transform hover:scale-105"><div className="flex items-center gap-4 mb-2"><Eye className="h-7 w-7 text-primary" /><h3 className="text-xl font-semibold">Discover</h3></div><p className="text-muted-foreground">Groundbreaking new ventures and world-changing ideas.</p></div>
                <div className="bg-background/60 p-6 rounded-lg transition-transform hover:scale-105"><div className="flex items-center gap-4 mb-2"><LinkIcon className="h-7 w-7 text-primary" /><h3 className="text-xl font-semibold">Connect</h3></div><p className="text-muted-foreground">With the founders, investors, and talent behind them.</p></div>
                <div className="bg-background/60 p-6 rounded-lg transition-transform hover:scale-105"><div className="flex items-center gap-4 mb-2"><Sparkles className="h-7 w-7 text-primary" /><h3 className="text-xl font-semibold">Find</h3></div><p className="text-muted-foreground">Your next partner, opportunity, or inspiration.</p></div>
            </div>
            <p className="text-md text-muted-foreground">This is where the <em>Global Iranians Advantage</em> becomes tangible.</p>
          </div>
        </CardContent>
      </Card>
    );
    
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{userName ? `${userName}'s Public Projects` : "User's Public Projects"}</h1>
        <Button onClick={handleToggleView} variant="outline"><Users className="mr-2 h-4 w-4"/> Show All Projects</Button>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, index) => <ProjectCardSkeleton key={index} />)}</div>;
    if (error) return <div className="text-center py-20 bg-destructive/10 text-destructive rounded-lg p-4"><AlertCircle className="h-8 w-8 mx-auto mb-2" /><p>{error}</p></div>;
    if (sortedAndFilteredProjects.length === 0) return <p className="text-center text-muted-foreground py-20">{isMarketplaceView ? "No projects match your criteria. Try adjusting the filters." : "This user has no public projects."}</p>;
    
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{sortedAndFilteredProjects.map(project => <ProjectCard key={project.id} project={project} onViewProject={handleViewProject} showOwnerControls={false} isPublicView={true} />)}</div>;
  };
  
  const FilterGroup: React.FC<{title: string, options: string[], selected: string[], onSelectionChange: (selection: string[]) => void}> = ({ title, options, selected, onSelectionChange }) => (
    <div className="mb-6">
        <h4 className="font-semibold mb-3 text-card-foreground">{title}</h4>
        <div className="space-y-2">
            {options.map(option => (
                <div key={option} className="flex items-center">
                    <Checkbox id={`${title}-${option}`} checked={selected.includes(option)} onCheckedChange={checked => onSelectionChange(checked ? [...selected, option] : selected.filter(s => s !== option))} />
                    <Label htmlFor={`${title}-${option}`} className="ml-2 text-sm font-normal text-muted-foreground">{option}</Label>
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        {getPageHeader()}
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, description, or owner..." className="pl-9 w-full" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>

          {isMarketplaceView && (
            <div className="flex items-center gap-2">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt_desc">Latest</SelectItem>
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>

              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto"><Filter className="mr-0 md:mr-2 h-4 w-4" /><span className="hidden md:inline">Filters</span></Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col">
                  <SheetHeader><SheetTitle>Filter Projects</SheetTitle><SheetDescription>Refine your search to find the perfect project.</SheetDescription></SheetHeader>
                  <div className="py-4 flex-grow overflow-y-auto pr-4">
                    <FilterGroup title="Stage" options={STAGE_OPTIONS} selected={filters.stage} onSelectionChange={newValues => setFilters(prev => ({ ...prev, stage: newValues }))} />
                    <Separator className="my-4" />
                    <FilterGroup title="MVP Status" options={MVP_STATUS_OPTIONS} selected={filters.mvpStatus} onSelectionChange={newValues => setFilters(prev => ({ ...prev, mvpStatus: newValues }))} />
                    <Separator className="my-4" />
                    <FilterGroup title="Milestone" options={MILESTONE_OPTIONS} selected={filters.milestones} onSelectionChange={newValues => setFilters(prev => ({ ...prev, milestones: newValues }))} />
                    <Separator className="my-4" />
                    <FilterGroup title="Funding Stage" options={FUNDING_STAGE_OPTIONS} selected={filters.fundingStage} onSelectionChange={newValues => setFilters(prev => ({ ...prev, fundingStage: newValues }))} />
                  </div>
                  <SheetFooter><Button variant="ghost" onClick={handleClearFilters}>Clear All</Button><Button onClick={() => setIsSheetOpen(false)}>Done</Button></SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>

        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default PublicProjectsPage;
