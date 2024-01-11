import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./_index.scss";
import { AuthProvider } from "./context/authContext/AuthContext.tsx";
import Layout from "./UI/layout/Layout.tsx";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/appContext/AppContext.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Layout>
              <App />
            </Layout>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
