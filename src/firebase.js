import { initializeApp } from "firebase/app";

import {
  getFirestore,
} from "firebase/firestore";

import {
  getStorage,
} from "firebase/storage";

// =========================
// FIREBASE CONFIG
// =========================
const firebaseConfig = {

  apiKey:
    "AIzaSyAVE4ssLc9o2TlETeuIxGlSNWYksDTViuk",

  authDomain:
    "natvian-foods.firebaseapp.com",

  projectId:
    "natvian-foods",

  storageBucket:
    "natvian-foods.firebasestorage.app",

  messagingSenderId:
    "699739865570",

  appId:
    "1:699739865570:web:329ee93c83edb928baf9bb",
};

// =========================
// INITIALIZE FIREBASE
// =========================
const app =
  initializeApp(
    firebaseConfig
  );

// =========================
// FIRESTORE DATABASE
// =========================
export const db =
  getFirestore(app);

// =========================
// FIREBASE STORAGE
// =========================
export const storage =
  getStorage(app);