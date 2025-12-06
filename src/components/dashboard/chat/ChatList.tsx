import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ChatListItem {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
  lastMessage: string;
  timestamp: any; // Using any for Firestore timestamp for now
}

interface ChatListProps {
  onSelectChat: (chatId: string, otherUser: { id: string; name: string; avatar: string }) => void;
  selectedChatId?: string | null;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, selectedChatId }) => {
  const [user] = useAuthState(auth);
  const [chats, setChats] = useState<ChatListItem[]>([]);

  useEffect(() => {
    if (!user) return;

    const chatsQuery = query(collection(db, 'chats'), where('userIds', 'array-contains', user.uid));

    const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
      const chatListData = await Promise.all(
        snapshot.docs.map(async (chatDoc) => {
          const chatData = chatDoc.data();
          const otherUserId = chatData.userIds.find((id: string) => id !== user.uid);

          if (!otherUserId) return null;

          const userProfileDoc = await getDoc(doc(db, 'userProfiles', otherUserId));
          if (!userProfileDoc.exists()) return null;

          const profileData = userProfileDoc.data();
          return {
            id: chatDoc.id,
            otherUserId,
            otherUserName: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim(),
            otherUserAvatar: profileData.profileImageUrl || 'https://via.placeholder.com/150',
            lastMessage: chatData.lastMessage || '...',
            timestamp: chatData.timestamp
          };
        })
      );

      setChats(chatListData.filter(Boolean) as ChatListItem[]);
    }, (error) => {
      console.error("Error fetching chat list: ", error);
    });

    return () => unsubscribe();
  }, [user]);

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold">Chats</h2>
            <div>
                <Button variant="ghost" size="icon"><Plus className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5" /></Button>
            </div>
        </div>
        <Tabs defaultValue="chats" className="p-2">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chats">Chats</TabsTrigger>
                <TabsTrigger value="archived">Archived Chats</TabsTrigger>
            </TabsList>
            <TabsContent value="chats">
                <div className="mt-4 space-y-1">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedChatId === chat.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            onClick={() => onSelectChat(chat.id, { id: chat.otherUserId, name: chat.otherUserName, avatar: chat.otherUserAvatar })}
                        >
                            <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={chat.otherUserAvatar} alt={chat.otherUserName} />
                                <AvatarFallback>{chat.otherUserName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold truncate">{chat.otherUserName}</p>
                                    <p className="text-xs text-muted-foreground">{formatTimestamp(chat.timestamp)}</p>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="archived">
                 <div className="text-center text-muted-foreground p-8">
                    <p>You have no archived conversations.</p>
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
};

export default ChatList;
