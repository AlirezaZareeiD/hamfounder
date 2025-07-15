import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, Settings, Search, Bell, LogOut, Edit, Home } from 'lucide-react'; // آیکون Edit و Home اضافه شد
import { Link, useNavigate } from 'react-router-dom'; // فرض بر استفاده از react-router-dom برای مسیریابی

interface DashboardHamburgerMenuProps {
  userEmail: string;
  onSignOut: () => void; // تابع خروج از سیستم برای استفاده در دکمه Sign Out
  userProfileImage?: string; // اگر تصویر پروفایل هم داشته باشیم
}

export const DashboardHamburgerMenu: React.FC<DashboardHamburgerMenuProps> = ({ userEmail, onSignOut, userProfileImage }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false); // بستن منو پس از کلیک روی یکی از گزینه‌ها
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* آیکون همبرگری برای باز کردن منو */}
      <SheetTrigger asChild>
        {/* کلاس sm:hidden حذف شد تا در دسکتاپ نیز نمایش داده شود */}
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      {/* محتوای پنل کناری */}
      <SheetContent side="right" className="w-64 sm:w-72 flex flex-col"> {/* استفاده از flex flex-col برای چیدمان عمودی */}
        <SheetHeader>
          {/* بخش تصویر پروفایل و ایمیل */}
          <div className="flex flex-col items-center border-b pb-4 mb-4">
            {/* کادر دایره‌ای برای تصویر پروفایل */}
            <div className="relative w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl font-bold mb-2 overflow-hidden"> {/* اضافه کردن overflow-hidden */}
              {userProfileImage ? (
                <img src={userProfileImage} alt="Profile" className="object-cover w-full h-full" /> // نمایش تصویر پروفایل اگر وجود داشته باشد
              ) : (
                userEmail ? userEmail.charAt(0).toUpperCase() : '?' // نمایش حرف اول ایمیل اگر تصویر پروفایل نباشد
              )}
              {/* آیکون مداد برای ویرایش تصویر - روی تصویر یا Placeholder قرار می‌گیرد */}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow cursor-pointer" onClick={() => { navigate('/dashboard/edit-profile'); handleLinkClick(); }}>
                <Edit className="h-4 w-4 text-gray-600" /> {/* آیکون Edit */}
              </div>
            </div>

            {/* نمایش ایمیل کاربر با اندازه فونت کوچکتر و مدیریت overflow */}
            <SheetTitle className="text-base font-semibold text-gray-800 text-center w-full overflow-hidden text-ellipsis whitespace-nowrap"> {/* اندازه فونت کوچکتر، وسط چین، مدیریت overflow */}
              {userEmail}
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* گزینه‌های منو */}
        <nav className="flex flex-col space-y-2 flex-grow"> {/* flex-grow برای اشغال فضای باقی‌مانده */}
          {/* Dashboard Home Link */}
          <Link to="/dashboard" onClick={handleLinkClick} className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <Home className="h-5 w-5 mr-3 text-gray-600" /> {/* می‌توانید از آیکون خانه استفاده کنید */}
            Your Dashboard
 </Link>
          <Link to="/dashboard/edit-profile" onClick={handleLinkClick} className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <User className="h-5 w-5 mr-3 text-gray-600" />
            Edit Profile
          </Link>
          <Link to="/dashboard/find-cofounder" onClick={handleLinkClick} className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <Search className="h-5 w-5 mr-3 text-gray-600" />
            Find Co-founder
          </Link>
          {/* خطای نحوی در className اینجا اصلاح شد */}
          <Link to="/dashboard/notifications" onClick={handleLinkClick} className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <Bell className="h-5 w-5 mr-3 text-gray-600" />
            Notifications
          </Link>
        </nav>

        {/* گزینه Sign Out در پایین پنل */}
        <div className="mt-auto border-t pt-4"> {/* mt-auto و border-t و pt-4 برای چسباندن به پایین و ایجاد فاصله */}
          <Button variant="ghost" onClick={() => { onSignOut(); handleLinkClick(); }} className="flex items-center p-2 rounded-md hover:bg-red-100 text-red-600 w-full justify-start">
             <LogOut className="h-5 w-5 mr-3" />
             Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
