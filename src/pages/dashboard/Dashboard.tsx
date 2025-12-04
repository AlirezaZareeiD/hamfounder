import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import MyProjects from "@/components/dashboard/MyProjects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Users, Search } from "lucide-react"; // Cleaned up unused imports
import ConnectionRequests from "@/components/dashboard/ConnectionRequests";
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ChatInterface from "@/components/dashboard/chat/ChatInterface";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  const checkFadeEffects = () => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
      setShowLeftFade(scrollLeft > 0);
      setShowRightFade(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkFadeEffects();
    const currentTabsList = tabsListRef.current;
    const handleResize = () => checkFadeEffects();
    window.addEventListener('resize', handleResize);

    const observer = new MutationObserver(checkFadeEffects);
    if (currentTabsList) {
      observer.observe(currentTabsList, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentTabsList) {
         observer.disconnect();
       }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => checkFadeEffects();
    const currentTabsList = tabsListRef.current;
    currentTabsList?.addEventListener('scroll', handleScroll);
    return () => {
      currentTabsList?.removeEventListener('scroll', handleScroll);
    };
  }, [activeTab]);

  return (
    <DashboardLayout>
      <div className="bg-white shadow rounded-lg p-6">

        {/* --- Merged & Simplified Call-to-Action Section --- */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">
            <span role="img" aria-label="sparkles" className="mr-2">✨</span>
            Every Founder’s Journey Begins Here!
          </h2>
           <p className="text-center text-slate-500 mb-6">
             Discover, connect, and grow with the global Iranian entrepreneurs ecosystem.
           </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Edit Profile */}
            <Link to="/dashboard/edit-profile" className="hover:no-underline">
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Edit Your Profile</CardTitle>
                  <Edit className="w-5 h-5 text-slate-500" />
                </CardHeader>
                <CardContent><CardDescription>Complete your profile to attract co-founders and investors.</CardDescription></CardContent>
              </Card>
            </Link>
            
            {/* Card 2: Find Co-Founder */}
            <Link to="/dashboard/find-cofounder" className="hover:no-underline">
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Find Co-Founder</CardTitle>
                  <Users className="w-5 h-5 text-slate-500" />
                </CardHeader>
                <CardContent><CardDescription>Browse member profiles and find your perfect match!</CardDescription></CardContent>
              </Card>
            </Link>

            {/* Card 3: Discover Projects */}
            <Link to="/dashboard/projects" className="hover:no-underline">
               <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Discover Projects</CardTitle>
                  <Search className="w-5 h-5 text-slate-500" />
                </CardHeader>
                <CardContent><CardDescription>Browse innovative ventures from the global Iranian community.</CardDescription></CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/*
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">
            <span role="img" aria-label="sparkles" className="mr-2">✨</span>
            Customize Your Profile
            <span role="img" aria-label="rocket" className="ml-2">🚀</span>
          </h2>
          <p className="text-center text-slate-500 mb-6">
            Tell your entrepreneurial story and connect with your ideal co-founders
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/dashboard/edit-profile" className="hover:no-underline">
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Edit Your Profile</CardTitle>
                  <Edit className="w-5 h-5 text-slate-500" />
                </CardHeader>
                <CardContent><CardDescription>Complete your profile to attract co-founders and investors.</CardDescription></CardContent>
              </Card>
            </Link>
            <Link to="/dashboard/find-cofounder" className="hover:no-underline">
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Find Co-Founder</CardTitle>
                  <Users className="w-5 h-5 text-slate-500" />
                </CardHeader>
                <CardContent><CardDescription>Browse member profiles and find your perfect match!</CardDescription></CardContent>
              </Card>
            </Link>
          </div>
        </div>

        
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">
            <span role="img" aria-label="sparkles" className="mr-2">✨</span>
            Explore the Visionary Builders' Marketplace
          </h2>
           <p className="text-center text-slate-500 mb-6">
             Discover, connect, and grow with the global Iranian entrepreneurs ecosystem. 
           </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/dashboard/projects" className="hover:no-underline">
               <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Discover Projects</CardTitle>
                  <Search className="w-5 h-5 text-slate-500" />
                </CardHeader>
                <CardContent><CardDescription>Browse innovative ventures from the global Iranian community.</CardDescription></CardContent>
              </Card>
            </Link>
            <Link to="/dashboard/find-cofounder" className="hover:no-underline">
               <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Find Talent</CardTitle>
                  <Users className="w-5 h-5 text-slate-500" />
                </CardHeader>
                <CardContent><CardDescription>Connect with skilled builders and potential collaborators.</CardDescription></CardContent>
              </Card>
            </Link>
            <Link to="/dashboard/projects" className="hover:no-underline">
               <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Seek Investment</CardTitle>
                  <DollarSign className="w-5 h-5 text-slate-500" />
                </CardHeader>
                <CardContent><CardDescription>Showcase your project to a network of aligned investors.</CardDescription></CardContent>
              </Card>
            </Link>
          </div>
        </div>
        */}

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
           <div className="relative">
          <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center sm:text-left"> </h1>

            {showLeftFade && (
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 sm:hidden"></div>
            )}

            <TabsList
               ref={tabsListRef}
               className="mb-6 w-full max-w-full justify-start overflow-x-auto flex-nowrap scrollbar-hide px-4 sm:px-0"
               onScroll={checkFadeEffects}
            >
             <TabsTrigger value="projects">My Projects</TabsTrigger>
             <TabsTrigger value="messages">My Messages</TabsTrigger>
             <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

            {showRightFade && (
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 sm:hidden"></div>
            )}
          </div>

          <TabsContent value="projects">
            <MyProjects />
          </TabsContent>

          <TabsContent value="messages">
            <ChatInterface />
          </TabsContent>

          <TabsContent value="notifications">
            <ConnectionRequests />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
