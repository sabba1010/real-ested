// src/firebase/firebase.config.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCc0LD6o14sM4lDAgkQ-9rYzx6Bb2AuV1Q",
  authDomain: "real-state-b8e2f.firebaseapp.com",
  projectId: "real-state-b8e2f",
  storageBucket: "real-state-b8e2f.appspot.com",
  messagingSenderId: "244156891210",
  appId: "1:244156891210:web:b7c769532f7c98164f26b3",
};

const app = initializeApp(firebaseConfig);
export default app;
