import React, { useState, useEffect, ChangeEvent, forwardRef, useImperativeHandle, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, UploadCloud, CheckCircle, XCircle, FileText } from "lucide-react";
import { storage } from '@/lib/firebase';
import * as storageModule from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

// Define the Document interface
export interface Document {
    id: string;
    name: string;
    url?: string | null;
    description?: string;
    file?: File;
    uploadProgress?: number;
    uploadError?: string;
    isUploading?: boolean;
    isUploaded?: boolean;
}

interface DocumentsInputProps {
    initialDocuments?: Document[];
    onDocumentsChange: (documents: Document[]) => void;
    projectId?: string;
}

export interface DocumentsInputRef {
  getDocuments: () => Document[];
  isUploading: () => boolean;
}

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

const areDocumentsSavableEqual = (docs1: Document[], docs2: Document[]): boolean => {
    if (docs1.length !== docs2.length) return false;

    // Create sorted copies to ensure comparison is order-independent
    const sortedDocs1 = [...docs1].sort((a, b) => a.id.localeCompare(b.id));
    const sortedDocs2 = [...docs2].sort((a, b) => a.id.localeCompare(b.id));

    for (let i = 0; i < sortedDocs1.length; i++) {
        const d1 = sortedDocs1[i];
        const d2 = sortedDocs2[i];
        // Compare only the fields we save to Firestore
        if (d1.id !== d2.id || d1.name !== d2.name || d1.url !== d2.url || d1.description !== d2.description) {
            return false;
        }
    }
    return true;
};

