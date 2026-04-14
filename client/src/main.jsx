import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./styles.css"
import App from './App.jsx'
import "leaflet/dist/leaflet.css"
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
)
