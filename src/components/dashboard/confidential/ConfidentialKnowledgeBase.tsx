
import React from 'react';
import { useConfidentialDocuments } from '@/hooks/useConfidentialDocuments'; // Our new hook
import { SecurePDFViewer } from './SecurePDFViewer'; // Our new viewer
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertTriangle, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export const ConfidentialKnowledgeBase: React.FC = () => {
  const { documents, loading, error } = useConfidentialDocuments();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="font-semibold text-lg">Loading Confidential Documents...</p>
        <p className="text-muted-foreground">Please wait while we securely fetch the knowledge base.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-destructive/10 border border-destructive/20 rounded-lg">
        <AlertTriangle className="h-8 w-8 text-destructive mb-3" />
        <p className="font-semibold text-lg text-destructive">Failed to Load Documents</p>
        <p className="text-muted-foreground">There was an error accessing the repository. Please try again later.</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
        <div className="text-center p-12 bg-muted/50 rounded-lg">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-lg">No Documents Found</p>
            <p className="text-muted-foreground">The confidential repository is currently empty.</p>
        </div>
    )
  }

  // Get the default tab value, which is the ID of the first document
  const defaultValue = documents[0]?.id;

  return (
    <Card className="overflow-hidden shadow-lg border-t-4 border-primary">
        <CardHeader className="bg-muted/30">
            <CardTitle>Confidential Knowledge Base</CardTitle>
            <CardDescription>Select a document from the list to view its contents securely.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            <Tabs defaultValue={defaultValue} className="flex flex-col md:flex-row min-h-[70vh]">
                <TabsList className="flex-col items-stretch h-auto p-4 border-r bg-muted/30 w-full md:w-1/4">
                    {documents.map(doc => (
                        <TabsTrigger key={doc.id} value={doc.id} className="justify-start p-3 whitespace-normal h-auto text-left">
                            <div>
                                <p className="font-semibold">{doc.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {/* FIX: Removed the unnecessary new Date() wrapper */}
                                    Version: {doc.version} | Last Updated: {format(doc.lastUpdated, 'dd MMM yyyy')}
                                </p>
                            </div>
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="w-full md:w-3/4">
                    {documents.map(doc => (
                        <TabsContent key={doc.id} value={doc.id} className="m-0">
                            <div className="p-4">
                                <h3 className="font-bold text-xl">{doc.title}</h3>
                                <p className="text-muted-foreground mb-4">{doc.description}</p>
                            </div>
                            <SecurePDFViewer storagePath={doc.storagePath} />
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </CardContent>
    </Card>
  );
};
