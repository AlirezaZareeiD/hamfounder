import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from '@/contexts/UserContext';
import { db, forceRefreshToken } from '@/lib/firebase'; // Import forceRefreshToken
import { collection, addDoc, updateDoc, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, MinusCircle } from 'lucide-react'; // Import icons



// Define interfaces
interface Document {
    name: string;
    url?: string;
    description?: string;
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

  console.log("Current user:", user); // Added console log to check user status

  // State for dropdown options
  const [stages, setStages] = useState<{ name: string; id: string }[]>([]);
  const [fundingStages, setFundingStages] = useState<{ name: string; id: string }[]>([]);
  const [mvpStatuses, setMvpStatuses] = useState<{ name: string; id: string }[]>([]);
  const [allMilestones, setAllMilestones] = useState<{ name: string; id: string }[]>([]);


  // useEffect to fetch dropdown options from Firebase
  useEffect(() => {
      const fetchDropdownOptions = async () => {
          // Force refresh auth token (NEWLY ADDED)
          await forceRefreshToken();
          console.log("Attempting to fetch dropdown data after token refresh...");


          try {
              console.log("Attempting to fetch projectStages...");
              const stagesSnapshot = await getDocs(collection(db, 'projectStages'));
              setStages(stagesSnapshot.docs.map(doc => ({ name: doc.data().name, id: doc.id })));
              console.log("Successfully fetched projectStages:", stagesSnapshot.docs.length, "documents.");

          } catch (error) {
              console.error("Error fetching projectStages:", error);
              toast({
                  title: "Error",
                  description: "Failed to load Project Stages.",
                  variant: "destructive",
              });
          }

          try {
              console.log("Attempting to fetch fundingStage...");
              const fundingStagesSnapshot = await getDocs(collection(db, 'fundingStage'));
              setFundingStages(fundingStagesSnapshot.docs.map(doc => ({ name: doc.data().name, id: doc.id })));
              console.log("Successfully fetched fundingStage:", fundingStagesSnapshot.docs.length, "documents.");

          } catch (error) {
              console.error("Error fetching fundingStage:", error);
              toast({
                  title: "Error",
                  description: "Failed to load Funding Stages.",
                  variant: "destructive",
              });
          }

           try {
              console.log("Attempting to fetch mvpStatus...");
              const mvpStatusesSnapshot = await getDocs(collection(db, 'mvpStatus'));
              setMvpStatuses(mvpStatusesSnapshot.docs.map(doc => ({ name: doc.data().name, id: doc.id })));
               console.log("Successfully fetched mvpStatus:", mvpStatusesSnapshot.docs.length, "documents.");

          } catch (error) {
              console.error("Error fetching mvpStatus:", error);
              toast({
                  title: "Error",
                  description: "Failed to load MVP Statuses.",
                  variant: "destructive",
              });
          }

          try {
              console.log("Attempting to fetch milestones...");
              const milestonesSnapshot = await getDocs(collection(db, 'milestones'));
              setAllMilestones(milestonesSnapshot.docs.map(doc => ({ name: doc.data().name, id: doc.id })));
              console.log("Successfully fetched milestones:", milestonesSnapshot.docs.length, "documents.");

          } catch (error) {
              console.error("Error fetching milestones:", error);
              toast({
                  title: "Error",
                  description: "Failed to load Milestones.",
                  variant: "destructive",
              });
          }
      };

      // Only fetch options if user is logged in.
      if (user) {
        fetchDropdownOptions();
      }

  }, [toast, user]); // Add user to dependency array


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
              tags: initialData.tags || [],
              milestones: initialData.milestones || '',
              documents: initialData.documents || [],
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
  }, [initialData]);


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

   // Handler for tags input (simple comma separation)
   const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Split by comma, trim whitespace, filter out empty strings
        const newTags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        setFormData(prev => ({ ...prev, tags: newTags }));
   };

   // Handler for documents input
   const handleDocumentChange = (index: number, field: keyof Document, value: string) => {
       setFormData(prev => {
           const newDocuments = [...prev.documents];
           newDocuments[index] = { ...newDocuments[index], [field]: value };
           return { ...prev, documents: newDocuments };
       });
   };

    const handleAddDocument = () => {
        setFormData(prev => ({
            ...prev,
            documents: [...prev.documents, { name: '', url: '', description: '' }]
        }));
    };

    const handleRemoveDocument = (index: number) => {
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index)
        }));
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


    // Basic validation (can be extended for new fields)
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
    <div className="bg-white p-6 rounded-lg shadow">
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
              {stages.map(stage => (
                  <SelectItem key={stage.id} value={stage.name}>{stage.name}</SelectItem>
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
                   {fundingStages.map(stage => (
                       <SelectItem key={stage.id} value={stage.name}>{stage.name}</SelectItem>
                   ))}
               </SelectContent>
           </Select>
        </div>


        {/* MVP Status */}
        <div>
           <Label htmlFor="mvpStatus">MVP Status</Label>
           <Select onValueChange={(value) => handleSelectChange('mvpStatus', value)} value={formData.mvpStatus}>
               <SelectTrigger id="mvpStatus">
                   <SelectValue placeholder="Select MVP Status" />
               </SelectTrigger>
               <SelectContent>
                    {mvpStatuses.map(status => (
                        <SelectItem key={status.id} value={status.name}>{status.name}</SelectItem>
                    ))}
               </SelectContent>
           </Select>
        </div>


        {/* Milestones (Single Select based on database structure) */}
        <div>
           <Label htmlFor="milestones">Milestone</Label>
           <Select onValueChange={(value) => handleSelectChange('milestones', value)} value={formData.milestones}>
               <SelectTrigger id="milestones">
                   <SelectValue placeholder="Select Milestone" />
               </SelectTrigger>
               <SelectContent>
                   {allMilestones.map(milestone => (
                       <SelectItem key={milestone.id} value={milestone.name}>{milestone.name}</SelectItem>
                   ))}
               </SelectContent>
           </Select>
        </div>


        {/* Tags Input */}
        <div>
            <Label htmlFor="tags">Tags</Label>
             <Input
                id="tags"
                value={formData.tags.join(', ')} // Display tags as comma-separated string
                onChange={handleTagsChange}
                placeholder="Add tags (comma-separated)"
            />
        </div>


        {/* Documents Input */}
         <div>
             <Label>Documents</Label>
             <div className="space-y-2">
                 {formData.documents.map((doc, index) => (
                     <div key={index} className="flex items-center space-x-2 border p-2 rounded">
                         <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-2">
                             <Input
                                 placeholder="Document Name"
                                 value={doc.name}
                                 onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                                 required
                             />
                              <Input
                                 placeholder="Document URL (Optional)"
                                 value={doc.url || ''}
                                 onChange={(e) => handleDocumentChange(index, 'url', e.target.value)}
                             />
                             <Input
                                 placeholder="Description (Optional)"
                                 value={doc.description || ''}
                                 onChange={(e) => handleDocumentChange(index, 'description', e.target.value)}
                             />
                         </div>
                         <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveDocument(index)}
                            className="shrink-0"
                         >
                             <MinusCircle className="h-4 w-4" />
                         </Button>
                     </div>
                 ))}
                 <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleAddDocument}
                 >
                     <PlusCircle className="h-4 w-4 mr-2" /> Add Document
                 </Button>
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


        <Button type="submit" disabled={isSaving}>
          {isSaving ? (initialData ? 'Saving Changes...' : 'Creating...') : (initialData ? 'Save Changes' : 'Create Project')}
        </Button>
      </form>
    </div>
  );
};




export default ProjectForm;
