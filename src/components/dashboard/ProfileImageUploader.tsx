import React, { useRef, useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { uploadProfileImage, updateUserProfile } from '@/lib/firebase';

import { useToast } from '@/hooks/use-toast';
interface ProfileImageUploaderProps {
  userProfileImage?: string;
  userId: string;
}

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({ userProfileImage, userId }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImageUrl(URL.createObjectURL(file)); // Set preview immediately
      setIsUploading(true);
      try {
        const downloadURL = await uploadProfileImage(file, userId);
        await updateUserProfile(userId, { profileImageUrl: downloadURL });
        toast({
          title: "Success",
          description: "Profile image updated successfully.",
        });
      } catch (error) {
        console.error("Error uploading profile image:", error);
        toast({ title: "Error", description: "Failed to upload profile image.", variant: "destructive" });
      } finally {
        setIsUploading(false);
      }
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
    <div className={`relative w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl font-bold overflow-hidden ${isUploading ? 'opacity-50' : ''}`}>
      {previewImageUrl ? ( // Show preview if available
        <img src={previewImageUrl} alt="Profile Preview" className="object-cover w-full h-full" />
      ) : userProfileImage ? ( // Otherwise show existing profile image
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
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};