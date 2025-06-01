import React, { useState, useEffect } from 'react';
import {
  Plus,
  Users,
  Calendar,
  MoreVertical,
  ChevronRight,
  Rocket,
  Lock,
  Globe,
  Briefcase,
  Search,
  Trash2 // Import Trash2 icon for delete
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
import { collection, query, where, onSnapshot, DocumentData, deleteDoc, doc } from 'firebase/firestore'; // Import deleteDoc and doc
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"; // Import DialogFooter and DialogClose
import ProjectForm from './ProjectForm';
import { useToast } from '@/hooks/use-toast'; // Import useToast


interface Project {
  id: string;
  name: string;
  description: string;
  stage: string;
  progress: number;
  isPrivate: boolean;
  team: { id: string; name: string; image?: string }[];
  lastUpdate: string;
  tasks: {
    completed: number;
    total: number;
  };
  ownerId: string;
  ownerInfo: {
    displayName?: string;
    profileImageUrl?: string;
  };
}


const MyProjects = () => {
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for delete dialog
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null); // State for project to delete


  const { user, loading: userLoading } = useUser();
  const { toast } = useToast(); // Initialize toast hook


  useEffect(() => {
    if (!userLoading && user) {
      const projectsCollectionRef = collection(db, 'projects');
      const q = query(projectsCollectionRef, where('ownerId', '==', user.uid));

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
            team: data.team || [],
            lastUpdate: data.lastUpdate || 'N/A',
            tasks: data.tasks || { completed: 0, total: 0 },
            ownerId: data.ownerId,
            ownerInfo: data.ownerInfo || {}
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


  const filteredProjects = filter === 'all' ? projects :
    projects.filter(project => {
      if (filter === 'private') return project.isPrivate;
      if (filter === 'public') return !project.isPrivate;
      return true;
    });

   const handleCreateNewProject = () => {
       setEditingProject(null);
       setIsFormOpen(true);
   };

   const handleEditProject = (project: Project) => {
       setEditingProject(project);
       setIsFormOpen(true);
   };

   // Function to handle clicking the Delete menu item
   const handleDeleteClick = (project: Project) => {
       setProjectToDelete(project); // Set the project to be deleted
       setIsDeleteDialogOpen(true); // Open the delete confirmation dialog
   };


   // Function to handle confirming the delete action
   const handleConfirmDelete = async () => {
       if (!projectToDelete) return;

       setIsDeleteDialogOpen(false); // Close the dialog immediately

       try {
           const projectRef = doc(db, 'projects', projectToDelete.id);
           await deleteDoc(projectRef); // Delete the document from Firestore

           toast({
               title: "Success",
               description: `${projectToDelete.name} deleted successfully!`,
           });

           setProjectToDelete(null); // Clear the projectToDelete state

       } catch (error) {
           console.error("Error deleting project:", error);
           toast({
               title: "Error",
               description: `Failed to delete ${projectToDelete.name}. Please try again.`,
               variant: "destructive",
           });
            setProjectToDelete(null); // Clear the state even on error
       }
   };


   const handleFormSuccess = () => {
       setIsFormOpen(false);
       setEditingProject(null);
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
            />
          </div>

          {/* New Project Button with Dialog Trigger */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-1 w-full sm:w-auto" onClick={handleCreateNewProject}>
                  <Plus className="h-4 w-4" />
                  New Project
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
              <DialogDescription>
                {editingProject ? 'Edit the details of your project.' : 'Fill in the details below to create a new project.'}
              </DialogDescription>
              <ProjectForm initialData={editingProject} onSuccess={handleFormSuccess} />
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

      {/* Display "No projects found" message only when filteredProjects is empty */}
      {filteredProjects.length === 0 ? (
         <div className="text-center text-slate-600 mt-8">
             <p>No projects found.</p>
             <p>Click "New Project" to create your first project.</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredProjects.map((project) => (
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
                       <DropdownMenuItem>View Project</DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleEditProject(project)}>Edit Details</DropdownMenuItem>
                       <DropdownMenuItem>Manage Team</DropdownMenuItem>
                       <DropdownMenuSeparator />
                       {/* Delete Project Menu Item - calls handleDeleteClick */}
                       <DropdownMenuItem
                           className="text-destructive"
                           onClick={() => handleDeleteClick(project)} // Call handler on click
                       >
                           <Trash2 className="h-4 w-4 mr-2" /> Delete Project
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>


                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-2 sm:gap-0">
                   <Badge
                     variant="outline"
                     className={`
                       ${project.stage === 'Ideation' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                       ${project.stage === 'Building' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
                       ${project.stage === 'Launching' ? 'bg-green-50 text-green-600 border-green-200' : ''}
                       ${project.stage === 'Scaling' ? 'bg-amber-50 text-amber-600 border-amber-200' : ''}
                       ${project.stage === 'Unknown' ? 'bg-gray-50 text-gray-600 border-gray-200' : ''}
                     `}
                   >
                     <Rocket className="h-3 w-3 mr-1" />
                     {project.stage} Stage
                   </Badge>
                   {/* lastUpdate is not in Firestore project document */}
                   {/* <span className="text-xs text-slate-500">Updated {project.lastUpdate}</span> */}
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


                 <Button variant="outline" size="sm" className="w-full mt-2">
                   View Project <ChevronRight className="h-4 w-4 ml-1" />
                 </Button>
               </CardContent>
             </Card>
           ))}
         </div>
      )}

      {/* Delete Confirmation Dialog */}
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
