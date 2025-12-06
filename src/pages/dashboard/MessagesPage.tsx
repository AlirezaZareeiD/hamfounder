import React, { useState, useCallback } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ChatList from '@/components/dashboard/chat/ChatList';
import ChatWindow from '@/components/dashboard/chat/ChatWindow';
import UserProfilePane from '@/components/dashboard/chat/UserProfilePane';
import { MessageSquare } from 'lucide-react';
import MemberModal from '@/components/dashboard/find-cofounder/MemberModal';
import { getUserProfile, auth } from '@/lib/firebase';
import { Member } from '@/types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';


interface SelectedChat {
  chatId: string;
  otherUser: {
    id: string;
    name: string;
    avatar: string;
  };
}

const MessagesPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Member | null>(null);

  const handleSelectChat = (chatId: string, otherUser: { id: string; name: string; avatar: string }) => {
    setSelectedChat({ chatId, otherUser });
    if (window.innerWidth < 1024) {
        setSidebarOpen(true);
    }
  };

  const handleToggleSidebar = () => {
      setSidebarOpen(!isSidebarOpen);
  }

  const handleViewProfile = async (otherUserInfo: { id: string; name: string; avatar: string }) => {
      try {
          const fullProfile = await getUserProfile(otherUserInfo.id);
          if (fullProfile) {
              const memberData: Member = {
                id: otherUserInfo.id,
                name: `${fullProfile.firstName || ''} ${fullProfile.lastName || ''}`.trim(),
                avatar: fullProfile.profileImageUrl || '',
                role: fullProfile.role || '',
                skills: fullProfile.skills || [],
                location: fullProfile.location || '',
                bio: fullProfile.personalSummary || '',
                experience: fullProfile.businessStage || 'N/A',
                industry: fullProfile.industry || (fullProfile as any).Industry || 'N/A',
                lookingFor: fullProfile.lookingFor || 'N/A',
                projectsCompleted: 0, // This data is not readily available here, default to 0
                isOnline: (fullProfile as any).isOnline || false,
                rating: (fullProfile as any).rating || 0,
                joinedDate: fullProfile.joinedDate ? new Date(fullProfile.joinedDate.seconds * 1000).toLocaleDateString() : 'N/A',
                achievements: fullProfile.achievements || []
            };
            setSelectedProfile(memberData);
            setProfileModalOpen(true);
          } else {
              toast({ variant: 'destructive', title: 'Could not load profile.' });
          }
      } catch (error) {
          console.error("Error fetching user profile:", error);
          toast({ variant: 'destructive', title: 'Error fetching profile.' });
      }
  }

  const handleCloseProfile = () => {
      setProfileModalOpen(false);
      setSelectedProfile(null);
  }

  const handleMessageFromModal = useCallback((member: Member) => {
    if (!user) return;
    setProfileModalOpen(false);
    const chatId = [user.uid, member.id].sort().join('_');
    // Since we are already on the messages page, we might not need to navigate,
    // but we can ensure the correct chat is selected.
    if (selectedChat?.chatId !== chatId) {
        handleSelectChat(chatId, {id: member.id, name: member.name, avatar: member.avatar});
    }
  }, [user, selectedChat]);


  return (
    <DashboardLayout>
      <div className={`grid grid-cols-1 md:grid-cols-[320px_1fr] ${isSidebarOpen ? 'lg:grid-cols-[320px_1fr_320px]' : 'lg:grid-cols-[320px_1fr_0px]'} h-[calc(100vh-theme(space.20))] transition-all duration-300 ease-in-out`}>
        {/* Column 1: Chat List */}
        <div className="border-r border-gray-200 dark:border-gray-800">
          <ChatList onSelectChat={handleSelectChat} selectedChatId={selectedChat?.chatId} />
        </div>

        {/* Column 2: Chat Window */}
        <div className={`border-l border-gray-200 dark:border-gray-800 ${selectedChat ? '' : 'flex'}`}>
          {selectedChat ? (
            <ChatWindow
              chatId={selectedChat.chatId}
              otherUser={selectedChat.otherUser}
              onToggleSidebar={handleToggleSidebar}
            />
          ) : (
            <div className="h-full w-full flex-col justify-center items-center text-muted-foreground hidden md:flex">
              <MessageSquare className="h-12 w-12 mb-4" />
              <h2 className="text-xl font-semibold">Select a conversation</h2>
              <p>Choose one of your connections to start chatting.</p>
            </div>
          )}
        </div>

        {/* Column 3: User Profile Pane */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-full' : 'w-0'}`}>
             {selectedChat && <UserProfilePane otherUser={selectedChat?.otherUser || null} onViewProfile={handleViewProfile} />}
        </div>
      </div>
      
      {/* Profile Modal */}
       {selectedProfile && (
          <MemberModal
            member={selectedProfile}
            isOpen={isProfileModalOpen}
            onClose={handleCloseProfile}
            onConnect={handleMessageFromModal}
            connectionStatus={'connected'} // Users in chat are already connected
            projectsCount={selectedProfile.projectsCompleted || 0}
          />
        )}
    </DashboardLayout>
  );
};

export default MessagesPage;
