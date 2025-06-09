import React, { useState, useEffect, ChangeEvent, forwardRef, useImperativeHandle } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, UploadCloud, CheckCircle, XCircle, FileText } from "lucide-react"; // Added FileText icon for placeholder
// Import storage from your firebase config file
import { storage } from '@/lib/firebase';
// Import ALL Storage functions as a module
import * as storageModule from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext'; // Import useUser hook to check user status


// Define the Document interface
export interface Document {
    id: string;
    name: string;
    url?: string | null;
    description?: string;
    file?: File; // Temporary, not saved to Firestore directly
    uploadProgress?: number; // Track upload progress (0-100)
    uploadError?: string; // Store upload error message
    isUploading?: boolean; // Added to track if a specific document is uploading
    isUploaded?: boolean; // Added to track if a specific document is successfully uploaded
}

interface DocumentsInputProps {
    initialDocuments?: Document[];
    onDocumentsChange: (documents: Document[]) => void;
    projectId?: string; // Needed for Firebase Storage path
}

export interface DocumentsInputRef {
  getDocuments: () => Document[];
  isUploading: () => boolean;
}


const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

const DocumentsInput = forwardRef<DocumentsInputRef, DocumentsInputProps>(({ initialDocuments = [], onDocumentsChange, projectId }, ref) => {
    // Initialize state with initialDocuments
    const [documents, setDocuments] = useState<Document[]>(initialDocuments.map(doc => ({
        ...doc,
        id: doc.id || Math.random().toString(36).substring(2, 15),
        url: doc.url === undefined ? null : doc.url,
        file: undefined,
        uploadProgress: undefined,
        uploadError: undefined,
        isUploading: false, // Initialize to false
        isUploaded: !!doc.url, // Initialize based on if a URL exists
    })));

    const { toast } = useToast();
    const { user, loading: userLoading } = useUser(); // Get user and loading status


    // Effect to notify parent when documents change (excluding temporary fields)
    useEffect(() => {
        // Create a version of documents without temporary fields for the parent
        const documentsToSave = documents.map(({ uploadProgress, uploadError, file, isUploading, isUploaded, ...rest }) => rest);

        // Create a cleaned version of initialDocuments for comparison
        const initialDocsCleaned = Array.isArray(initialDocuments) ? initialDocuments.map(({uploadProgress, uploadError, file, isUploading, isUploaded, ...rest}) => rest) : [];

        // Only call onDocumentsChange if the savable part of documents has changed
        // Using stringify can be brittle, but for simple data structures like this, it's often sufficient for diffing.
        // A more robust approach might involve deep comparison or tracking a change flag.
        if (JSON.stringify(documentsToSave) !== JSON.stringify(initialDocsCleaned)) {
             console.log("DocumentsInput useEffect - calling onDocumentsChange with savable data.");
             onDocumentsChange(documentsToSave);
        } else {
             console.log("DocumentsInput useEffect - savable documents state unchanged.");
        }
    }, [documents, onDocumentsChange, initialDocuments]);

    // Effect to log documents state for debugging
    useEffect(() => {
        console.log("DocumentsInput state updated:", documents);
        // Also log overall uploading status
        console.log("DocumentsInput is currently uploading:", documents.some(doc => doc.isUploading === true));
    }, [documents]);


    const handleAddDocument = () => {
        setDocuments([...documents, {
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

         // Remove the document from the state immediately for a responsive UI
        setDocuments(documents.filter(doc => doc.id !== id));

        // Implement Firebase Storage deletion if URL exists and projectId is available
        // This part runs in the background after updating the state
        if (docToRemove?.url && projectId) {
             console.log(`[Storage Deletion] Attempting to delete file for document ID: ${id}`);
             try {
                 // Parse the URL to get the storage path
                 const url = new URL(docToRemove.url);
                 // Extract the path part after '/o/' and before the '?' query string
                 const storagePath = decodeURIComponent(url.pathname.split('/o/')[1]).split('?')[0];

                 console.log(`[Storage Deletion] Constructed storage path: ${storagePath}`);

                 // Get a reference to the file in storage
                 const fileRef = storageModule.ref(storage, storagePath);
                 // Delete the file
                 await storageModule.deleteObject(fileRef);
                 console.log("[Storage Deletion] File deleted from storage successfully.");
                 toast({
                     title: "Success",
                     description: `File "${docToRemove.name || 'document'}" deleted from storage.`,
                 });
             } catch (error) {
                 console.error("[Storage Deletion] Error deleting file from storage:", error);
                  // Optionally, show an error toast if deletion failed
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
                // When name or description change, we don't need to reset upload status.
                // Only file change should trigger a potential re-upload.
                ...(field === 'file' ? {
                    uploadProgress: undefined,
                    uploadError: undefined,
                    isUploading: false, // Reset upload status
                    isUploaded: false, // Reset uploaded status
                     url: undefined // If a new file is selected, clear the old URL immediately
                } : {}),
            } : doc
        ));
    };


    // Function to initiate upload
    const initiateUpload = async (docId: string, file: File, currentProjectId: string) => {
         console.log(`[Upload Initiate] Starting upload for document ID: ${docId}, file: ${file.name}`);
         console.log(`[Upload Initiate] Using Project ID: ${currentProjectId}`);

         // --- Added Debugging Logs for Upload Path and User Status ---
         const uniqueFileName = `${docId}_${file.name}`;
         const storagePath = `projects/${currentProjectId}/documents/${docId}/${uniqueFileName}`;
         console.log(`[Upload Initiate] Constructed storage path: ${storagePath}`);
         console.log(`[Upload Initiate] Current user UID: ${user?.uid || 'Not Authenticated'}`);
         console.log(`[Upload Initiate] User loading status: ${userLoading}`);
         // --- End Debugging Logs ---


         // Update the state to show that upload is starting for this specific document
         setDocuments(prevDocs => prevDocs.map(doc =>
             doc.id === docId ? { ...doc, isUploading: true, uploadProgress: 0, uploadError: undefined, isUploaded: false } : doc
         ));

         try {
             // Create a storage reference
             const storageRef = storageModule.ref(storage, storagePath);

             // Start the upload task
             const uploadTask = storageModule.uploadBytesResumable(storageRef, file);

             // Monitor the upload progress and state changes
             uploadTask.on('state_changed',
                 (snapshot: storageModule.UploadTaskSnapshot) => {
                     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                     // Only update state if there's a significant change in progress to avoid excessive re-renders
                     if (progress - (documents.find(d => d.id === docId)?.uploadProgress || 0) > 1 || progress === 100) {
                         setDocuments(prevDocs => prevDocs.map(d => d.id === docId ? { ...d, uploadProgress: progress } : d));
                     }
                 },
                 (error) => {
                     // Handle unsuccessful uploads
                     console.error(`[Upload State Change] Upload failed for document ID: ${docId}, file: ${file.name}`, error);
                      setDocuments(prevDocs => prevDocs.map(d => d.id === docId ? {
                         ...d,
                         uploadError: error.message || 'Upload failed',
                         isUploading: false,
                         uploadProgress: undefined,
                         url: null,
                         isUploaded: false,
                      } : d));
                      toast({
                          title: "Upload Error",
                          description: `Failed to upload file "${file.name}". Error: ${error.message}`,
                          variant: "destructive",
                      });
                 },
                 () => {
                      // Handle successful uploads on complete
                      console.log(`[Upload Complete] Upload complete for document ID: ${docId}, file: ${file.name}`);
                     // Get the download URL for the uploaded file
                     storageModule.getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                         console.log(`[Upload Get URL] Download URL obtained for document ID ${docId}: ${downloadURL}`);
                         setDocuments(prevDocs => prevDocs.map(d => d.id === docId ? {
                             ...d,
                             url: downloadURL,
                             isUploading: false,
                             uploadProgress: undefined,
                             uploadError: undefined,
                             file: undefined, // Clear the temporary file object
                             isUploaded: true,
                         } : d));
                          toast({
                              title: "Upload Successful",
                              description: `File "${file.name}" uploaded.`,
                              variant: "success",
                          });
                     }).catch(err => {
                         // Handle errors in getting the download URL
                         console.error(`[Upload Get URL] Failed to get download URL for document ID: ${docId}, file: ${file.name}`, err);
                           setDocuments(prevDocs => prevDocs.map(d => d.id === docId ? {
                             ...d,
                             uploadError: err.message || 'Failed to get URL',
                             isUploading: false,
                             uploadProgress: undefined,
                             url: null,
                             isUploaded: false,
                          } : d));
                           toast({
                               title: "Upload Error",
                               description: `Failed to get download URL for file "${file.name}". Error: ${err.message}`,
                               variant: "destructive",
                           });
                     });
                 }
             );

         } catch (error) {
             // Handle errors that occur before the upload task starts
             console.error(`[Upload Initiate Error] Error initiating upload for document ID: ${docId}, file: ${file.name}`, error);
               setDocuments(prevDocs => prevDocs.map(d => d.id === docId ? {
                 ...d,
                 uploadError: error.message || 'Upload initiation failed',
                 isUploading: false,
                 uploadProgress: undefined,
                 url: null,
                 isUploaded: false,
              } : d));
               toast({
                   title: "Upload Error",
                   description: `Could not initiate upload for file "${file.name}". Error: ${error.message}`,
                   variant: "destructive",
               });
         }
    };


    const handleFileUpload = (id: string) => async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        // Clear the file input value immediately after selection or cancellation
        event.target.value = '';

        if (!file) {
            // If user cancels file selection, reset the document state for that ID
             setDocuments(prevDocs => prevDocs.map(doc =>
                doc.id === id ? { ...doc, file: undefined, url: undefined, uploadProgress: undefined, uploadError: undefined, isUploading: false, isUploaded: false } : doc
            ));
             console.log(`[File Selection] User cancelled file selection for document ID: ${id}`);
            return;
        }

         console.log(`[File Selection] File selected for document ID: ${id}, name: ${file.name}, size: ${file.size}`);

        // Check for file size limit
        if (file.size > MAX_FILE_SIZE_BYTES) {
            toast({
                title: "Upload Error",
                description: `File "${file.name}" exceeds the maximum size limit of 50MB.`,
                variant: "destructive",
            });
             // Update state to show error and clear the file/url for the specific document
            setDocuments(prevDocs => prevDocs.map(doc =>
                doc.id === id ? { ...doc, file: undefined, url: undefined, uploadProgress: undefined, uploadError: 'File too large', isUploading: false, isUploaded: false } : doc
            ));
            console.error(`[File Selection] File too large: ${file.name}`);
            return;
        }

        // Store the file temporarily in state and initiate upload
        setDocuments(prevDocs => prevDocs.map(doc =>
            doc.id === id ? {
                ...doc,
                file: file, // Store the selected file object temporarily
                url: undefined, // Clear any previous URL as a new file is selected
                uploadProgress: undefined, // Reset progress
                uploadError: undefined, // Clear previous errors
                isUploading: true, // Indicate upload is about to start
                isUploaded: false, // Not uploaded yet
            } : doc
        ));

        // *** Initiate upload immediately if projectId is available AND user is authenticated ***
        // Upload requires a project ID for the path and authenticated user for rules.
        if (projectId && user && !userLoading) {
             console.log("[File Selection] Project ID and authenticated user available. Initiating upload immediately.");
             // Call the initiateUpload function with the selected file and project ID
             initiateUpload(id, file, projectId);
        } else {
             console.log("[File Selection] Project ID or authenticated user not available. Upload will be pending until project is saved or user state is ready.");
             // Cannot upload without a project ID (e.g., for new projects before the first save)
             // or if user state is not ready.
             setDocuments(prevDocs => prevDocs.map(doc =>
                 doc.id === id ? {
                     ...doc,
                     file: file,
                     isUploading: false, // Not currently uploading
                     uploadError: "Save project first to upload file or wait for user state.",
                     isUploaded: false,
                 } : doc
             ));
              toast({
                 title: "Upload Pending",
                 description: "File selected. Save the project or wait for authentication state to be ready to enable upload.",
              });
        }
    };

     // Effect to retry upload if projectId becomes available and there are pending files
     // This handles the case where a file is selected for a NEW project before its first save.
     useEffect(() => {
          console.log("[Retry Upload Effect] Running. Project ID:", projectId, "User:", user?.uid, "User Loading:", userLoading);
         if (projectId && user && !userLoading) {
             documents.forEach(doc => {
                 // If a document has a file object but no URL and is not currently uploading and has an error indicating pending
                 if (doc.file && !doc.url && !doc.isUploading && doc.uploadError === "Save project first to upload file or wait for user state.") {
                      console.log(`[Retry Upload Effect] Found pending file for document ID: ${doc.id}. Attempting to initiate upload.`);
                     // Clear the pending error state before retrying
                      setDocuments(prevDocs => prevDocs.map(d => d.id === doc.id ? { ...d, uploadError: undefined } : d));
                     // Initiate the upload for this pending file
                     initiateUpload(doc.id, doc.file, projectId);
                 }
             });
         }
     }, [projectId, user, userLoading, documents]); // Depend on projectId, user, userLoading, and documents state


    // Exported functions via ref, used by the parent component (ProjectForm)
    useImperativeHandle(ref, () => ({
      // getDocuments returns the current list of documents, excluding temporary upload status fields.
      // It ensures that the URL is string or null for consistency.
      getDocuments: () => documents.map(({ file, uploadProgress, uploadError, isUploading, isUploaded, ...rest }) => ({
            ...rest,
            url: rest.url === undefined ? null : rest.url, // Ensure url is string or null
        })),
      // isUploading indicates if ANY document in the list is currently being uploaded.
      isUploading: () => documents.some(doc => doc.isUploading === true), // Explicitly check for true
    }));


    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Documents</label>
            {/* Map through the documents state to render each document input block */}
            {documents.map((doc, index) => (
                <div key={doc.id} className="border p-4 rounded-md space-y-3 relative">
                    {/* Remove Button */}
                    {/* Disabled if the document is currently uploading */}
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

                    {/* Document Name Input */}
                    <div>
                        <label htmlFor={`doc-name-${doc.id}`} className="block text-xs font-medium text-gray-500">Name</label>
                        <Input
                            id={`doc-name-${doc.id}`}
                            value={doc.name}
                            onChange={(e) => handleDocumentChange(doc.id, 'name', e.target.value)}
                            placeholder="Document Name"
                             disabled={doc.isUploading} // Disable name input while uploading
                        />
                    </div>

                    {/* File Upload Input and Status Display */}
                    <div>
                         <label htmlFor={`doc-file-${doc.id}`} className="block text-xs font-medium text-gray-500">File (Max 50MB)</label>
                         {/* Conditional rendering for the file input or status */}
                         {/* Show file input if not uploading and not successfully uploaded */}
                         {(!doc.isUploading && !doc.isUploaded) ? (
                             <Input
                                 id={`doc-file-${doc.id}`}
                                 type="file"
                                 onChange={handleFileUpload(doc.id)}
                                 className="file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border-none file:rounded-md file:px-4 file:py-1 mr-4"
                                 // Allow selecting a new file if there was an error
                                  disabled={doc.isUploading}
                             />
                         ) : (
                             // Show status/link if uploading or uploaded
                             <div className="mt-1 flex items-center text-sm">
                                  {/* File Status Display */}
                                  {/* Show upload progress if uploading */}
                                  {doc.isUploading && doc.uploadProgress !== undefined && (
                                     <div className="text-sm text-blue-600 flex items-center">
                                         <UploadCloud className="h-4 w-4 mr-2" /> Uploading: {doc.uploadProgress.toFixed(0)}%
                                     </div>
                                  )}
                                  {/* Show error message if upload failed */}
                                  {doc.uploadError && !doc.isUploading && ( // Ensure not uploading when showing error
                                     <div className="text-sm text-red-600 flex items-center">
                                         <XCircle className="h-4 w-4 mr-2" /> Error: {doc.uploadError}
                                     </div>
                                  )}
                                  {/* Show uploaded status and link if successfully uploaded and URL exists */}
                                  {doc.isUploaded && doc.url && !doc.isUploading && ( // Ensure not uploading when showing uploaded status
                                     <div className="text-sm text-green-600 flex items-center">
                                         <CheckCircle className="h-4 w-4 mr-2" /> Uploaded: <a href={doc.url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline break-all ml-1">
                                             {/* Display filename extracted from URL, or "View File" */}
                                             {(() => {
                                                 try {
                                                      if (typeof doc.url !== 'string') return 'View File';
                                                      const url = new URL(doc.url);
                                                      const decodedPath = decodeURIComponent(url.pathname);
                                                      // Extract filename from the path
                                                      const fileName = decodedPath.split('/').pop()?.split('?')[0];
                                                      return fileName || 'View File';
                                                 } catch (e) {
                                                      console.error("Error parsing document URL for filename:", e);
                                                      return 'View File';
                                                 }
                                             })()}
                                         </a>
                                     </div>
                                  )}
                                  {/* Show selected file name if not uploading, not error, not uploaded, and file object exists */}
                                   {!doc.isUploading && !doc.uploadError && !doc.isUploaded && doc.file && !doc.url && ( // Check if a file is selected but not uploaded/uploading
                                      <div className="text-sm text-gray-600 flex items-center">
                                          <FileText className="h-4 w-4 mr-2 text-gray-500" /> Selected: {doc.file.name}
                                      </div>
                                   )}
                                    {/* Show "No file selected" initially or after removal/error */}
                                   {!doc.isUploading && !doc.uploadError && !doc.isUploaded && !doc.file && !doc.url && (
                                       <div className="text-sm text-gray-500">No file selected.</div>
                                   )}
                             </div>
                         )}
                    </div>

                    {/* Document Description Input */}
                    <div>
                        <label htmlFor={`doc-description-${doc.id}`} className="block text-xs font-medium text-gray-500">Description (Optional)</label>
                        <Textarea
                            id={`doc-description-${doc.id}`}
                            value={doc.description || ''}
                            onChange={(e) => handleDocumentChange(doc.id, 'description', e.target.value)}
                            placeholder="Document Description"
                            rows={2}
                             disabled={doc.isUploading} // Disable description input while uploading
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
