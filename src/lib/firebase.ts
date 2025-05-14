
// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "@/hooks/use-toast";

// توجه: این کلیدها باید با کلیدهای واقعی شما جایگزین شوند
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Provider instances
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');
const linkedInProvider = new OAuthProvider('linkedin.com');

// Email/Password Authentication
export const registerWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    toast({
      title: "ثبت نام موفق!",
      description: "به هم‌فاندر خوش آمدید. اکنون می‌توانید وارد شوید.",
    });
    return userCredential.user;
  } catch (error: any) {
    let errorMessage = "خطا در ایجاد حساب کاربری. لطفاً دوباره تلاش کنید.";
    
    // ارائه پیام‌های خطای دقیق‌تر بدون افشای جزئیات فنی
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "این ایمیل قبلاً ثبت شده است.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "لطفاً یک ایمیل معتبر وارد کنید.";
    } else if (error.code === 'auth/weak-password') {
      errorMessage = "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    }
    
    toast({
      title: "خطا",
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
    toast({
      title: "خطا در ورود با گوگل",
      description: "ورود با گوگل با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
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
    toast({
      title: "خطا در ورود با اپل",
      description: "ورود با اپل با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
      variant: "destructive",
    });
    throw error;
  }
};

export const signInWithLinkedIn = async () => {
  try {
    // توجه: برای کارکرد LinkedIn نیاز به تنظیمات اضافی در کنسول Firebase دارید
    const result = await signInWithPopup(auth, linkedInProvider);
    return result.user;
  } catch (error: any) {
    toast({
      title: "خطا در ورود با لینکدین",
      description: "ورود با لینکدین با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
      variant: "destructive",
    });
    throw error;
  }
};
