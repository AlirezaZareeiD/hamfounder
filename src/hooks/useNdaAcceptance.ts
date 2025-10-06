
import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useUser } from '@/contexts/UserContext';

export const useNdaAcceptance = () => {
  // Corrected: Removed properties that don't exist on useUser
  const { user } = useUser(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptNda = async () => {
    if (!user) {
      setError("User not authenticated.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const functions = getFunctions();
      const acceptNdaAndSetClaim = httpsCallable(functions, 'acceptNdaAndSetClaim');
      await acceptNdaAndSetClaim();
      // Removed unnecessary calls to forceTokenRefresh and refetchUserProfile.
      // The component logic handles reloading the page, which is sufficient.
    } catch (err: any) {
      console.error("Error accepting NDA:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { acceptNda, loading, error };
};
