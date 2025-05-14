
// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "@/hooks/use-toast";

// Firebase configuration
// NOTE: You need to replace these with your actual Firebase configuration values
// from your Firebase console: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "AIzaSyDdefault_demo_key_replace_this",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};

// Initialize Firebase only once - use a singleton pattern
let app;
try {
  // Check if Firebase is already initialized
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export const auth = getAuth(app);

// Provider instances
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
const appleProvider = new OAuthProvider('apple.com');
const linkedInProvider = new OAuthProvider('linkedin.com');

// Email/Password Authentication
export const registerWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    toast({
      title: "Registration successful!",
      description: "Welcome to Hamfounder. You can now log in.",
    });
    return userCredential.user;
  } catch (error: any) {
    let errorMessage = "Error creating account. Please try again.";
    
    // More descriptive error messages
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "This email is already registered.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Please enter a valid email address.";
    } else if (error.code === 'auth/weak-password') {
      errorMessage = "Password must be at least 8 characters long.";
    }
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
    throw error;
  }
};

// Social Login Functions with improved error handling
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Google login error:", error);
    let errorMessage = "Failed to sign in with Google. Please try again.";
    
    // Specific error messages based on Firebase error codes
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = "Sign-in popup was closed before completing the sign-in process.";
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = "Multiple popup requests were triggered. Please try again.";
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = "This domain isn't authorized for OAuth operations. Please contact support.";
    }
    
    toast({
      title: "Google Sign-in Error",
      description: errorMessage,
      variant: "destructive",
    });
    throw error;
  }
};

export const signInWithApple = async () => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Apple login error:", error);
    let errorMessage = "Failed to sign in with Apple. Please try again.";
    
    // Specific error messages based on Firebase error codes
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = "Sign-in popup was closed before completing the sign-in process.";
    } else if (error.code === 'auth/provider-already-linked') {
      errorMessage = "This Apple account is already linked to another user.";
    }
    
    toast({
      title: "Apple Sign-in Error",
      description: errorMessage,
      variant: "destructive",
    });
    throw error;
  }
};

export const signInWithLinkedIn = async () => {
  try {
    // Note: LinkedIn login requires additional setup in the Firebase console
    const result = await signInWithPopup(auth, linkedInProvider);
    return result.user;
  } catch (error: any) {
    console.error("LinkedIn login error:", error);
    let errorMessage = "Failed to sign in with LinkedIn. Please try again.";
    
    // Specific error messages based on Firebase error codes
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = "Sign-in popup was closed before completing the sign-in process.";
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = "LinkedIn sign-in is not enabled in Firebase. Please contact support.";
    }
    
    toast({
      title: "LinkedIn Sign-in Error",
      description: errorMessage,
      variant: "destructive",
    });
    throw error;
  }
};
