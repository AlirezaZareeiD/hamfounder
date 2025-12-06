import React, { useEffect, useState, useRef } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2, Smile, ArrowRight } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: any; // Firestore timestamp
}

interface ChatWindowProps {
  chatId: string;
  otherUser: { id: string; name: string; avatar: string };
  onToggleSidebar: () => void;
}

// A simple date formatter for relative time
const formatRelativeTime = (timestamp: any) => {
    if (!timestamp) return '';
    const now = new Date();
    const date = timestamp.toDate();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, otherUser, onToggleSidebar }) => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;

    setLoading(true);
    const messagesQuery = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Message));
      setMessages(msgs);
      setLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, (error) => {
        console.error("Error fetching messages: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text: newMessage,
      senderId: user.uid,
      createdAt: serverTimestamp()
    });
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
            <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-lg">{otherUser.name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            <ArrowRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-gray-500" /></div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.senderId === user?.uid ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={msg.senderId === user?.uid ? user.photoURL! : otherUser.avatar} />
                <AvatarFallback>{msg.senderId === user?.uid ? 'Y' : otherUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className={`p-3 rounded-lg max-w-lg ${msg.senderId === user?.uid ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-800 rounded-bl-none'}`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.senderId === user?.uid ? 'text-blue-200' : 'text-gray-500'}`}>{formatRelativeTime(msg.createdAt)}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSendMessage} className="relative">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="pr-28 pl-10 h-12 rounded-full bg-gray-100 dark:bg-gray-800"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
            <Button type="button" variant="ghost" size="icon"><Smile className="h-5 w-5 text-gray-500" /></Button>
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
             <p className="text-xs text-gray-400 mr-2 hidden sm:block">Press Enter to send</p>
            <Button type="submit" size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white" disabled={!newMessage.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
