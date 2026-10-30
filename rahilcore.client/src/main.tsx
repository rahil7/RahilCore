import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LoadingProvider } from "./contexts/LoadingContext";

import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <LoadingProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </LoadingProvider>
        </BrowserRouter>
    </StrictMode>
);
