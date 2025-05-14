
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignUpSocialButtons } from "@/components/SignUpSocialButtons";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { Logo } from "@/components/Logo";
import { registerWithEmailPassword, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Define the form validation schema
const formSchema = z.object({
  email: z.string().email({
    message: "لطفاً یک آدرس ایمیل معتبر وارد کنید.",
  }),
  password: z
    .string()
    .min(8, {
      message: "رمز عبور باید حداقل ۸ کاراکتر باشد.",
    })
    .regex(/[A-Z]/, {
      message: "رمز عبور باید حداقل یک حرف بزرگ داشته باشد.",
    })
    .regex(/[a-z]/, {
      message: "رمز عبور باید حداقل یک حرف کوچک داشته باشد.",
    })
    .regex(/[0-9]/, {
      message: "رمز عبور باید حداقل یک عدد داشته باشد.",
    })
});

interface SignUpFormData {
  email: string;
  password: string;
}

const SignUp = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to dashboard
        navigate('/dashboard');
      }
    });

    // Clean up subscription
    return () => unsubscribe();
  }, [navigate]);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: SignUpFormData) => {
    if (!termsAccepted) {
      toast({
        title: "خطا",
        description: "لطفاً با شرایط خدمات و سیاست حریم خصوصی موافقت کنید.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await registerWithEmailPassword(data.email, data.password);
      // افزودن به گزارش کاربران جدید - در یک محیط واقعی، این اطلاعات در بک‌اند ذخیره می‌شود
      console.log("User consent logged:", {
        email: data.email,
        termsAccepted: true,
        timestamp: new Date().toISOString()
      });
      
      // رفتار پیشفرض این است که دسترسی سپس به سمت Dashboard هدایت می‌شود
      // این در useEffect بالا برای AuthStateChanged انجام می‌شود
    } catch (error) {
      console.error("Signup error:", error);
      // خطاها در تابع registerWithEmailPassword مدیریت می‌شوند
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50/50 flex flex-col">
      {/* Header with Logo */}
      <header className="py-6 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          <Logo />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Value Proposition */}
            <div className="order-2 lg:order-1">
              <div className="max-w-xl mx-auto lg:mx-0 space-y-6 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                  Connect with Iranian Innovators Worldwide
                </h1>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Join Hamfounder's global network of founders, professionals, and investors building the future of Iranian entrepreneurship. Access exclusive resources, connect with peers, and discover new opportunities.
                </p>
                <div className="hidden lg:block">
                  <div className="flex items-center justify-center lg:justify-start space-x-4 pt-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-purple-${300 + i*100} to-blue-${400 + i*100}`}></div>
                      ))}
                    </div>
                    <p className="font-medium text-slate-700">Join 5,000+ members</p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mt-8 border border-slate-100">
                    <p className="text-slate-700 italic">
                      "Hamfounder has connected me with Iranian founders globally, opening doors to partnerships I never thought possible. The network is invaluable."
                    </p>
                    <div className="mt-4 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
                      <div className="ml-3">
                        <p className="font-medium text-slate-900">Sara Rahmani</p>
                        <p className="text-sm text-slate-500">Founder, TechBridge</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sign-up Form */}
            <div className="order-1 lg:order-2">
              <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-md mx-auto lg:mx-0 lg:ml-auto border border-slate-100">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">ایجاد حساب کاربری</h2>
                  <p className="text-slate-600 mt-2">به جامعه ما بپیوندید</p>
                </div>

                {/* Social Login Buttons */}
                <SignUpSocialButtons />

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-slate-500">یا ادامه با</span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="email" className="text-slate-700">
                            آدرس ایمیل
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              autoComplete="email"
                              className="h-12 ltr"
                              dir="ltr"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="password" className="text-slate-700">
                            رمز عبور
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                id="password"
                                type={isPasswordVisible ? "text" : "password"}
                                placeholder="یک رمز عبور قوی ایجاد کنید"
                                autoComplete="new-password"
                                className="h-12 pr-10 ltr"
                                dir="ltr"
                                {...field}
                              />
                            </FormControl>
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                              onClick={togglePasswordVisibility}
                              aria-label={isPasswordVisible ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
                            >
                              {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                          
                          {/* Password requirements */}
                          <div className="text-xs text-slate-500 mt-2">
                            باید حداقل ۸ کاراکتر با حروف بزرگ، کوچک و اعداد باشد.
                          </div>
                          
                          {/* Password strength meter */}
                          {field.value && <PasswordStrengthMeter password={field.value} />}
                          
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Terms and Conditions Checkbox */}
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 border border-slate-300 rounded bg-slate-50 focus:ring-3 focus:ring-primary"
                          checked={termsAccepted}
                          onChange={() => setTermsAccepted(!termsAccepted)}
                          required
                        />
                      </div>
                      <div className="mr-3 text-sm">
                        <label htmlFor="terms" className="text-slate-600">
                          با کلیک روی "ایجاد حساب کاربری"، با{" "}
                          <Link to="/terms" className="text-purple-600 hover:text-purple-800 font-medium">
                            شرایط خدمات
                          </Link>{" "}
                          و{" "}
                          <Link to="/privacy" className="text-purple-600 hover:text-purple-800 font-medium">
                            سیاست حریم خصوصی
                          </Link>{" "}
                          هم‌فاندر موافقت می‌کنم.
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          در حال ایجاد حساب...
                        </>
                      ) : "ایجاد حساب کاربری"}
                    </Button>
                  </form>
                </Form>

                {/* Already have an account */}
                <div className="mt-6 text-center">
                  <span className="text-slate-600">قبلاً حساب کاربری دارید؟</span>{" "}
                  <Link to="/" className="text-purple-600 hover:text-purple-800 font-medium">
                    ورود
                  </Link>
                </div>

                {/* Trust signals */}
                <div className="flex items-center justify-center mt-8 text-sm text-slate-500">
                  <svg
                    className="h-4 w-4 ml-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  اتصال امن و رمزنگاری‌شده
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 mt-auto">
        <div className="container max-w-7xl mx-auto text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} هم‌فاندر. تمام حقوق محفوظ است.</p>
        </div>
      </footer>
    </div>
  );
};

export default SignUp;
