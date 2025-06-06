import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from '@/contexts/UserContext';
import { db, auth, storage } from '@/lib/firebase'; // Import storage
import { collection, addDoc, updateDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { Label } from "@/components/ui/label";
import DocumentsInput, { DocumentsInputRef } from './DocumentsInput';

// Import Firebase Storage functions
import { ref, uploadBytesResumable, getDownloadURL, getMetadata } from 'firebase/storage';


// Define interfaces (Assuming these are correct and match your Firestore structure)
interface ProjectDocument {
    id: string;
    name: string;
    url?: string | null; // Must allow string or null - We will save this after upload
    description?: string;
    token?: string; // Add token field if you need to store it
    // Temporary fields like file, uploadProgress, uploadError are NOT in the Project interface
}

interface ProjectFormData {
  name: string;
  description: string;
  stage: string;
  isPrivate: boolean;
  fundingStage: string;
  mvpStatus: string;
  milestones: string;
  tags: string[];
  documents: ProjectDocument[]; // Use the specific interface
}

interface Project {
  id: string;
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
  createdAt: any; // Consider using specific Date types if possible
  updatedAt: any; // Consider using specific Date types if possible
  tasks: {
    completed: number;
    total: number;
  };
  milestones?: string[]; // Changed to string[] based on how it's stored in ProjectForm
  documents?: ProjectDocument[]; // Use the specific ProjectDocument interface here
  fundingStage?: string;
  mvpStatus?: string;
  team?: any[]; // Keep as any[] if structure is varied
  tags?: string[];
}

interface ProjectFormProps {
    onSuccess?: () => void;
    initialData?: Project | null;
}

// Helper function to remove undefined fields from an object recursively
const removeUndefined = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj; // Return primitive values or null as is
  }

  if (Array.isArray(obj)) {
    return obj.map(removeUndefined).filter(item => item !== undefined);
  }

  const newObj: any = {};
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value !== undefined) {
        newObj[key] = removeUndefined(value);
      }
    }
  }
  return newObj;
};


// Hardcoded options for dropdowns
const projectStagesOptions = [
    "Idea",
    "Prototype",
    "MVP",
    "Early Stage",
    "Growth Stage",
    "Mature",
];

const mvpStatusOptions = [
    "Idea Stage",
    "Concept Validation",
    "Low-Code MVP",
    "Concierge MVP",
    "Wizard of Oz MVP",
    "Single-Feature MVP",
    "Functional MVP",
    "Beta Product",
    "Product-Market Fit MVP",
];

const milestonesOptions = [
    "Idea Validation",
    "Problem-Solution Fit",
    "MVP Launch",
    "Early Traction",
    "Product-Market Fit",
    "Team Milestones",
    "Fundraising Milestones",
    "Growth Milestones",
    "Scalability",
    "Exit",
];

const fundingStagesOptions = [
    "Bootstrapping",
    "Pre-Seed Stage",
    "Seed Stage",
    "Series A",
    "Series B",
    "Series C",
    "Bridge Financing",
    "IPO",
];

