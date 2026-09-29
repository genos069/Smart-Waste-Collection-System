import "leaflet/dist/leaflet.css";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeProvider";
import { AuthProvider } from "./context/AuthProvider";
import "./styles.css";
import "./styles/admin-redesign.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>,
);
