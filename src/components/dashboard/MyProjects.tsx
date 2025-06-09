import React, { useState, useEffect } from 'react';
import {
  Plus,
  Users,
  Calendar,
  MoreVertical,
  ChevronRight, // Keep ChevronRight for the button icon
  Rocket,
  Lock,
  Globe,
  Briefcase,
  Search,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useUser } from '@/contexts/UserContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, DocumentData, deleteDoc, doc } from 'firebase/firestore'; // Import getDoc, doc, deleteDoc
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import CreateProjectForm from './CreateProjectForm'; // Import CreateProjectForm
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation


interface Document {
    id: string;
    name: string;
    url?: string | null; // Expect null or string, not undefined
    description?: string;
    // file, uploadProgress, uploadError are not in Firestore documents
}

interface Project {
  id: string;
  name: string;
  description: string;
  stage: string;
  progress: number;
  isPrivate: boolean;
  team: { id: string; name: string; image?: string }[]; // Assuming team structure
  // lastUpdate: string; // Note: This is likely not in Firestore and might need to be removed or calculated
  tasks: {
    completed: number;
    total: number;
  };
  ownerId: string;
  ownerInfo: {
    displayName?: string;
    profileImageUrl?: string;
  };
  // Added fields from ProjectForm
  fundingStage: string;
  mvpStatus: string;
  milestones: string[]; // Updated to string[] based on ProjectDetailsPage
  tags: string[];
  documents: Document[];
  createdAt: any; // Timestamp
  updatedAt: any; // Timestamp
}


