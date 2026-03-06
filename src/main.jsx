import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { StackNavigationProvider } from "./context/StackNavigationContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <StackNavigationProvider>
        <App />
      </StackNavigationProvider>
    </BrowserRouter>
  </StrictMode>,
);
