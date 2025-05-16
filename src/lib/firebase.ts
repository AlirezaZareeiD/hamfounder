import { FirebaseApp, initializeApp } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup, Auth, getAuth } from "firebase/auth";
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


// پیاده سازی Sign-in با لینکدین پیچیده تر است و به صورت پیش فرض در Firebase Auth نیست.
// ممکن است نیاز به Firebase Functions و استفاده از OpenID Connect داشته باشد.
// فعلاً تابع signInWithLinkedIn را به صورت موقت اضافه می کنیم و بعداً می توان آن را پیاده سازی کرد یا حذف کرد.
export const signInWithLinkedIn = () => {
  console.log("Sign in with LinkedIn not yet implemented");
  // در آینده می توانید پیاده سازی Sign-in با لینکدین را در اینجا اضافه کنید.
  // Firebase به صورت پیش فرض Provider برای لینکدین ندارد و نیاز به راه حل سفارشی دارد.
  // ممکن است نیاز به استفاده از Firebase Functions و یک OAuth 2.0 flow داشته باشد.
  throw new Error("Sign in with LinkedIn not yet implemented");
};


