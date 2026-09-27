import { login, forgotPassword, resetPassword } from "../../services/authService";
import React, { useState, useContext } from "react";
import "./Login.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [view, setView] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  // ================= LOGIN =================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login({ email, password });

      // ✅ IMPORTANT: update context
      setUser(data.user);

      if (data.user.type === "admin") {
        navigate("/admin-dashboard");
      } else if (data.user.type === "driver") {
        navigate("/truck-dashboard");
      } else {
        navigate("/unauthorized"); // or login page
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= FORGOT =================
  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await forgotPassword(forgotEmail);
      setResetToken(result.resetToken || "");
      setMessage(result.message);
      setView("reset");
    } catch (err) {
      setMessage(err.message);
    }
  };

  // ================= RESET =================
  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      await resetPassword({ token: resetToken, newPassword });

      alert("Password reset successful");
      setView("login");
      setForgotEmail("");
      setResetToken("");
      setNewPassword("");
      setMessage("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="wrapper">
      <div className="container">

        <div className="form-box">
          <h1>BMC</h1>
          <h2>Berhampur Municipal Corporation Login</h2>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="forgot-message">{message}</p>}

          {/* LOGIN */}
          {view === "login" && (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label>Email</label>
              </div>

              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label>Password</label>
              </div>

              <button className="btn-login" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <p onClick={() => setView("forgot")} className="forgot-link">
                Forgot Password?
              </p>
            </form>
          )}

          {/* FORGOT */}
          {view === "forgot" && (
            <form onSubmit={handleForgotSubmit}>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />

              <button className="btn-login">
                Send Reset Token
              </button>

              <p onClick={() => setView("login")} className="forgot-link">
                Back to Login
              </p>
            </form>
          )}

          {/* RESET */}
          {view === "reset" && (
            <form onSubmit={handleResetPassword}>
              <input
                type="text"
                placeholder="Token"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <button className="btn-login">
                Reset Password
              </button>

              <p onClick={() => setView("login")} className="forgot-link">
                Back to Login
              </p>
            </form>
          )}
        </div>

        <div className="map-box">
          <iframe
            src="https://www.google.com/maps?q=Berhampur Municipal Corporation&output=embed"
            loading="lazy"
            title="BMC Map"
          />
        </div>

      </div>
    </div>
  );
};

export default Login;
