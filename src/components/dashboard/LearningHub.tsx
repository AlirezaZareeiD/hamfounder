
import React from 'react';
import { BookOpen, PlayCircle, FileText, CheckSquare, Search, Clock, Download, Bookmark, BookmarkPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const LearningHub = () => {
  // Mock data for learning resources
  const recommendedCourses = [
    {
      id: 1,
      title: "Lean Startup Fundamentals",
      author: "Eric Ries",
      type: "Course",
      duration: "2.5 hours",
      level: "Beginner",
      progress: 35,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      title: "Pitching to Investors",
      author: "Y Combinator",
      type: "Course",
      duration: "1.5 hours",
      level: "Intermediate",
      progress: 0,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      title: "Product-Market Fit",
      author: "Andrew Chen",
      type: "Workshop",
      duration: "3 hours",
      level: "Advanced",
      progress: 0,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];
  
  const templates = [
    {
      id: 1,
      title: "Business Model Canvas",
      type: "Template",
      author: "Hamfounder Team",
      downloads: 2840
    },
    {
      id: 2,
      title: "Investor Pitch Deck",
      type: "Template",
      author: "Hamfounder Team",
      downloads: 1905
    },
    {
      id: 3,
      title: "Competitive Analysis Framework",
      type: "Template",
      author: "Hamfounder Team",
      downloads: 1345
    }
  ];
  
  const articles = [
    {
      id: 1,
      title: "How Iranian Entrepreneurs Can Access Global Markets",
      readTime: "10 min read",
      category: "Global Markets"
    },
    {
      id: 2,
      title: "Building Remote Teams Across Time Zones",
      readTime: "7 min read",
      category: "Team Building"
    },
    {
      id: 3,
      title: "Navigating International Payments as an Iranian Founder",
      readTime: "12 min read",
      category: "Finance"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Learning Hub</h1>
        <div className="flex items-center bg-white border rounded-full px-4 py-2 w-64">
          <Search className="h-4 w-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="outline-none text-sm w-full bg-transparent"
          />
        </div>
      </div>

      <Tabs defaultValue="recommended">
        <TabsList className="mb-6">
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="m-0">
          <h2 className="text-lg font-medium mb-4">For Your Current Stage: Ideation</h2>
          
          {/* Recommended Courses */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium flex items-center">
                <PlayCircle className="h-5 w-5 mr-2 text-blue-600" />
                Courses & Workshops
              </h3>
              <Button variant="link" size="sm" className="text-blue-600">
                View All Courses
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                  <CardContent className="p-4">
                    <Badge className="mb-2">{course.type}</Badge>
                    <h4 className="font-medium mb-1 line-clamp-1">{course.title}</h4>
                    <p className="text-xs text-slate-500 mb-2">by {course.author}</p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> {course.duration}
                      </span>
                      <span>{course.level}</span>
                    </div>
                    
                    {course.progress > 0 ? (
                      <div className="space-y-1">
                        <Progress value={course.progress} className="h-1" />
                        <div className="flex justify-between text-xs">
                          <span>{course.progress}% complete</span>
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                            Continue
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button size="sm" className="w-full">Start Learning</Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Templates Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium flex items-center">
                <CheckSquare className="h-5 w-5 mr-2 text-blue-600" />
                Templates & Frameworks
              </h3>
              <Button variant="link" size="sm" className="text-blue-600">
                View All Templates
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Badge variant="outline" className="mb-2">{template.type}</Badge>
                        <h4 className="font-medium">{template.title}</h4>
                        <p className="text-xs text-slate-500">by {template.author}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <BookmarkPlus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-slate-500">
                        {template.downloads.toLocaleString()} downloads
                      </span>
                      <Button variant="outline" size="sm" className="flex gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Articles Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Articles & Guides
              </h3>
              <Button variant="link" size="sm" className="text-blue-600">
                View All Articles
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {articles.map((article) => (
                <Card key={article.id} className="group cursor-pointer hover:border-blue-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-2">{article.category}</Badge>
                        <h4 className="font-medium mb-1 group-hover:text-blue-600 transition-colors">{article.title}</h4>
                        <p className="text-xs text-slate-500">{article.readTime}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <BookmarkPlus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="ghost" className="text-xs text-blue-600 mt-3 p-0 h-auto">
                      Read article →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="courses" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder for courses tab content */}
            <p className="col-span-full text-center py-6 text-slate-500">
              All courses content will be displayed here.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Placeholder for templates tab content */}
            <p className="col-span-full text-center py-6 text-slate-500">
              All templates content will be displayed here.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="articles" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Placeholder for articles tab content */}
            <p className="col-span-full text-center py-6 text-slate-500">
              All articles content will be displayed here.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="bookmarked" className="m-0">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Bookmark className="h-10 w-10 text-slate-300 mb-3" />
            <h3 className="font-medium mb-1">No bookmarks yet</h3>
            <p className="text-sm text-slate-500 max-w-md">
              Start bookmarking courses, templates, and articles to access them quickly later.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningHub;