const DocumentsInput = forwardRef<DocumentsInputRef, DocumentsInputProps>(({ initialDocuments = [], onDocumentsChange, projectId }, ref) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const { toast } = useToast();
    const { user, loading: userLoading } = useUser();

    // ✅ FIX: This ref helps break the infinite loop.
    // It tracks if a state update was caused by the parent, to prevent echoing the change back.
    const isSyncing = useRef(false);

    // Effect to sync internal state with initialDocuments prop from the parent
    useEffect(() => {
        const incoming = Array.isArray(initialDocuments) ? initialDocuments : [];
        
        // Only update if the incoming data is actually different from the current state
        if (!areDocumentsSavableEqual(documents, incoming)) {
            console.log("DocumentsInput: Syncing state from parent.");
            isSyncing.current = true; // Set the flag before updating state
            setDocuments(incoming.map(doc => ({
                ...doc,
                id: doc.id || Math.random().toString(36).substring(2, 15),
                isUploaded: !!doc.url,
            })));
        }
    }, [initialDocuments]);

    // Effect to notify parent when documents are changed by the USER
    useEffect(() => {
        // If the sync flag is true, it means the change came from the parent.
        // We do not notify the parent back. Reset the flag and exit.
        if (isSyncing.current) {
            isSyncing.current = false; // Reset the flag
            return;
        }

        // If the flag was false, the change was internal (e.g., user action).
        // Notify the parent.
        console.log("DocumentsInput: Notifying parent of user-made changes.");
        const documentsToSave = documents.map(({ uploadProgress, uploadError, file, isUploading, isUploaded, ...rest }) => rest);
        onDocumentsChange(documentsToSave);

    }, [documents, onDocumentsChange]);
    
    const handleAddDocument = () => {
        setDocuments(prev => [...prev, {
            id: Math.random().toString(36).substring(2, 15),
            name: '',
            description: '',
            url: null,
            file: undefined,
            uploadProgress: undefined,
            uploadError: undefined,
            isUploading: false,
            isUploaded: false,
        }]);
    };

    const handleRemoveDocument = async (id: string) => {
        const docToRemove = documents.find(doc => doc.id === id);
        setDocuments(prev => prev.filter(doc => doc.id !== id));

        if (docToRemove?.url && projectId) {
            console.log(`[Storage Deletion] Attempting to delete file for document ID: ${id}`);
            try {
                const url = new URL(docToRemove.url);
                const storagePath = decodeURIComponent(url.pathname.split('/o/')[1]).split('?')[0];
                console.log(`[Storage Deletion] Constructed storage path: ${storagePath}`);
                const fileRef = storageModule.ref(storage, storagePath);
                await storageModule.deleteObject(fileRef);
                console.log("[Storage Deletion] File deleted from storage successfully.");
                toast({
                    title: "Success",
                    description: `File "${docToRemove.name || 'document'}" deleted from storage.`,
                });
            } catch (error) {
                console.error("[Storage Deletion] Error deleting file from storage:", error);
                toast({
                    title: "Error",
                    description: `Failed to delete file "${docToRemove.name || 'document'}" from storage.`,
                    variant: "destructive",
                });
            }
        } else {
            console.log(`[Storage Deletion] Document ID ${id} had no URL or projectId, skipping storage deletion.`);
        }
    };

    const handleDocumentChange = (id: string, field: keyof Document, value: any) => {
        setDocuments(prevDocs => prevDocs.map(doc =>
            doc.id === id ? {
                ...doc,
                [field]: value,
                ...(field === 'file' ? {
                    uploadProgress: undefined,
                    uploadError: undefined,
                    isUploading: false,
                    isUploaded: false,
                    url: undefined
                } : {}),
            } : doc
        ));
    };

    const initiateUpload = async (docId: string, file: File, currentProjectId: string) => {
        console.log(`[Upload Initiate] Starting upload for document ID: ${docId}, file: ${file.name}`);
        const uniqueFileName = `${docId}_${file.name}`;
        const storagePath = `projects/${currentProjectId}/documents/${docId}/${uniqueFileName}`;
        
        setDocuments(prevDocs => prevDocs.map(doc =>
            doc.id === docId ? { ...doc, isUploading: true, uploadProgress: 0, uploadError: undefined, isUploaded: false } : doc
        ));

        try {
            const storageRef = storageModule.ref(storage, storagePath);
            const uploadTask = storageModule.uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot: storageModule.UploadTaskSnapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (progress - (documents.find(d => d.id === docId)?.uploadProgress || 0) > 1 || progress === 100) {
                        setDocuments(prevDocs => prevDocs.map(d => d.id === docId ? { ...d, uploadProgress: progress } : d));
                    }
                },
                (error) => {
                    console.error(`[Upload State Change] Upload failed for document ID: ${docId}`, error);
                    setDocuments(prevDocs => prevDocs.map(d => d.id === docId ? { ...d, uploadError: error.message, isUploading: false } : d));
                    toast({ title: "Upload Error", description: `Failed to upload "${file.name}".`, variant: "destructive" });
                },
                () => {
                    console.log(`[Upload Complete] Upload complete for document ID: ${docId}`);
                    storageModule.getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setDocuments(prevDocs => prevDocs.map(d => d.id === docId ? { ...d, url: downloadURL, isUploading: false, file: undefined, isUploaded: true } : d));
                        toast({ title: "Upload Successful", description: `File "${file.name}" uploaded.`, variant: "success" });
                    }).catch(err => {
                        console.error(`[Upload Get URL] Failed to get download URL for document ID: ${docId}`, err);
                        setDocuments(prevDocs => prevDocs.map(d => d.id === docId ? { ...d, uploadError: err.message, isUploading: false } : d));
                        toast({ title: "Upload Error", description: `Failed to get URL for "${file.name}".`, variant: "destructive" });
                    });
                }
            );
        } catch (error: any) {
            console.error(`[Upload Initiate Error] Error initiating upload for document ID: ${docId}`, error);
            setDocuments(prevDocs => prevDocs.map(d => d.id === docId ? { ...d, uploadError: error.message, isUploading: false } : d));
            toast({ title: "Upload Error", description: `Could not initiate upload for "${file.name}".`, variant: "destructive" });
        }
    };

    const handleFileUpload = (id: string) => async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) {
            setDocuments(prevDocs => prevDocs.map(doc => doc.id === id ? { ...doc, file: undefined, url: undefined, uploadError: undefined, isUploading: false, isUploaded: false } : doc));
            return;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            toast({ title: "Upload Error", description: `File is too large (Max 50MB).`, variant: "destructive" });
            setDocuments(prevDocs => prevDocs.map(doc => doc.id === id ? { ...doc, uploadError: 'File too large', isUploading: false, isUploaded: false } : doc));
            return;
        }

        setDocuments(prevDocs => prevDocs.map(doc => doc.id === id ? { ...doc, file, url: undefined, uploadError: undefined, isUploading: true, isUploaded: false } : doc));

        if (projectId && user && !userLoading) {
            initiateUpload(id, file, projectId);
        } else {
            setDocuments(prevDocs => prevDocs.map(doc => doc.id === id ? { ...doc, isUploading: false, uploadError: "Save project first to upload file." } : doc));
            toast({ title: "Upload Pending", description: "Save the project to enable upload." });
        }
    };

    useEffect(() => {
        if (projectId && user && !userLoading) {
            documents.forEach(doc => {
                if (doc.file && !doc.url && !doc.isUploading && doc.uploadError) {
                    initiateUpload(doc.id, doc.file, projectId);
                }
            });
        }
    }, [projectId, user, userLoading, documents]);

    useImperativeHandle(ref, () => ({
        getDocuments: () => documents.map(({ file, uploadProgress, uploadError, isUploading, isUploaded, ...rest }) => ({
            ...rest,
            url: rest.url === undefined ? null : rest.url,
        })),
        isUploading: () => documents.some(doc => doc.isUploading === true),
    }));

    return (
        <div className="space-y-4">
            {documents.map((doc, index) => (
                <div key={doc.id} className="border p-4 rounded-md space-y-3 relative">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveDocument(doc.id)}
                        aria-label="Remove document"
                        disabled={doc.isUploading}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    <div>
                        <label htmlFor={`doc-name-${doc.id}`} className="block text-xs font-medium text-gray-500">Name</label>
                        <Input
                            id={`doc-name-${doc.id}`}
                            value={doc.name}
                            onChange={(e) => handleDocumentChange(doc.id, 'name', e.target.value)}
                            placeholder="Document Name"
                            disabled={doc.isUploading}
                        />
                    </div>

                    <div>
                        <label htmlFor={`doc-file-${doc.id}`} className="block text-xs font-medium text-gray-500">File (Max 50MB)</label>
                        {(!doc.isUploading && !doc.isUploaded) ? (
                            <Input
                                id={`doc-file-${doc.id}`}
                                type="file"
                                onChange={handleFileUpload(doc.id)}
                                className="file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border-none file:rounded-md file:px-4 file:py-1 mr-4"
                                disabled={doc.isUploading}
                            />
                        ) : (
                            <div className="mt-1 flex items-center text-sm">
                                {doc.isUploading && doc.uploadProgress !== undefined && (
                                    <div className="text-sm text-blue-600 flex items-center">
                                        <UploadCloud className="h-4 w-4 mr-2" /> Uploading: {doc.uploadProgress.toFixed(0)}%
                                    </div>
                                )}
                                {doc.uploadError && !doc.isUploading && (
                                    <div className="text-sm text-red-600 flex items-center">
                                        <XCircle className="h-4 w-4 mr-2" /> Error: {doc.uploadError}
                                    </div>
                                )}
                                {doc.isUploaded && doc.url && !doc.isUploading && (
                                    <div className="text-sm text-green-600 flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-2" /> Uploaded: <a href={doc.url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline break-all ml-1">
                                            {(() => {
                                                try {
                                                    if (typeof doc.url !== 'string') return 'View File';
                                                    const url = new URL(doc.url);
                                                    const decodedPath = decodeURIComponent(url.pathname);
                                                    const fileName = decodedPath.split('/').pop()?.split('?')[0];
                                                    return fileName || 'View File';
                                                } catch (e) {
                                                    return 'View File';
                                                }
                                            })()}
                                        </a>
                                    </div>
                                )}
                                {!doc.isUploading && !doc.uploadError && !doc.isUploaded && doc.file && !doc.url && (
                                    <div className="text-sm text-gray-600 flex items-center">
                                        <FileText className="h-4 w-4 mr-2 text-gray-500" /> Selected: {doc.file.name}
                                    </div>
                                )}
                                {!doc.isUploading && !doc.uploadError && !doc.isUploaded && !doc.file && !doc.url && (
                                    <div className="text-sm text-gray-500">No file selected.</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor={`doc-description-${doc.id}`} className="block text-xs font-medium text-gray-500">Description (Optional)</label>
                        <Textarea
                            id={`doc-description-${doc.id}`}
                            value={doc.description || ''}
                            onChange={(e) => handleDocumentChange(doc.id, 'description', e.target.value)}
                            placeholder="Document Description"
                            rows={2}
                            disabled={doc.isUploading}
                        />
                    </div>
                </div>
            ))}

            <Button type="button" variant="outline" onClick={handleAddDocument} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Document
            </Button>
        </div>
    );
});

export default DocumentsInput;