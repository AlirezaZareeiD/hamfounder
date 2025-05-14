
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignUpSocialButtons } from "@/components/SignUpSocialButtons";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { registerWithEmailPassword } from "@/lib/firebase";

// Define the form validation schema
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long.",
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

interface SignupFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

export const SignupForm = ({ isSubmitting, setIsSubmitting }: SignupFormProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

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
        title: "Error",
        description: "Please agree to the Terms of Service and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await registerWithEmailPassword(data.email, data.password);
      // Log new user consent - in a real environment, this data would be stored in the backend
      console.log("User consent logged:", {
        email: data.email,
        termsAccepted: true,
        timestamp: new Date().toISOString()
      });
      
      // Default behavior is to redirect to Dashboard after authentication
      // This is handled in the SignUp.tsx component
    } catch (error) {
      console.error("Signup error:", error);
      // Errors are handled in the registerWithEmailPassword function
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-md mx-auto lg:mx-0 lg:ml-auto border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
        <p className="text-slate-600 mt-2">Join our community</p>
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
                  Must be at least 8 characters with uppercase, lowercase letters, and numbers.
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
                className="w-4 h-4 border border-slate-300 rounded bg-slate-50 focus:ring-3 focus:ring-primary"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-slate-600">
                By clicking "Create Account", I agree to Hamfounder's{" "}
                <Link to="/terms" className="text-purple-600 hover:text-purple-800 font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-purple-600 hover:text-purple-800 font-medium">
                  Privacy Policy
                </Link>.
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
                Creating account...
              </>
            ) : "Create Account"}
          </Button>
        </form>
      </Form>

      {/* Already have an account */}
      <div className="mt-6 text-center">
        <span className="text-slate-600">Already have an account?</span>{" "}
        <Link to="/" className="text-purple-600 hover:text-purple-800 font-medium">
          Sign In
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
  );
};
