import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Auth from "./pages/auth/Auth";

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
