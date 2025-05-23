import { FirebaseApp, initializeApp } from "firebase/app";
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, Auth, getAuth, OAuthProvider, User, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, StorageReference } from "firebase/storage";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check"; // Import App Check functions
import { getFirestore, Firestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTsycr4yok1M6iOGdfO98mr_cTOKhoLbY",
  authDomain: "hamfounder-demo-2025.firebaseapp.com",
  projectId: "hamfounder-demo-2025",
  storageBucket: "hamfounder-demo-2025.firebasestorage.app",
  messagingSenderId: "571868985684",
  appId: "1:571868985684:web:c13d8e1d736c66b08330c1"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize App Check
try {
  // Pass your debug token in the isActivated field in debug builds
  if (process.env.NODE_ENV === 'development') {
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = 'A66D714E-16E2-4F07-A01E-5448F1B5B213'; // Replace with your actual debug token
    console.log("Firebase App Check debug token set for development.");
  }

  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LfRy0UrAAAAAGLYTGqCM2ITAk0OvKiCnQRYD0bk'), // Replace with your reCAPTCHA v3 site key
    isTokenAutoRefreshEnabled: true, // Set to true to enable auto refresh.
  });
  console.log("Firebase App Check initialized successfully."); // Added console log for confirmation
} catch (error) {
  console.error("Error initializing Firebase App Check:", error);
}

setPersistence(getAuth(app), browserLocalPersistence);
console.log("Firebase Auth persistence set to local.");
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

// Function to upload a profile image to Firebase Storage
export const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
  const storage = getStorage();
  const storageRef: StorageReference = ref(storage, `profile_pictures/${userId}`);

  // Upload the file
  const snapshot = await uploadBytes(storageRef, file);
  // Get the download URL
  return getDownloadURL(snapshot.ref);
};

// Function to update user profile data in Firestore
export const updateUserProfile = async (userId: string, profileData: { profileImageUrl?: string }) => {
  // Get a reference to the user's profile document
  const userDocRef = doc(db, 'userProfiles', userId);
  // Update the document with the provided profile data, merging with existing fields
  await setDoc(userDocRef, profileData, { merge: true });
};

// Function to get user profile data from Firestore
export const getUserProfile = async (userId: string) => {
  const userDocRef = doc(db, 'userProfiles', userId);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null; // Or return {} or undefined based on preference
  }
};
