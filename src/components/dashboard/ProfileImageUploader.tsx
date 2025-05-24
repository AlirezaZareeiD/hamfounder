import React, { useRef, useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { uploadProfileImage, updateUserProfile } from '@/lib/firebase';

import { useToast } from '@/hooks/use-toast';
interface ProfileImageUploaderProps { // Define interface outside the component if not used elsewhere
  userProfileImage?: string;
  userId: string;
  onImageUpdate?: (imageUrl: string) => void;
}

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({ userProfileImage, userId, onImageUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state for editing mode
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined); // New state for selected file
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleEditClick = () => {
    setIsEditing(true); // Enter editing mode
  };

  const handleSaveClick = async () => {
    if (!selectedFile) return; // Should not happen if button is disabled, but good practice

    setIsUploading(true);
    try {
      const downloadURL = await uploadProfileImage(selectedFile, userId);
      await updateUserProfile(userId, { profileImageUrl: downloadURL });
      if (onImageUpdate) {
        onImageUpdate(downloadURL);
      }
      toast({
        title: "Success",
        description: "Profile image updated successfully.",

      });
      // Reset states after successful upload and update
      setSelectedFile(undefined);
      setPreviewImageUrl(downloadURL); // Set preview to the newly uploaded image
      setIsEditing(false); // Exit editing mode on save
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast({
        title: "Error",
        description: "Failed to upload profile image.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false); // Exit editing mode
    setSelectedFile(undefined); // Reset selected file
    setPreviewImageUrl(undefined); // Reset preview URL
  };


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (isEditing && file) { // Only handle if a file is selected and in editing mode
      setSelectedFile(file); // Store the selected file
 setPreviewImageUrl(URL.createObjectURL(file)); // Create and set the preview URL
    }
  };

  // Clean up the object URL when the component unmounts or previewImageUrl changes
  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  return (
 <div className="flex flex-col items-center">
      {!isEditing ? (
        <div
 className={`relative w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl font-bold overflow-hidden`}>
          {userProfileImage ? (
            <img src={userProfileImage} alt="Profile" className="object-cover w-full h-full" />
          ) : (
 // Placeholder for profile image - can be replaced with an icon or initial later
            <div className="w-full h-full flex items-center justify-center">
 ?
            </div>
          )}
          <div
 className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow cursor-pointer"
 onClick={handleEditClick}
          >
 <Edit className="h-5 w-5 text-gray-600" />
          </div>
        </div>
      ) : (
 <div className={`flex flex-col items-center space-y-4 ${isUploading ? 'opacity-50' : ''}`}>
 {/* Display Current Image */}
 <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl font-bold overflow-hidden">
            {userProfileImage ? (
              <img src={userProfileImage} alt="Current Profile" className="object-cover w-full h-full" />
 ) : (
 <div className="w-full h-full flex items-center justify-center">?</div>
 )}
 </div>

 {/* File Input */}
 <input type="file" accept="image/*" onChange={handleFileChange} />

 {/* Preview of New Image */}
          {previewImageUrl && (
 <div className="mt-4 w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl font-bold overflow-hidden">
              <img src={previewImageUrl} alt="New Profile Preview" className="object-cover w-full h-full" />
 </div>
 )}

 {/* Save and Cancel Buttons */}
 <div className="flex space-x-2">
 <button onClick={handleSaveClick} disabled={!selectedFile || isUploading} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">{isUploading ? 'Saving...' : 'Save'}</button>
 <button onClick={handleCancelClick} disabled={isUploading} className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50">Cancel</button>
 </div>
 </div>
      )}
 </div>
  );
};