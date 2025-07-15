import { useState, useEffect, useRef } from "react"; // Add useRef
import { useNavigate } from "react-router-dom";
// Remove direct auth import, will get user from context
// import { auth, getUserProfile } from "@/lib/firebase";

// Import the useUser hook from the context
// import { useUser } from "@/contexts/UserContext";

// Logo و DashboardHamburgerMenu دیگر در اینجا لازم نیستند چون در DashboardLayout هستند
// import { Logo } from "@/components/Logo"; // این خط را حذف کنید
// import { DashboardHamburgerMenu } from "@/components/dashboard/DashboardHamburgerMenu"; // این خط را حذف کنید

// Button, signOut, toast ممکن است در منطق تب ها لازم باشند، می توانید نگه دارید یا اگر فقط در DashboardLayout استفاده می شوند حذف کنید
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { toast } from "@/hooks/use-toast";


import MyProjects from "@/components/dashboard/MyProjects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LearningHub from "@/components/dashboard/LearningHub";
import EventsCommunity from "@/components/dashboard/EventsCommunity";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import FounderRoadmapSection from '@/components/FounderRoadmapSection';
import TrustBuildingSection from '@/components/TrustBuildingSection';

import DashboardLayout from '@/components/layouts/DashboardLayout'; // وارد کردن لایه‌بندی داشبورد


const Dashboard = () => {
  // Get user and loading state from the context
 // const { user, loading } = useUser(); // این خط قبلا حذف شده است
  const [activeTab, setActiveTab] = useState("projects");
  // Remove userProfileImage state, handled by context and layout
  // const [userProfileImage, setUserProfileImage] = useState<string | undefined>(undefined); // State to store profile image URL - این خط قبلا کامنت یا حذف شده است
  const tabsListRef = useRef<HTMLDivElement>(null); // Create a ref for the TabsList
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true); // Initially show right fade

  const navigate = useNavigate(); // useNavigate لازم است اگر useEffect بالا را نگه می دارید - با حذف useEffect بالا ممکن است دیگر لازم نباشد، اما فعلا نگه می داریم

  // REMOVED: useEffect for redirection, which was using user and loading
  // useEffect(() => {
  //    // Only redirect if loading is false and user is null
  //    if (!loading && !user) {
  //      navigate('/login');
  //      return;
  //    }
  //  }, [user, loading, navigate]); // Added loading to dependency array

  // Remove the effect to fetch user profile image, handled by context and layout
  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     console.log("Fetching user profile..."); // Add this log
  //     console.log("auth.currentUser:", auth.currentUser); // Add this log
  //     console.log("user variable:", user); // Add this log
  //     if (user) {
  //       try {
  //         const profile = await getUserProfile(user.uid);
  //         if (profile?.profileImageUrl) {
  //           setUserProfileImage(profile.profileImageUrl);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching user profile:", error);
  //       }
  //     }
  //   };
  //   fetchUserProfile();
  // }, [user]); // Rerun when the user object changes


  // handleSignOut دیگر در اینجا مدیریت نمی شود و به DashboardLayout منتقل شده است
  // const handleSignOut = async () => {
  //   try {
  //     await signOut(auth);
  //     toast({
  //       title: "Sign Out Successful",
  //       description: "You have been successfully signed out of your account.",
  //     });
  //     navigate('/');
  //   } catch (error) {
  //     toast({
  //       title: "Sign Out Error",
  //       description: "There was a problem signing out. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // بررسی کاربر در DashboardLayout انجام می شود
  // if (!user) {
  //   return null; // Loading or redirecting state - در DashboardLayout مدیریت می شود - این هم قبلا کامنت یا حذف شده است
  // }

  const checkFadeEffects = () => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
      const atLeftEnd = scrollLeft === 0;
      const atRightEnd = scrollLeft + clientWidth >= scrollWidth - 1; // Allow for 1px tolerance

      setShowLeftFade(!atLeftEnd);
      setShowRightFade(!atRightEnd);
    }
  };

  useEffect(() => {
    // Check fade effects initially and on window resize
    checkFadeEffects();
    const handleResize = () => checkFadeEffects();
    window.addEventListener('resize', handleResize);

    // Check fade effects when tabs are clicked (content changes might affect scrollWidth)
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
    // Re-check fade effects after scroll
    const handleScroll = () => {
      checkFadeEffects();
    };
    tabsListRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      tabsListRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [activeTab]); // Re-check when activeTab changes


  return (
    <DashboardLayout> {/* استفاده از لایه‌بندی داشبورد */}
      {/* محتوای اصلی داشبورد (تب ها و سکشن ها) - profileImageURL passed implicitly via DashboardLayout */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center sm:text-left"> Welcome - Every founder’s journey begins here!</h1> {/* Centered heading on mobile */}

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
           <div className="relative"> {/* Added relative positioning for fades */}
             {/* Left Fade */}
            {showLeftFade && (
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 sm:hidden"></div> // Only visible on small screens
            )}

            <TabsList
               ref={tabsListRef} // Attach the ref
               className="mb-6 w-full max-w-full justify-start overflow-x-auto flex-nowrap scrollbar-hide px-4 sm:px-0" // Added horizontal padding for fades
               onScroll={checkFadeEffects} // Check fade visibility on scroll
            >
             <TabsTrigger value="projects">My Projects</TabsTrigger>
             <TabsTrigger value="learning">Learning Hub</TabsTrigger>
             <TabsTrigger value="events">Events & Community</TabsTrigger>
             <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

            {/* Right Fade */}
            {showRightFade && (
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 sm:hidden"></div> // Only visible on small screens
            )}
          </div>

          <TabsContent value="projects">
            {/* Optionally show loading state here if MyProjects depends heavily on user */}
            {/* {loading ? <div>Loading Projects...</div> : <MyProjects />} */}
            <MyProjects />
          </TabsContent>

          <TabsContent value="learning">
             {/* Optionally show loading state here if LearningHub depends heavily on user */}
             {/* {loading ? <div>Loading Learning Hub...</div> : <LearningHub />} */}
            <LearningHub />
          </TabsContent>

          <TabsContent value="events">
             {/* Optionally show loading state here if EventsCommunity depends heavily on user */}
             {/* {loading ? <div>Loading Events & Community...</div> : <EventsCommunity />} */}
            <EventsCommunity />
          </TabsContent>

          <TabsContent value="notifications">
             {/* Optionally show loading state here if NotificationsPanel depends heavily on user */}
             {/* {loading ? <div>Loading Notifications...</div> : <NotificationsPanel />} */}
            <NotificationsPanel />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-8"><FounderRoadmapSection /></div> {/* Added margin top for spacing */}
    </DashboardLayout>
  );
};

export default Dashboard;