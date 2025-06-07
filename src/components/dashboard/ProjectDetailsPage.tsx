import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { db } from '@/lib/firebase'; // Assuming db is initialized here
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Rocket, Lock, Globe, Briefcase, ArrowLeft, Edit2 } from 'lucide-react'; // Import ArrowLeft and Edit2
import { Button } from "@/components/ui/button"; // Import Button
import { useUser } from '@/contexts/UserContext'; // Import useUser context


// Assuming you have a config file or env variable for Firebase Project ID / Storage Bucket Name
// You might need to adjust this based on your project setup
// Example:
// import { firebaseConfig } from '@/lib/firebase';
// const FIREBASE_STORAGE_BUCKET = firebaseConfig.storageBucket; // Or get it from process.env

// IMPORTANT: Replace with your actual Firebase Storage Bucket Name.
// This is usually found in your Firebase project settings -> Project settings -> General -> Your project's Firebase services -> Storage -> Bucket URL (without the gs:// prefix).
// Example: "your-firebase-project-id.appspot.com"
// It's highly recommended to store this in an environment variable (e.g., REACT_APP_FIREBASE_STORAGE_BUCKET)
// and access it using process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
const FIREBASE_STORAGE_BUCKET = "hamfounder-demo-2025.firebasestorage.app";


// Define the Document interface
interface ProjectDocument {
    id: string; // Document ID in the documents array
    name: string; // File name
    url?: string | null; // Optional URL (saved after upload - now we prioritize building from ID)
    description?: string;
    token?: string; // Optional token (if needed for public access and stored)
    uploadError?: string; // Optional field to indicate upload errors during form submission
}

interface Project {
    id: string; // Document ID of the project in 'projects' collection
    name: string;
    description: string;
    stage: string;
    progress: number;
    isPrivate: boolean;
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
    milestones?: string[];
    documents?: ProjectDocument[]; // Use the specific ProjectDocument interface
    fundingStage?: string;
    mvpStatus?: string;
    team?: any[];
    tags?: string[];
}


