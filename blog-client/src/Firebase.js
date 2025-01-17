// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-gv.firebaseapp.com",
  projectId: "mern-blog-gv",
  storageBucket: "mern-blog-gv.appspot.com",
  messagingSenderId: "703942747544",
  appId: "1:703942747544:web:02ff4e84d637df3dfcb7ed",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
