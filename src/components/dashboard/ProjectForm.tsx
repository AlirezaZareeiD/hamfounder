import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from '@/contexts/UserContext';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'; // Removed getDocs as we are not fetching from Firestore for dropdowns
import { useToast } from '@/hooks/use-toast';
import TagsInput from 'react-tagsinput'; // Import TagsInput
// import DocumentsInput from './DocumentsInput'; // Will be imported later

// Define interfaces
interface Document {
    name: string;
    url?: string; // url will be populated after file upload
    description?: string;
    file?: File; // Temporarily store the file object before upload
    uploadProgress?: number; // Track upload progress
    uploadError?: string; // Store upload error
}

interface ProjectFormData {
  name: string;
  description: string;
  stage: string;
  isPrivate: boolean;
  fundingStage: string;
  mvpStatus: string;
  tags: string[];
  milestones: string;
  documents: Document[];
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
  milestones: string;
  documents: Document[];
}

interface ProjectFormProps {
    onSuccess?: () => void;
    initialData?: Project | null;
}

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
    tags: [],
    milestones: '',
    documents: [],
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
              isPrivate: initialData.isPrivate ?? false,
              fundingStage: initialData.fundingStage || '',
              mvpStatus: initialData.mvpStatus || '',
              // Ensure tags is an array even if initialData.tags is null or undefined
              tags: Array.isArray(initialData.tags) ? initialData.tags : [],
              // Ensure documents is an array even if initialData.documents is null or undefined
              documents: Array.isArray(initialData.documents) ? initialData.documents : [],
              milestones: initialData.milestones || '',
          });
      } else {
           setFormData({
             name: '',
             description: '',
             stage: '',
             isPrivate: false,
             fundingStage: '',
             mvpStatus: '',
             tags: [],
             milestones: '',
             documents: [],
           });
      }
      // Added initialData.id as a key to force re-render of TagsInput
  }, [initialData, initialData?.id]);


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

    // Handler for TagsInput
    const handleTagsChange = (tags: string[]) => {
        setFormData(prev => ({ ...prev, tags }));
    };

    // Placeholder handler for DocumentsInput changes (will be replaced by actual component handler)
    const handleDocumentsChange = (updatedDocuments: Document[]) => {
        setFormData(prev => ({ ...prev, documents: updatedDocuments }));
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
        // NOTE: File uploads will be handled BEFORE saving the form data to Firestore.
        // This logic will be added when we implement DocumentsInput.

        if (initialData) {
            // Update existing project
            const projectRef = doc(db, 'projects', initialData.id);
            await updateDoc(projectRef, {
                ...formData,
                updatedAt: serverTimestamp(),
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
                ownerInfo: {
                    displayName: user.displayName || null,
                    profileImageUrl: user.photoURL || null,
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                progress: 0,
                tasks: { completed: 0, total: 0 },
            });

            toast({
                title: "Success",
                description: "Project created successfully!",
            });
        }

      if (onSuccess) {
          onSuccess();
      }

      if (!initialData) {
           setFormData({
             name: '',
             description: '',
             stage: '',
             isPrivate: false,
             fundingStage: '',
             mvpStatus: '',
             tags: [],
             milestones: '',
             documents: [],
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
    // Added flex-grow to make the container take available height
    // Added custom max-h for better scroll control if needed, or rely on parent.
    <div className="bg-white p-6 rounded-lg shadow flex flex-col h-full overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-4 flex-grow"> {/* Added flex-grow here */}
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

        {/* Milestones (Conditional Display) */}
        {formData.stage !== 'MVP' && (
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
        )}

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
                value={formData.tags}
                onChange={handleTagsChange}
                 tagProps={{ className: 'react-tagsinput-tag bg-black text-white rounded px-2 py-1 mr-1 text-sm' }}
                 inputProps={{ placeholder: 'Add tags (press Enter or Tab)' }}
                 className="react-tagsinput border border-gray-300 rounded-md p-2 w-full focus-within:ring-blue-500 focus-within:border-blue-500 sm:text-sm"
                 // Added key prop to force re-render when initialData changes
                 key={initialData?.id || 'new'}
            />
        </div>

         {/* Documents Input (Placeholder) */}
        <div>
            <Label>Documents</Label>
            {/* This will be replaced by the DocumentsInput component */}
            <div className="border border-dashed border-gray-300 rounded-md p-4 text-center text-gray-500">
                Document upload functionality will be added here.
                {/* Placeholder for DocumentsInput component */}
                {/* <DocumentsInput documents={formData.documents} onDocumentsChange={handleDocumentsChange} /> */}
            </div>
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

        {/* The submit button is inside the form, so it will scroll with the form content */}
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (initialData ? 'Saving Changes...' : 'Creating...') : (initialData ? 'Save Changes' : 'Create Project')}
        </Button>
      </form>
    </div>
  );
};

export default ProjectForm;
