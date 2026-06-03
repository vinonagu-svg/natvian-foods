import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const loginUser = async (email, password) => {
  // Firebase Authentication
  const userCred = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const uid = userCred.user.uid;

  // Firestore User Document
  const userSnap = await getDoc(
    doc(db, "users", uid)
  );

  if (!userSnap.exists()) {
    throw new Error(
      "User not found in Firestore"
    );
  }

  const userData = userSnap.data();

  // Block inactive users
  if (userData.status !== "active") {
    throw new Error(
      "Account is inactive"
    );
  }

  return {
    uid,
    ...userData,
  };
};