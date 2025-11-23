import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from '@/contexts/UserContext';
import { db } from '@/lib/firebase';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'; // Only setDoc for creation
import { useToast } from '@/hooks/use-toast';
import { Label } from "@/components/ui/label";

// Define interfaces for the simplified form data
interface CreateProjectFormData {
    name: string;
    description: string;
    stage: string;
    isPrivate: boolean;
    progress: number; // Keep progress for the simple form
}

interface CreateProjectFormProps {
    onSuccess?: () => void;
    // initialData is not needed for creation form, remove it
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

// Hardcoded options for dropdowns (simplified for creation)
const projectStagesOptions = [
    "Idea",
    "Prototype",
    "MVP",
    "Early Stage",
    "Growth Stage",
    "Mature",
];

// Remove other options like mvpStatusOptions, milestonesOptions, fundingStagesOptions

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<CreateProjectFormData>({
    name: '',
    description: '',
    stage: '',
    isPrivate: false,
    progress: 0, // Initialize progress
  });

  const [isSaving, setIsSaving] = useState(false);
  const { user, loading } = useUser();
  const { toast } = useToast();

  // No need for documentsInputRef or isDocumentsUploading state in the simple form

  useEffect(() => {
      // Reset form when component is mounted or dialog is opened/closed (if controlled by state in parent)
      // This ensures a clean form for each new project creation attempt.
       setFormData({
           name: '',
           description: '',
           stage: '',
           isPrivate: false,
           progress: 0,
       });
       // Reset saving state as well
       setIsSaving(false);
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  // FIX 1: Correct the event handler type. No 'React.' prefix is needed for HTMLTextAreaElement.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

   const handleSelectChange = (id: keyof CreateProjectFormData, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

   const handleCheckboxChange = (id: keyof CreateProjectFormData, checked: boolean) => {
        setFormData(prev => ({ ...prev, [id]: checked }));
    };

    // Remove handleTagsChange and handleDocumentsChange as these fields are not in the simple form

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

      console.log("CreateProjectForm - handleSubmit called.");
      console.log("Current user state:", user);
      console.log("Loading state:", loading);

      // No need to check for document uploads here

      if (typeof setDoc !== 'function') { // Only check for setDoc
          console.error("Firebase Error: setDoc is not a function. Check Firebase SDK initialization.");
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
           // --- Single write operation to CREATE NEW project ---
           console.log("Attempting to create new project document in Firestore.");
           const newProjectRef = doc(collection(db, 'projects')); // Get a new doc ref with auto-generated ID
           const currentProjectId = newProjectRef.id; // Get the ID immediately

           const newProjectData = {
               ownerId: user.uid,
               createdAt: serverTimestamp(),
               updatedAt: serverTimestamp(), // Add updatedAt as well
               name: formData.name,
               description: formData.description,
               stage: formData.stage,
               isPrivate: formData.isPrivate,
               progress: formData.progress,
               tasks: { completed: 0, total: 0 },
               ownerInfo: {
                   displayName: user.displayName,
                   profileImageUrl: user.photoURL,
               },
               // Initialize new fields with default/empty values for simplicity in creation
               fundingStage: '',
               mvpStatus: '',
               milestones: [], // Initialize as empty array
               tags: [], // Initialize as empty array
               documents: [], // Initialize as empty array
           };

           const cleanedNewProjectData = removeUndefined(newProjectData);
           console.log("Data being sent to Firestore for new project creation:", cleanedNewProjectData);

           // Use setDoc with the new ref to create the document
           await setDoc(newProjectRef, cleanedNewProjectData);
           console.log("New project document created successfully with ID:", currentProjectId);

           // FIX 2: Remove the invalid 'variant' property. The default toast style will be used.
           toast({
               title: "Project Created!",
               description: "Your new project has been successfully created.",
           });
           if (onSuccess) onSuccess();


      } catch (error) {
          console.error('Error creating project:', error);
          toast({
              title: "Error",
              description: `Failed to create project. Please try again. ${(error as Error).message}`,
              variant: "destructive",
          });
      } finally {
          setIsSaving(false);
      }
    };

    // Determine if the form should be disabled (only when saving)
    const isFormDisabled = isSaving; // No longer dependent on document uploads in this simple form


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

        {/* Save Button - Disabled when saving */}
        <Button type="submit" disabled={isFormDisabled}>
          {isSaving ? 'Creating...' : 'Create Project'}
        </Button>
      </form>
    </div>
  );
};

export default CreateProjectForm;