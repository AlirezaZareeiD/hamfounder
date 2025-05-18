import React, { useState } from 'react';
import { 
  Plus, 
  Users, 
  Calendar, 
  MoreVertical, 
  ChevronRight,
  Rocket,
  Lock,
  Globe,
  Briefcase,
  Search
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
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const MyProjects = () => {
  const [filter, setFilter] = useState("all");
  
  // Mock data for projects
  const projects = [
    {
      id: 1,
      name: "Hamfounder Platform",
      description: "A global ecosystem for Iranian entrepreneurs.",
      stage: "Building",
      progress: 65,
      isPrivate: false,
      team: [
        { id: 1, name: "Ali R.", image: "" },
        { id: 2, name: "Mina T.", image: "" },
        { id: 3, name: "Kamran E.", image: "" }
      ],
      lastUpdate: "2 days ago",
      tasks: {
        completed: 12,
        total: 20
      }
    },
    {
      id: 2,
      name: "TechBridge App",
      description: "Connecting Iranian tech talent worldwide through a mobile application.",
      stage: "Ideation",
      progress: 30,
      isPrivate: true,
      team: [
        { id: 1, name: "Ali R.", image: "" },
        { id: 4, name: "Sara K.", image: "" }
      ],
      lastUpdate: "5 days ago",
      tasks: {
        completed: 5,
        total: 15
      }
    },
    {
      id: 3,
      name: "DiasporaPay",
      description: "Financial solution for cross-border payments.",
      stage: "Ideation",
      progress: 15,
      isPrivate: false,
      team: [
        { id: 1, name: "Ali R.", image: "" }
      ],
      lastUpdate: "1 week ago",
      tasks: {
        completed: 3,
        total: 18
      }
    }
  ];

  // Filter projects based on the selected filter
  const filteredProjects = filter === 'all' ? projects : 
    projects.filter(project => {
      if (filter === 'private') return project.isPrivate;
      if (filter === 'public') return !project.isPrivate;
      return true;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-9 pr-4 py-2 text-sm border rounded-md w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Projects
        </Button>
        <Button 
          variant={filter === 'public' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('public')}
        >
          <Globe className="h-4 w-4 mr-1" />
          Public
        </Button>
        <Button 
          variant={filter === 'private' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('private')}
        >
          <Lock className="h-4 w-4 mr-1" />
          Private
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="relative group hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center justify-between">
                <div className="flex items-center">
                  <span>{project.name}</span>
                  {project.isPrivate && <Lock className="h-4 w-4 text-slate-400 ml-2" />}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Project</DropdownMenuItem>
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem>Manage Team</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Delete Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <Badge 
                  variant="outline" 
                  className={`
                    ${project.stage === 'Ideation' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                    ${project.stage === 'Building' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
                    ${project.stage === 'Launching' ? 'bg-green-50 text-green-600 border-green-200' : ''}
                    ${project.stage === 'Scaling' ? 'bg-amber-50 text-amber-600 border-amber-200' : ''}
                  `}
                >
                  <Rocket className="h-3 w-3 mr-1" />
                  {project.stage} Stage
                </Badge>
                <span className="text-xs text-slate-500">Updated {project.lastUpdate}</span>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Project Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-1.5" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.team.map((member) => (
                    <Avatar key={member.id} className="border-2 border-white h-8 w-8">
                      <AvatarImage src={member.image} />
                      <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {project.team.length > 3 && (
                    <div className="h-8 w-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-medium">
                      +{project.team.length - 3}
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-500 flex items-center">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {project.tasks.completed}/{project.tasks.total} tasks
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-2">
                View Project <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyProjects;
