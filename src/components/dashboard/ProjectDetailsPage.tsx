      // import React, { useEffect, useState } from 'react'; // React is not needed in scope with modern JSX transform
      import { useEffect, useState } from 'react';
      import { useParams, useNavigate } from 'react-router-dom';
      import { db } from '@/lib/firebase';
      // Import onSnapshot along with doc, etc.
      import { doc, /* getDoc, */ DocumentData, /* updateDoc, */ onSnapshot } from 'firebase/firestore';
      import { useUser } from '@/contexts/UserContext';
      import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
      import { Button } from "@/components/ui/button";
      import { Badge } from "@/components/ui/badge";
      import { Progress } from "@/components/ui/progress";
      import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
      import { ChevronLeft, Rocket, Lock, /* Globe, */ Briefcase, Calendar, Edit, Link as LinkIcon } from 'lucide-react';
      import { useToast } from '@/hooks/use-toast';
      import { Dialog, /* DialogTrigger, */ DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
      import EditProjectForm from './EditProjectForm'; // Import EditProjectForm

      // Moved Document interface here or ensure it's consistently imported
      interface Document {
          id: string; // Unique ID for the document within the project
          name: string; // Display name of the document
          url?: string | null; // Firebase Storage download URL, null while uploading or if not uploaded
          description?: string; // Optional description of the document
      }

      interface Project {
          id: string;
          name: string;
          description: string;
          stage: string;
          progress: number;
          isPrivate: boolean;
          team?: { id: string; name: string; image?: string }[]; // Assuming this structure might still be in old data
          tasks: {
              completed: number;
              total: number;
          };
          ownerId: string;
           ownerInfo: {
              displayName?: string;
              profileImageUrl?: string;
           };
          fundingStage: string;
          mvpStatus: string;
          milestones: string; // Confirmed as string based on form and latest rules
          tags: string[];
          documents: Document[];
          createdAt: any; // FIX: Made required to match EditProjectForm's type
          updatedAt: any; // FIX: Made required to match EditProjectForm's type
      }


      const ProjectDetailsPage = () => {
          const { projectId } = useParams<{ projectId?: string }>();
          const navigate = useNavigate();
          const { user } = useUser(); // const { user, loading: userLoading } = useUser(); // userLoading is not used
          const { toast } = useToast();

          const [project, setProject] = useState<Project | null>(null);
          const [loading, setLoading] = useState(true);
          const [error, setError] = useState<string | null>(null);
          const [isEditFormOpen, setIsEditFormOpen] = useState(false);


          useEffect(() => {
              if (!projectId) {
                  setError("Project ID is missing.");
                  setLoading(false);
                  return;
              }

              setLoading(true); // Set loading true when starting to fetch/listen

              const projectRef = doc(db, 'projects', projectId);

              // Use onSnapshot to listen for real-time updates
              const unsubscribe = onSnapshot(projectRef, (projectSnap) => {
                  if (projectSnap.exists()) {
                      const data = projectSnap.data() as DocumentData;

                       // Ensure milestones is treated as a string based on current form/rules
                       const milestonesValue = typeof data.milestones === 'string' ? data.milestones : '';

                       // Ensure tags is an array of strings
                       const tagsArray = Array.isArray(data.tags) ? data.tags.map((tag: any) => String(tag)) : [];


                       // Ensure documents is an array of Document interface
                       const documentsArray: Document[] = Array.isArray(data.documents)
                           ? data.documents.map((doc: any) => ({
                                 id: doc.id || '', // Ensure id exists or provide default
                                 name: doc.name || 'Unnamed Document',
                                 url: doc.url || null,
                                 description: doc.description || '',
                                 // Exclude temporary upload fields
                             }))
                           : [];


                      const projectData: Project = {
                         id: projectSnap.id,
                         name: data.name || 'Unnamed Project',
                         description: data.description || 'No description provided.',
                         stage: data.stage || 'Unknown',
                         progress: data.progress ?? 0, // Use nullish coalescing for number default
                         isPrivate: data.isPrivate ?? false, // Use nullish coalescing for boolean default
                         team: Array.isArray(data.team) ? data.team : [], // Keep team structure if it exists
                         tasks: data.tasks || { completed: 0, total: 0 },
                         ownerId: data.ownerId,
                         ownerInfo: data.ownerInfo || {},
                         fundingStage: data.fundingStage || '',
                         mvpStatus: data.mvpStatus || '',
                         milestones: milestonesValue, // Use the processed string value
                         tags: tagsArray, // Use the processed array
                         documents: documentsArray, // Use the processed array
                          createdAt: data.createdAt || null,
                          updatedAt: data.updatedAt || null,
                     };
                     setProject(projectData);
                     setError(null); // Clear any previous errors on successful fetch
     
                 } else {
                     // Document does not exist (e.g., deleted)
                     setProject(null);
                     setError("Project not found or has been deleted.");
                 }
                 setLoading(false); // Set loading false once the initial snapshot is received
             }, (err) => { // Error callback for onSnapshot
                 console.error("Error fetching project with onSnapshot:", err);
                 setError("Failed to load project details.");
                 setProject(null);
                 setLoading(false); // Set loading false on error
             });
     
             // Cleanup function: Unsubscribe from the listener when the component unmounts
             return () => unsubscribe();
     
         }, [projectId, toast]); // Depend on projectId and toast
     
     
         const handleGoBack = () => {
             navigate(-1);
         };
     
         const handleEditProject = () => {
             if (project) {
                  setIsEditFormOpen(true);
             }
         };
     
     
         if (loading) {
             return (
                 <div className="container mx-auto px-4 py-8">
                     <div className="text-center text-slate-600">Loading project details...</div>
                 </div>
             );
         }
     
         if (error) {
             return (
                 <div className="container mx-auto px-4 py-8">
                     <div className="flex items-center mb-6">
                          <Button variant="ghost" onClick={handleGoBack} className="mr-2">
                             <ChevronLeft className="h-5 w-5 mr-1" /> Back
                          </Button>
                          <h1 className="text-2xl font-bold text-slate-900">Project Details</h1>
                     </div>
                     <div className="text-center text-red-600 mt-8">Error: {error}</div>
                 </div>
             );
         }
     
         if (!project) {
             return (
                 <div className="container mx-auto px-4 py-8">
                      <div className="flex items-center mb-6">
                          <Button variant="ghost" onClick={handleGoBack} className="mr-2">
                             <ChevronLeft className="h-5 w-5 mr-1" /> Back
                          </Button>
                          <h1 className="text-2xl font-bold text-slate-900">Project Details</h1>
                     </div>
                     <div className="text-center text-slate-600 mt-8">Project not found.</div>
                 </div>
             );
         }
     
         const isOwner = user && project.ownerId === user.uid;
     
     
         return (
             <div className="container mx-auto px-4 py-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                      <div className="flex items-center">
                          <Button variant="ghost" onClick={handleGoBack} className="mr-2">
                              <ChevronLeft className="h-5 w-5 mr-1" /> Back
                          </Button>
                           <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
                           {project.isPrivate && <Badge variant="secondary" className="ml-2"><Lock className="h-3 w-3 mr-1" /> Private</Badge>}
                      </div>
     
                      {isOwner && (
                          <Button onClick={handleEditProject} className="flex items-center gap-1 w-full sm:w-auto">
                              <Edit className="h-4 w-4" /> Edit Project
                          </Button>
                      )}
                  </div>
     
     
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-2 space-y-6">
                         <Card>
                             <CardHeader>
                                 <CardTitle className="text-lg">Description</CardTitle>
                             </CardHeader>
                             <CardContent>
                                 <p className="text-slate-700">{project.description}</p>
                             </CardContent>
                         </Card>
     
                         <Card>
                              <CardHeader>
                                  <CardTitle className="text-lg">Additional Details</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                  {project.fundingStage && (
                                       <div className="text-slate-700 flex items-center">
                                            <Briefcase className="h-5 w-5 mr-2 text-slate-500" />
                                            <strong>Funding Stage:</strong> {project.fundingStage}
                                       </div>
                                  )}
                                  {project.mvpStatus && (
                                       <div className="text-slate-700 flex items-center">
                                            <Rocket className="h-5 w-5 mr-2 text-slate-500" />
                                            <strong>MVP Status:</strong> {project.mvpStatus}
                                       </div>
                                  )}
                                  {project.milestones && ( // Check if milestones string is not empty
                                       <div className="text-slate-700 flex items-center">
                                            <Calendar className="h-5 w-5 mr-2 text-slate-500" />
                                            <strong>Milestone:</strong> {project.milestones} {/* Display as single string */}
                                       </div>
                                  )}
                                  {project.tags && project.tags.length > 0 && (
                                      <div>
                                          <strong>Tags:</strong>
                                          <div className="flex flex-wrap gap-2 mt-2">
                                              {project.tags.map(tag => (
                                                   <Badge key={tag} variant="secondary">{tag}</Badge>
                                              ))}
                                          </div>
                                      </div>
                                  )}
                              </CardContent>
                         </Card>
     
     
                         <Card>
                             <CardHeader>
                                 <CardTitle className="text-lg">Documents</CardTitle>
                             </CardHeader>
                             <CardContent>
                                 {project.documents && project.documents.length > 0 ? (
                                     <ul className="list-disc list-inside space-y-2">
                                         {project.documents.map(doc => (
                                             <li key={doc.id} className="text-slate-700 break-words">
                                                 <strong>{doc.name}:</strong> {doc.description}
                                                 {doc.url && (
                                                      <a
                                                          href={doc.url}
                                                          target="_blank"
                                                          rel="noopener noreferrer"
                                                          className="text-blue-600 hover:underline ml-2 flex items-center inline-flex"
                                                      >
                                                          <LinkIcon className="h-4 w-4 mr-1" /> View File
                                                      </a>
                                                 )}
                                             </li>
                                         ))}
                                     </ul>
                                 ) : (
                                     <p className="text-slate-600">No documents uploaded yet.</p>
                                 )}
                             </CardContent>
                         </Card>
     
     
                     </div>
     
                     <div className="lg:col-span-1 space-y-6">
                         <Card>
                             <CardHeader>
                                 <CardTitle className="text-lg">Overview</CardTitle>
                             </CardHeader>
                             <CardContent className="space-y-4">
                                 <div className="text-slate-700 flex items-center">
                                     <Rocket className="h-5 w-5 mr-2 text-slate-500" />
                                     <strong>Stage:</strong> {project.stage}
                                 </div>
                                  <div>
                                      <div className="flex justify-between text-sm mb-1 text-slate-700">
                                          <span>Project Progress</span>
                                          <span className="font-medium">{project.progress}%</span>
                                      </div>
                                      <Progress value={project.progress} className="h-2" />
                                  </div>
                             </CardContent>
                         </Card>
     
                          <Card>
                              <CardHeader>
                                  <CardTitle className="text-lg">Owner</CardTitle>
                              </CardHeader>
                              <CardContent className="flex items-center space-x-4">
                                  <Avatar className="h-10 w-10">
                                      <AvatarImage src={project.ownerInfo?.profileImageUrl} />
                                      <AvatarFallback>
                                          {project.ownerInfo?.displayName ? project.ownerInfo.displayName.charAt(0) : project.ownerId.charAt(0)}
                                      </AvatarFallback>
                                  </Avatar>
                                  <div>
                                      <p className="font-semibold text-slate-800">{project.ownerInfo?.displayName || 'Unknown User'}</p>
                                  </div>
                              </CardContent>
                          </Card>
     
                         <Card>
                             <CardHeader>
                                 <CardTitle className="text-lg">Tasks</CardTitle>
                             </CardHeader>
                             <CardContent>
                                 <p className="text-slate-700">{project.tasks.completed} out of {project.tasks.total} tasks completed.</p>
                             </CardContent>
                         </Card>
     
     
                     </div>
                 </div>
     
                 {/* Edit Project Dialog */}
                 {project && ( // Render dialog only if project data is loaded
                      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
                          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto flex flex-col">
                              <DialogTitle>Edit Project: {project.name}</DialogTitle>
                              <DialogDescription>
                                  Update the details of your project below.
                              </DialogDescription>
                              {/* Pass the LATEST fetched project data from onSnapshot */}
                              {/* This ensures the form is initialized with the most recent data */}
                              <EditProjectForm
                                  initialData={project}
                                  onSuccess={() => {
                                      setIsEditFormOpen(false);
                                      // Note: Since we are using onSnapshot, the project data
                                      // in ProjectDetailsPage will automatically update when
                                      // the save operation in EditProjectForm completes.
                                      // No manual re-fetch needed here.
                                  }}
                              />
                          </DialogContent>
                      </Dialog>
                 )}
     
             </div>
         );
     };
     
     export default ProjectDetailsPage;