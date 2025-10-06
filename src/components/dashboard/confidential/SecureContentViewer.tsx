
import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Loader2, AlertTriangle, ExternalLink, FileText, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SecureContentViewerProps {
  storagePath: string;
  documentName: string;
}

export const SecureContentViewer: React.FC<SecureContentViewerProps> = ({ storagePath, documentName }) => {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fileType = storagePath.split('.').pop()?.toLowerCase();

  useEffect(() => {
    const fetchContentUrl = async () => {
      setLoading(true);
      setError(null);
      setDownloadUrl(null);

      if (!storagePath) {
        setLoading(false);
        return;
      }

      try {
        const storageRef = ref(storage, storagePath);
        const url = await getDownloadURL(storageRef);
        setDownloadUrl(url);
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

    fetchContentUrl();
  }, [storagePath]);

  const handleOpenInNewTab = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div className="p-4 border-t">
         <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{documentName || 'Document'}</CardTitle>
                {fileType === 'pdf' && <FileText className="h-5 w-5 text-muted-foreground" />}
                {fileType === 'wav' && <Music className="h-5 w-5 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="ml-3 text-muted-foreground">Verifying access and loading content...</p>
                    </div>
                )}
                {error && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <AlertTriangle className="h-8 w-8 text-destructive mb-3" />
                        <p className="text-destructive font-semibold">Access Denied</p>
                        <p className="text-muted-foreground text-sm mt-1 px-4">{error}</p>
                    </div>
                )}
                {!loading && !error && downloadUrl && (
                    <>
                        {fileType === 'wav' && (
                            <div className="p-4">
                                <audio controls className="w-full" controlsList="nodownload">
                                    <source src={downloadUrl} type="audio/wav" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        )}
                        {fileType === 'pdf' && (
                             <div className="text-center py-12 flex flex-col items-center justify-center bg-muted/20 rounded-lg">
                                 <FileText className="h-12 w-12 text-primary/30 mb-4" />
                                 <p className="text-muted-foreground mb-5 font-semibold">This document will open securely in a new tab.</p>
                                <Button onClick={handleOpenInNewTab}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Open {documentName}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    </div>
  );
};
