import { Route, Routes } from 'react-router-dom'

import Home from "./pages/Home/Home";
import Login from './pages/Login/Login';
import DriverDashboard from "./pages/DriverDashboard"


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
      </Routes>
    </>
  )
}

export default App
