
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Query, DocumentData, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle, Search, Users, ArrowLeft } from 'lucide-react';
import ProjectCard, { Project } from '@/components/dashboard/ProjectCard';

const PublicProjectsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const [isMarketplaceView, setIsMarketplaceView] = useState(!userId);
  const [userName, setUserName] = useState<string>('');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      setUserName('');

      try {
        let projectsQuery: Query;

        if (isMarketplaceView) {
          projectsQuery = query(collection(db, 'projects'), where("isPrivate", "==", false), orderBy("updatedAt", "desc"));
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

            // Safely handle the updatedAt field, which could be a Firestore Timestamp or undefined
            let updatedAtDate: Date | undefined = undefined;
            if (data.updatedAt) {
                if (data.updatedAt instanceof Timestamp) {
                    updatedAtDate = data.updatedAt.toDate();
                } else if (data.updatedAt.seconds) { // Handle cases where it's a plain object
                    updatedAtDate = new Timestamp(data.updatedAt.seconds, data.updatedAt.nanoseconds).toDate();
                } else if (data.updatedAt instanceof Date) {
                    updatedAtDate = data.updatedAt;
                }
            }

            return {
                id: doc.id,
                name: data.name || 'Unnamed Project',
                description: data.description || '',
                stage: data.stage || 'Unknown',
                progress: data.progress || 0,
                isPrivate: data.isPrivate ?? false,
                tasks: data.tasks || { completed: 0, total: 0 },
                ownerId: data.ownerId,
                ownerInfo: data.ownerInfo || {},
                tags: Array.isArray(data.tags) ? data.tags : [],
                fundingStage: data.fundingStage || '',
                mvpStatus: data.mvpStatus || '',
                milestones: Array.isArray(data.milestones) ? data.milestones.map(String) : [],
                updatedAt: updatedAtDate,
            } as Project;
        });
       
        setProjects(fetchedProjects);

        if (!isMarketplaceView && fetchedProjects.length > 0) {
          const ownerName = fetchedProjects[0].ownerInfo?.displayName;
          if (ownerName) {
            setUserName(ownerName);
          }
        }

      } catch (err: any) {
        console.error("Error fetching projects: ", err);
        if (err.code === 'failed-precondition') {
            setError("The database requires an index for this query. Please check the Firebase console. The error log in your browser's developer tools may have a direct link to create it.");
        } else {
            setError("Failed to load projects. Check console for details.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [userId, isMarketplaceView]);

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    const lowercasedTerm = searchTerm.toLowerCase();
    return projects.filter(p =>
      p.name.toLowerCase().includes(lowercasedTerm) ||
      p.description.toLowerCase().includes(lowercasedTerm) ||
      (p.ownerInfo?.displayName?.toLowerCase().includes(lowercasedTerm) ?? false)
    );
  }, [projects, searchTerm]);

  const handleToggleView = () => {
    setIsMarketplaceView(prev => !prev);
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/dashboard/projects/${projectId}`);
  };

  const getPageTitle = () => {
    if (isMarketplaceView) return "Project Marketplace";
    if (userName) return `${userName}'s Public Projects`;
    return "User's Public Projects";
  };

  const renderContent = () => {
    if (isLoading) return <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    if (error) return <div className="text-center py-20 bg-destructive/10 text-destructive rounded-lg p-4"><AlertCircle className="h-8 w-8 mx-auto mb-2" /><p>{error}</p></div>;
    if (filteredProjects.length === 0) return <p className="text-center text-muted-foreground py-20">{isMarketplaceView ? "No public projects found in the marketplace yet." : "This user has no public projects."}</p>;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
            <ProjectCard
                key={project.id}
                project={project}
                onViewProject={handleViewProject}
                showOwnerControls={false}
                isPublicView={true}
            />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
             {userId && (
                <Button onClick={handleToggleView} variant="outline">
                    {isMarketplaceView ? 
                      <><ArrowLeft className="mr-2 h-4 w-4"/>{`Back to ${userName || 'User'}'s Projects`}</> : 
                      <><Users className="mr-2 h-4 w-4"/> Show All Projects</>
                    }
                </Button>
            )}
        </div>

        {isMarketplaceView && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            <h2 className="font-semibold">Welcome to the Project Marketplace!</h2>
            <p className="text-sm">Discover innovative public projects from the Hamfounder community. Click 'View Project' to learn more.</p>
          </div>
        )}
       
        <div className="relative mb-8">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isMarketplaceView ? "Search by name, description, or owner..." : "Search by name or description..."}
              className="pl-9 w-full md:w-1/2 lg:w-1/3"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
        </div>

        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default PublicProjectsPage;
