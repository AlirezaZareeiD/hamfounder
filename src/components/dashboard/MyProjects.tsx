
import { useState, useEffect } from 'react';
import {
  Plus,
  Globe,
  Lock,
  Search,
  Trash2,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useUser } from '@/contexts/UserContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, DocumentData, deleteDoc, doc } from 'firebase/firestore';
import CreateProjectForm from './CreateProjectForm';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ProjectCard, { Project } from './ProjectCard'; // Import the new reusable ProjectCard

const MyProjects = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!userLoading && user) {
      const q = query(collection(db, 'projects'), where('ownerId', '==', user.uid));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const projectsData: Project[] = snapshot.docs.map(doc => {
           const data = doc.data() as DocumentData;
           return {
            id: doc.id,
            name: data.name || 'Unnamed Project',
            description: data.description || '',
            stage: data.stage || 'Unknown',
            progress: data.progress || 0,
            isPrivate: data.isPrivate ?? false,
            team: Array.isArray(data.team) ? data.team : [],
            tasks: data.tasks || { completed: 0, total: 0 },
            ownerId: data.ownerId,
            ownerInfo: data.ownerInfo || {},
            tags: Array.isArray(data.tags) ? data.tags : [],
            fundingStage: data.fundingStage || '',
            mvpStatus: data.mvpStatus || '',
            milestones: Array.isArray(data.milestones) ? data.milestones.map(String) : [],
           } as Project;
        });
        setProjects(projectsData);
        setLoading(false);
      }, (err) => {
        console.error("Error fetching user projects:", err);
        setError("Failed to load projects.");
        setLoading(false);
      });

      return () => unsubscribe();
    } else if (!userLoading && !user) {
        setProjects([]);
        setLoading(false);
    }
  }, [user, userLoading]);

  const filteredAndSearchedProjects = projects.filter(project => {
      const filterMatch = filter === 'all' || (filter === 'public' && !project.isPrivate) || (filter === 'private' && project.isPrivate);
      const searchMatch = searchTerm.trim() === '' || project.name.toLowerCase().includes(searchTerm.toLowerCase());
      return filterMatch && searchMatch;
  });

   const handleDeleteClick = (project: Project) => {
       setProjectToDelete(project);
       setIsDeleteDialogOpen(true);
   };

   const handleConfirmDelete = async () => {
       if (!projectToDelete) return;
       setIsDeleteDialogOpen(false);
       try {
           await deleteDoc(doc(db, 'projects', projectToDelete.id));
           toast({ title: "Success", description: `Project "${projectToDelete.name}" deleted.` });
       } catch (error) {
           console.error("Error deleting project:", error);
           toast({ title: "Error", description: "Failed to delete project.", variant: "destructive" });
       }
   };

   const handleViewProject = (projectId: string) => {
       navigate(`/dashboard/projects/${projectId}`);
   };

  if (loading || userLoading) {
      return <div className="text-center p-8">Loading projects...</div>;
  }

  if (error) {
       return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-9 pr-4 py-2 text-sm border rounded-md w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-1 w-full sm:w-auto" onClick={() => setIsCreateFormOpen(true)}>
                  <Plus className="h-4 w-4" /> New Project
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto flex flex-col">
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Fill in the details to create a new project.</DialogDescription>
              <CreateProjectForm onSuccess={() => setIsCreateFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>All Projects</Button>
        <Button variant={filter === 'public' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('public')}>
          <Globe className="h-4 w-4 mr-1" /> Public
        </Button>
        <Button variant={filter === 'private' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('private')}>
          <Lock className="h-4 w-4 mr-1" /> Private
        </Button>
      </div>

      {filteredAndSearchedProjects.length === 0 ? (
         <div className="text-center text-slate-600 mt-8">
             <p>No projects found. Click "New Project" to get started.</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredAndSearchedProjects.map((project) => (
             <ProjectCard 
                key={project.id} 
                project={project} 
                onViewProject={handleViewProject}
                onDeleteProject={handleDeleteClick}
                showOwnerControls={true} // <-- Show owner controls on the dashboard
             />
           ))}
         </div>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>Are you sure you want to delete "{projectToDelete?.name}"?</DialogDescription>
              <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button variant="destructive" onClick={handleConfirmDelete}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyProjects;
