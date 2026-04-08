import { Route, Routes } from 'react-router-dom'

import Home from "./pages/Home/Home";
import Login from './pages/Login/Login';
import DriverDashboard from './pages/DriverDashboard/DriverDashboard';
import NotFound from './pages/404 Page/NotFound';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  )
}

export default App
