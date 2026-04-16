import React, { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebase.init";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Email/Password Registration
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ✅ Email/Password Login
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ✅ Google Login
  const signInWithGoogle = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // ✅ Logout
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // ✅ Save user to backend
  const saveUserToDB = async (userInfo) => {
    try {
      const payload = {
        email: userInfo.email,
        name: userInfo.name,
        photoURL: userInfo.photoURL,
      };

      if (userInfo.role) {
        payload.role = userInfo.role;
      }

      await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("❌ Failed to save user:", error);
    }
  };

  // ✅ Fetch role from backend
  const fetchUserRole = async (email) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error("Failed to fetch user role");

      const data = await res.json();
      const fetchedRole = data.role ? data.role.trim().toLowerCase() : "user";

      setRole(fetchedRole);
      return fetchedRole;
    } catch (error) {
      console.error("❌ Error fetching role:", error);
      setRole("user");
      return "user";
    }
  };

  // ✅ Watch user login/logout state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);

      if (currentUser?.email) {
        await saveUserToDB({
          email: currentUser.email,
          name: currentUser.displayName || "User",
          photoURL: currentUser.photoURL || "",
        });

        await fetchUserRole(currentUser.email);
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Provide all context values
  const authInfo = {
    user,
    role,
    loading,
    createUser,
    signIn,
    signInWithGoogle,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


