// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFehwfLowTXf2Dx2yL_vvnUF8507kP_7w",
  authDomain: "enata-light.firebaseapp.com",
  projectId: "enata-light",
  storageBucket: "enata-light.firebasestorage.app",
  messagingSenderId: "107558417494",
  appId: "1:107558417494:web:7bda559f48930fd5adf7f7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
