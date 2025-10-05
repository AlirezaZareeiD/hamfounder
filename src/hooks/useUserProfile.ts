
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/components/firebase/config.js'; // Corrected Path with extension
import { useUser } from '@/contexts/UserContext';

export interface UserProfile {
  email: string;
  ndaAccepted?: boolean;
  [key: string]: any;
}

export const useUserProfile = () => {
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const userProfileRef = doc(db, 'userProfiles', user.uid);

    const unsubscribe = onSnapshot(userProfileRef, (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data() as UserProfile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Failed to fetch user profile:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { userProfile, loading };
};
