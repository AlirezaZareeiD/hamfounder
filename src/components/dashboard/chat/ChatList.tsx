import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';


interface ChatListItem {
  id: string; // The chat document ID
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
  lastMessage: string;
}


interface ChatListProps {
  onSelectChat: (chatId: string, otherUser: { id: string; name: string; avatar: string }) => void;
}


const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const [user] = useAuthState(auth);
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!user) return;


    setLoading(true);
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
            lastMessage: chatData.lastMessage || '...'
          };
        })
      );


      setChats(chatListData.filter(Boolean) as ChatListItem[]);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching chat list: ", error);
      setLoading(false);
    });


    return () => unsubscribe();
  }, [user]);


  if (loading) {
    return <div className="flex justify-center items-center py-8"><Loader2 className="animate-spin" /></div>;
  }


  return (
    <div className="h-full overflow-y-auto border-r">
        <h2 className="text-xl font-semibold p-4 border-b">Messages</h2>
        <div className="space-y-2 p-2">
            {chats.length > 0 ? chats.map((chat) => (
                <Card
                    key={chat.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onSelectChat(chat.id, { id: chat.otherUserId, name: chat.otherUserName, avatar: chat.otherUserAvatar })}
                >
                    <CardContent className="p-3 flex items-center space-x-3">
                        <Avatar>
                            <AvatarImage src={chat.otherUserAvatar} alt={chat.otherUserName} />
                            <AvatarFallback>{chat.otherUserName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{chat.otherUserName}</p>
                            <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                        </div>
                    </CardContent>
                </Card>
            )) : (
                <div className="text-center text-muted-foreground p-8">
                    <p>You have no active conversations.</p>
                </div>
            )}
        </div>
    </div>
  );
};


export default ChatList;