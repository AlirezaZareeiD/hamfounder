import React, { useEffect, useState, useRef } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
}

interface ChatWindowProps {
  chatId: string;
  otherUser: { id: string; name: string; avatar: string };
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, otherUser }) => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

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
    }, (error) => {
        console.error("Error fetching messages: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

    const text = newMessage;
    setNewMessage('');

    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text,
      senderId: user.uid,
      createdAt: serverTimestamp()
    });
  };

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="border-b flex-shrink-0">
        <div className="flex items-center space-x-3">
            <Avatar>
                <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{otherUser.name}</p>
                {/* Optional: Add online status here */}
            </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex items-end space-x-2 ${msg.senderId === user?.uid ? 'justify-end' : ''}`}>
                <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.senderId === user?.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p>{msg.text}</p>
                </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-4 border-t flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </div>
  );
};

export default ChatWindow;
