// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqj3qX9gjc6iH2p_fGaFGEzKaOMOOJGgw",
  authDomain: "new-pos-7323f.firebaseapp.com",
  projectId: "new-pos-7323f",
  storageBucket: "new-pos-7323f.firebasestorage.app",
  messagingSenderId: "344898952123",
  appId: "1:344898952123:web:d24db12d818a7372d4029e",
  measurementId: "G-13Z5GME4XV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;