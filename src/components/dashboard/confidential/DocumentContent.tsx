
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description: string;
}

interface DocumentContentProps {
  document: Document | null;
}

export const DocumentContent: React.FC<DocumentContentProps> = ({ document }) => {
  if (!document) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-12 h-64 border-b">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-semibold text-muted-foreground">Select a document from the list</p>
            <p className="text-sm text-muted-foreground/80">The selected document's details and content will be displayed here.</p>
        </div>
    );
  }

  return (
    <div className="p-6 border-b">
        <h2 className="text-2xl font-bold tracking-tight">{document.title}</h2>
        <p className="mt-2 text-muted-foreground">{document.description}</p>
    </div>
  );
};