const ProjectForm: React.FC<ProjectFormProps> = ({ onSuccess, initialData }) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    stage: '',
    isPrivate: false,
    fundingStage: '',
    mvpStatus: '',
    milestones: '',
    tags: [],
    documents: [],
  });

  const [projectTags, setProjectTags] = useState<string[]>([]);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user, loading } = useUser();
  const { toast } = useToast();

  // documentsInputRef will still be used to get the list of documents with files
  const documentsInputRef = useRef<DocumentsInputRef>(null);
  const formRef = useRef<HTMLFormElement>(null); // Ref for the form


  useEffect(() => {
      console.log('ProjectForm useEffect - initialData changed:', initialData);
      if (initialData) {
          setFormData({
              name: initialData.name || '',
              description: initialData.description || '',
              stage: initialData.stage || '',
              isPrivate: initialData.isPrivate ?? false,
              fundingStage: initialData.fundingStage || '',
              mvpStatus: initialData.mvpStatus || '',
              documents: Array.isArray(initialData.documents) ? initialData.documents.map(({ file, uploadProgress, uploadError, ...rest }) => ({
                   ...rest,
                   url: rest.url === undefined ? null : rest.url,
                   token: (rest as any).token, // Include token if it exists in initialData
              })) : [],
              milestones: initialData.milestones || '',
              tags: Array.isArray(initialData.tags) ? initialData.tags : [],
          });
          console.log('ProjectForm useEffect - Setting projectTags from initialData.tags:', initialData.tags);
          setProjectTags(Array.isArray(initialData.tags) ? initialData.tags : []);
          setIsInitialDataLoaded(true);
      } else {
           setFormData({
             name: '',
             description: '',
             stage: '',
             isPrivate: false,
             fundingStage: '',
             mvpStatus: '',
             milestones: '',
             tags: [],
             documents: [],
           });
           console.log('ProjectForm useEffect - Clearing projectTags for new project');
           setProjectTags([]);
           setIsInitialDataLoaded(true);
      }
  }, [initialData]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | React.ChangeEvent<HTMLTextAreaElement>>) => { // Corrected type
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

   const handleSelectChange = (id: keyof ProjectFormData, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

   const handleCheckboxChange = (id: keyof ProjectFormData, checked: boolean) => {
        setFormData(prev => ({ ...prev, [id]: checked }));
    };

    const handleTagsChange = (tags: string[]) => {
        setProjectTags(tags);
    };

    const handleDocumentsChange = (updatedDocuments: ProjectDocument[]) => {
         // Ensure that when documents are updated from DocumentsInput,
         // any temporary fields (file, uploadProgress, uploadError) are NOT added to formData,
         // and url is string or null.
         const cleanedDocuments = updatedDocuments.map(({ file, uploadProgress, uploadError, ...rest }) => ({
             ...rest,
             url: rest.url === undefined ? null : rest.url,
             token: (rest as any).token, // Ensure token is included if present
         }));
         setFormData(prev => ({ ...prev, documents: cleanedDocuments }));
    };


    // Function to handle document uploads (moved from DocumentsInput concept)
    // This function will be called from handleSubmit
    const uploadProjectDocuments = async (projectId: string, documentsToProcess: ProjectDocument[]): Promise<ProjectDocument[]> => {
        if (!projectId) {
            console.error("uploadProjectDocuments: Project ID is missing.");
            return documentsToProcess; // Return original list if no project ID
        }

        const filesToUpload = documentsToProcess.filter(doc => doc.file && !doc.url && !doc.uploadError);
        if (filesToUpload.length === 0) {
            console.log("uploadProjectDocuments: No new files to upload.");
            // Return the cleaned list without temporary fields
             return documentsToProcess.map(({ file, uploadProgress, uploadError, ...rest }) => ({
                 ...rest,
                 url: rest.url === undefined ? null : rest.url,
                 token: (rest as any).token,
             }));
        }

        // Start with existing documents (without files) and successfully uploaded ones
        const finalDocumentsList: ProjectDocument[] = documentsToProcess.filter(doc => !doc.file || doc.url || doc.uploadError);


        for (const docToUpload of filesToUpload) {
            // Generate a new ID for the document if it doesn't have one yet (for new files)
            const documentId = docToUpload.id || doc(collection(db, 'temp')).id; // Use a temp collection for ID generation


            try {
                const storagePath = `projects/${projectId}/documents/${documentId}/${docToUpload.name}`;
                const storageRef = ref(storage, storagePath);
                console.log(`uploadProjectDocuments: Starting upload for ${docToUpload.name} to ${storagePath}`);

                const uploadTask = uploadBytesResumable(storageRef, docToUpload.file as File);

                // Wait for the upload to complete
                await uploadTask;

                // Get the download URL and metadata (for token)
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                const metadata = await getMetadata(uploadTask.snapshot.ref);
                const downloadToken = metadata.downloadTokens?.[0]; // Get token if available and needed

                console.log(`uploadProjectDocuments: Upload of ${docToUpload.name} finished. URL:`, downloadURL);
                if (downloadToken) console.log(`uploadProjectDocuments: Token:`, downloadToken);


                // Add the successfully uploaded document info to the list
                 finalDocumentsList.push({
                    id: documentId, // Use the generated/existing document ID
                    name: docToUpload.name,
                    description: docToUpload.description,
                    url: downloadURL,
                    token: downloadToken, // Store the token
                 });


            } catch (error) {
                 console.error(`uploadProjectDocuments: Error uploading or getting URL for ${docToUpload.name}:`, error);
                 // Add the document to the list with error info and url/token as null
                  finalDocumentsList.push({
                     id: docToUpload.id, // Use original ID if available
                     name: docToUpload.name,
                     description: docToUpload.description,
                     url: null,
                     token: undefined,
                     uploadError: (error as Error).message,
                 });
            }
        }

        console.log("uploadProjectDocuments: Finished processing all files. Returning list:", finalDocumentsList);
         // Final clean up of temporary fields from the returned list
        return finalDocumentsList.map(({ file, uploadProgress, uploadError, ...rest }) => ({
                 ...rest,
                 url: rest.url === undefined ? null : rest.url,
                 token: (rest as any).token, // Ensure token is carried over
         }));
    };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("handleSubmit called.");

    if (!user || loading) {
      toast({
        title: "Authentication Error",
        description: "Authentication state is not ready. Please try again.",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    if (!formData.name.trim() || !formData.description.trim() || !formData.stage.trim()) {
         toast({
            title: "Validation Error",
            description: "Please fill in all required fields (Name, Description, Stage).",
            variant: "destructive",
         });
         setIsSaving(false);
         return;
    }

    setIsSaving(true);
    let currentProjectId = initialData?.id;
    // Get a document reference, generates ID for new documents automatically
    const projectDocRef = initialData ? doc(db, 'projects', initialData.id) : doc(collection(db, 'projects'));
    currentProjectId = initialData?.id || projectDocRef.id; // Ensure currentProjectId is set

    try {
        // Step 1: Prepare and Save/Update basic project data (excluding documents with URLs/Tokens for now)
        // We will save documents data separately after uploads
        const basicProjectDataToSave = {
             name: formData.name,
             description: formData.description,
             stage: formData.stage,
             isPrivate: formData.isPrivate,
             fundingStage: formData.fundingStage,
             mvpStatus: formData.mvpStatus,
             milestones: formData.milestones,
             tags: projectTags,
             updatedAt: serverTimestamp(),
             ...(initialData ? {} : { ownerId: user.uid, createdAt: serverTimestamp() }), // Set owner/createdAt only for new projects
             // IMPORTANT: Do NOT include documents array in this initial save/update
             // Documents will be updated separately after uploads
         };

        const cleanedBasicProjectData = removeUndefined(basicProjectDataToSave);

        console.log('Saving basic project data for ID:', currentProjectId, cleanedBasicProjectData);

        if (!initialData) {
             // Create new document with generated ID using setDoc
             await setDoc(projectDocRef, cleanedBasicProjectData);
             console.log("Basic project document created with ID:", currentProjectId);
        } else {
             // Update existing document using updateDoc
             await updateDoc(projectDocRef, cleanedBasicProjectData);
             console.log("Basic project document updated for ID:", currentProjectId);
        }


        // Step 2: Process documents (handle uploads) and get the updated list with URLs/Tokens
        // Get the current list of documents from formData state (includes files for new uploads)
        const documentsToProcess = formData.documents;
        console.log("Processing documents for upload:", documentsToProcess);

        // Call the function to handle uploads and get the final documents list
        const finalDocumentsList = await uploadProjectDocuments(currentProjectId, documentsToProcess);
        console.log("Uploads processed. Final documents list to save:", finalDocumentsList);


        // Step 3: Update the project document specifically with the final documents list
        if (currentProjectId) {
            const documentsUpdateData = {
                 documents: finalDocumentsList, // This should contain documents with IDs, names, descriptions, URLs, and Tokens
                 updatedAt: serverTimestamp(), // Update timestamp again
            };
             const cleanedDocumentsUpdateData = removeUndefined(documentsUpdateData);
             console.log("Updating project document with final documents list:", cleanedDocumentsUpdateData);

            // Use setDoc with merge: true to add/update the documents array without overwriting other fields
            // Using setDoc({ merge: true }) is generally safer than updateDoc for adding nested fields like arrays
            await setDoc(projectDocRef, cleanedDocumentsUpdateData, { merge: true });
            console.log("Project document updated with final documents list.");

        } else {
             console.error("Cannot update documents: currentProjectId is missing.");
             toast({
                 title: "Error",
                 description: "Failed to update documents: Project ID not available.",
                 variant: "destructive",
             });
        }


        // Final success message after all operations (basic save + document update)
        toast({
             title: initialData ? "Project Updated!" : "Project Created!",
             description: `Your project has been successfully ${initialData ? 'updated' : 'created'}.`,
             variant: "success",
        });
        if (onSuccess) onSuccess();


    } catch (error) {
      console.error(`Error ${initialData ? 'updating' : 'creating'} project or uploading documents:`, error);
      toast({
        title: "Error",
        description: `Failed to save project. Please check the console for details. ${(error as Error).message}`,
        variant: "destructive",
      });

    } finally {
      setIsSaving(false);
    }
};


  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col h-full">
        {isInitialDataLoaded ? (
            <div className="flex-grow overflow-y-auto pr-4">
                <form id="project-form" ref={formRef} onSubmit={handleSubmit} className="space-y-4 pb-4">
                    {/* Project Name */}
                    <div>
                      <Label htmlFor="name">Project Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Project Description */}
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        required
                      />
                    </div>

                    {/* Project Stage */}
                     <div>
                       <Label htmlFor="stage">Stage</Label>
                       <Select onValueChange={(value) => handleSelectChange('stage', value)} value={formData.stage} required>
                         <SelectTrigger id="stage">
                           <SelectValue placeholder="Select Stage" />
                         </SelectTrigger>
                         <SelectContent>
                           {projectStagesOptions.map(stage => (
                               <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>

                    {/* MVP Status (Conditional Display) */}
                    {formData.stage === 'MVP' && (
                        <div>
                            <Label htmlFor="mvpStatus">MVP Status</Label>
                            <Select onValueChange={(value) => handleSelectChange('mvpStatus', value)} value={formData.mvpStatus}>
                                <SelectTrigger id="mvpStatus">
                                    <SelectValue placeholder="Select MVP Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mvpStatusOptions.map(status => (
                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Milestones - ALWAYS Display */}
                    <div>
                       <Label htmlFor="milestones">Milestone</Label>
                       <Select onValueChange={(value) => handleSelectChange('milestones', value)} value={formData.milestones}>
                           <SelectTrigger id="milestones">
                               <SelectValue placeholder="Select Milestone" />
                           </SelectTrigger>
                           <SelectContent>
                               {milestonesOptions.map(milestone => (
                                   <SelectItem key={milestone} value={milestone}>{milestone}</SelectItem>
                               ))}
                           </SelectContent>
                       </Select>
                    </div>


                    {/* Funding Stage */}
                     <div>
                        <Label htmlFor="fundingStage">Funding Stage</Label>
                        <Select onValueChange={(value) => handleSelectChange('fundingStage', value)} value={formData.fundingStage}>
                            <SelectTrigger id="fundingStage">
                                <SelectValue placeholder="Select Funding Stage" />
                            </SelectTrigger>
                            <SelectContent>
                                {fundingStagesOptions.map(stage => (
                                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                     </div>

                    {/* Tags Input */}
                    <div>
                        <Label htmlFor="tags">Tags</Label>
                         <TagsInput
                            value={projectTags}
                            onChange={handleTagsChange}
                             tagProps={{ className: 'react-tagsinput-tag bg-black text-white rounded px-2 py-1 mr-1 text-sm' }}
                             inputProps={{ placeholder: 'Add tags (press Enter or Tab)' }}
                             className="react-tagsinput border border-gray-300 rounded-md p-2 w-full focus-within:ring-blue-500 focus-within:border-blue-500 sm:text-sm"
                             key={initialData?.id || 'new'}
                        />
                    </div>

                     {/* Documents Input */}
                    <div>
                        <Label>Documents</Label>
                        {/* We pass the current documents state to DocumentsInput */}
                        {/* DocumentsInput will manage adding new files to its internal state */}
                        <DocumentsInput
                            ref={documentsInputRef}
                            initialDocuments={formData.documents} // Pass documents from local state
                            onDocumentsChange={handleDocumentsChange} // DocumentsInput will call this when documents list changes (e.g., adding file)
                            // projectId is no longer passed here as upload logic is in handleSubmit
                        />
                    </div>


                    {/* Is Private */}
                    <div className="flex items-center space-x-2">
                       <Checkbox
                          id="isPrivate"
                          checked={formData.isPrivate}
                          onCheckedChange={(checked: boolean) => handleCheckboxChange('isPrivate', checked)}
                       />
                       <Label htmlFor="isPrivate">Private Project</Label>
                    </div>

                </form>
            </div>
        ) : (
             <div className="flex-grow flex items-center justify-center">
                 <p>Loading form data...</p>
             </div>
        )}

         <div className="pt-4 border-t mt-auto">
             <Button
                 type="button"
                 disabled={isSaving}
                 onClick={() => formRef.current?.submit()}
             >
               {isSaving ? (initialData ? 'Saving Changes...' : 'Creating...') : (initialData ? 'Save Changes' : 'Create Project')}
             </Button>
         </div>
    </div>
  );
};

export default ProjectForm;
