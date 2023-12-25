import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  onAuthStateChanged,
} from "firebase/auth";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import { firebaseConfig } from "../config";
import Auth from "./pages/auth/Auth";
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
export const storageRef = ref(storage);

function App() {
  return (
    <Routes>
      <Route index element={<Navigate replace to="login" />} />
      <Route path="login" element={<Auth />} />
      <Route path="register" element={<Auth />} />
      <Route path="home" element={<Home />} />
    </Routes>
  );
}

export default App;
