import React, { ReactNode, useEffect } from 'react'; // Import useEffect
import { Logo } from '../Logo'; // Import Logo as a named export
import { DashboardHamburgerMenu } from '../dashboard/DashboardHamburgerMenu'; // Import DashboardHamburgerMenu as a named export
import { useUser } from '@/contexts/UserContext'; // Import useUser hook
import { signOut } from 'firebase/auth'; // Import signOut
import { auth } from '@/lib/firebase'; // Import auth
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Define props interface (adjust if needed, removing userEmail and userProfileImage)
interface DashboardLayoutProps {
  children: ReactNode;
  // userEmail and userProfileImage are now accessed via Context
  // onSignOut is still needed if you manage sign out here
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => { // Removed userEmail, onSignOut, userProfileImage from props
  const { user, loading, userProfileImage } = useUser(); // Use the useUser hook
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle sign out logic
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Redirect to home page after sign out
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle sign out error if needed
    }
  };

  // Redirect unauthenticated users to login page
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login'); // Redirect to login page if not loading and no user
    }
  }, [user, loading, navigate]); // Dependencies for useEffect


  // You might want to show a loading indicator while loading auth state
  if (loading) {
    return <div>Loading...</div>; // Replace with a proper loading component
  }

  // The redirect logic is now handled by useEffect, so we don't need this check here anymore
  // if (!user) {
  //   return null;
  // }


  return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white shadow-sm py-4 px-4 sm:px-6">
          <div className="container max-w-7xl mx-auto flex justify-between items-center">
            <Logo />
            {/* Pass userEmail and userProfileImage from Context */}
            {/* Pass handleSignOut as before */}
            <DashboardHamburgerMenu
              userEmail={user?.email || ""} // Use user.email from Context
              onSignOut={handleSignOut} // Pass the local handleSignOut
              userProfileImage={userProfileImage} // Use userProfileImage from Context
            />
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
