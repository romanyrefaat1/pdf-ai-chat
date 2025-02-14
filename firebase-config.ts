import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKYQsF4yVWl4zTeUT_1EkHmjW1Q_Am1fw",
  authDomain: "pdf-chatter-9c9f2.firebaseapp.com",
  projectId: "pdf-chatter-9c9f2",
  storageBucket: "pdf-chatter-9c9f2.appspot.com",
  messagingSenderId: "788926208615",
  appId: "1:788926208615:web:f66d56863c7965beded2c2",
  measurementId: "G-0VYXZZMX3J",
};

// Initialize Firebase only if it hasn't been initialized
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
