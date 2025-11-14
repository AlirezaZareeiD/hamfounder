import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ChatInterface from '@/components/dashboard/chat/ChatInterface';

const MessagesPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Messages</h1>
        <ChatInterface />
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
