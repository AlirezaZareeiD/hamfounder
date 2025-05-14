
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignUpSocialButtons } from "@/components/SignUpSocialButtons";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { Logo } from "@/components/Logo";

// Define the form validation schema
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number.",
    })
});

interface SignUpFormData {
  email: string;
  password: string;
}

const SignUp = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    
    try {
      // In a real application, this would send the data to your authentication service
      console.log("Form submitted:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Account created!",
        description: "Welcome to Hamfounder. You can now log in.",
      });
      
      // In a real app, you'd redirect to login or dashboard
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem creating your account. Please try again.",
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
                  <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
                  <p className="text-slate-600 mt-2">Join the community today</p>
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
                          <FormLabel htmlFor="password" className="text-slate-700">
                            Password
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                id="password"
                                type={isPasswordVisible ? "text" : "password"}
                                placeholder="Create a strong password"
                                autoComplete="new-password"
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
                          
                          {/* Password requirements */}
                          <div className="text-xs text-slate-500 mt-2">
                            Must be at least 8 characters with uppercase, lowercase and numbers.
                          </div>
                          
                          {/* Password strength meter */}
                          {field.value && <PasswordStrengthMeter password={field.value} />}
                          
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
                      {isSubmitting ? "Creating account..." : "Create Account"}
                    </Button>

                    {/* Terms and Privacy */}
                    <div className="text-center text-sm text-slate-600 mt-4">
                      By clicking "Create Account", you agree to Hamfounder's{" "}
                      <Link to="/terms" className="text-purple-600 hover:text-purple-800 font-medium">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-purple-600 hover:text-purple-800 font-medium">
                        Privacy Policy
                      </Link>
                      .
                    </div>
                  </form>
                </Form>

                {/* Already have an account */}
                <div className="mt-6 text-center">
                  <span className="text-slate-600">Already have an account?</span>{" "}
                  <Link to="/" className="text-purple-600 hover:text-purple-800 font-medium">
                    Log in
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
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 mt-auto">
        <div className="container max-w-7xl mx-auto text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Hamfounder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SignUp;
