import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./styles.css"
import "./styles/admin-redesign.css"
import App from './App.jsx'
import "leaflet/dist/leaflet.css"
import { AuthProvider } from "./context/AuthProvider";

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
)
