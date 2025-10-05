
import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Interface updated: lastUpdated is now a Date object
export interface ConfidentialDocument {
  id: string;
  title: string;
  description: string;
  storagePath: string;
  category: string;
  version: string;
  lastUpdated: Date; // FIX: Changed from string to Date
}

export const useConfidentialDocuments = () => {
  const [documents, setDocuments] = useState<ConfidentialDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const documentsRef = collection(db, 'confidentialDocuments');
        const q = query(documentsRef, orderBy('lastUpdated', 'desc'));
        const querySnapshot = await getDocs(q);

        const fetchedDocuments = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            storagePath: data.storagePath,
            category: data.category,
            version: data.version,
            // FIX: Correctly convert Firestore Timestamp to a JavaScript Date object
            lastUpdated: (data.lastUpdated as Timestamp).toDate(),
          } as ConfidentialDocument;
        });

        setDocuments(fetchedDocuments);
      } catch (err) {
        console.error("Error fetching confidential documents: ", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return { documents, loading, error };
};
