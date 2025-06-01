import React, { useState, useEffect } from 'react'; // Import useEffect
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from '@/contexts/UserContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'; // Import updateDoc and doc
import { useToast } from '@/hooks/use-toast';


interface ProjectFormData {
  name: string;
  description: string;
  stage: string;
  isPrivate: boolean;
  // Add other fields as needed based on your project schema
}

// Define the Project interface here or import it if already defined elsewhere
interface Project {
  id: string;
  name: string;
  description: string;
  stage: string;
  progress: number; // Assuming progress is a number
  isPrivate: boolean;
  // Add other fields that might be in initialData
  ownerId: string;
  ownerInfo: {
    displayName?: string;
    profileImageUrl?: string;
  };
  createdAt: any; // Use 'any' or Firebase Timestamp type if available
  updatedAt: any; // Use 'any' or Firebase Timestamp type if available
  tasks: {
    completed: number;
    total: number;
  };
  // Add other fields that might be in the initialData object
  milestones?: any[];
  documents?: any[];
  fundingStage?: string;
  mvpStatus?: string;
}


interface ProjectFormProps {
    onSuccess?: () => void;
    initialData?: Project | null; // Add initialData prop for editing
}


const ProjectForm: React.FC<ProjectFormProps> = ({ onSuccess, initialData }) => { // Receive initialData prop
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    stage: '',
    isPrivate: false,
    // Initialize other fields here
  });
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  // useEffect to populate form when initialData changes (for editing)
  useEffect(() => {
      if (initialData) {
          setFormData({
              name: initialData.name || '',
              description: initialData.description || '',
              stage: initialData.stage || '',
              isPrivate: initialData.isPrivate ?? false, // Use nullish coalescing for boolean
              // Populate other fields from initialData if needed
          });
      } else {
          // Clear form if initialData is null (for creating)
           setFormData({
             name: '',
             description: '',
             stage: '',
             isPrivate: false,
             // Reset other fields
           });
      }
  }, [initialData]); // Rerun effect when initialData changes


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

   const handleSelectChange = (id: keyof ProjectFormData, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };


   const handleCheckboxChange = (id: keyof ProjectFormData, checked: boolean) => {
        setFormData(prev => ({ ...prev, [id]: checked }));
    };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create or update a project.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    // Basic validation
    if (!formData.name.trim() || !formData.description.trim() || !formData.stage.trim()) {
         toast({
            title: "Validation Error",
            description: "Please fill in all required fields (Name, Description, Stage).",
            variant: "destructive",
         });
         setIsSaving(false);
         return;
    }

    try {
        if (initialData) {
            // Update existing project
            const projectRef = doc(db, 'projects', initialData.id); // Get reference to the existing document
            await updateDoc(projectRef, {
                ...formData,
                updatedAt: serverTimestamp(), // Update the timestamp
                // Do NOT update ownerId, createdAt, progress, tasks directly here
                // These should be handled by backend/Cloud Functions if needed
            });

            toast({
                title: "Success",
                description: "Project updated successfully!",
            });

        } else {
            // Create a new project
            const projectsCollectionRef = collection(db, 'projects');
            await addDoc(projectsCollectionRef, {
                ...formData,
                ownerId: user.uid,
                ownerInfo: { // Initialize ownerInfo - will be updated by Cloud Function later
                    displayName: user.displayName || null,
                    profileImageUrl: user.photoURL || null,
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                progress: 0,
                tasks: { completed: 0, total: 0 },
                milestones: [],
                documents: [],
                fundingStage: '',
                mvpStatus: '',
                // ... add other initial fields
            });

            toast({
                title: "Success",
                description: "Project created successfully!",
            });
        }


      // Call the onSuccess prop if it exists
      if (onSuccess) {
          onSuccess();
      }

      // Optionally, redirect the user
      // navigate('/dashboard/projects');

      // Clear the form after successful creation (not after update, as the user might want to continue editing)
      if (!initialData) {
           setFormData({
             name: '',
             description: '',
             stage: '',
             isPrivate: false,
             // Reset other fields
           });
      }


    } catch (error) {
      console.error(`Error ${initialData ? 'updating' : 'creating'} project:`, error);
      toast({
        title: "Error",
        description: `Failed to ${initialData ? 'update' : 'create'} project. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Title is now handled by the Dialog in MyProjects */}
      {/* <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Project' : 'Create New Project'}</h2> */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
              {/* Assuming you have stages defined somewhere, or hardcode them for now */}
              <SelectItem value="Ideation">Ideation</SelectItem>
              <SelectItem value="Building">Building</SelectItem>
              <SelectItem value="Launching">Launching</SelectItem>
              <SelectItem value="Scaling">Scaling</SelectItem>
              {/* Add other stages from your projectStages collection */}
            </SelectContent>
          </Select>
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


        {/* Add other form fields here based on your project schema */}


        <Button type="submit" disabled={isSaving}>
          {isSaving ? (initialData ? 'Saving Changes...' : 'Creating...') : (initialData ? 'Save Changes' : 'Create Project')}
        </Button>
      </form>
    </div>
  );
};


export default ProjectForm;
