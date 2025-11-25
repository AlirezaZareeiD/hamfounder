
import React from 'react';
import {
  MoreVertical,
  ChevronRight,
  Rocket,
  Lock,
  Briefcase,
  Calendar,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// A comprehensive interface that covers all project details
export interface Project {
  id: string;
  name: string;
  description: string;
  stage: string;
  progress: number;
  isPrivate: boolean;
  tasks: {
    completed: number;
    total: number;
  };
  ownerId: string;
  ownerInfo: {
    displayName?: string;
    profileImageUrl?: string;
  };
  fundingStage: string;
  mvpStatus: string;
  milestones: string[];
  tags: string[];
}

interface ProjectCardProps {
  project: Project;
  onViewProject: (id: string) => void;
  onDeleteProject?: (project: Project) => void;
  showOwnerControls: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewProject, onDeleteProject, showOwnerControls }) => {

  return (
    <Card className="relative group hover:shadow-md transition-shadow flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-slate-800 flex items-start justify-between gap-2">
          <span className="flex items-center pt-2">
            {project.name}
            {project.isPrivate && <Lock className="h-4 w-4 text-slate-400 ml-2" />}
          </span>
          {showOwnerControls && onDeleteProject && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewProject(project.id)}>
                  View / Edit Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDeleteProject(project)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col flex-grow">
        <p className="text-sm text-slate-600 line-clamp-2 flex-grow">{project.description}</p>

        {project.fundingStage && (
          <div className="text-sm text-slate-600 flex items-center"><Briefcase className="h-4 w-4 mr-1 text-slate-500" /> Funding Stage: {project.fundingStage}</div>
        )}
        {project.mvpStatus && (
          <div className="text-sm text-slate-600 flex items-center"><Rocket className="h-4 w-4 mr-1 text-slate-500" /> MVP Status: {project.mvpStatus}</div>
        )}
        {project.milestones && project.milestones.length > 0 && (
          <div className="text-sm text-slate-600 flex items-center"><Calendar className="h-4 w-4 mr-1 text-slate-500" /> Milestone: {project.milestones[0]}</div>
        )}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}

        {showOwnerControls && (
          <>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Project Progress</span>
                <span className="font-medium">{project.progress || 0}%</span>
              </div>
              <Progress value={project.progress || 0} className="h-1.5" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex -space-x-2">
                <Avatar key={project.ownerId} className="border-2 border-white h-8 w-8">
                  <AvatarImage src={project.ownerInfo?.profileImageUrl} />
                  <AvatarFallback className="text-xs">
                    {project.ownerInfo?.displayName ? project.ownerInfo.displayName.charAt(0) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="text-xs text-slate-500 flex items-center">
                <Briefcase className="h-3 w-3 mr-1" />
                {(project.tasks?.completed || 0)}/{(project.tasks?.total || 0)} tasks
              </div>
            </div>
          </>
        )}

        <Button variant="outline" size="sm" className="w-full mt-auto" onClick={() => onViewProject(project.id)}>
          View Project <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