const ProjectDetailsPage = () => {
  const { projectId } = useParams<{ projectId: string }>(); // This projectId is the Document ID of the project
  const navigate = useNavigate(); // Initialize navigate hook
  const { user, loading: userLoading } = useUser(); // Get user and loading state from context

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to construct the download URL
  const getDownloadUrl = (projectDocumentId: string, docId: string, docName: string, token?: string): string | null => {
      if (!FIREBASE_STORAGE_BUCKET) {
          console.error("Firebase Storage Bucket is not configured.");
          // Consider showing a user-friendly message or error in the UI
          return null;
      }
       if (!projectDocumentId || !docId || !docName) {
           console.warn("Missing information to construct download URL:", { projectDocumentId, docId, docName });
           return null;
       }


      // Encode the file path in the bucket
      // Path structure: projects/<projectDocumentId>/documents/<docId>/<docName>
      // projectDocumentId here is the ID of the document in the 'projects' collection
      const encodedFilePath = encodeURIComponent(`projects/${projectDocumentId}/documents/${docId}/${docName}`);

      // Construct the base URL
      let downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_STORAGE_BUCKET}/o/${encodedFilePath}?alt=media`;

      // Add token if it exists and is needed
      if (token) {
          downloadUrl += `&token=${token}`;
      } else {
          // Optional: Log a warning if no token but public access might be required
          // This depends on your Firebase Storage Rules
          // console.warn(`No token available for document ${docName}. Public access required in Storage Rules.`);
      }

      return downloadUrl;
  };


  useEffect(() => {
    const fetchProject = async () => {
      console.log("Fetching project details for projectId:", projectId);
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
          console.log("Project data fetched:", data);


          // Map documents to ensure they conform to ProjectDocument interface
          // We will prioritize using the ID and name to construct the URL
          const documents: ProjectDocument[] = Array.isArray(data.documents)
            ? data.documents.map((docData: any) => ({
                id: docData.id || Math.random().toString(36).substring(2, 15), // Ensure ID exists (fallback)
                name: docData.name || 'Unnamed File',
                description: docData.description || undefined, // Keep description as undefined if empty
                url: docData.url === undefined ? null : docData.url, // Keep any existing URL but we will build it
                token: docData.token || undefined, // Include token if stored
                uploadError: docData.uploadError || undefined, // Include upload error if stored
            }))
            : []; // Default to empty array if documents field is missing or not an array

            // Ensure milestones is treated as an array of strings
            let milestonesArray: string[] = [];
            if (data.milestones) {
                if (Array.isArray(data.milestones)) {
                    milestonesArray = data.milestones.map((m: any) => String(m)); // Ensure elements are strings
                } else if (typeof data.milestones === 'string' && data.milestones.trim() !== '') {
                    milestonesArray = [data.milestones]; // Treat non-empty string as single milestone
                }
            }


          const fetchedProject: Project = {
            id: projectSnap.id, // This is the Project Document ID
            name: data.name || 'Unnamed Project',
            description: data.description || 'No description provided.',
            stage: data.stage || 'Unknown',
            progress: data.progress || 0,
            isPrivate: data.isPrivate ?? false, // Use nullish coalescing for boolean
            ownerId: data.ownerId || '',
            ownerInfo: data.ownerInfo,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            tasks: data.tasks || { completed: 0, total: 0 },
            milestones: milestonesArray, // Use the processed milestones array
            documents: documents, // Use the mapped documents array
            fundingStage: data.fundingStage || '',
            mvpStatus: data.mvpStatus || '',
            team: Array.isArray(data.team) ? data.team : [], // Ensure team is an array
            tags: Array.isArray(data.tags) ? data.tags : [], // Ensure tags is an array
          };

          console.log("Processed Project Object:", fetchedProject);
          setProject(fetchedProject);
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

  }, [projectId, toast]); // Depend on projectId and toast


    // Handle navigation back to the dashboard projects list
    const handleBackToProjects = () => {
        console.log("Navigating back to /dashboard");
        navigate('/dashboard/'); // Assuming this is the route for the projects list
        // Or navigate(-1) if you want to go back to the previous page in history
    };

    // Handle navigation to edit the project
    const handleEditProject = () => {
        if (project) {
             console.log("Navigating to edit project:", project.id);
             // Assuming your ProjectForm is triggered from the dashboard route
             // We navigate back to the dashboard and might need a way to indicate
             // that the edit modal should open for this project ID.
             // A simple approach for now is to just navigate back to the dashboard.
             // A more integrated approach would involve a dedicated edit page route
             // or state management to control the dashboard modal.
             navigate(`/dashboard?editProjectId=${project.id}`); // Example: Navigate back and add a query param
        }
    };


  if (loading || userLoading) { // Also consider userLoading
    return <div className="text-center text-slate-600 mt-8">Loading project details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 mt-8">Error: {error}</div>;
  }

  if (!project) {
       // This case might be redundant if error is set, but good for clarity
       return <div className="text-center text-slate-600 mt-8">No project data available.</div>;
  }

    // Check if the current user is the owner of the project
    const isOwner = user && project.ownerId === user.uid;


  return (
    <div className="container mx-auto py-8">
        {/* Back Button and Edit Button (if owner) */}
        <div className="flex items-center justify-between mb-6">
            <Button
                variant="outline"
                onClick={handleBackToProjects}
                className="flex items-center gap-1"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
            </Button>

            {isOwner && (
                <Button
                     variant="outline"
                     onClick={handleEditProject}
                     className="flex items-center gap-1"
                >
                     <Edit2 className="h-4 w-4" />
                     Edit Project
                </Button>
            )}
        </div>


      {/* Project Header */}
      <h1 className="text-3xl font-bold mb-4 text-slate-800">{project.name}</h1>
      <p className="text-lg text-slate-700 mb-6">{project.description}</p>

      {/* Project Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stage */}
          <div>
              <h2 className="text-xl font-semibold mb-2 text-slate-700">Stage</h2>
               <Badge
                     variant="outline"
                     className={`
                       ${project.stage === 'Idea' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                       ${project.stage === 'Prototype' ? 'bg-cyan-50 text-cyan-600 border-cyan-200' : ''}
                       ${project.stage === 'MVP' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
                       ${project.stage === 'Early Stage' ? 'bg-green-50 text-green-600 border-green-200' : ''}
                       ${project.stage === 'Growth Stage' ? 'bg-amber-50 text-amber-600 border-amber-200' : ''}
                       ${project.stage === 'Mature' ? 'bg-gray-50 text-gray-600 border-gray-200' : ''}
                       ${!project.stage || project.stage === 'Unknown' ? 'bg-gray-50 text-gray-600 border-gray-200' : ''}
                       text-base px-3 py-1
                       flex items-center
                     `}
                   >
                     <Rocket className="h-4 w-4 mr-2" />
                     {project.stage || 'Unknown'} Stage
                   </Badge>
          </div>

           {/* Visibility */}
           <div>
               <h2 className="text-xl font-semibold mb-2 text-slate-700">Visibility</h2>
               <Badge variant="outline" className="text-base px-3 py-1 flex items-center">
                    {project.isPrivate ? (
                        <Lock className="h-4 w-4 mr-2" />
                    ) : (
                        <Globe className="h-4 w-4 mr-2" />
                    )}
                   {project.isPrivate ? 'Private' : 'Public'}
               </Badge>
           </div>

            {/* Progress */}
            <div>
               <h2 className="text-xl font-semibold mb-2 text-slate-700">Progress</h2>
                <div className="flex items-center gap-3">
                    {/* Assuming progress is stored as a number between 0 and 100 */}
                    <Progress value={project.progress} className="h-2 w-3/4" />
                    <span className="font-medium text-slate-800">{project.progress || 0}%</span>
                </div>
           </div>

           {/* Tasks */}
           <div>
               <h2 className="text-xl font-semibold mb-2 text-slate-700">Tasks</h2>
                <div className="text-slate-600">
                   {project.tasks?.completed || 0} of {project.tasks?.total || 0} tasks completed
                </div>
           </div>

           {/* Owner */}
           <div>
               <h2 className="text-xl font-semibold mb-2 text-slate-700">Owner</h2>
                <div className="flex items-center gap-3">
                   {project.ownerInfo && (
                       <Avatar className="h-10 w-10">
                           <AvatarImage src={project.ownerInfo.profileImageUrl} />
                            <AvatarFallback>
                                {project.ownerInfo.displayName ? project.ownerInfo.displayName.charAt(0).toUpperCase() : project.ownerId.charAt(0).toUpperCase()}
                            </AvatarFallback>
                       </Avatar>
                   )}
                   {/* Display owner name or default */}
                   <span className="text-slate-700">{project.ownerInfo?.displayName || 'Unknown User'}</span>
                </div>
           </div>

            {/* Funding Stage - Added based on Project interface */}
             {project.fundingStage && project.fundingStage.trim() !== '' && (
                 <div>
                    <h2 className="text-xl font-semibold mb-2 text-slate-700">Funding Stage</h2>
                    <div className="text-slate-600">{project.fundingStage}</div>
                 </div>
             )}

             {/* MVP Status - Added based on Project interface */}
              {project.mvpStatus && project.mvpStatus.trim() !== '' && (
                  <div>
                     <h2 className="text-xl font-semibold mb-2 text-slate-700">MVP Status</h2>
                     <div className="text-slate-600">{project.mvpStatus}</div>
                  </div>
              )}

               {/* Milestones - Using the processed milestonesArray */}
                {project.milestones && project.milestones.length > 0 && ( // Check if the processed array has items
                     <div>
                        <h2 className="text-xl font-semibold mb-2 text-slate-700">Milestones</h2>
                         <ul className="list-disc list-inside text-slate-600">
                             {project.milestones.map((milestone, idx) => ( // Now we are sure we are mapping over an array
                                 <li key={idx}>{milestone}</li>
                             ))}
                         </ul>
                     </div>
                )}


               {/* Team - Added based on Project interface (assuming simple display) */}
                {project.team && project.team.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-slate-700">Team</h2>
                        {/* Display team members simply, adjust as needed */}
                        <div className="text-slate-600">
                            {/* Assuming team is an array of user IDs or objects */}
                             {/* You might need to adjust how team members are displayed based on their structure */}
                             {Array.isArray(project.team) ? project.team.join(', ') : 'N/A'} {/* Basic display */}
                        </div>
                    </div>
                )}


      </div> {/* End of Project Details Grid */}

      {/* Tags Section */}
      {project.tags && project.tags.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-sm px-2 py-1">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Files Section */}
      {project.documents && project.documents.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">Uploaded Files</h2>
          <ul className="list-disc list-inside text-slate-700">
            {project.documents.map((doc: ProjectDocument, index) => {
                // Use the Project Document ID (project.id), Document ID (doc.id), and file name (doc.name)
                // to construct the download URL.
                const fileDownloadUrl = project.id && doc.id && doc.name
                    ? getDownloadUrl(project.id, doc.id, doc.name, doc.token) // Pass token if stored
                    : null;

                return (
                    <li key={doc.id || index}> {/* Prefer doc.id as key if available, fallback to index */}
                      {fileDownloadUrl ? ( // Check if a download URL could be constructed
                        <a href={fileDownloadUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {doc.name || 'Unnamed File'} {/* Display document name as link text */}
                        </a>
                      ) : (
                        // If no URL could be constructed or doc.url was null/undefined
                        <span>{doc.name || 'Unnamed File'}</span>
                      )}
                      {/* Display description if available and not empty */}
                      {doc.description && doc.description.trim() !== '' && (
                          <span className="ml-2 text-sm text-slate-500">({doc.description})</span>
                      )}
                      {/* Display upload error if it exists */}
                      {doc.uploadError && (
                           <span className="ml-2 text-sm text-red-500">(Upload Failed: {doc.uploadError})</span>
                      )}
                    </li>
                 );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
