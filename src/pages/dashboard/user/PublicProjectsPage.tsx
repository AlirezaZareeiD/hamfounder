import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Query, DocumentData } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle, Search, Users } from 'lucide-react';
// FIX: Correctly import the reusable ProjectCard component and its associated Project interface
import ProjectCard, { Project } from '@/components/dashboard/ProjectCard';


const PublicProjectsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let projectsQuery: Query = query(collection(db, 'projects'), where("isPrivate", "==", false));


        // If a userId is present in the URL, filter projects for that specific user
        if (userId) {
          projectsQuery = query(projectsQuery, where("ownerId", "==", userId));
        }


        const querySnapshot = await getDocs(projectsQuery);
        const fetchedProjects = querySnapshot.docs.map(doc => {
            const data = doc.data() as DocumentData;
            // Map the Firestore data to the comprehensive Project interface
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
            } as Project;
        });
       
        setProjects(fetchedProjects);


      } catch (err) {
        console.error("Error fetching projects: ", err);
        setError("Failed to load projects. A Firestore index might be required. Check the console for a link to create it.");
      } finally {
        setIsLoading(false);
      }
    };


    fetchProjects();
  }, [userId]);


  const filteredProjects = useMemo(() => {
    if (!searchTerm) {
      return projects;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return projects.filter(p =>
      p.name.toLowerCase().includes(lowercasedTerm) ||
      p.description.toLowerCase().includes(lowercasedTerm)
    );
  }, [projects, searchTerm]);


  // Navigate to the detailed view of a specific project
  const handleViewProject = (projectId: string) => {
    navigate(`/dashboard/projects/${projectId}`);
  };


  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }
    if (error) {
      return <div className="flex flex-col items-center justify-center py-20 bg-destructive/10 text-destructive rounded-lg"><AlertCircle className="h-8 w-8 mb-2" /><p>{error}</p></div>;
    }
    if (filteredProjects.length === 0) {
        return <p className="text-center text-muted-foreground py-20">{userId ? "This user has no public projects." : "No public projects found."}</p>;
    }
    return (
      // Use the new grid layout for the cards
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* FIX: Use the new ProjectCard component and pass the correct props */}
        {filteredProjects.map(project => (
            <ProjectCard
                key={project.id}
                project={project}
                onViewProject={handleViewProject}
                showOwnerControls={false} // <-- Explicitly hide owner controls
            />
        ))}
      </div>
    );
  };


  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold">{userId ? "User's Public Projects" : "All Public Projects"}</h1>
             {/* This button is now correctly routed */}
             {userId && (
                <Button onClick={() => navigate('/dashboard/projects')} variant="outline">
                    <Users className="mr-2 h-4 w-4"/> Show All Projects
                </Button>
            )}
        </div>
       
        <div className="relative mb-6">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or description..."
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
