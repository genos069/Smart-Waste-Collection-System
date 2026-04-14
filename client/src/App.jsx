import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";

import DriverDashboard from "./pages/DriverDashboard";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminMapPage from "./pages/AdminMap/AdminMapPage.jsx";
import AllBins from "./pages/AllBins.jsx";
import TruckDriverDashboard from "./pages/TruckDriverDashboard/TruckDriverDashboard.jsx";
import AdminList from "./pages/admin/AdminList.jsx";
import CreateAdmin from "./pages/admin/CreateAdmin.jsx";
import ForgetPassword from "./pages/admin/ForgotPassword.jsx";
import ResetPassword from "./pages/admin/ResetPassword.jsx";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/driver-dashboard"
        element={
          <ProtectedRoute role="driver">
            <DriverDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-map"
        element={
          <ProtectedRoute role="admin">
            <AdminMapPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/all-bins"
        element={
          <ProtectedRoute role="admin">
            <AllBins />
          </ProtectedRoute>
        }
      />

      <Route
        path="/truck-dashboard"
        element={
          <ProtectedRoute role="driver">
            <TruckDriverDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-list"
        element={
          <ProtectedRoute role="admin">
            <AdminList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-users"
        element={
          <ProtectedRoute role="admin">
            <CreateAdmin />
          </ProtectedRoute>
        }
      />

      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

    </Routes>
  );
}

export default App;