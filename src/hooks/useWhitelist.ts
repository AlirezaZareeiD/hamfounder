
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/components/firebase/config.js';

export const useWhitelist = () => {
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWhitelist = async () => {
      console.log('[useWhitelist] Hook triggered. Fetching whitelist...');
      try {
        const docRef = doc(db, 'config', 'access_control');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('[useWhitelist] Document found:', data);
          const rawUids = data.whitelisted_cofounder_uids || [];

          // --- FINAL FIX: Clean up the data ---
          // Trim whitespace and newlines from each UID to prevent comparison errors.
          const cleanedUids = rawUids.map((uid: string) => uid.trim());

          setWhitelist(cleanedUids);
          console.log('[useWhitelist] Whitelist state updated with CLEANED data:', cleanedUids);

        } else {
          console.error('[useWhitelist] CRITICAL: config/access_control document does not exist!');
          setWhitelist([]);
        }
      } catch (error) {
        console.error("[useWhitelist] Error fetching document:", error);
      } finally {
        setLoading(false);
        console.log('[useWhitelist] Fetch finished. Loading state set to false.');
      }
    };

    fetchWhitelist();
  }, []);

  return { whitelist, loading };
};
