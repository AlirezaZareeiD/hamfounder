
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useQuery } from '@tanstack/react-query';
import UserReportTable from './UserReportTable'; // Corrected: Default import
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog'; // Import Dialog for context

// Updated interface to include all fields from the backend
interface UserReportItem {
  uid: string;
  email: string;
  isProfileComplete: boolean;
  profileCompletionPercentage: number;
  projectCount: number;
  lastSignInTime: string;
  profileData: any; 
}

// Set up the callable function
const functions = getFunctions();
const getUserReportCallable = httpsCallable<unknown, UserReportItem[]>(functions, 'getUserReport');

const fetchUserReport = async (): Promise<UserReportItem[]> => {
  try {
    const result = await getUserReportCallable();
    return result.data;
  } catch (error: any) {
    console.error("Error fetching user report:", error);
    // Propagate a more informative error message
    throw new Error(error.message || 'An unknown error occurred.');
  }
};

const BIDashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery<UserReportItem[], Error>({ 
    queryKey: ['userReport'], 
    queryFn: fetchUserReport,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span className="text-xl font-medium">Loading User Report...</span>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Loading Report</AlertTitle>
          <AlertDescription>
            There was a problem fetching the user report. Please try again later.
            <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-xs">
              {error.message}
            </pre>
          </AlertDescription>
        </Alert>
      );
    }

    // Corrected: Pass only the 'data' prop
    return <UserReportTable data={data || []} />;
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">BI Dashboard</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">User activity and registration insights.</p>
        </header>

        <section>
          <h2 className="text-2xl font-semibold mb-4">User Registration Report</h2>
          {/* Wrap the content in the Dialog component to provide context for Trigger and Content */}
          <Dialog>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
              {renderContent()}
            </div>
          </Dialog>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default BIDashboard;
