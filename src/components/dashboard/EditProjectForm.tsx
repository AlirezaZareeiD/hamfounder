import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from '@/contexts/UserContext';
import { db } from '@/lib/firebase';
import { collection, updateDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { Label } from "@/components/ui/label";
import DocumentsInput, { DocumentsInputRef, Document } from './DocumentsInput';

interface EditProjectFormData {
    name: string;
    description: string;
    stage: string;
    isPrivate: boolean;
    fundingStage: string;
    mvpStatus: string;
    milestones: string;
    tags: string[];
    documents: Document[];
    progress: number;
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

interface EditProjectFormProps {
    onSuccess?: () => void;
    initialData?: Project | null;
}

const removeUndefined = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
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

const projectStagesOptions = ["Idea", "Prototype", "MVP", "Early Stage", "Growth Stage", "Mature"];
const mvpStatusOptions = ["Idea Stage", "Concept Validation", "Low-Code MVP", "Concierge MVP", "Wizard of Oz MVP", "Single-Feature MVP", "Functional MVP", "Beta Product", "Product-Market Fit MVP"];
const milestonesOptions = ["Idea Validation", "Problem-Solution Fit", "MVP Launch", "Early Traction", "Product-Market Fit", "Team Milestones", "Fundraising Milestones", "Growth Milestones", "Scalability", "Exit"];
const fundingStagesOptions = ["Bootstrapping", "Pre-Seed Stage", "Seed Stage", "Series A", "Series B", "Series C", "Bridge Financing", "IPO"];

const EditProjectForm: React.FC<EditProjectFormProps> = ({ onSuccess, initialData }) => {
    const [formData, setFormData] = useState<EditProjectFormData>({
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

    const [projectTags, setProjectTags] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDocumentsUploading, setIsDocumentsUploading] = useState(false);
    const { user, loading } = useUser();
    const { toast } = useToast();
    const documentsInputRef = useRef<DocumentsInputRef>(null);

    useEffect(() => {
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
            setProjectTags(Array.isArray(initialData.tags) ? initialData.tags : []);
        } else {
            setFormData({ name: '', description: '', stage: '', isPrivate: false, fundingStage: '', mvpStatus: '', milestones: '', tags: [], documents: [], progress: 0 });
            setProjectTags([]);
        }
        setIsDocumentsUploading(false);
    }, [initialData]);

    useEffect(() => {
        if (documentsInputRef.current) {
            const currentlyUploading = documentsInputRef.current.isUploading();
            if (isDocumentsUploading !== currentlyUploading) {
                 setIsDocumentsUploading(currentlyUploading);
            }
        }
    }, [formData.documents, isDocumentsUploading]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (id: keyof EditProjectFormData, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleCheckboxChange = (id: keyof EditProjectFormData, checked: boolean) => {
        setFormData(prev => ({ ...prev, [id]: checked }));
    };

    const handleTagsChange = (tags: string[]) => {
        setProjectTags(tags);
    };

    // ✅ FIX: Wrapped the function in useCallback to stabilize its reference
    const handleDocumentsChange = useCallback((updatedDocuments: Document[]) => {
        console.log("EditProjectForm - handleDocumentsChange triggered by child component.");
        setFormData(prev => ({ ...prev, documents: updatedDocuments }));
    }, []); // Empty dependency array is correct as setFormData is stable

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 0 && value <= 100) {
            setFormData(prev => ({ ...prev, progress: value }));
        } else if (e.target.value === '') {
            setFormData(prev => ({ ...prev, progress: 0 }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (documentsInputRef.current && documentsInputRef.current.isUploading()) {
            toast({ title: "Upload in Progress", description: "Please wait for document uploads to complete." });
            return;
        }
        if (!user || loading) {
            toast({ title: "Authentication Error", description: "Authentication state is not ready.", variant: "destructive" });
            return;
        }
        if (!formData.name.trim() || !formData.description.trim() || !formData.stage.trim()) {
            toast({ title: "Validation Error", description: "Please fill in all required fields (Name, Description, Stage).", variant: "destructive" });
            return;
        }

        setIsSaving(true);
        try {
            const finalDocumentsToSave: Document[] = documentsInputRef.current ? documentsInputRef.current.getDocuments() : [];
            
            if (!initialData) {
                const newProjectRef = doc(collection(db, 'projects'));
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
                    documents: finalDocumentsToSave,
                    progress: formData.progress,
                    tasks: { completed: 0, total: 0 },
                    ownerInfo: {
                        displayName: user.displayName,
                        profileImageUrl: user.photoURL,
                    }
                };
                await setDoc(newProjectRef, removeUndefined(newProjectData));
            } else {
                const projectRef = doc(db, 'projects', initialData.id);
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
                    documents: finalDocumentsToSave,
                };
                await updateDoc(projectRef, removeUndefined(updatedProjectData));
            }

            toast({
                title: initialData ? "Project Updated!" : "Project Created!",
                description: "Your project has been successfully saved.",
            });
            if (onSuccess) onSuccess();

        } catch (error: any) {
            console.error(`Error saving project:`, error);
            toast({
                title: "Error",
                description: `Failed to save project. ${error.message}`,
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const isFormDisabled = isSaving || isDocumentsUploading;

    return (
        <div className="bg-white p-6 rounded-lg shadow flex flex-col h-full">
            <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
                <div>
                    <Label htmlFor="name">Project Name</Label>
                    <Input id="name" value={formData.name} onChange={handleInputChange} required disabled={isFormDisabled} />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={handleInputChange} rows={4} required disabled={isFormDisabled} />
                </div>
                <div>
                    <Label htmlFor="stage">Stage</Label>
                    <Select onValueChange={(value) => handleSelectChange('stage', value)} value={formData.stage} required disabled={isFormDisabled}>
                        <SelectTrigger id="stage"><SelectValue placeholder="Select Stage" /></SelectTrigger>
                        <SelectContent>{projectStagesOptions.map(stage => (<SelectItem key={stage} value={stage}>{stage}</SelectItem>))}</SelectContent>
                    </Select>
                </div>
                <div style={{ display: formData.stage === 'MVP' ? 'block' : 'none' }}>
                    <Label htmlFor="mvpStatus">MVP Status</Label>
                    <Select onValueChange={(value) => handleSelectChange('mvpStatus', value)} value={formData.mvpStatus} disabled={isFormDisabled}>
                        <SelectTrigger id="mvpStatus"><SelectValue placeholder="Select MVP Status" /></SelectTrigger>
                        <SelectContent>{mvpStatusOptions.map(status => (<SelectItem key={status} value={status}>{status}</SelectItem>))}</SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="milestones">Milestone</Label>
                    <Select onValueChange={(value) => handleSelectChange('milestones', value)} value={formData.milestones} disabled={isFormDisabled}>
                        <SelectTrigger id="milestones"><SelectValue placeholder="Select Milestone" /></SelectTrigger>
                        <SelectContent>{milestonesOptions.map(milestone => (<SelectItem key={milestone} value={milestone}>{milestone}</SelectItem>))}</SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="fundingStage">Funding Stage</Label>
                    <Select onValueChange={(value) => handleSelectChange('fundingStage', value)} value={formData.fundingStage} disabled={isFormDisabled}>
                        <SelectTrigger id="fundingStage"><SelectValue placeholder="Select Funding Stage" /></SelectTrigger>
                        <SelectContent>{fundingStagesOptions.map(stage => (<SelectItem key={stage} value={stage}>{stage}</SelectItem>))}</SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="tags">Tags</Label>
                    <TagsInput
                        value={projectTags}
                        onChange={handleTagsChange}
                        tagProps={{ className: 'react-tagsinput-tag bg-black text-white rounded px-2 py-1 mr-1 text-sm' }}
                        inputProps={{ placeholder: 'Add tags (press Enter or Tab)' }}
                        className={`react-tagsinput border rounded-md p-2 w-full sm:text-sm ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : 'border-gray-300'}`}
                        key={initialData?.id || 'new'}
                        disabled={isFormDisabled}
                    />
                </div>
                <div>
                    <Label htmlFor="progress">Progress (%)</Label>
                    <Input id="progress" type="number" value={formData.progress} onChange={handleProgressChange} min="0" max="100" required disabled={isFormDisabled} />
                </div>
                <div>
                    <Label>Documents</Label>
                    <DocumentsInput ref={documentsInputRef} initialDocuments={formData.documents} onDocumentsChange={handleDocumentsChange} projectId={initialData?.id} />
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="isPrivate" checked={formData.isPrivate} onCheckedChange={(checked: boolean) => handleCheckboxChange('isPrivate', checked)} disabled={isFormDisabled} />
                    <Label htmlFor="isPrivate">Private Project</Label>
                </div>
                <Button type="submit" disabled={isFormDisabled}>
                    {isSaving ? (initialData ? 'Saving Changes...' : 'Creating...') : (isDocumentsUploading ? 'Uploading Files...' : (initialData ? 'Save Changes' : 'Create Project'))}
                </Button>
            </form>
        </div>
    );
};

export default EditProjectForm;