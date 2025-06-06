import React, { useState, useEffect, ChangeEvent, forwardRef, useImperativeHandle } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';

// Define the Document interface - matches the one in ProjectForm.tsx
// Adjusted url type to allow null, matching Firestore representation after cleaning
interface Document {
    id: string; // Add an ID for easier management
    name: string;
    url?: string | null; // url will be populated after file upload, can be null in Firestore
    description?: string;
    file?: File; // Temporarily store the file object before upload - NOT in Firestore
    uploadProgress?: number; // Track upload progress (0-100) - NOT in Firestore
    uploadError?: string; // Store upload error message - NOT in Firestore
}

interface DocumentsInputProps {
    initialDocuments?: Document[];
    onDocumentsChange: (documents: Document[]) => void;
    onUploadsComplete?: (updatedDocuments: Document[]) => void; // Callback for when external uploads complete
    projectId?: string; // Needed for Firebase Storage path
}

export interface DocumentsInputRef {
  uploadDocuments: (projectId: string) => Promise<Document[]>;
}


const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

const DocumentsInput = forwardRef<DocumentsInputRef, DocumentsInputProps>(({ initialDocuments = [], onDocumentsChange, projectId }, ref) => {
    // Ensure initial documents have a null url if undefined, matching the Document interface
    const [documents, setDocuments] = useState<Document[]>(initialDocuments.map(doc => ({
        ...doc,
        id: doc.id || Math.random().toString(36).substring(2, 15), // Simple ID generation if missing
        url: doc.url === undefined ? null : doc.url, // Ensure url is string or null
        // file, uploadProgress, uploadError should not be in initialDocuments from Firestore
        file: undefined,
        uploadProgress: undefined,
        uploadError: undefined,
    })));

    const { toast } = useToast();

    // UseEffect to handle initial population if needed, but the useState initializer above handles most cases
    // Keeping this simplified for clarity, relying on useState initializer.
    // If initialDocuments can change *after* the initial render, a useEffect might still be needed:
     useEffect(() => {
         const documentsWithIds = initialDocuments.map(doc => ({
             ...doc,
             id: doc.id || Math.random().toString(36).substring(2, 15),
             url: doc.url === undefined ? null : doc.url,
             file: undefined,
             uploadProgress: undefined,
             uploadError: undefined,
         }));
         // Only update state if initialDocuments actually changed to prevent infinite loops
         // A deep comparison might be needed for complex objects if relying heavily on this effect
         if (JSON.stringify(documentsWithIds) !== JSON.stringify(documents.map(({file, uploadProgress, uploadError, ...rest}) => rest))) {
              setDocuments(documentsWithIds);
         }
     }, [initialDocuments]); // Depend only on initialDocuments

    // Notify parent when documents change (filtering out temporary fields)
    useEffect(() => {
        const documentsToSave = documents.map(({ uploadProgress, uploadError, file, ...rest }) => rest);
        // Only call onDocumentsChange if the savable data has actually changed
        // This helps prevent unnecessary renders in the parent component
        // A deep comparison is used here for robustness
        if (JSON.stringify(documentsToSave) !== JSON.stringify(initialDocuments.map(({uploadProgress, uploadError, file, ...rest}) => rest))) {
             onDocumentsChange(documentsToSave);
        }
    }, [documents, onDocumentsChange, initialDocuments]); // Depend on documents, onDocumentsChange, and initialDocuments for comparison


    const handleAddDocument = () => {
        setDocuments([...documents, {
            id: Math.random().toString(36).substring(2, 15),
            name: '', // Initialize with empty string
            description: '', // Initialize with empty string
            url: null, // New documents start with null URL
            file: undefined,
            uploadProgress: undefined,
            uploadError: undefined,
        }]);
    };

    const handleRemoveDocument = (id: string) => {
         // Find the document to potentially delete from storage
         const docToRemove = documents.find(doc => doc.id === id);

         // Remove the document from the state immediately for responsiveness
        setDocuments(documents.filter(doc => doc.id !== id));

        // TODO: Implement Firebase Storage deletion for the associated file if URL exists
        // This requires knowing the storage path from the URL or storing it with the document.
        // For now, we only remove the reference in the document list.
        // You would add logic here to call deleteObject from firebase/storage
        // based on docToRemove.url and projectId.
        if (docToRemove?.url && projectId) {
             console.log("Attempting to delete file from storage for document ID:", id);
             // Example (requires knowing the exact storage path format used during upload):
             // const storagePath = `project-documents/${projectId}/${docToRemove.url.split('/').pop()?.split('?')[0]}`; // This path parsing might need adjustment
             // const fileRef = ref(storage, storagePath);
             // deleteObject(fileRef).then(() => {
             //     console.log("File deleted from storage successfully.");
             // }).catch((error) => {
             //     console.error("Error deleting file from storage:", error);
             // });
        } else {
             console.log("Document had no URL or projectId, skipping storage deletion for ID:", id);
        }
    };

    const handleDocumentChange = (id: string, field: keyof Document, value: any) => {
        setDocuments(prevDocs => prevDocs.map(doc =>
            doc.id === id ? {
                ...doc,
                [field]: value,
                // Clear upload related status when file or other key fields change
                ...(field === 'file' || field === 'name' || field === 'description' ? {
                    uploadProgress: undefined,
                    uploadError: undefined,
                     ...(field === 'file' ? { url: undefined } : {}) // Clear URL if a new file is selected
                } : {}),
            } : doc
        ));
    };


    const handleInputChange = (id: string, field: 'name' | 'description', value: string) => {
        setDocuments(prevDocs => prevDocs.map(doc =>
            doc.id === id ? { ...doc, [field]: value } : doc
        ));
        // Note: handleDocumentChange is more comprehensive and could replace this
        // handleDocumentChange(id, field, value); // Using the more general handler
    };


    // Exported function to trigger uploads
    useImperativeHandle(ref, () => ({
      uploadDocuments: async (currentProjectId: string) => {
        if (!currentProjectId) {
            console.error("Cannot trigger uploads without a project ID.");
            // Return current documents state, filtering out temporary fields
            return documents.map(({ file, uploadProgress, uploadError, ...rest }) => rest);
        }

        // Filter documents that have a file selected but no URL yet
        const documentsToUpload = documents.filter(doc => doc.file && !doc.url);
        console.log(`Found ${documentsToUpload.length} documents to upload.`);

        if (documentsToUpload.length === 0) {
             console.log("No new documents to upload.");
             // If no documents to upload, return the current state, filtering out temporary fields
            return documents.map(({ file, uploadProgress, uploadError, ...rest }) => rest);
        }

        const uploadPromises = documentsToUpload.map(async (docToUpload) => {
             if (!docToUpload.file) {
                 // This case should theoretically not be reached due to the filter
                 console.warn("Skipping upload for document with no file (unexpected):", docToUpload);
                 return Promise.resolve({ ...docToUpload, uploadError: 'No file provided' }); // Resolve with an error state
             }

            // Construct storage path using project ID and a unique identifier + filename
            // Using a unique ID helps prevent conflicts if files have the same name
             const uniqueFileName = `${docToUpload.id}_${docToUpload.file.name}`;
            const storagePath = `project-documents/${currentProjectId}/${uniqueFileName}`;

            console.log(`Starting upload for document: ${docToUpload.name} to path: ${storagePath}`);

            const storageRef = ref(storage, storagePath);
            const uploadTask = uploadBytesResumable(storageRef, docToUpload.file);

            return new Promise<Document>((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        // Update progress in state
                         // Using function form of setDocuments to ensure latest state
                        setDocuments(prevDocs => prevDocs.map(d => d.id === docToUpload.id ? { ...d, uploadProgress: progress, uploadError: undefined } : d));
                    },
                    (error) => {
                        console.error("Upload failed for document:", docToUpload.name, error);
                        // Update error in state
                         // Using function form of setDocuments to ensure latest state
                        setDocuments(prevDocs => prevDocs.map(d => d.id === docToUpload.id ? { ...d, uploadError: error.message || 'Upload failed', uploadProgress: undefined } : d));
                         reject(error); // Reject the promise on error
                    },
                    () => {
                         // Upload successful
                         console.log(`Upload complete for document: ${docToUpload.name}`);
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            console.log(`Download URL obtained for ${docToUpload.name}: ${downloadURL}`);
                            // Ensure URL is string (not null) on success
                             const updatedDoc: Document = { ...docToUpload, url: downloadURL, uploadProgress: undefined, uploadError: undefined, file: undefined };
                             // Update state with final URL and clear temporary fields
                             // Using function form of setDocuments to ensure latest state
                             setDocuments(prevDocs => prevDocs.map(d => d.id === updatedDoc.id ? updatedDoc : d));
                             resolve(updatedDoc); // Resolve with the updated document object
                         }).catch(err => {
                             console.error("Failed to get download URL for document:", docToUpload.name, err);
                             // Update error in state if getting URL fails
                             // Using function form of setDocuments to ensure latest state
                             setDocuments(prevDocs => prevDocs.map(d => d.id === docToUpload.id ? { ...d, uploadError: err.message || 'Failed to get URL', uploadProgress: undefined } : d));
                             reject(err); // Reject if getting URL fails
                         });
                    }
                );
            });
        });

        try {
            // Wait for all upload promises to settle (either resolve or reject)
            const uploadResults = await Promise.allSettled(uploadPromises);
            console.log("Document upload promises settled:", uploadResults);

             // At this point, the state should have been updated by the promise listeners
             // for both fulfilled and rejected promises.

             // We need to construct the final list of documents to return.
             // This list should include:
             // 1. Documents that were successfully uploaded (with their new URLs).
             // 2. Documents that already had URLs and were not re-uploaded.
             // 3. Documents that failed to upload (keeping their error status, filtering out the temporary file).
             // 4. Documents that were newly added but had no file selected (should be filtered out by parent save logic, but good to handle here too).


             // Get the final state after all async updates *should* have processed.
             // Accessing state directly after await can sometimes be stale,
             // but given typical React update cycles, this is often the most practical approach.
             // A more complex solution would involve using a reducer or a state management library.
             const finalDocumentsState = documents.map(doc => {
                 // Filter out temporary fields (file, uploadProgress, uploadError)
                 const { file, uploadProgress, uploadError, ...rest } = doc;
                 // Ensure URL is explicitly null if it was undefined
                 return { ...rest, url: rest.url === undefined ? null : rest.url };
             });

             console.log("Final documents state after uploads (filtered temporary fields):", finalDocumentsState);


            // The onUploadsComplete callback was defined in the interface but not used.
            // If you need a callback after all uploads settle (regardless of success/failure)
            // you could call it here with the finalDocumentsState.
            // if (onUploadsComplete) {
            //     onUploadsComplete(finalDocumentsState);
            // }


             // Return the cleaned array. The parent component (ProjectForm) will use this.
             return finalDocumentsState;


        } catch (error) {
            // This catch block will only be reached if Promise.allSettled itself throws,
            // which is unlikely. Errors in individual uploads are handled within the promise listeners.
            console.error("An unexpected error occurred during document uploads (Promise.allSettled):", error);
            // Re-throw the error if necessary, or return a state reflecting the failures
            throw error;
        }
      },
    }));


    const handleFileUpload = (id: string) => async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            // Clear the input if the user cancels the file selection
             setDocuments(prevDocs => prevDocs.map(doc =>
                doc.id === id ? { ...doc, file: undefined, url: undefined, uploadProgress: undefined, uploadError: undefined } : doc
            ));
            return;
        }


        if (file.size > MAX_FILE_SIZE_BYTES) {
            toast({
                title: "Upload Error",
                description: `File "${file.name}" exceeds the maximum size limit of 50MB.`,
                variant: "destructive",
            });
             // Update state to show error and clear the file/url
            setDocuments(prevDocs => prevDocs.map(doc =>
                doc.id === id ? { ...doc, file: undefined, url: undefined, uploadProgress: undefined, uploadError: 'File too large' } : doc
            ));
            // Clear the file input value so the same file can be selected again if needed
            event.target.value = '';
            return;
        }

        // Store the file temporarily and clear previous upload status
        setDocuments(prevDocs => prevDocs.map(doc =>
            doc.id === id ? {
                ...doc,
                file: file,
                url: undefined, // Clear any previous URL
                uploadProgress: undefined, // No progress yet
                uploadError: undefined, // Clear previous errors
            } : doc
        ));


        toast({
            title: "File Selected",
            description: `File "${file.name}" selected. Upload will begin when you save the project.\nPlease save the form to complete the upload.`,
        });

        event.target.value = ''; // Clear the file input value immediately after selection
    };


    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Documents</label>
            {documents.map((doc, index) => (
                <div key={doc.id} className="border p-4 rounded-md space-y-3 relative">
                    {/* Remove Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveDocument(doc.id)}
                        aria-label="Remove document"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    {/* Document Name Input */}
                    <div>
                        <label htmlFor={`doc-name-${doc.id}`} className="block text-xs font-medium text-gray-500">Name</label>
                        <Input
                            id={`doc-name-${doc.id}`}
                            value={doc.name}
                            onChange={(e) => handleInputChange(doc.id, 'name', e.target.value)}
                            placeholder="Document Name"
                        />
                    </div>

                    {/* File Upload Input and Status Display */}
                    <div>
                         <label htmlFor={`doc-file-${doc.id}`} className="block text-xs font-medium text-gray-500">File (Max 50MB)</label>
                         <Input
                             id={`doc-file-${doc.id}`}
                             type="file"
                             onChange={handleFileUpload(doc.id)}
                             className="file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border-none file:rounded-md file:px-4 file:py-1 mr-4"
                             // Clear the input value if the doc has a URL or error, so user can re-select
                              value={doc.url || doc.uploadError ? '' : undefined}
                         />

                         {/* Consolidated File Status Display */}
                         {doc.uploadError && (
                             <div className="text-sm text-red-600 mt-1">{doc.uploadError}</div>
                         )}
                         {doc.uploadProgress !== undefined && (
                             <div className="text-sm text-blue-600 mt-1">Uploading: {doc.uploadProgress.toFixed(0)}%</div>
                         )}
                         {!doc.uploadError && doc.uploadProgress === undefined && (
                             // Display either the uploaded URL or the selected file name if no upload is in progress or has failed
                             doc.url ? (
                                 <div className="text-sm text-green-600 mt-1">
                                     Uploaded: <a href={doc.url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline break-all">
                                         {/* Attempt to get filename from URL, fallback to 'View File' */}
                                         {doc.url.split('/').pop()?.split('?')[0] || 'View File'}
                                     </a>
                                 </div>
                             ) : doc.file ? (
                                 <div className="text-sm text-gray-600 mt-1">Selected: {doc.file.name}</div>
                             ) : (
                                 // Display a message if no file is selected or uploaded yet for this document slot
                                 <div className="text-sm text-gray-500 mt-1">No file selected.</div>
                             )
                         )}
                    </div>

                    {/* Document Description Input */}
                    <div>
                        <label htmlFor={`doc-description-${doc.id}`} className="block text-xs font-medium text-gray-500">Description (Optional)</label>
                        <Textarea
                            id={`doc-description-${doc.id}`}
                            value={doc.description || ''}
                            onChange={(e) => handleInputChange(doc.id, 'description', e.target.value)}
                            placeholder="Document Description"
                            rows={2}
                        />
                    </div>
                </div>
            ))}

            {/* Add Document Button */}
            <Button type="button" variant="outline" onClick={handleAddDocument} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Document
            </Button>
        </div>
    );
});

export default DocumentsInput;
