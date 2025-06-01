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
  Search
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
import { useUser } from '@/contexts/UserContext'; // Import the useUser hook
import { db } from '@/lib/firebase'; // Import the Firestore instance
import { collection, query, where, onSnapshot, DocumentData } from 'firebase/firestore'; // Import necessary Firestore functions


interface Project {
  id: string; // Changed id type to string to match Firestore document ID
  name: string;
  description: string;
  stage: string;
  progress: number;
  isPrivate: boolean;
  team: { id: string; name: string; image?: string }[]; // Assuming team member IDs are strings and image is optional
  lastUpdate: string; // Keep as string for now, could be a Date
  tasks: {
    completed: number;
    total: number;
  };
  ownerId: string; // Added ownerId to project interface
  ownerInfo: { // Added ownerInfo to project interface
    displayName?: string;
    profileImageUrl?: string;
  };
}


const MyProjects = () => {
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]); // State to hold real project data
  const [loading, setLoading] = useState(true); // Loading state for fetching projects
  const [error, setError] = useState<string | null>(null); // Error state


  const { user, loading: userLoading } = useUser(); // Get user and loading state from context


  useEffect(() => {
    // Fetch projects when user is authenticated and not loading
    if (!userLoading && user) {
      const projectsCollectionRef = collection(db, 'projects');
      // Create a query to get projects where ownerId matches the current user's uid
      const q = query(projectsCollectionRef, where('ownerId', '==', user.uid));

      // Set up a real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const projectsData: Project[] = snapshot.docs.map(doc => {
           const data = doc.data() as DocumentData;
           return {
            id: doc.id,
            name: data.name || 'Unnamed Project', // Provide default if data is missing
            description: data.description || '',
            stage: data.stage || 'Unknown',
            progress: data.progress || 0,
            isPrivate: data.isPrivate ?? false, // Use nullish coalescing for boolean
            team: data.team || [], // Provide empty array if missing
            lastUpdate: data.lastUpdate || 'N/A',
            tasks: data.tasks || { completed: 0, total: 0 }, // Provide default if missing
            ownerId: data.ownerId,
            ownerInfo: data.ownerInfo || {} // Provide empty object if missing
           } as Project; // Cast to Project type
        });
        setProjects(projectsData);
        setLoading(false); // Data fetched, set loading to false
      }, (err) => {
        console.error("Error fetching user projects:", err);
        setError("Failed to load projects.");
        setLoading(false); // Error occurred, set loading to false
      });

      // Cleanup the listener on component unmount
      return () => unsubscribe();
    } else if (!userLoading && !user) {
        // If user is not logged in after loading, clear projects and stop loading
        setProjects([]);
        setLoading(false);
    }
  }, [user, userLoading]); // Rerun effect when user or userLoading changes


  // Filter projects based on the selected filter (now uses real data)
  const filteredProjects = filter === 'all' ? projects :
    projects.filter(project => {
      if (filter === 'private') return project.isPrivate;
      if (filter === 'public') return !project.isPrivate;
      return true;
    });

  if (loading || userLoading) {
      return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
             {/* Basic loading indicator */}
             <div className="text-center text-slate-600">Loading projects...</div>
        </div>
      );
  }

  if (error) {
       return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
             {/* Display error message */}
             <div className="text-center text-red-600">Error: {error}</div>
        </div>
       );
  }

  if (filteredProjects.length === 0) {
      return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
               {/* Search and New Project button - keep them even if no projects */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full sm:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      className="pl-9 pr-4 py-2 text-sm border rounded-md w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                   <Button className="flex items-center gap-1 w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                    New Project
                  </Button>
                </div>
            </div>
             {/* Filter buttons */}
             <div className="flex gap-2 overflow-x-auto pb-2">
                <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>All Projects</Button>
                <Button variant={filter === 'public' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('public')}><Globe className="h-4 w-4 mr-1" /> Public</Button>
                <Button variant={filter === 'private' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('private')}><Lock className="h-4 w-4 mr-1" /> Private</Button>
              </div>
             {/* Message when no projects are found */}
             <div className="text-center text-slate-600 mt-8">
                 <p>No projects found.</p>
                 <p>Click "New Project" to create your first project.</p>
             </div>
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


          <Button className="flex items-center gap-1 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
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


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Use filteredProjects (which now contains real data or is empty) */}
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
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem>Manage Team</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Delete Project
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
                    ${project.stage === 'Unknown' ? 'bg-gray-50 text-gray-600 border-gray-200' : ''} {/* Added unknown stage styling */}
                  `}
                >
                  <Rocket className="h-3 w-3 mr-1" />
                  {project.stage} Stage
                </Badge>
                {/* lastUpdate is not in Firestore project document, remove or handle appropriately */}
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
                 {/* Team members display - Needs adjustment if team structure is different in Firestore */}
                <div className="flex -space-x-2">
                   {/* Display owner's profile image and name */}
                   {project.ownerInfo && (
                       <Avatar key={project.ownerId} className="border-2 border-white h-8 w-8">
                           <AvatarImage src={project.ownerInfo.profileImageUrl} />
                           <AvatarFallback className="text-xs">
                               {project.ownerInfo.displayName ? project.ownerInfo.displayName.charAt(0) : project.ownerId.charAt(0)}
                            </AvatarFallback>
                       </Avatar>
                   )}
                   {/* Add other team members here if they are stored in the project document */}
                   {/* project.team.map((member) => ( ... )) */}
                 </div>
                {/* Task count display */}
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
    </div>
  );
};


export default MyProjects;
