// This file's content has been commented out as per user request to hide the firebase configuration alert on the sign-up page.

// import React, { useState } from "react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { AlertTriangle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { FirebaseSetupDialog } from "./FirebaseSetupDialog";

export const FirebaseConfigAlert = () => {
    //   const [showSetupGuide, setShowSetupGuide] = useState(false);
  
    //   // Check if we're using default Firebase config
    //   const isUsingDefaultConfig = () => {
    //     // Replace with your actual check for default config
    //     // This is a placeholder check
    //     return (
    //       !import.meta.env.VITE_FIREBASE_API_KEY ||
    //       import.meta.env.VITE_FIREBASE_API_KEY === "YOUR_FIREBASE_API_KEY"
    //     );
    //   };
  
    //   if (!isUsingDefaultConfig()) {
    //     return null; // Don't show the alert if not using default config
    //   }
  
    //   return (
    //     <>
    //       <Alert variant="warning" className="mb-6">
    //         <AlertTriangle className="h-4 w-4" />
    //         <AlertDescription className="flex items-center justify-between">
    //           <span>
    //             Firebase authentication is not fully configured. Social logins may
    //             not work properly.
    //           </span>
    //           <Button
    //             variant="outline"
    //             size="sm"
    //             onClick={() => setShowSetupGuide(true)}
    //           >
    //             View Setup Guide
    //           </Button>
    //         </AlertDescription>
    //       </Alert>
  
    //       <FirebaseSetupDialog
    //         isOpen={showSetupGuide}
    //         onClose={() => setShowSetupGuide(false)}
    //       />
    //     </>
    //   );
  };
  
  // Export statement is now uncommented
  // export default FirebaseConfigAlert; // If you were using default export
  