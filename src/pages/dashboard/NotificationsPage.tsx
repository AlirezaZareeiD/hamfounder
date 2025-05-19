import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout'; // فرض بر استفاده از یک لایه‌بندی داشبورد

const NotificationsPage: React.FC = () => {
  return (
    <DashboardLayout> {/* استفاده از لایه‌بندی داشبورد */}
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Notifications</h1>
        <p className="text-gray-700">This function is under development and will be active soon.</p>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
