
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, Search, Bell, LogOut, Edit, Home, Briefcase, Lock, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useWhitelist } from '@/hooks/useWhitelist';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardHamburgerMenuProps {
  userEmail: string;
  onSignOut: () => void;
  userProfileImage?: string;
}

export const DashboardHamburgerMenu: React.FC<DashboardHamburgerMenuProps> = ({ userEmail, onSignOut, userProfileImage }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  // --- THE FIX: Correctly consume the useWhitelist hook ---
  const { whitelist, loading: whitelistLoading } = useWhitelist();

  // Memoize the check to prevent re-calculation on every render
  const isUserWhitelisted = useMemo(() => {
    // If it's loading or there is no user, they are not whitelisted
    if (whitelistLoading || !user) {
      return false;
    }
    // Otherwise, check if the user's UID is in the array
    return whitelist.includes(user.uid);
  }, [whitelist, whitelistLoading, user]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-64 sm:w-72 flex flex-col">
        <SheetHeader>
          <div className="flex flex-col items-center border-b pb-4 mb-4">
            <div className="relative w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl font-bold mb-2 overflow-hidden">
              {userProfileImage ? (
                <img src={userProfileImage} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                userEmail ? userEmail.charAt(0).toUpperCase() : '?'
              )}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow cursor-pointer" onClick={() => { navigate('/dashboard/edit-profile'); handleLinkClick(); }}>
                <Edit className="h-4 w-4 text-gray-600" />
              </div>
            </div>

            <SheetTitle className="text-base font-semibold text-gray-800 text-center w-full overflow-hidden text-ellipsis whitespace-nowrap">
              {userEmail}
            </SheetTitle>
          </div>
        </SheetHeader>

        <nav className="flex flex-col space-y-2 flex-grow">
          <Link to="/dashboard" onClick={handleLinkClick} className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <Home className="h-5 w-5 mr-3 text-gray-600" />
            Your Dashboard
          </Link>
          <Link to="/dashboard/edit-profile" onClick={handleLinkClick} className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <User className="h-5 w-5 mr-3 text-gray-600" />
            Edit Profile
          </Link>
          <Link to="/dashboard/find-cofounder" onClick={handleLinkClick} className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <Search className="h-5 w-5 mr-3 text-gray-600" />
            Find Co-founder
          </Link>
          <Link to="/dashboard/notifications" onClick={handleLinkClick} className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <Bell className="h-5 w-5 mr-3 text-gray-600" />
            Notifications
          </Link>
          <Link to="/dashboard/messages" onClick={handleLinkClick} className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <MessageSquare className="h-5 w-5 mr-3 text-gray-600" />
            Messages
          </Link>

          {/* --- THE FIX: Conditionally render based on the correct logic -- */}
          {whitelistLoading ? (
            <div className="flex items-center p-2">
              <Skeleton className="h-5 w-5 mr-3 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
          ) : isUserWhitelisted && (
            <Link to="/admin/co-founder-private-repository" onClick={handleLinkClick} className="flex items-center p-2 rounded-md hover:bg-gray-100">
              <Lock className="h-5 w-5 mr-3 text-gray-600" />
                Private Repository
            </Link>
          )}

          {user?.email === 'alireza.zareidowlatabadi@gmail.com' && (
            <Link to="/admin/bi-dashboard" onClick={handleLinkClick} className="flex items-center p-2 rounded-md hover:bg-gray-100">
              <Briefcase className="h-5 w-5 mr-3 text-gray-600" />
              BI Dashboard
            </Link>
          )}
        </nav>

        <div className="mt-auto border-t pt-4">
          <Button variant="ghost" onClick={() => { onSignOut(); handleLinkClick(); }} className="flex items-center p-2 rounded-md hover:bg-red-100 text-red-600 w-full justify-start">
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
