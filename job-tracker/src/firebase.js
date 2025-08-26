// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAujblUpXiUV8gxrE7p9q3ySXgj6LBNTGw",
  authDomain: "job-tracker-b9e24.firebaseapp.com",
  projectId: "job-tracker-b9e24",
  storageBucket: "job-tracker-b9e24.firebasestorage.app",
  messagingSenderId: "944871532067",
  appId: "1:944871532067:web:0136520dc72aed271bf396",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
