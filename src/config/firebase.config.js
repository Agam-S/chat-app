// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6nSKFAnLm6L4ayb1TMLBnbVbHcwbckm4",
  authDomain: "chat-app-2699c.firebaseapp.com",
  projectId: "chat-app-2699c",
  storageBucket: "chat-app-2699c.appspot.com",
  messagingSenderId: "789820638523",
  appId: "1:789820638523:web:5b069ad225374dfbace31e",
  measurementId: "G-7WVE9GMW4E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
