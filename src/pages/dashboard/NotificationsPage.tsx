import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ConnectionRequests from '@/components/dashboard/ConnectionRequests';

const NotificationsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        <ConnectionRequests />
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;