import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Solo aquí debe estar el BrowserRouter
import App from "./App";
import "./index.css";
import "./testUpload"; // Importa el archivo de prueba

console.log("Montando React...");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
