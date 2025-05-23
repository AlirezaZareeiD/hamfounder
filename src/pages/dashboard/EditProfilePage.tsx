import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import DashboardLayout from '@/components/layouts/DashboardLayout'; // فرض بر استفاده از یک لایه‌بندی داشبورد
import { ProfileImageUploader } from '@/components/dashboard/ProfileImageUploader'; // Import the new component
import { getUserProfile, auth } from '@/lib/firebase'; // Import getUserProfile and auth

const EditProfilePage: React.FC = () => {
  const [userProfileImage, setUserProfileImage] = useState<string | undefined>(undefined); // Add state for profile image URL

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = auth.currentUser?.uid; // Get current user's UID
      if (userId) {
        const profile = await getUserProfile(userId); // Fetch user profile
        if (profile?.profileImageUrl) {
          setUserProfileImage(profile.profileImageUrl); // Update state if image URL exists
        }
      }
    };
    fetchUserProfile();
  }, []); // Run only once on mount

  return (
    <DashboardLayout> {/* استفاده از لایه‌بندی داشبورد */}
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>
        <ProfileImageUploader userProfileImage={userProfileImage} userId={auth.currentUser?.uid || ''} /> {/* Pass state and userId to ProfileImageUploader */}
      </div>
    </DashboardLayout>
  );
};

export default EditProfilePage;
