// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCciUKRpU04mqNJjfUTmdRIGXvvKE0eOXw",
  authDomain: "whatssive-be3ac.firebaseapp.com",
  projectId: "whatssive-be3ac",
  storageBucket: "whatssive-be3ac.appspot.com",
  messagingSenderId: "412877427166",
  appId: "1:412877427166:web:29c62338fbfec6d8b58d4f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);