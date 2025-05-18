
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import MyProjects from "@/components/dashboard/MyProjects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LearningHub from "@/components/dashboard/LearningHub";
import EventsCommunity from "@/components/dashboard/EventsCommunity";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    // Redirect to login page if user is not authenticated
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Sign Out Successful",
        description: "You have been successfully signed out of your account.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Sign Out Error",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return null; // Loading or redirecting state
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center space-x-4">
            <span className="text-slate-700">
              {user.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Hamfounder Dashboard</h1>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 w-full max-w-full justify-start overflow-x-auto">
                <TabsTrigger value="projects">My Projects</TabsTrigger>
                <TabsTrigger value="learning">Learning Hub</TabsTrigger>
                <TabsTrigger value="events">Events & Community</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="projects">
                <MyProjects />
              </TabsContent>
              
              <TabsContent value="learning">
                <LearningHub />
              </TabsContent>
              
              <TabsContent value="events">
                <EventsCommunity />
              </TabsContent>
              
              <TabsContent value="notifications">
                <NotificationsPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
