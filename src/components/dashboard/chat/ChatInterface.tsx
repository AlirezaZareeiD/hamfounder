import React, { useState } from 'react';
import ChatList from '@/components/dashboard/chat/ChatList';
import ChatWindow from '@/components/dashboard/chat/ChatWindow';
import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface SelectedChat {
  chatId: string;
  otherUser: {
    id: string;
    name: string;
    avatar: string;
  };
}

const ChatInterface: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);

  const handleSelectChat = (chatId: string, otherUser: { id: string; name: string; avatar: string }) => {
    setSelectedChat({ chatId, otherUser });
  };

  return (
    <Card className="h-[600px] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      <div className="col-span-1 md:col-span-1 lg:col-span-1 h-full overflow-y-auto border-r">
        <ChatList onSelectChat={handleSelectChat} />
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-3 h-full border-l">
        {selectedChat ? (
          <ChatWindow
            chatId={selectedChat.chatId}
            otherUser={selectedChat.otherUser}
          />
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-4" />
            <h2 className="text-xl font-semibold">Select a conversation</h2>
            <p>Choose one of your connections to start chatting.</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ChatInterface;