const MyProjects = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false); // Renamed state for clarity
  // editingProject state is no longer needed for opening the form from this page
  // const [editingProject, setEditingProject] = useState<Project | null>(null); // Removed
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const navigate = useNavigate(); // Initialize navigate hook
  const location = useLocation(); // Initialize useLocation hook
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();


    // Removed the useEffect block that checked for editProjectId query parameter


  useEffect(() => {
    if (!userLoading && user) {
      const projectsCollectionRef = collection(db, 'projects');
      // Query only for projects owned by the current user
      const q = query(projectsCollectionRef, where('ownerId', '==', user.uid));

      console.log("Setting up Firestore listener for user:", user.uid);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log("Received project snapshot.");
        const projectsData: Project[] = snapshot.docs.map(doc => {
           const data = doc.data() as DocumentData;
            console.log(`Processing document ${doc.id}:`, data); // Log document data

            // Ensure milestones is treated as an array of strings during mapping
            let milestonesArray: string[] = [];
            if (data.milestones) {
                if (Array.isArray(data.milestones)) {
                    milestonesArray = data.milestones.map((m: any) => String(m)); // Ensure elements are strings
                } else if (typeof data.milestones === 'string' && data.milestones.trim() !== '') {
                    milestonesArray = [data.milestones]; // Treat non-empty string as single milestone
                }
            }


           return {
            id: doc.id,
            name: data.name || 'Unnamed Project',
            description: data.description || '',
            stage: data.stage || 'Unknown',
            progress: data.progress || 0, // Assuming progress is stored
            isPrivate: data.isPrivate ?? false,
            team: Array.isArray(data.team) ? data.team : [], // Ensure team is an array
            // lastUpdate: data.lastUpdate || 'N/A', // Keep or remove based on Firestore schema
            tasks: data.tasks || { completed: 0, total: 0 }, // Assuming tasks structure
            ownerId: data.ownerId,
            ownerInfo: data.ownerInfo || {}, // Assuming ownerInfo structure
            tags: Array.isArray(data.tags) ? data.tags : [], // Ensure tags is an array
            // ADDED: Read new fields from Firestore data
            fundingStage: data.fundingStage || '',
            mvpStatus: data.mvpStatus || '',
            milestones: milestonesArray, // Use the processed milestones array
            documents: Array.isArray(data.documents) ? data.documents : [], // Ensure documents is an array
            createdAt: data.createdAt || null, // Read createdAt
            updatedAt: data.updatedAt || null, // Read updatedAt
           } as Project;
        });
        console.log("Processed projects data:", projectsData);
        setProjects(projectsData);
        setLoading(false);
      }, (err) => {
        console.error("Error fetching user projects:", err);
        setError("Failed to load projects.");
        setLoading(false);
      });

      return () => {
          console.log("Unsubscribing from Firestore listener.");
          unsubscribe();
      }
    } else if (!userLoading && !user) {
        console.log("User not logged in. Clearing projects.");
        setProjects([]);
        setLoading(false);
    } else {
        console.log("User loading or user not available yet.");
    }
  }, [user, userLoading]); // Depend on user and userLoading


  const filteredAndSearchedProjects = projects.filter(project => {
      const filterMatch = filter === 'all' ||
                          (filter === 'public' && !project.isPrivate) ||
                          (filter === 'private' && project.isPrivate);

      // Include searching in new fields like tags, fundingStage, mvpStatus, milestones, document names/descriptions
      const searchMatch = searchTerm.trim() === '' ||
                          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           project.fundingStage.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.mvpStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           // Search within milestones array
                           project.milestones.some(milestone => milestone.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           project.documents.some(doc =>
                               doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (doc.description || '').toLowerCase().includes(searchTerm.toLowerCase())
                           );


      return filterMatch && searchMatch;
  });


   const handleCreateNewProject = () => {
       console.log("Opening form for new project.");
       setIsCreateFormOpen(true); // Open the create form dialog
   };

   // handleEditProject is removed as editing starts from the details page


   const handleDeleteClick = (project: Project) => {
       console.log("Confirming deletion for project:", project.id);
       setProjectToDelete(project);
       setIsDeleteDialogOpen(true);
   };

   const handleConfirmDelete = async () => {
       if (!projectToDelete) {
           console.warn("No project selected for deletion.");
           return;
       }

       setIsDeleteDialogOpen(false);
       console.log("Proceeding with deletion for project:", projectToDelete.id);

       try {
           // Assuming deleteDoc and doc are imported from 'firebase/firestore'
           const projectRef = doc(db, 'projects', projectToDelete.id);
           await deleteDoc(projectRef);

           toast({
               title: "Success",
               description: `${projectToDelete.name} deleted successfully!`,
           });

           console.log("Project deleted successfully:", projectToDelete.id);
           setProjectToDelete(null); // Clear the projectToDelete state

       } catch (error) {
           console.error("Error deleting project:", error);
           toast({
               title: "Error",
               description: `Failed to delete ${projectToDelete.name}. Please try again.`,
               variant: "destructive",
           });
           setProjectToDelete(null); // Clear the projectToDelete state even on error
       }
   };

    // Renamed handleFormSuccess to handleCreateFormSuccess for clarity
   const handleCreateFormSuccess = () => {
       console.log("Create project form submitted successfully. Closing form.");
       setIsCreateFormOpen(false); // Close the create form dialog
       // The onSnapshot listener will automatically update the projects list
   };

   // Function to navigate to Project Details page
   const handleViewProject = (projectId: string) => {
       console.log("Navigating to project details page for ID:", projectId);
       navigate(`/dashboard/projects/${projectId}`); // Navigate to the specific project details URL
   };


  if (loading || userLoading) {
      return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
             <div className="text-center text-slate-600">Loading projects...</div>
        </div>
      );
  }

  if (error) {
       return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
             <div className="text-center text-red-600">Error: {error}</div>
        </div>
       );
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

          {/* Dialog for creating a new project */}
          <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-1 w-full sm:w-auto" onClick={handleCreateNewProject}>
                  <Plus className="h-4 w-4" />
                  New Project
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto flex flex-col">
              <DialogTitle>Create New Project</DialogTitle> {/* Title updated */}
              <DialogDescription>
                Fill in the details below to create a new project. {/* Description updated */}
              </DialogDescription>
              {/* Use CreateProjectForm for creation */}
              <CreateProjectForm onSuccess={handleCreateFormSuccess} /> {/* Pass onSuccess */}
            </DialogContent>
          </Dialog>

        </div>
      </div>


      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Projects
        </Button>
        <Button
          variant={filter === 'public' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('public')}
        >
          <Globe className="h-4 w-4 mr-1" />
          Public
        </Button>
        <Button
          variant={filter === 'private' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('private')}
        >
          <Lock className="h-4 w-4 mr-1" />
          Private
        </Button>
      </div>

      {filteredAndSearchedProjects.length === 0 ? (
         <div className="text-center text-slate-600 mt-8">
             <p>No projects found matching your criteria.</p>
             {searchTerm.trim() === '' && filter === 'all' && (
                 <p>Click "New Project" to create your first project.</p>
             )}
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredAndSearchedProjects.map((project) => (
             <Card key={project.id} className="relative group hover:shadow-md transition-shadow">
               <CardHeader className="pb-2">
                 <CardTitle className="text-lg font-bold text-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                   <div className="flex items-center">
                     <span>{project.name}</span>
                     {project.isPrivate && <Lock className="h-4 w-4 text-slate-400 ml-2" />}
                   </div>
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <Button variant="ghost" size="icon" className="h-8 w-8">
                         <MoreVertical className="h-4 w-4" />
                       </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                       {/* Updated onClick to navigate */}
                       <DropdownMenuItem onClick={() => handleViewProject(project.id)}>
                           View Project
                       </DropdownMenuItem>
                       {/* Removed Edit Details dropdown item */}
                       <DropdownMenuItem>Manage Team</DropdownMenuItem>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem
                           className="text-destructive"
                           onClick={() => handleDeleteClick(project)}
                       >
                           <Trash2 className="h-4 w-4 mr-2" /> Delete Project
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>

                 {/* Display new fields */}
                 {project.fundingStage && (
                     <div className="text-sm text-slate-600 flex items-center"><Briefcase className="h-4 w-4 mr-1 text-slate-500" /> Funding Stage: {project.fundingStage}</div>
                 )}
                  {project.mvpStatus && (
                      <div className="text-sm text-slate-600 flex items-center"><Rocket className="h-4 w-4 mr-1 text-slate-500" /> MVP Status: {project.mvpStatus}</div>
                  )}
                   {project.milestones && project.milestones.length > 0 && ( // Check if it's an array before mapping
                      <div className="text-sm text-slate-600 flex items-center"><Calendar className="h-4 w-4 mr-1 text-slate-500" /> Milestone: {project.milestones.join(', ')}</div>
                   )}
                   {project.tags && project.tags.length > 0 && (
                       <div className="flex flex-wrap gap-1">
                           {project.tags.map(tag => (
                               <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                           ))}
                       </div>
                   )}


                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-2 sm:gap-0">
                   <Badge
                     variant="outline"
                     className={`
                       ${project.stage === 'Idea' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                       ${project.stage === 'Prototype' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
                       ${project.stage === 'MVP' ? 'bg-green-50 text-green-600 border-green-200' : ''}
                       ${project.stage === 'Early Stage' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : ''}
                       ${project.stage === 'Growth Stage' ? 'bg-teal-50 text-teal-600 border-teal-200' : ''}
                       ${project.stage === 'Mature' ? 'bg-gray-50 text-gray-600 border-gray-200' : ''}
                       ${project.stage === 'Unknown' ? 'bg-gray-50 text-gray-600 border-gray-200' : ''}
                     `}
                   >
                     <Rocket className="h-3 w-3 mr-1" />
                     {project.stage} Stage
                   </Badge>
                 </div>


                 <div>
                   <div className="flex justify-between text-sm mb-1">
                     <span>Project Progress</span>
                     <span className="font-medium">{project.progress}%</span>
                   </div>
                   <Progress value={project.progress} className="h-1.5" />
                 </div>


                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                     <div className="flex -space-x-2">
                        {project.ownerInfo && (
                            <Avatar key={project.ownerId} className="border-2 border-white h-8 w-8">
                                <AvatarImage src={project.ownerInfo.profileImageUrl} />
                                <AvatarFallback className="text-xs">
                                    {project.ownerInfo.displayName ? project.ownerInfo.displayName.charAt(0) : project.ownerId.charAt(0)}
                                 </AvatarFallback>
                            </Avatar>
                        )}
                      </div>
                     <div className="text-xs text-slate-500 flex items-center">
                       <Briefcase className="h-3 w-3 mr-1" />
                       {project.tasks.completed}/{project.tasks.total} tasks
                     </div>
                   </div>


                 {/* The button at the bottom of the card can also navigate */}
                 {/* Updated onClick to navigate */}
                 <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handleViewProject(project.id)}>
                   View Project <ChevronRight className="h-4 w-4 ml-1" />
                 </Button>
               </CardContent>
             </Card>
           ))}
         </div>
      )}

      {/* Dialog for confirming project deletion */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                  Are you sure you want to delete the project "{projectToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
              <DialogFooter>
                  <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={handleConfirmDelete}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

    </div>
  );
};


export default MyProjects;
