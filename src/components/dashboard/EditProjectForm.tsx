import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from '@/contexts/UserContext';
import { db, auth } from '@/lib/firebase';
import { collection, updateDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { Label } from "@/components/ui/label";
import DocumentsInput, { DocumentsInputRef, Document } from './DocumentsInput'; // Import Document interface from DocumentsInput

// Define interfaces (Assuming these are correct and match your Firestore structure)
// Removed the local Document interface as it's now imported from DocumentsInput

interface ProjectFormData {
  name: string;
  description: string;
  stage: string;
  isPrivate: boolean;
  fundingStage: string;
  mvpStatus: string;
  milestones: string; // Ensure this field is always in the form data
  tags: string[]; // Add tags to formData interface for consistency
  documents: Document[]; // Use the imported Document interface
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
  documents: Document[]; // Use the imported Document interface
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
  // Added state to track if documents are uploading
  const [isDocumentsUploading, setIsDocumentsUploading] = useState(false);
  const { user, loading } = useUser();
  const { toast } = useToast();

  // Create a ref for the DocumentsInput component
  const documentsInputRef = useRef<DocumentsInputRef>(null);

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
              documents: Array.isArray(initialData.documents) ? initialData.documents : [],
              milestones: initialData.milestones || '',
              tags: Array.isArray(initialData.tags) ? initialData.tags : [],
              progress: initialData.progress ?? 0,
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
             milestones: '',
             tags: [],
             documents: [],
             progress: 0,
           });
           console.log('ProjectForm useEffect - Clearing projectTags for new project');
           setProjectTags([]);
           console.log('ProjectForm useEffect - projectTags state after clearing:', projectTags);
      }
      // Reset document uploading status when initialData changes (e.g., switching between projects or creating new)
      setIsDocumentsUploading(false);

  }, [initialData]);

    // Effect to listen for changes in formData.documents and update isDocumentsUploading state
    // This is triggered by the onDocumentsChange callback in DocumentsInput
    useEffect(() => {
        console.log('ProjectForm useEffect - formData.documents changed:', formData.documents);
         if (documentsInputRef.current) {
             const currentlyUploading = documentsInputRef.current.isUploading();
             console.log('DocumentsInput is currently uploading:', currentlyUploading);
             setIsDocumentsUploading(currentlyUploading);
         }
     }, [formData.documents]); // Depend on formData.documents


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
          // This callback is triggered by DocumentsInput when its internal document state changes,
          // including when uploads complete and URLs are available.
          console.log("ProjectForm - handleDocumentsChange triggered:", updatedDocuments);
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
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      console.log("handleSubmit called.");
      console.log("Current user state:", user);
      console.log("Loading state:", loading);

       // --- Check if documents are still uploading ---
      if (documentsInputRef.current && documentsInputRef.current.isUploading()) {
          toast({
              title: "Upload in Progress",
              description: "Please wait for document uploads to complete before saving.",
              variant: "info", // Use info variant for non-blocking message
          });
          console.log("Blocked save due to ongoing document uploads.");
          return; // Prevent form submission
      }
       console.log("No documents are currently uploading. Proceeding with save.");


      if (typeof setDoc !== 'function' || typeof updateDoc !== 'function') {
          console.error("Firebase Error: setDoc or updateDoc is not a function. Check Firebase SDK initialization.");
          toast({
              title: "System Error",
              description: "Firebase write functions are not available. Please contact support.",
              variant: "destructive",
          });
          setIsSaving(false); // Ensure saving state is reset
          return;
      }

      if (!user || loading) {
          toast({
              title: "Authentication Error",
              description: "Authentication state is not ready. Please try again.",
              variant: "destructive",
          });
          setIsSaving(false); // Ensure saving state is reset
          return;
      }

      setIsSaving(true);

      if (!formData.name.trim() || !formData.description.trim() || !formData.stage.trim()) {
           toast({
              title: "Validation Error",
              description: "Please fill in all required fields (Name, Description, Stage).",
              variant: "destructive",
           });
           setIsSaving(false); // Ensure saving state is reset
           return;
      }

       // Basic validation for progress
       if (formData.progress < 0 || formData.progress > 100) {
           toast({
               title: "Validation Error",
               description: "Progress must be a number between 0 and 100.",
               variant: "destructive",
           });
           setIsSaving(false); // Ensure saving state is reset
           return;
       }


      try {
          let currentProjectId = initialData?.id;
          let projectRef;

          // --- Get the final documents list from the DocumentsInput component ---
          const finalDocumentsToSave: Document[] = documentsInputRef.current ? documentsInputRef.current.getDocuments() : [];
          console.log("Final documents list obtained from DocumentsInput:", finalDocumentsToSave);


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
                   // Include the final documents list here for new projects
                   documents: finalDocumentsToSave,
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
                   // Include the final documents list here for existing projects
                   documents: finalDocumentsToSave,
                   // Do NOT include ownerId, createdAt, or tasks here for update
               };

               const cleanedUpdatedProjectData = removeUndefined(updatedProjectData);
               console.log('Data being sent to Firestore for existing project update:', cleanedUpdatedProjectData);

               await updateDoc(projectRef, cleanedUpdatedProjectData);
               console.log("Existing project document updated successfully:", currentProjectId);

           }

            // Note: Document uploads are now handled by DocumentsInput component
            // We no longer need the separate logic for handling uploads here.


           // --- Final Success/Error Handling ---
           toast({
               title: initialData ? "Project Updated!" : "Project Created!",
               description: initialData ? "Your project has been successfully updated." : "Your new project has been successfully created.",
               variant: "success",
           });
           if (onSuccess) onSuccess();


      } catch (error) {
          console.error(`Error ${initialData ? 'updating' : 'creating'} project:`, error); // Removed "or uploading documents" from message
          toast({
              title: "Error",
              description: `Failed to ${initialData ? 'update' : 'create'} project. Please try again. ${(error as Error).message}`, // Removed "or upload documents" from message
              variant: "destructive",
          });
      } finally {
          setIsSaving(false);
      }
    };

    // Determine if the form should be disabled (saving or documents uploading)
    const isFormDisabled = isSaving || isDocumentsUploading;


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
             disabled={isFormDisabled} // Disable input when form is disabled
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
             disabled={isFormDisabled} // Disable textarea when form is disabled
          />
        </div>

        {/* Project Stage */}
         <div>
           <Label htmlFor="stage">Stage</Label>
           <Select onValueChange={(value) => handleSelectChange('stage', value)} value={formData.stage} required disabled={isFormDisabled}> {/* Disable select */}
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
        <div style={{ display: formData.stage === 'MVP' ? 'block' : 'none' }}>
            <Label htmlFor="mvpStatus">MVP Status</Label>
            <Select onValueChange={(value) => handleSelectChange('mvpStatus', value)} value={formData.mvpStatus} disabled={isFormDisabled}> {/* Disable select */}
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
           <Select onValueChange={(value) => handleSelectChange('milestones', value)} value={formData.milestones} disabled={isFormDisabled}> {/* Disable select */}
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
            <Select onValueChange={(value) => handleSelectChange('fundingStage', value)} value={formData.fundingStage} disabled={isFormDisabled}> {/* Disable select */}
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
                 className={`react-tagsinput border rounded-md p-2 w-full sm:text-sm ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : 'border-gray-300 focus-within:ring-blue-500 focus-within:border-blue-500'}`}
                 key={initialData?.id || 'new'}
                 disabled={isFormDisabled} // Disable tags input
            />
        </div>

        {/* Progress Input */}
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
                 disabled={isFormDisabled} // Disable input
            />
        </div>


         {/* Documents Input - Connected via ref */}
        <div>
            <Label>Documents</Label>
            <DocumentsInput ref={documentsInputRef} initialDocuments={formData.documents} onDocumentsChange={handleDocumentsChange} projectId={initialData?.id} />
        </div>


        {/* Is Private */}
        <div className="flex items-center space-x-2">
           <Checkbox
              id="isPrivate"
              checked={formData.isPrivate}
              onCheckedChange={(checked: boolean) => handleCheckboxChange('isPrivate', checked)}
               disabled={isFormDisabled} // Disable checkbox
           />
           <Label htmlFor="isPrivate">Private Project</Label>
        </div>

        {/* Save Button - Disabled when saving or documents are uploading */}
        <Button type="submit" disabled={isFormDisabled}>
          {isSaving ? (initialData ? 'Saving Changes...' : 'Creating...') : (isDocumentsUploading ? 'Uploading Files...' : (initialData ? 'Save Changes' : 'Create Project'))}
        </Button>
      </form>
    </div>
  );
};

export default ProjectForm;
