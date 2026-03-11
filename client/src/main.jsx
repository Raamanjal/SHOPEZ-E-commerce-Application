import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import { GeneralProvider } from "./context/GeneralContext.js";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GeneralProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#141414",
              color: "#f7f3ee",
              border: "1px solid rgba(255, 165, 0, 0.22)",
            },
          }}
        />
      </GeneralProvider>
    </BrowserRouter>
  </StrictMode>
);
