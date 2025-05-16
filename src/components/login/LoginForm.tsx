import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, signInWithGoogle, signInWithGitHub, signInWithLinkedInPlaceholder } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";


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

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState({
    emailPassword: false,
    google: false,
    github: false,
    linkedin: false,
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(prev => ({ ...prev, emailPassword: true }));

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // Redirection is handled by the auth state observer
    } catch (error: any) {
      let errorMessage = "Failed to log in. Please check your credentials.";

      if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "User not found. Please check your email address.";
      } else if (error.code === 'auth/wrong-password') { // Corrected: Removed unnecessary backslash
        errorMessage = "Wrong password. Please try again.";
      }

      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, emailPassword: false }));
    }
  };

  const handleSocialLogin = async (provider: string) => {
     setIsLoading(prev => ({ ...prev, [provider.toLowerCase()]: true }));

     try {
        if (provider === "Apple") {
             toast({
               title: "Feature coming soon",
               description:
                 "We're currently in the MVP development phase, and this feature will be available soon. In the meantime, you can log in with your Google account or create a new profile using your email.\\nThank you for your patience!",
             });
             return;
           }

       if (provider === "LinkedIn") {
         toast({
           title: "Feature coming soon",
           description:
             "We're currently in the MVP development phase, and this feature will be available soon. In the meantime, you can log in with your Google account or create a new profile using your email.\\nThank you for your patience!",
         });
         await signInWithLinkedInPlaceholder();
         return;
       }

       switch(provider) {
         case "Google":
           await signInWithGoogle();
           break;
         case "GitHub":
           await signInWithGitHub();
           break;
         default:
           toast({
             title: "Error",
             description: `Sign in with ${provider} is not supported.`,
           });
       }

       toast({
         title: "Success",
         description: `Successfully signed in with ${provider}.`
       });

     } catch (error: any) {
       console.error(`${provider} login error:`, error);
        toast({
          title: "Login Error",
          description: error.message || `Failed to log in with ${provider}. Please try again.`,
          variant: "destructive",
        });
     } finally {
       setIsLoading(prev => ({ ...prev, [provider.toLowerCase()]: false }));
     }
   };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
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

        {/* Submit Button (Email/Password) */}
        <Button
          type="submit"
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base"
          disabled={isLoading.emailPassword}
        >
          {isLoading.emailPassword ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : "Log in"}
        </Button>

        {/* Social Login Buttons Section */}
        <div className="relative">
           <div className="absolute inset-0 flex items-center">
             <span className="w-full border-t" />
           </div>
           <div className="relative flex justify-center text-xs uppercase">
             <span className="bg-background px-2 text-muted-foreground">
               Or continue with
             </span>
           </div>
         </div>


        {/* Google Button */}
        <Button
           type="button"
           variant="outline"
           className="w-full h-12 border-slate-200 hover:bg-slate-50 text-slate-800 relative flex items-center justify-center"
           onClick={() => handleSocialLogin("Google")}
           disabled={isLoading.google}
         >
           <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
             <path
               d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
               fill="#EA4335"
             />
             <path
               d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
               fill="#4285F4"
             />
             <path
               d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
               fill="#FBBC05"
             />
             <path
               d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.2754 17.385C3.2554 21.31 7.3104 24 12.0004 24Z"
               fill="#34A853"
             />
           </svg>
           {isLoading.google ? "Signing in..." : "Sign in with Google"}
         </Button>


        {/* GitHub Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 border-slate-200 hover:bg-slate-50 text-slate-800 relative flex items-center justify-center"
          onClick={() => handleSocialLogin("GitHub")}
          disabled={isLoading.github}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
             <path
               d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.542-1.36-1.32-1.725-1.32-1.725-1.087-.731.084-.716.084-.716 1.205.086 1.838 1.238 1.838 1.238 1.07 1.835 2.804 1.305 3.49.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1-.322 3.3-.123 1-.33 2.07-.5 3.17-.552 1.1.052 2.17.22 3.17.552 2.3-.2 3.3.123 3.3.123.645 1.653.24 2.873.105 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z"
               fill="currentColor"
             />
           </svg>
          {isLoading.github ? "Signing in..." : "Sign in with GitHub"}
        </Button>

        {/* LinkedIn Login Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 border-slate-200 hover:bg-slate-50 text-slate-800 relative flex items-center justify-center"
          onClick={() => handleSocialLogin("LinkedIn")}
          disabled={isLoading.linkedin}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
            <path
              d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
              fill="#0077B5"
            />
          </svg>
          {isLoading.linkedin ? "Signing in with LinkedIn..." : "Sign in with LinkedIn"}
        </Button>
      </form>
    </Form>
  );
};
