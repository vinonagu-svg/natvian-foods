import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        console.log(
          "Firebase Auth User:",
          firebaseUser
        );

        try {
          if (!firebaseUser) {
            setUser(null);
            setLoading(false);
            return;
          }

          console.log(
            "Checking Firestore user:",
            firebaseUser.uid
          );

          const userRef = doc(
            db,
            "users",
            firebaseUser.uid
          );

          const userSnap = await getDoc(userRef);

          console.log(
            "User document exists:",
            userSnap.exists()
          );

          if (!userSnap.exists()) {
            setUser(null);
            setLoading(false);
            return;
          }

          const data = userSnap.data();

          if (data.status !== "active") {
            await signOut(auth);

            setUser(null);
            setLoading(false);

            return;
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: data.name || "",
            role: data.role || "staff",
            permissions: data.permissions || [],
            status: data.status,
          });

          setLoading(false);
        } catch (error) {
          console.error("Auth Error:", error);
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const value = useContext(AuthContext);

  console.log("useAuth value =", value);

  return value;
};