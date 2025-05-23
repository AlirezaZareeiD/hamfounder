import React from 'react';
import { DashboardHamburgerMenu } from '../dashboard/DashboardHamburgerMenu'; // مسیر صحیح برای وارد کردن منوی همبرگری
import { Logo } from '../Logo'; // مسیر صحیح برای وارد کردن لوگو
import { auth } from '@/lib/firebase'; // وارد کردن auth برای دسترسی به اطلاعات کاربر و signOut
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // برای هدایت پس از خروج
import { toast } from '@/hooks/use-toast'; // برای نمایش پیام خروج موفق

interface DashboardLayoutProps {
  children: React.ReactNode;
  userProfileImage?: string; // Add this prop
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userProfileImage }) => {
  const navigate = useNavigate();
  const user = auth.currentUser; // دریافت کاربر فعلی

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


  // اگر کاربر لاگین نکرده، ریدایرکت یا نمایش صفحه بارگذاری
   if (!user) {
     return null; // یا یک صفحه بارگذاری
   }


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
          {/* منوی همبرگری در لایه‌بندی */}
          {/* user.email و onSignOut از لایه‌بندی پاس داده می شوند */}
          <DashboardHamburgerMenu userEmail={user.email || ""} onSignOut={handleSignOut} userProfileImage={userProfileImage} /> {/* Pass userProfileImage */}
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          {children} {/* محتوای صفحه خاص در اینجا رندر می شود */}
        </div>
      </main>

      {/* می توانید فوتر را نیز در اینجا اضافه کنید */}
    </div>
  );
};

export default DashboardLayout;
