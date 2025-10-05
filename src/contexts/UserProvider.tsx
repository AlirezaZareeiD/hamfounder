
import React, { useEffect, useState, ReactNode, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, getUserProfile } from '@/lib/firebase'; // Assuming Firebase init and getUserProfile
import { UserContext, UserContextType } from './UserContext'; // Import UserContext and UserContextType

// The Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start in loading state
  const [userProfileImage, setUserProfileImage] = useState<string | undefined>(undefined);

  // ===================================================================
  // START: ADDED FUNCTION TO FORCE TOKEN REFRESH
  // ===================================================================
  const forceTokenRefresh = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        // The 'true' argument forces a token refresh.
        await currentUser.getIdToken(true);
        console.log("User token has been refreshed.");
      } catch (error) {
        console.error("Error refreshing user token:", error);
      }
    }
  }, []);
  // ===================================================================
  // END: ADDED FUNCTION
  // ===================================================================

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false); // Auth state checked, set loading to false

      // Fetch user profile image if user is logged in
      if (firebaseUser) {
        try {
          // Assuming getUserProfile takes uid and returns a profile object with profileImageUrl
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile?.profileImageUrl) {
            setUserProfileImage(profile.profileImageUrl);
          } else {
             setUserProfileImage(undefined); // Clear if no image found
          }
        } catch (error) {
          console.error("Error fetching user profile image:", error);
          setUserProfileImage(undefined); // Clear on error
        }
      } else {
        setUserProfileImage(undefined); // Clear profile image when user logs out
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // The value that will be provided to consuming components
  const value: UserContextType = {
    user,
    loading,
    userProfileImage,
    forceTokenRefresh, // Expose the new function through the context
  };

  // Provide the value to the UserContext
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
