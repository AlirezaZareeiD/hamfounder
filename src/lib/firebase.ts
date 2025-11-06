import { FirebaseApp, initializeApp } from "firebase/app";
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, Auth, getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
// Import ref as well
import { getStorage, ref, uploadBytes, getDownloadURL, StorageReference } from "firebase/storage";
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from "firebase/app-check"; // Import AppCheck type
import { getFirestore, Firestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getFunctions, Functions } from 'firebase/functions'; // Import Functions services

const firebaseConfig = {
  apiKey: "AIzaSyBTsycr4yok1M6iOGdfO98mr_cTOKhoLbY",
  authDomain: "hamfounder-demo-2025.firebaseapp.com",
  projectId: "hamfounder-demo-2025",
  storageBucket: "hamfounder-demo-2025.firebasestorage.app",
  messagingSenderId: "571868985684",
  appId: "1:571868985684:web:c13d8e1d736c66b08330c1"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
console.log("Firebase App initialized:", app);

// Initialize App Check
let appCheck: AppCheck | undefined; // Declare appCheck variable here

try {
  console.log("Attempting to initialize Firebase App Check...");
  console.log("Firebase app object before initializeAppCheck:", app);

  // Pass your debug token in the isActivated field in debug builds
  if (process.env.NODE_ENV === 'development') {
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = 'A66D714E-16E2-4F07-A01E-5448F1B5B213'; // Replace with your actual debug token
    console.log("Firebase App Check debug token set for development.");
  }

  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LfRy0UrAAAAAGLYTGqCM2ITAk0OvKiCnQRYD0bk'), // Replace with your reCAPTCHA v3 site key
    isTokenAutoRefreshEnabled: true, // Set to true to enable auto refresh.
  });

  console.log("initializeAppCheck call finished.");
  console.log("Firebase App Check initialized successfully.");

} catch (error) {
  console.error("Error initializing Firebase App Check:", error);
}

setPersistence(getAuth(app), browserLocalPersistence);
console.log("Firebase Auth persistence set to local.");
export const auth: Auth = getAuth(app); // Export auth
export const db: Firestore = getFirestore(app, 'hamfounderdatabase');
export const functions: Functions = getFunctions(app); // Initialize and export Functions

// Export appCheck if needed elsewhere (optional)
// export { appCheck };


// Function to force refresh the user's ID token
export const forceRefreshToken = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      console.log("Attempting to force refresh auth token...");
      await user.getIdTokenResult(true); // Pass true to force refresh
      console.log("Auth token refreshed successfully.");
    } catch (error) {
      console.error("Error refreshing auth token:", error);
    }
  } else {
    console.log("No authenticated user to refresh token.");
  }
};


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

export const signInWithLinkedInPlaceholder = () => {
  console.log("LinkedIn login feature coming soon.");
};

// Initialize and export storage AND ref
export const storage = getStorage(app);
export { ref }; // Export the ref function as well


// Function to upload an image to Firebase Storage with a specified type
export const uploadImage = async (file: File, userId: string, type: 'profile' | 'companyLogo'): Promise<string> => {
  let storagePath: string;

  // Determine the storage path based on the image type
  if (type === 'profile') {
    storagePath = `profile_pictures/${userId}`;
  } else if (type === 'companyLogo') {
    storagePath = `company_logos/${userId}`; // Use a different path for company logos
  } else {
    // Handle unexpected types or throw an error
    throw new Error(`Unsupported image type: ${type}`);
  }

  const storageRef: StorageReference = ref(storage, storagePath);

  // Upload the file
  const snapshot = await uploadBytes(storageRef, file);
  // Get the download URL
  return getDownloadURL(snapshot.ref);
};

// Function to update user profile data in Firestore
export const updateUserProfile = async (userId: string, profileData: {
  profileImageUrl?: string;
  firstName?: string;
  lastName?: string;
  pronouns?: string;
  tagline?: string;
  location?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  personalSummary?: string;
  role?: string;
  lookingFor?: string;
  businessStage?: string;
  skills?: string[] | undefined;
  interests?: string[] | undefined;
  companyName?: string;
  companyLogoUrl?: string;
  companyWebsiteUrl?: string;
}) => {
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
