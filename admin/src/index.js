import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { AuthContextProvider } from "./context/authContext";
import { ToastContainer } from 'react-toastify';
ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ToastContainer />
      <DarkModeContextProvider>
       
        <App />
      </DarkModeContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
