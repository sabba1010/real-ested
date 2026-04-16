// src/firebase/firebase.init.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCc0LD6o14sM4lDAgkQ-9rYzx6Bb2AuV1Q",
  authDomain: "real-state-b8e2f.firebaseapp.com",
  projectId: "real-state-b8e2f",
  storageBucket: "real-state-b8e2f.firebasestorage.app",
  messagingSenderId: "244156891210",
  appId: "1:244156891210:web:b7c769532f7c98164f26b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and export it
const auth = getAuth(app);

export { app, auth };
