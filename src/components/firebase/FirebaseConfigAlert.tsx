
import React, { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FirebaseSetupDialog } from "./FirebaseSetupDialog";

export const FirebaseConfigAlert = () => {
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // Check if we're using default Firebase config
  const isUsingDefaultConfig = () => {
    // This is a simple check to see if we're using the default config
    // In a real app, you might want to check this server-side or in a more robust way
    return typeof window !== "undefined" && 
           window.location.hostname !== "your-project-id.firebaseapp.com" && 
           window.location.hostname !== "your-project-id.web.app";
  };

  if (!isUsingDefaultConfig()) {
    return null;
  }

  return (
    <>
      <Alert className="mb-4 border-amber-200 bg-amber-50">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-800 flex items-center justify-between">
          <span>Firebase authentication is not fully configured. Social logins may not work properly.</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2 border-amber-200 text-amber-800 hover:bg-amber-100"
            onClick={() => setShowSetupGuide(true)}
          >
            View Setup Guide
          </Button>
        </AlertDescription>
      </Alert>
      
      <FirebaseSetupDialog 
        open={showSetupGuide} 
        onOpenChange={setShowSetupGuide} 
      />
    </>
  );
};
