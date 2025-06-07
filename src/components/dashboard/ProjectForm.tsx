import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from '@/contexts/UserContext';
import { db, auth } from '@/lib/firebase';
import { collection, updateDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore'; // Removed addDoc as we'll use setDoc for new projects
import { useToast } from '@/hooks/use-toast';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { Label } from "@/components/ui/label";
import DocumentsInput, { DocumentsInputRef } from './DocumentsInput';

// Define interfaces (Assuming these are correct and match your Firestore structure)
interface Document {
    id: string;
    name: string;
    url?: string | null; // Explicitly allow null
    description?: string;
    file?: File; // Temporary, not saved to Firestore directly
    uploadProgress?: number; // Temporary
    uploadError?: string; // Temporary
}

interface ProjectFormData {
  name: string;
  description: string;
  stage: string;
  isPrivate: boolean;
  fundingStage: string;
  mvpStatus: string;
  milestones: string; // Ensure this field is always in the form data
  tags: string[]; // Add tags to formData interface for consistency
  documents: Document[];
  progress: number; // Add progress to formData
}

interface Project {
  id: string;
  name: string;
  description: string;
  stage: string;
  progress: number;
  isPrivate: boolean;
  ownerId: string;
  ownerInfo: {
    displayName?: string;
    profileImageUrl?: string;
  };
  createdAt: any;
  updatedAt: any;
  tasks: {
    completed: number;
    total: number;
  };
  fundingStage: string;
  mvpStatus: string;
  tags: string[];
  milestones: string; // Ensure this field is in the Project interface
  documents: Document[];
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
    // Recursively clean array items and filter out undefined items (after recursion)
    return obj.map(removeUndefined).filter(item => item !== undefined);
  }

  const newObj: any = {};
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) { // Safer check for own properties
      const value = obj[key];
      if (value !== undefined) { // If the value is not undefined
        newObj[key] = removeUndefined(value); // Recursively clean the value
      }
    }
  }
  return newObj; // Return the new object without undefined fields
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
    milestones: '', // Initialize milestones with an empty string
    tags: [], // Initialize tags in formData
    documents: [],
    progress: 0, // Initialize progress in formData
  });

  const [projectTags, setProjectTags] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const { user, loading } = useUser();
  const { toast } = useToast();

  const documentsInputRef = useRef<DocumentsInputRef>(null);

  useEffect(() => {
      console.log('ProjectForm useEffect - initialData changed:', initialData);
      if (initialData) {
          setFormData({
              name: initialData.name || '',
              description: initialData.description || '',
              stage: initialData.stage || '',
              isPrivate: initialData.isPrivate ?? false,
              // Ensure these fields are initialized from initialData
              fundingStage: initialData.fundingStage || '',
              mvpStatus: initialData.mvpStatus || '',
              documents: Array.isArray(initialData.documents) ? initialData.documents : [],
              milestones: initialData.milestones || '', // Ensure milestones is populated
              tags: Array.isArray(initialData.tags) ? initialData.tags : [], // Initialize tags from initialData
              progress: initialData.progress ?? 0, // Initialize progress from initialData, default to 0
          });
          console.log('ProjectForm useEffect - Setting projectTags from initialData.tags:', initialData.tags);
          setProjectTags(Array.isArray(initialData.tags) ? initialData.tags : []);
          console.log('ProjectForm useEffect - projectTags state after setting:', projectTags);
      } else {
           setFormData({
             name: '',
             description: '',
             stage: '',
             isPrivate: false,
             fundingStage: '',
             mvpStatus: '',
             milestones: '', // Initialize milestones with an empty string for new projects
             tags: [], // Clear tags for new project
             documents: [],
             progress: 0, // Initialize progress to 0 for new project
           });
           console.log('ProjectForm useEffect - Clearing projectTags for new project');
           setProjectTags([]);
           console.log('ProjectForm useEffect - projectTags state after clearing:', projectTags);
      }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | React.HTMLTextAreaElement>) => {
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

    const handleDocumentsChange = (updatedDocuments: Document[]) => {
         // The DocumentsInput component should return documents with 'url' as string or null,
         // and exclude temporary fields like 'file', 'uploadProgress', 'uploadError'.
         // We can directly update the formData documents state with this cleaned array.
        setFormData(prev => ({ ...prev, documents: updatedDocuments }));
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 0 && value <= 100) {
             setFormData(prev => ({ ...prev, progress: value }));
        } else if (e.target.value === '') {
            setFormData(prev => ({ ...prev, progress: 0 })); // Allow clearing the input
        }
        // Optional: Provide feedback to the user if input is invalid
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      console.log("handleSubmit called.");
      console.log("Current user state:", user);
      console.log("Loading state:", loading);

      if (typeof setDoc !== 'function' || typeof updateDoc !== 'function') {
          console.error("Firebase Error: setDoc or updateDoc is not a function. Check Firebase SDK initialization.");
          toast({
              title: "System Error",
              description: "Firebase write functions are not available. Please contact support.",
              variant: "destructive",
          });
          setIsSaving(false);
          return;
      }

      if (!user || loading) {
          toast({
              title: "Authentication Error",
              description: "Authentication state is not ready. Please try again.",
              variant: "destructive",
          });
          setIsSaving(false);
          return;
      }

      setIsSaving(true);

      if (!formData.name.trim() || !formData.description.trim() || !formData.stage.trim()) {
           toast({
              title: "Validation Error",
              description: "Please fill in all required fields (Name, Description, Stage).",
              variant: "destructive",
           });
           setIsSaving(false);
           return;
      }

       // Basic validation for progress
       if (formData.progress < 0 || formData.progress > 100) {
           toast({
               title: "Validation Error",
               description: "Progress must be a number between 0 and 100.",
               variant: "destructive",
           });
           setIsSaving(false);
           return;
       }


      try {
          let currentProjectId = initialData?.id;
          let projectRef;

          if (!initialData) {
               // --- Single write operation to CREATE NEW project first ---
               console.log("Attempting to create new project document in Firestore.");
               const newProjectRef = doc(collection(db, 'projects')); // Get a new doc ref with auto-generated ID
               currentProjectId = newProjectRef.id; // Get the ID immediately

               const newProjectData = {
                   ownerId: user.uid,
                   createdAt: serverTimestamp(),
                   updatedAt: serverTimestamp(),
                   name: formData.name,
                   description: formData.description,
                   stage: formData.stage,
                   isPrivate: formData.isPrivate,
                   fundingStage: formData.fundingStage,
                   mvpStatus: formData.mvpStatus,
                   milestones: formData.milestones,
                   tags: projectTags,
                   // Do NOT include documents here initially for new projects
                   documents: [], // Initialize with an empty array
                   progress: formData.progress,
                   tasks: { completed: 0, total: 0 },
                   ownerInfo: {
                       displayName: user.displayName,
                       profileImageUrl: user.photoURL,
                   }
               };

               const cleanedNewProjectData = removeUndefined(newProjectData);
               console.log("Data being sent to Firestore for initial new project creation:", cleanedNewProjectData);

               // Use setDoc with the new ref to create the document
               await setDoc(newProjectRef, cleanedNewProjectData);
               console.log("New project document created successfully with ID:", currentProjectId);

               projectRef = newProjectRef; // Set projectRef for potential later updates


           } else {
               // --- Update operation for EXISTING projects ---
               console.log('Working with existing project with ID:', currentProjectId);
               projectRef = doc(db, 'projects', currentProjectId);

               const updatedProjectData = {
                   name: formData.name,
                   description: formData.description,
                   stage: formData.stage,
                   isPrivate: formData.isPrivate,
                   fundingStage: formData.fundingStage,
                   mvpStatus: formData.mvpStatus,
                   milestones: formData.milestones,
                   tags: projectTags,
                   progress: formData.progress,
                   updatedAt: serverTimestamp(),
                   // Do NOT include ownerId, createdAt, or documents here for update initially
               };

               const cleanedUpdatedProjectData = removeUndefined(updatedProjectData);
               console.log('Data being sent to Firestore for existing project initial update:', cleanedUpdatedProjectData);

               await updateDoc(projectRef, cleanedUpdatedProjectData);
               console.log("Existing project document updated successfully:", currentProjectId);

           }

           // --- Handle Document Uploads AFTER project document is created/updated ---
           let finalDocumentsToSave: Omit<Document, 'file' | 'uploadProgress' | 'uploadError'>[] = initialData?.documents || []; // Start with existing docs

           if (documentsInputRef.current && currentProjectId) {
                console.log(`Handling document uploads for project ID: ${currentProjectId}`);
                // The DocumentsInput component should manage uploads/deletes and return the final list
                // Pass the actual project ID
                finalDocumentsToSave = await documentsInputRef.current.uploadDocuments(currentProjectId);
                console.log("Document uploads completed. Final documents list:", finalDocumentsToSave);

                // Update the project document in Firestore with the final documents list
                console.log("Updating project document with final documents list:", finalDocumentsToSave);
                await updateDoc(projectRef, {
                    documents: finalDocumentsToSave
                });
                 console.log("Project document updated with documents.");

           } else if (documentsInputRef.current && !currentProjectId) {
               // This case should ideally not happen with the new flow, but included for safety
               console.error("Attempted to upload documents without a valid project ID after initial save.");
               toast({
                   title: "Upload Error",
                   description: "Failed to upload documents due to missing project ID.",
                   variant: "destructive",
               });
               // We can still proceed with the project creation/update even if docs fail
           } else {
               console.log("No new documents to upload or documentsInputRef is not available.");
               // If no documentsInputRef or no files selected initially, the project document is already correct
               // based on initialData (for edits) or initialized empty (for new). No further update needed for docs.
           }


           // --- Final Success/Error Handling ---
           toast({
               title: initialData ? "Project Updated!" : "Project Created!",
               description: initialData ? "Your project has been successfully updated." : "Your new project has been successfully created.",
               variant: "success",
           });
           if (onSuccess) onSuccess();


      } catch (error) {
          console.error(`Error ${initialData ? 'updating' : 'creating'} project or uploading documents:`, error);
          toast({
              title: "Error",
              description: `Failed to ${initialData ? 'update' : 'create'} project or upload documents. Please try again. ${(error as Error).message}`,
              variant: "destructive",
          });
      } finally {
          setIsSaving(false);
      }
    };


  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col h-full">
      <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
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
        {/* Modified to use CSS for visibility instead of conditional rendering */}
        <div style={{ display: formData.stage === 'MVP' ? 'block' : 'none' }}>
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

        {/* Progress Input - NEW FIELD */}
        <div>
            <Label htmlFor="progress">Progress (%)</Label>
            <Input
                id="progress"
                type="number"
                value={formData.progress}
                onChange={handleProgressChange}
                min="0"
                max="100"
                required
            />
        </div>


         {/* Documents Input */}
        <div>
            <Label>Documents</Label>
            {/* Pass projectTags to DocumentsInput if it needs them */}
            <DocumentsInput ref={documentsInputRef} initialDocuments={formData.documents} onDocumentsChange={handleDocumentsChange} projectId={initialData?.id} />
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

        <Button type="submit" disabled={isSaving}>
          {isSaving ? (initialData ? 'Saving Changes...' : 'Creating...') : (initialData ? 'Save Changes' : 'Create Project')}
        </Button>
      </form>
    </div>
  );
};

export default ProjectForm;
