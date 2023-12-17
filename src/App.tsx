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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);

// onAuthStateChanged(auth, () => {
//   console.log(auth, "change");
// });

// if (window.location.hostname === "localhost") {
//   connectAuthEmulator(auth, "https://");
//   //connectStorageEmulator(storage, "127.0.0.1", 9199);
// }

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
