import React, { useRef, useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
// Ensure these functions are correctly implemented in your firebase.ts or equivalent
import { uploadImage, updateUserProfile } from '@/lib/firebase'; // Changed import from uploadProfileImage to uploadImage

import { useToast } from '@/hooks/use-toast';

// Add a 'type' prop to the interface to distinguish between profile and company logo
interface ProfileImageUploaderProps {
  userProfileImage?: string; // This prop will now hold either the profile image URL or the company logo URL
  userId: string;
  onImageUpdate?: (imageUrl: string) => void;
  type: 'profile' | 'companyLogo'; // Define the type of image being uploaded
}

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({ userProfileImage, userId, onImageUpdate, type }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Call the new uploadImage function and pass the type
      const downloadURL = await uploadImage(selectedFile, userId, type); // Changed function call and added type

      // Determine which field to update in the user profile based on the 'type' prop
      const updateData = type === 'profile'
        ? { profileImageUrl: downloadURL }
        : { companyLogoUrl: downloadURL }; // Use 'companyLogoUrl' for company logos

      // Update the user document in Firestore with the correct image URL
      await updateUserProfile(userId, updateData);

      // Call the parent component's callback with the new image URL
      if (onImageUpdate) {
        onImageUpdate(downloadURL);
      }

      // Set the success message based on the 'type' prop
      const successMessage = type === 'profile'
        ? "Profile image updated successfully."
        : "Company logo updated successfully."; // Specific message for company logo

      toast({
        title: "Success",
        description: successMessage,
      });

      // Reset states after successful upload and update
      setSelectedFile(undefined);
      // Set the preview to the newly uploaded image URL
      setPreviewImageUrl(downloadURL);
      setIsEditing(false); // Exit editing mode on save

    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      toast({
        title: "Error",
        description: `Failed to upload ${type} image.`,
        variant: "destructive",
      });
      // Reset preview if upload fails to avoid showing a broken image
      setPreviewImageUrl(undefined);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false); // Exit editing mode
    setSelectedFile(undefined); // Reset selected file
    setPreviewImageUrl(undefined); // Reset preview URL
    // Revert preview to the original image if it exists
    if (userProfileImage) {
      setPreviewImageUrl(userProfileImage);
    }
  };


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Only handle if a file is selected and in editing mode
    if (isEditing && file) {
      setSelectedFile(file); // Store the selected file
      // Create and set the preview URL for the selected file
      setPreviewImageUrl(URL.createObjectURL(file));
    }
  };

  // Clean up the object URL when the component unmounts or previewImageUrl changes
  // This prevents memory leaks from the temporary object URLs created by URL.createObjectURL
  useEffect(() => {
    return () => {
      if (previewImageUrl && previewImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  // When entering editing mode, set the initial preview image to the current userProfileImage
  useEffect(() => {
    if (isEditing && userProfileImage) {
      setPreviewImageUrl(userProfileImage);
    } else if (!isEditing) {
       // When exiting editing mode, clear the preview if no new file was selected
       if (!selectedFile && previewImageUrl && previewImageUrl.startsWith('blob:')) {
         URL.revokeObjectURL(previewImageUrl);
         setPreviewImageUrl(undefined);
       }
       // Also reset preview to the original image if editing was cancelled
        if (!selectedFile && userProfileImage && !previewImageUrl) {
            setPreviewImageUrl(userProfileImage);
        }
    }
  }, [isEditing, userProfileImage, selectedFile]);


  return (
    <div className="flex flex-col items-center">
      {/* Display mode: Shows the current image with an edit icon */}
      {!isEditing ? (
        <div
          className={`relative w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl font-bold overflow-hidden`}
        >
          {/* Display the current profile image or company logo */}
          {userProfileImage ? (
            <img src={userProfileImage} alt={`${type} image`} className="object-cover w-full h-full" />
          ) : (
            // Placeholder when no image is available
            <div className="w-full h-full flex items-center justify-center">
              ?
            </div>
          )}
          {/* Edit icon to switch to editing mode */}
          <div
            className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow cursor-pointer"
            onClick={handleEditClick}
          >
            <Edit className="h-5 w-5 text-gray-600" />
          </div>
        </div>
      ) : (
        // Editing mode: Shows current image, file input, preview, and action buttons
        <div className={`flex flex-col items-center space-y-4 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}> {/* Added pointer-events-none when uploading */}
          {/* Display Current Image in editing mode */}
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl font-bold overflow-hidden">
            {userProfileImage ? (
              <img src={userProfileImage} alt={`Current ${type} Image`} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">?</div>
            )}
          </div>

          {/* File Input for selecting a new image */}
          <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} /> {/* Added ref */}


          {/* Preview of New Image (only shown if a file is selected) */}
          {previewImageUrl && !previewImageUrl.startsWith('blob:') && userProfileImage && (
            // Show original image preview if no new file selected
             <div className="mt-4 w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl font-bold overflow-hidden">
                <img src={previewImageUrl} alt={`Original ${type} Preview`} className="object-cover w-full h-full" />
             </div>
          )}
          {previewImageUrl && previewImageUrl.startsWith('blob:') && (
             // Show new image preview if a file is selected
            <div className="mt-4 w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl font-bold overflow-hidden">
              <img src={previewImageUrl} alt={`New ${type} Preview`} className="object-cover w-full h-full" />
            </div>
          )}


          {/* Save and Cancel Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleSaveClick}
              disabled={!selectedFile || isUploading} // Disable save if no file selected or uploading
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {isUploading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancelClick}
              disabled={isUploading} // Disable cancel while uploading
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
