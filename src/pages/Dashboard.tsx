
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    // اگر کاربر وارد نشده باشد، به صفحه ورود هدایت شود
    if (!user) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "خروج موفق",
        description: "شما با موفقیت از حساب کاربری خود خارج شدید.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "خطا در خروج",
        description: "مشکلی در خروج از حساب کاربری رخ داده است. لطفا دوباره تلاش کنید.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return null; // صفحه بارگذاری یا در حال انتقال
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center space-x-4">
            <span className="text-slate-700">
              {user.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>خروج</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">داشبورد هم‌فاندر</h1>
            <p className="text-slate-600">
              خوش آمدید! این صفحه داشبورد شماست. در نسخه نهایی، اینجا می‌توانید اطلاعات پروفایل خود را تکمیل کنید و به شبکه نوآوران ایرانی در سراسر جهان متصل شوید.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
