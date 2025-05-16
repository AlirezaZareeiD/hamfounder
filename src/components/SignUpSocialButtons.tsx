import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { signInWithGoogle, signInWithGitHub, signInWithLinkedInPlaceholder } from "@/lib/firebase";
import { useState } from "react";

export const SignUpSocialButtons = () => {
  const [isLoading, setIsLoading] = useState<{
    google: boolean;
    github: boolean;
    apple: boolean;
    linkedin: boolean;
  }>({
    google: false,
    github: false,
    apple: false,
    linkedin: false
  });

  const handleSocialLogin = async (provider: string) => {
    try {
      setIsLoading(prev => ({ ...prev, [provider.toLowerCase()]: true }));

      if (provider === "Apple") {
        toast({
          title: "Feature coming soon",
          description:
            "We're currently in the MVP development phase, and this feature will be available soon. In the meantime, you can log in with your Google account or create a new profile using your email.\nThank you for your patience!",
        });
        return;
      }

      if (provider === "LinkedIn") {
        toast({
          title: "Feature coming soon",
          description:
            "We're currently in the MVP development phase, and this feature will be available soon. In the meantime, you can log in with your Google account or create a new profile using your email.\nThank you for your patience!",
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
          return; // Exit for unsupported providers
      }

      // Only show success toast for providers that actually perform login
      toast({
        title: "Success",
        description: `Successfully signed in with ${provider}.`
      });

    } catch (error: any) {
      console.error(`${provider} login error:`, error);

      let errorMessage = `Failed to sign in with ${provider}. Please try again.`;

      // More specific error handling for Firebase auth errors
      if (error.code) {
          switch (error.code) {
              case 'auth/cancelled-popup-request':
              case 'auth/popup-closed-by-user':
                  errorMessage = `Sign in with ${provider} was cancelled.`;
                  break;
              // You might need to inspect the exact error code when the provider is not configured
              // For example, it could be 'auth/unauthorized-domain' or similar if domain is not added in Firebase
              // For now, a generic failed message will cover this.
              default:
                  errorMessage = error.message || errorMessage; // Use error message if available
                  break;
          }
      }


      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [provider.toLowerCase()]: false }));
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {/* Google Button */}
      <Button
        type="button"
        variant="outline"
        className="h-12 border-slate-200 hover:bg-slate-50 text-slate-800 relative flex items-center justify-center"
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
        className="h-12 border-slate-200 hover:bg-slate-50 text-slate-800 relative flex items-center justify-center"
        onClick={() => handleSocialLogin("GitHub")}
        disabled={isLoading.github}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
          <path
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.542-1.36-1.32-1.725-1.32-1.725-1.087-.731.084-.716.084-.716 1.205.086 1.838 1.238 1.838 1.238 1.07 1.835 2.804 1.305 3.49.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1-.322 3.3-.123 1-.33 2.07-.5 3.17-.552 1.1.052 2.17.22 3.17.552 2.3-.2 3.3.123 3.3.123.645 1.653.24 2.873.105 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z"
            fill="currentColor" // Using currentColor to match button text color
          />
        </svg>
        {isLoading.github ? "Signing in..." : "Sign in with GitHub"}
      </Button>

      {/* Apple Button */}
      <Button
        type="button"
        variant="outline"
        className="h-12 border-slate-200 hover:bg-slate-50 text-slate-800 relative flex items-center justify-center"
        onClick={() => handleSocialLogin("Apple")}
        disabled={isLoading.apple}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
          <path
            d="M16.7152 0C15.3352 0.12 13.7952 1.12 12.9552 2.4C12.1952 3.56 11.6352 5.12 11.9152 6.64C13.4352 6.68 15.0352 5.64 15.8352 4.36C16.6352 3.08 17.1152 1.52 16.7152 0ZM16.6752 6.8401C14.5152 6.8401 13.6752 8.0801 12.2752 8.0801C10.8352 8.0801 9.6752 6.8801 7.8352 6.8801C5.9952 6.8801 4.0752 8.0001 2.9552 9.9201C1.2752 12.9201 2.5152 17.8001 4.1552 20.4001C4.9552 21.6801 5.9952 23.1201 7.3552 23.0801C8.6352 23.0401 9.1152 22.2401 10.6752 22.2401C12.2352 22.2401 12.6752 23.0801 14.0352 23.0401C15.4352 23.0001 16.3552 21.7201 17.1552 20.4401C17.7952 19.4401 18.2352 18.4001 18.4752 17.2801C16.2352 16.2801 15.6752 13.1201 17.8752 11.6801C17.0752 10.0401 16.0352 9.1201 14.5552 8.7601"
            fill="currentColor"
          />
        </svg>
        {isLoading.apple ? "Signing in..." : "Sign in with Apple"}
      </Button>

      {/* LinkedIn Button */}
      <Button
        type="button"
        variant="outline"
        className="h-12 border-slate-200 hover:bg-slate-50 text-slate-800 relative flex items-center justify-center"
        onClick={() => handleSocialLogin("LinkedIn")}
        disabled={isLoading.linkedin}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
          <path
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
            fill="#0077B5"
          />
        </svg>
        {isLoading.linkedin ? "Signing in..." : "Sign in with LinkedIn"}
      </Button>
    </div>
  );
};