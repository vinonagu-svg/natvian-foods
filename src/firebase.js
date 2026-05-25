import { initializeApp } from "firebase/app";

import {
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVE4ssLc9o2TlETeuIxGlSNWYksDTViuk",
  authDomain:
    "natvian-foods.firebaseapp.com",
  projectId: "natvian-foods",
  storageBucket:
    "natvian-foods.firebasestorage.app",
  messagingSenderId:
    "699739865570",
  appId: "1:699739865570:web:329ee93c83edb928baf9bb",
};

const app =
  initializeApp(firebaseConfig);

export const db =
  getFirestore(app);