import { useState, useEffect, useRef } from "react"; 
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { signOut } from "firebase/auth";
// import { toast } from "@/hooks/use-toast";
import MyProjects from "@/components/dashboard/MyProjects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Edit, Users } from "lucide-react"; 
// import LearningHub from "@/components/dashboard/LearningHub";
// import EventsCommunity from "@/components/dashboard/EventsCommunity";
import ConnectionRequests from "@/components/dashboard/ConnectionRequests";
import FounderRoadmapSection from '@/components/FounderRoadmapSection';
import DashboardLayout from '@/components/layouts/DashboardLayout'; 

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true); 

  // const navigate = useNavigate();

  const checkFadeEffects = () => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
      const atLeftEnd = scrollLeft === 0;
      const atRightEnd = scrollLeft + clientWidth >= scrollWidth - 1;

      setShowLeftFade(!atLeftEnd);
      setShowRightFade(!atRightEnd);
    }
  };

  useEffect(() => {
    checkFadeEffects();
    const handleResize = () => checkFadeEffects();
    window.addEventListener('resize', handleResize);

    const observer = new MutationObserver(checkFadeEffects);
    if (tabsListRef.current) {
      observer.observe(tabsListRef.current, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (tabsListRef.current) {
         observer.disconnect();
       }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      checkFadeEffects();
    };
    tabsListRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      tabsListRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [activeTab]);

  return (
    <DashboardLayout>
      <div className="bg-white shadow rounded-lg p-6">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">
            <span role="img" aria-label="sparkles" className="mr-2">✨</span>
            Customize Your Profile
            <span role="img" aria-label="rocket" className="ml-2">🚀</span>
          </h2>
          <p className="text-center text-slate-500 mb-6">
            Tell your entrepreneurial story and connect with your ideal co-founders
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/dashboard/edit-profile">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Edit Your Profile</CardTitle>
                  <Edit className="w-5 h-5 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Complete your profile to attract co-founders and investors.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
            <Link to="/dashboard/find-cofounder">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Find Co-Founder</CardTitle>
                  <Users className="w-5 h-5 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Browse member profiles and find your perfect match!
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
           <div className="relative">
          <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center sm:text-left"> Every founder’s journey begins here!</h1>

            {showLeftFade && (
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 sm:hidden"></div>
            )}

            <TabsList
               ref={tabsListRef}
               className="mb-6 w-full max-w-full justify-start overflow-x-auto flex-nowrap scrollbar-hide px-4 sm:px-0"
               onScroll={checkFadeEffects}
            >
             <TabsTrigger value="projects">My Projects</TabsTrigger>
             {/* <TabsTrigger value="learning">Learning Hub</TabsTrigger> */}
             {/* <TabsTrigger value="events">Events & Community</TabsTrigger> */}
             <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

            {showRightFade && (
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 sm:hidden"></div>
            )}
          </div>

          <TabsContent value="projects">
            <MyProjects />
          </TabsContent>

          {/*
          <TabsContent value="learning">
            <LearningHub />
          </TabsContent>
          */}

          {/*
          <TabsContent value="events">
            <EventsCommunity />
          </TabsContent>
          */}

          <TabsContent value="notifications">
            <ConnectionRequests />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-8"><FounderRoadmapSection /></div>
    </DashboardLayout>
  );
};

export default Dashboard;
