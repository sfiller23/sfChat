import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3MzC7enBsiyIvp14_X7kD3EME6oWi0Hs",
  authDomain: "sfchat-47232.firebaseapp.com",
  projectId: "sfchat-47232",
  storageBucket: "sfchat-47232.appspot.com",
  messagingSenderId: "522955401252",
  appId: "1:522955401252:web:df4e9c9865845e11ad10b1",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
