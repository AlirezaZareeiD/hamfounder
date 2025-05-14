
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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

// Social Login Functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Google login error:", error);
    toast({
      title: "Google Sign-in Error",
      description: "Failed to sign in with Google. Please try again.",
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
    toast({
      title: "Apple Sign-in Error",
      description: "Failed to sign in with Apple. Please try again.",
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
    toast({
      title: "LinkedIn Sign-in Error",
      description: "Failed to sign in with LinkedIn. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};
