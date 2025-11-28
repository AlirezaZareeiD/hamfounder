
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectCardSkeleton: React.FC = () => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-3 flex flex-col flex-grow">
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
        
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        
        <div className="flex flex-wrap gap-1 pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-12" />
        </div>

        <div className="flex-grow" />

        <div className="pt-2 space-y-3">
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/5" />
                </div>
                <Skeleton className="h-1.5 w-full" />
            </div>
            
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-5 w-24" />
                </div>
            </div>
        </div>

        <Skeleton className="h-9 w-full mt-2" />
      </CardContent>
    </Card>
  );
};

export default ProjectCardSkeleton;
