
import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '@/lib/firebase'; // Import auth
import { Loader2, AlertTriangle, ExternalLink, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SecurePDFViewerProps {
  storagePath: string;
  documentName: string;
}

export const SecurePDFViewer: React.FC<SecurePDFViewerProps> = ({ storagePath, documentName }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugClaims, setDebugClaims] = useState<string | null>(null); // State for visible debug info

  useEffect(() => {
    const fetchPdfUrl = async () => {
      setLoading(true);
      setError(null);
      setDebugClaims(null);

      if (!storagePath) {
        setLoading(false);
        setError('No document selected.');
        return;
      }

      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const idTokenResult = await currentUser.getIdTokenResult(true);
          console.log('Current User Claims for Debugging:', idTokenResult.claims);
          setDebugClaims(JSON.stringify(idTokenResult.claims, null, 2)); 
        } catch (e) {
          console.error('Error fetching user token for debugging:', e);
          setDebugClaims('Error fetching user token.');
        }
      } else {
        setDebugClaims('Firebase user object was not available at time of check.');
      }

      try {
        const storageRef = ref(storage, storagePath);
        const url = await getDownloadURL(storageRef);
        setPdfUrl(url);
      } catch (err: any) {
        console.error('Error getting download URL: ', err);
        if (err.code === 'storage/object-not-found') {
             setError('The requested document does not exist.');
        } else if (err.code === 'storage/unauthorized') {
            setError('You do not have permission to access this document. Please ensure you have accepted the latest access agreement.');
        } else {
            setError('An unexpected error occurred while trying to load the document.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPdfUrl();
  }, [storagePath]);

  const handleOpenInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div className='p-4 sm:p-6 border-t'>
      <Card className='w-full shadow-none border-none'>
        <CardContent className='p-0 pt-4'>
          {loading && !error && (
              <div className='flex items-center justify-center py-12'>
                  <Loader2 className='h-6 w-6 animate-spin text-primary' />
                  <p className='ml-3 text-muted-foreground'>Verifying access and loading link...</p>
              </div>
          )}
          {error && (
              <div className='flex flex-col items-center justify-center py-10 text-center bg-red-50/50 dark:bg-red-900/10 border border-destructive/20 rounded-lg p-4'>
                  <AlertTriangle className='h-8 w-8 text-destructive mb-3' />
                  <p className='text-destructive font-bold text-lg'>Access Denied</p>
                  <p className='text-muted-foreground text-sm mt-1 mb-4 px-4'>{error}</p>
                  {debugClaims && (
                    <div className='mt-3 w-full text-left max-w-md mx-auto'>
                      <p className='text-xs font-semibold text-slate-600 dark:text-slate-400'>User Claims at Time of Request:</p>
                      <pre className='mt-1 text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded-md overflow-auto whitespace-pre-wrap break-all text-slate-700 dark:text-slate-300'>
                        {debugClaims}
                      </pre>
                    </div>
                  )}
              </div>
          )}
          {!loading && !error && pdfUrl && (
              <div className='text-center py-10 flex flex-col items-center justify-center bg-gray-50/70 dark:bg-gray-900/40 rounded-lg shadow-inner_sm border border-gray-200/60 dark:border-gray-800/50 hover:bg-gray-100/60 dark:hover:bg-gray-900/60 transition-colors duration-300 group'>
                  <FileText className='h-16 w-16 text-primary/20 group-hover:text-primary/30 transition-colors duration-300' />
                  <h3 className='mt-5 mb-1 text-xl font-bold text-gray-700 dark:text-gray-300'>View Document</h3>
                  <p className='text-muted-foreground mb-6 text-sm max-w-xs mx-auto'>For security and a better viewing experience, this document will open in a new, secure browser tab.</p>
                  <Button onClick={handleOpenInNewTab} size='lg' className='shadow-md group-hover:shadow-lg transition-shadow duration-300'>
                      <ExternalLink className='mr-2 h-4 w-4' />
                      Open Securely
                  </Button>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
