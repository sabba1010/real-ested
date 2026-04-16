import app from './firebase.config';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Register with Email & Password
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login with Email & Password
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Google Login
export const googleLogin = () => {
  return signInWithPopup(auth, googleProvider);
};

// Logout
export const logoutUser = () => {
  return signOut(auth);
};

export { auth };
