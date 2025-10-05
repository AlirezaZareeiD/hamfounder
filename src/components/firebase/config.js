// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// This configuration is correct as it points to the correct Firebase project.
const firebaseConfig = {
  apiKey: "AIzaSyBTsycr4yok1M6iOGdfO98mr_cTOKhoLbY",
  authDomain: "hamfounder-demo-2025.firebaseapp.com",
  projectId: "hamfounder-demo-2025",
  storageBucket: "hamfounder-demo-2025.firebasestorage.app",
  messagingSenderId: "571868985684",
  appId: "1:571868985684:web:c13d8e1d736c66b08330c1"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// CORRECTLY connect to the NAMED database instead of the default one.
const db = getFirestore(app, "hamfounderdatabase");

export { db };
