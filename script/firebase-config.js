// script/firebase-config.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2PKfscSYM6qVz_mmZ9jCxt9X_Xtm4e8g",
  authDomain: "christopher-portfolio93.firebaseapp.com",
  projectId: "christopher-portfolio93",
  storageBucket: "christopher-portfolio93.firebasestorage.app",
  messagingSenderId: "306395476030",
  appId: "1:306395476030:web:d01e0ec1cde4ef982a216f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export 'db' so other files can use it
export { db };