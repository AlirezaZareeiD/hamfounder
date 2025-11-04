
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import PricingPage from "./pages/PricingPage";
import { UserProvider } from "./contexts/UserProvider";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CoFounderPrivateRepository from "./pages/AdminConsole/Co-FounderPrivateRepository";

// Dashboard components
import Dashboard from "./pages/dashboard/Dashboard";
import EditProfilePage from "./pages/dashboard/EditProfilePage";
import FindCofounderPage from "./pages/dashboard/find-cofounder/FindCofounderPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import MessagesPage from "./pages/dashboard/MessagesPage"; // Import the new MessagesPage
import PublicProjectsPage from "./pages/dashboard/user/PublicProjectsPage"; // Import the new PublicProjectsPage
import ProjectDetailsPage from './components/dashboard/ProjectDetailsPage';
import BIDashboard from "./pages/AdminConsole/BI-Dashboard";
import AdminRoute from "./components/auth/AdminRoute";
import WhitelistRoute from "./components/auth/WhitelistRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UserProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/pricing" element={<PricingPage />} />

            {/* Whitelisted Route */}
            <Route 
              path="/admin/co-founder-private-repository"
              element={
                <WhitelistRoute>
                  <CoFounderPrivateRepository />
                </WhitelistRoute>
              }
            />

            {/* Dashboard routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/edit-profile" element={<EditProfilePage />} />
            <Route path="/dashboard/find-cofounder" element={<FindCofounderPage />} />
            <Route path="/dashboard/notifications" element={<NotificationsPage />} />
            <Route path="/dashboard/messages" element={<MessagesPage />} /> {/* Add MessagesPage route */}
            <Route path="/dashboard/projects/:projectId" element={<ProjectDetailsPage />} />
            <Route path="/dashboard/user/:userId/projects" element={<PublicProjectsPage />} /> {/* Add PublicProjectsPage route */}
            
            {/* Admin route */}
            <Route
              path="/admin/bi-dashboard"
              element={
                <AdminRoute>
                  <BIDashboard />
                </AdminRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;
