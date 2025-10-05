
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useWhitelist } from '@/hooks/useWhitelist';
import { RingLoader } from 'react-spinners';

interface WhitelistRouteProps {
  children: React.ReactElement;
}

const WhitelistRoute: React.FC<WhitelistRouteProps> = ({ children }) => {
  const { user, loading: userLoading } = useUser();
  const { whitelist, loading: whitelistLoading } = useWhitelist();

  // --- DEBUGGING LOGS ---
  console.log('[WhitelistRoute] User Loading:', userLoading);
  console.log('[WhitelistRoute] Whitelist Loading:', whitelistLoading);
  console.log('[WhitelistRoute] User UID:', user?.uid);
  console.log('[WhitelistRoute] Whitelist:', whitelist);

  const isLoading = userLoading || whitelistLoading;

  if (isLoading) {
    console.log('[WhitelistRoute] Showing loading spinner...');
    return (
      <div className="flex h-screen items-center justify-center">
        <RingLoader color="#36d7b7" size={80} />
      </div>
    );
  }

  const isWhitelisted = user && whitelist.includes(user.uid);
  console.log('[WhitelistRoute] Is User Whitelisted?:', isWhitelisted);

  if (!isWhitelisted) {
    console.log('[WhitelistRoute] User not in whitelist. Redirecting to /dashboard.');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('[WhitelistRoute] User is whitelisted. Rendering children.');
  return children;
};

export default WhitelistRoute;
