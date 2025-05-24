import React, { ReactNode } from 'react';
import { Logo } from '../Logo'; // Import Logo as a named export
import { DashboardHamburgerMenu } from '../dashboard/DashboardHamburgerMenu'; // Import DashboardHamburgerMenu as a named export
import { useUser } from '@/contexts/UserContext'; // Import useUser hook
import { signOut } from 'firebase/auth'; // Import signOut
import { auth } from '@/lib/firebase'; // Import auth

// Define props interface (adjust if needed, removing userEmail and userProfileImage)
interface DashboardLayoutProps {
  children: ReactNode;
  // userEmail and userProfileImage are now accessed via Context
  // onSignOut is still needed if you manage sign out here
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => { // Removed userEmail, onSignOut, userProfileImage from props
  const { user, loading, userProfileImage } = useUser(); // Use the useUser hook

  // Handle sign out logic
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Redirect to login page after sign out if needed
      // Example: navigate('/login'); (if you use react-router-dom's useNavigate)
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle sign out error if needed
    }
  };


  // You might want to show a loading indicator while loading auth state
  if (loading) {
    return <div>Loading...</div>; // Replace with a proper loading component
  }

  // You might want to redirect unauthenticated users
  if (!user) {
    // Example: Redirect to login page
    // navigate('/login'); (if you use react-router-dom's useNavigate)
    return null; // Or a message indicating redirection
  }


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
