
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Document {
  id: string;
  title: string;
  version: string;
  lastUpdated: Date; // Correctly typed as Date
}

interface DocumentListProps {
  documents: Document[];
  selectedDocumentId: string | null;
  onSelectDocument: (doc: Document) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents, selectedDocumentId, onSelectDocument }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Document Library</h2>
      <div className="space-y-2">
        {documents.map(doc => (
          <Button
            key={doc.id}
            variant="ghost"
            onClick={() => onSelectDocument(doc)}
            className={cn(
              "w-full justify-start text-left h-auto py-3 px-4 whitespace-normal",
              selectedDocumentId === doc.id && "bg-accent text-accent-foreground"
            )}
          >
            <div>
              <p className="font-semibold">{doc.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {/* FIX: The hook already converts the timestamp to a Date object. */}
                Version: {doc.version} | Updated: {format(doc.lastUpdated, 'dd MMM yyyy')}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
