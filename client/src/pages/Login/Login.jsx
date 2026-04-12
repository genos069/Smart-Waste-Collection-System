import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [showForgot, setShowForgot] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  // ✅ LOGIN
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateEmail(email)) {
      setError("Enter a valid email");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // store role
        localStorage.setItem("userType", data.userType);

        // redirect based on role
        if (data.userType === "admin") {
          window.location.href = "/admin-dashboard";
        } else {
          window.location.href = "/driver-dashboard";
        }
      } else {
        setError(data.msg || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FORGOT PASSWORD
  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setForgotMessage("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setForgotMessage(data.message || "Check your email.");
    } catch (err) {
      console.error(err);
      setForgotMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        {/* FORM */}
        <div className="form-box">
          <h1>BMC</h1>
          <h2>Berhampur Municipal Corporation Login</h2>

          {error && <p className="error-message">{error}</p>}

          {!showForgot ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                />
                <label>Email</label>
              </div>

              <div className="form-group">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                />
                <label>Password</label>
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <a
                href="#"
                className="forgot-link"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgot(true);
                  setForgotMessage("");
                }}
              >
                Forgot Password?
              </a>
            </form>
          ) : (
            <form onSubmit={handleForgotSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                />
                <label>Enter your registered email</label>
              </div>

              <button type="submit" className="btn-login">
                Send Reset Link
              </button>

              <a
                href="#"
                className="forgot-link"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgot(false);
                  setForgotMessage("");
                }}
              >
                ← Back to Login
              </a>

              {forgotMessage && (
                <p className="forgot-message">{forgotMessage}</p>
              )}
            </form>
          )}
        </div>

        {/* MAP */}
        <div className="map-box">
          <iframe
            src="https://www.google.com/maps?q=Berhampur%20Municipal%20Corporation&output=embed"
            loading="lazy"
            title="BMC Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Login;