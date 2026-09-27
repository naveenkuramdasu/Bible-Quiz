// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7vvNRZVmqBtlfyHzFuNNujJLU1ehKYdE",
  authDomain: "bible-quiz-test.firebaseapp.com",
  projectId: "bible-quiz-test",
  storageBucket: "bible-quiz-test.firebasestorage.app",
  messagingSenderId: "206201515778",
  appId: "1:206201515778:web:64e0ad13fb55fbf09c5c1b",
  measurementId: "G-XX245YZM8F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Cloud Firestore
export const db = getFirestore(app);

export default app;