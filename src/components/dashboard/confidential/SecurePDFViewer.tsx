
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
        setError("No document selected.");
        return;
      }

      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          // Force refresh the token to get the latest claims
          const idTokenResult = await currentUser.getIdTokenResult(true);
          console.log('Current User Claims for Debugging:', idTokenResult.claims);
          // Set claims to state for visible debugging
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
        console.error("Error getting download URL: ", err);
        if (err.code === 'storage/object-not-found') {
             setError("The requested document does not exist.");
        } else if (err.code === 'storage/unauthorized') {
            setError("You do not have permission to access this document. Please ensure you have accepted the latest access agreement.");
        } else {
            setError("An unexpected error occurred while trying to load the document.");
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
    <div className="p-4 border-t">
         <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{documentName || 'Document'}</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {loading && !error && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="ml-3 text-muted-foreground">Verifying access and loading link...</p>
                    </div>
                )}
                {error && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <AlertTriangle className="h-8 w-8 text-destructive mb-3" />
                        <p className="text-destructive font-semibold">Access Denied</p>
                        <p className="text-muted-foreground text-sm mt-1 px-4">{error}</p>
                        {/* VISIBLE DEBUG BOX */}
                        {debugClaims && (
                          <div className='mt-4 w-full text-left'>
                            <p className='text-xs font-semibold text-slate-600'>User Claims at Time of Request:</p>
                            <pre className="mt-1 text-xs bg-slate-100 p-2 rounded-md overflow-auto whitespace-pre-wrap break-all">
                              {debugClaims}
                            </pre>
                          </div>
                        )}
                    </div>
                )}
                {!loading && !error && pdfUrl && (
                     <div className="text-center py-8">
                         <p className="text-muted-foreground mb-4">The document is ready to be viewed securely in a new tab.</p>
                        <Button onClick={handleOpenInNewTab}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open {documentName}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
};
