import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { UserProvider } from "./contexts/UserProvider"; // Import UserProvider

// وارد کردن کامپوننت های داشبورد از فولدر جدید
import Dashboard from "./pages/dashboard/Dashboard";
import EditProfilePage from "./pages/dashboard/EditProfilePage"; // وارد کردن صفحه ویرایش پروفایل
import FindCofounderPage from "./pages/dashboard/FindCofounderPage"; // وارد کردن صفحه جستجوی کوفاندر
import NotificationsPage from "./pages/dashboard/NotificationsPage"; // وارد کردن صفحه نوتیفیکیشن ها
import ProjectDetailsPage from './components/dashboard/ProjectDetailsPage'; // Import ProjectDetailsPage

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          {/* مسیر اصلی داشبورد */} {/* Fix: Ensure Dashboard is a child of Routes */}
          {/* از کامپوننت Dashboard به عنوان یک Layout برای مسیرهای داخلی آن استفاده کنید */}
          {/* یا هر مسیر داخلی داشبورد را مستقیم در اینجا تعریف کنید */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* مسیر اصلی داشبورد */}

          {/* اضافه کردن مسیرهای جدید برای صفحات موقت داشبورد */}
          <Route path="/dashboard/edit-profile" element={<EditProfilePage />} />
          <Route path="/dashboard/find-cofounder" element={<FindCofounderPage />} />
          <Route path="/dashboard/notifications" element={<NotificationsPage />} />

          {/* مسیر جدید برای صفحه جزئیات پروژه - استفاده از :projectId به عنوان پارامتر دینامیک */}
          <Route path="/dashboard/projects/:projectId" element={<ProjectDetailsPage />} />

          {/* مسیر Catch-all برای صفحات یافت نشد */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;