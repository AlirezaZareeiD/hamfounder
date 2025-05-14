
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { SignUpSocialButtons } from "@/components/SignUpSocialButtons";
import { SimpleFooter } from "@/components/signup/SimpleFooter";

// Define form validation schema
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // Redirection is handled by the auth state observer
    } catch (error: any) {
      let errorMessage = "Failed to log in. Please check your credentials.";
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "User not found. Please check your email address.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Wrong password. Please try again.";
      }
      
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
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
        <div className="container max-w-md mx-auto">
          <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 border border-slate-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Log in to your Account</h2>
              <p className="text-slate-600 mt-2">Welcome back to Hamfounder</p>
            </div>

            {/* Social Login Buttons */}
            <SignUpSocialButtons />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-slate-500">or continue with</span>
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
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          className="h-12"
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
                      <div className="flex justify-between">
                        <FormLabel htmlFor="password" className="text-slate-700">
                          Password
                        </FormLabel>
                        <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-800">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <FormControl>
                          <Input
                            id="password"
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="h-12 pr-10"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          onClick={togglePasswordVisibility}
                          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                        >
                          {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : "Log in"}
                </Button>
              </form>
            </Form>

            {/* Don't have an account */}
            <div className="mt-6 text-center">
              <span className="text-slate-600">Don't have an account?</span>{" "}
              <Link to="/signup" className="text-purple-600 hover:text-purple-800 font-medium">
                Create an Account
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex items-center justify-center mt-8 text-sm text-slate-500">
              <svg
                className="h-4 w-4 mr-1"
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
              Secure, encrypted connection
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <SimpleFooter />
    </div>
  );
};

export default Login;
