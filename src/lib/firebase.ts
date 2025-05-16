import { FirebaseApp, initializeApp } from "firebase/app";
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, Auth, getAuth, OAuthProvider } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTsycr4yok1M6iOGdfO98mr_cTOKhoLbY",
  authDomain: "hamfounder-demo-2025.firebaseapp.com",
  projectId: "hamfounder-demo-2025",
  storageBucket: "hamfounder-demo-2025.firebasestorage.app",
  messagingSenderId: "571868985684",
  appId: "1:571868985684:web:c13d8e1d736c66b08330c1"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// اضافه شده برای Sign-in با گوگل
const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

// اضافه شده برای Sign-in با اپل (اگر نیاز دارید و پیکربندی در Firebase انجام شده است)
// const appleProvider = new AppleAuthProvider();
// export const signInWithApple = () => {
//   return signInWithPopup(auth, appleProvider);
// };

// Added for Sign-in with GitHub
const githubProvider = new GithubAuthProvider();
export const signInWithGitHub = async () => {
  try {
    await signInWithPopup(auth, githubProvider);
  } catch (error) {
    console.error("GitHub login error:", error);
    // Handle errors (e.g., show a user-friendly message)
  }
};

// Placeholder for Sign-in with LinkedIn (Feature Coming Soon)
// const linkedinProvider = new OAuthProvider('oidc.linkedin-oidc');
// export const signInWithLinkedIn = () => {
//   return signInWithPopup(auth, linkedinProvider);
// };
export const signInWithLinkedInPlaceholder = () => {
  console.log("LinkedIn login feature coming soon.");
};
