// Firebase configuration
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  OAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  Auth,
  User
} from "firebase/auth";
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

// Set persistence to LOCAL to keep the user logged in across browser sessions
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting authentication persistence:", error);
  });

// Provider instances with security enhancements
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

const appleProvider = new OAuthProvider('apple.com');
// Require user to consent to scopes each time (Apple recommended practice)
appleProvider.addScope('email');
appleProvider.addScope('name');

const linkedInProvider = new OAuthProvider('linkedin.com');
// Request only necessary scopes
linkedInProvider.addScope('r_emailaddress');
linkedInProvider.addScope('r_liteprofile');

// Helper function to sanitize input and prevent XSS
const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/[<>&"'`=]/g, '') // Remove potentially dangerous characters
    .trim();
};

// Email/Password Authentication with enhanced security
export const registerWithEmailPassword = async (email: string, password: string) => {
  try {
    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    
    if (sanitizedEmail !== email) {
      throw new Error("Invalid characters in email detected");
    }
    
    // Additional validation
    if (password.length < 8) {
      toast({
        title: "Password Too Weak",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      throw new Error("Password too weak");
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, sanitizedEmail, password);
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
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = "Network error. Please check your internet connection.";
    }
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
    
    // Log for monitoring but don't expose sensitive details
    console.error("Registration error:", error.code);
    throw error;
  }
};

// Enhanced sign-in with email/password
export const signInWithEmailPassword = async (email: string, password: string) => {
  try {
    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    
    if (sanitizedEmail !== email) {
      throw new Error("Invalid characters in email detected");
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail, password);
    return userCredential.user;
  } catch (error: any) {
    let errorMessage = "Failed to sign in. Please check your credentials.";
    
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMessage = "Invalid email or password.";
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = "Too many failed login attempts. Please try again later.";
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = "This account has been disabled. Please contact support.";
    }
    
    toast({
      title: "Login Error",
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
    console.error("Google login error code:", error.code);
    let errorMessage = "Failed to sign in with Google. Please try again.";
    
    // Specific error messages based on Firebase error codes
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = "Sign-in popup was closed before completing the sign-in process.";
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = "Multiple popup requests were triggered. Please try again.";
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = "This domain isn't authorized for OAuth operations. Please contact support.";
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = "An account already exists with the same email address but different sign-in credentials.";
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
    console.error("Apple login error code:", error.code);
    let errorMessage = "Failed to sign in with Apple. Please try again.";
    
    // Specific error messages based on Firebase error codes
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = "Sign-in popup was closed before completing the sign-in process.";
    } else if (error.code === 'auth/provider-already-linked') {
      errorMessage = "This Apple account is already linked to another user.";
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = "The credential is malformed or has expired.";
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
    console.error("LinkedIn login error code:", error.code);
    let errorMessage = "Failed to sign in with LinkedIn. Please try again.";
    
    // Specific error messages based on Firebase error codes
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = "Sign-in popup was closed before completing the sign-in process.";
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = "LinkedIn sign-in is not enabled in Firebase. Please contact support.";
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = "An account already exists with the same email address but different sign-in credentials.";
    }
    
    toast({
      title: "LinkedIn Sign-in Error",
      description: errorMessage,
      variant: "destructive",
    });
    throw error;
  }
};

// Helper function to check if a user is authenticated
export const isUserAuthenticated = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
};

// Security enhanced listener for auth state changes
export const onAuthChange = (callback: (user: User | null) => void): () => void => {
  return onAuthStateChanged(auth, (user) => {
    // Call the callback with the user object
    callback(user);
  });
};

// Export additional sign-out function
export const signOutUser = async () => {
  try {
    await auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    return true;
  } catch (error) {
    console.error("Sign out error:", error);
    toast({
      title: "Error",
      description: "Failed to sign out. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};
