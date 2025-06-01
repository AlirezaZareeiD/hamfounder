import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge"; // Import Badge component
import { Progress } from "@/components/ui/progress"; // Assuming Progress is also used
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming Avatar is also used
import { Rocket, Lock, Globe, Briefcase } from 'lucide-react'; // Assuming these icons are used


interface Project {
    id: string;
    name: string;
    description: string;
    stage: string;
    progress: number;
    isPrivate: boolean;
    // Add other fields as needed based on your project schema
    ownerId: string;
    ownerInfo?: {
        displayName?: string;
        profileImageUrl?: string;
    };
    createdAt: any;
    updatedAt: any;
    tasks: {
        completed: number;
        total: number;
    };
    milestones?: any[];
    documents?: any[];
    fundingStage?: string;
    mvpStatus?: string;
    team?: any[];
}


const ProjectDetailsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();


  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setError("Project ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const projectRef = doc(db, 'projects', projectId);
        const projectSnap = await getDoc(projectRef);

        if (projectSnap.exists()) {
          const data = projectSnap.data() as DocumentData;
          setProject({
            id: projectSnap.id,
            name: data.name || 'Unnamed Project',
            description: data.description || 'No description provided.',
            stage: data.stage || 'Unknown',
            progress: data.progress || 0,
            isPrivate: data.isPrivate ?? false,
            ownerId: data.ownerId || '',
            ownerInfo: data.ownerInfo,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            tasks: data.tasks || { completed: 0, total: 0 },
            milestones: data.milestones || [],
            documents: data.documents || [],
            fundingStage: data.fundingStage || '',
            mvpStatus: data.mvpStatus || '',
            team: data.team || [],
            // ... fetch other fields
          } as Project);
           setLoading(false);
        } else {
          setError("Project not found.");
          setLoading(false);
           toast({
               title: "Error",
               description: "Project not found.",
               variant: "destructive",
           });
        }
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Failed to load project details.");
        setLoading(false);
         toast({
             title: "Error",
             description: "Failed to load project details. Please try again.",
             variant: "destructive",
         });
      }
    };

    fetchProject();

  }, [projectId, toast]);


  if (loading) {
    return <div className="text-center text-slate-600 mt-8">Loading project details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 mt-8">Error: {error}</div>;
  }

  if (!project) {
       return <div className="text-center text-slate-600 mt-8">No project data available.</div>;
  }


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">{project.name}</h1>
      <p className="text-lg text-slate-700 mb-6">{project.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
              <h2 className="text-xl font-semibold mb-2 text-slate-700">Stage</h2>
               <Badge
                     variant="outline"
                     className={`
                       ${project.stage === 'Ideation' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                       ${project.stage === 'Building' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
                       ${project.stage === 'Launching' ? 'bg-green-50 text-green-600 border-green-200' : ''}
                       ${project.stage === 'Scaling' ? 'bg-amber-50 text-amber-600 border-amber-200' : ''}
                       ${project.stage === 'Unknown' ? 'bg-gray-50 text-gray-600 border-gray-200' : ''}
                       text-base px-3 py-1
                     `}
                   >
                     <Rocket className="h-4 w-4 mr-2" />
                     {project.stage} Stage
                   </Badge>
          </div>

           <div>
               <h2 className="text-xl font-semibold mb-2 text-slate-700">Visibility</h2>
               <Badge variant="outline" className="text-base px-3 py-1">
                    {project.isPrivate ? (
                        <Lock className="h-4 w-4 mr-2" />
                    ) : (
                        <Globe className="h-4 w-4 mr-2" />
                    )}
                   {project.isPrivate ? 'Private' : 'Public'}
               </Badge>
           </div>

            <div>
               <h2 className="text-xl font-semibold mb-2 text-slate-700">Progress</h2>
                <div className="flex items-center gap-3">
                    <Progress value={project.progress} className="h-2 w-3/4" />
                    <span className="font-medium text-slate-800">{project.progress}%</span>
                </div>
           </div>

           <div>
               <h2 className="text-xl font-semibold mb-2 text-slate-700">Tasks</h2>
                <div className="text-slate-600">
                   {project.tasks.completed} of {project.tasks.total} tasks completed
                </div>
           </div>

           <div>
               <h2 className="text-xl font-semibold mb-2 text-slate-700">Owner</h2>
                <div className="flex items-center gap-3">
                   {project.ownerInfo && (
                       <Avatar className="h-10 w-10">
                           <AvatarImage src={project.ownerInfo.profileImageUrl} />
                            <AvatarFallback>
                                {project.ownerInfo.displayName ? project.ownerInfo.displayName.charAt(0) : project.ownerId.charAt(0)}
                            </AvatarFallback>
                       </Avatar>
                   )}
                   <span className="text-slate-700">{project.ownerInfo?.displayName || 'Unknown User'}</span>
                </div>
           </div>

      </div>

    </div>
  );
};


export default ProjectDetailsPage;
