import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/authContext/AuthContext.tsx";
import Layout from "./UI/layout/Layout.tsx";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/authContext/AppContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Layout>
            <App />
          </Layout>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
