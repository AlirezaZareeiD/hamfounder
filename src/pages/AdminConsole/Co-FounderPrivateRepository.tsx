
import React, { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useUser } from '@/contexts/UserContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { NdaAcceptanceForm } from '@/components/dashboard/confidential/NdaAcceptanceForm';
import { ConfidentialKnowledgeBase } from '@/components/dashboard/confidential/ConfidentialKnowledgeBase';
import { TrustFrameworkViewer } from '@/components/dashboard/confidential/TrustFrameworkViewer';
import { EmbeddedVideoPlayer } from '@/components/dashboard/confidential/EmbeddedVideoPlayer'; // Import the new video player
import { Loader2, ShieldCheck, AlertTriangle, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const CoFounderPrivateRepository = () => {
  const { user } = useUser();
  const { userProfile, loading: profileLoading } = useUserProfile();
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ndaJustAccepted, setNdaJustAccepted] = useState(false);
  const [isFrameworkOpen, setIsFrameworkOpen] = useState(false);
  const YOUTUBE_VIDEO_ID = "IBgL6Qvv6hs"; // Centralized video ID

  const handleAcceptNDA = async () => {
    if (!user) return;
    setIsAccepting(true);
    setError(null);
    try {
      const functions = getFunctions();
      const acceptNda = httpsCallable(functions, 'acceptNdaAndSetClaim');
      await acceptNda();
      setNdaJustAccepted(true);
    } catch (err: any) {
      console.error("Error accepting NDA: ", err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  };

  useEffect(() => {
    if (ndaJustAccepted && !isAccepting) {
      setTimeout(() => window.location.reload(), 1000);
    }
  }, [ndaJustAccepted, isAccepting]);

  const renderContent = () => {
    if (profileLoading || isAccepting) {
      return (
        <div className="flex flex-col items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className='mt-4 text-sm text-slate-600'>{isAccepting ? 'Finalizing agreement, please wait...' : 'Loading your access status...'}</p>
        </div>
      );
    }

    if (ndaJustAccepted) {
      return (
          <div className="flex flex-col items-center justify-center h-48 text-center">
              <ShieldCheck className="h-10 w-10 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Access Granted!</h3>
              <p className="text-gray-600 mt-2">The page will now refresh to load the confidential documents.</p>
          </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-600 p-8 bg-red-50 rounded-lg">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          <p className='font-semibold'>Failed to grant access</p>
          <p>{error}</p>
        </div>
      );
    }

    // Main logic: Show NDA form or the Confidential Knowledge Base
    if (userProfile?.ndaAccepted) {
      return (
        // Use React Fragment for better structure
        <>
          <Collapsible open={isFrameworkOpen} onOpenChange={setIsFrameworkOpen} className="mb-8">
            <div className='p-4 border rounded-lg bg-white shadow-sm'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h3 className='font-semibold text-gray-800'>Professional Trust Framework</h3>
                        <p className='text-sm text-muted-foreground mt-1'>Review the agreement you accepted.</p>
                    </div>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className='rounded-full'>
                            <Eye className="h-5 w-5" />
                            <span className="sr-only">Toggle Framework View</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-4 pt-4 border-t">
                    <TrustFrameworkViewer />
                </CollapsibleContent>
            </div>
          </Collapsible>
          
          <ConfidentialKnowledgeBase />

          <EmbeddedVideoPlayer 
            videoId={YOUTUBE_VIDEO_ID}
            title="Our Vision in Motion"
            description="A message from our founder on the mission and opportunity ahead."
          />
        </>
      );
    } else {
      return <NdaAcceptanceForm onAccept={handleAcceptNDA} />;
    }
  };

  return (
    <DashboardLayout>
        <div className='container mx-auto py-12 px-4'>
            <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md">
                <CardHeader className='flex flex-row items-center gap-4'>
                    <ShieldCheck className='w-10 h-10 text-blue-600' />
                    <div>
                        <CardTitle className='text-blue-900'>Welcome to the Founders' Circle</CardTitle>
                        <CardDescription className='text-blue-700'>A trusted space for potential co-founders to explore our vision.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        To build something great, we need trust. This private repository contains our strategic documents and business model canvas. We're sharing this with you because we see you as a potential future partner on this exciting journey.
                        <br/><br/>
                        By proceeding, you agree to treat this information with respect and confidentiality, just as you would with your own groundbreaking ideas. This simply formalizes our mutual trust as we explore the possibility of building the future together.
                    </p>
                    {userProfile?.ndaAccepted && userProfile.ndaAcceptedTimestamp && (
                        <div className='mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-sm text-green-900 flex items-center'>
                            <ShieldCheck className='w-5 h-5 mr-3 flex-shrink-0' />
                            <span>
                                Thank you for your commitment! Access granted on {" "}
                                {new Date(userProfile.ndaAcceptedTimestamp.seconds * 1000).toLocaleString()}.
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className='mt-8'>
                {renderContent()}
            </div>
        </div>
    </DashboardLayout>
  );
};

export default CoFounderPrivateRepository;
