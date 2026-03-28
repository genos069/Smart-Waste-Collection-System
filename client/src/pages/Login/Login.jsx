import React, { useState } from "react";
import "./Login.css"; // Your CSS file (adapted from original)

const Login = () => {
  const [showForgot, setShowForgot] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [error, setError] = useState("");
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  // Handle login form submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // Example fetch request to backend
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert(data.message);
        // TODO: redirect to dashboard
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    }
  };

  // Handle forgot password submit
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
      setForgotMessage(data.message);
    } catch (err) {
      console.error(err);
      setForgotMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        {/* Form Section */}
        <div className="form-box">
          <h1>BMC</h1>
          <h2>Berhampur Municipal Corporation Login</h2>

          {error && <p className="error-message">{error}</p>}

          {!showForgot ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  id="userId"
                  placeholder=" "
                  required
                  value={userid}
                  onChange={(e) => setUserid(e.target.value)}
                />
                <label htmlFor="userId">User ID</label>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  placeholder=" "
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password">Password</label>
              </div>
              <button type="submit" className="btn-login">
                Login
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
                  id="forgotEmail"
                  placeholder=" "
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="forgotEmail">Enter your registered email</label>
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
              <div
                className="forgot-link"
                style={{
                  marginTop: "12px",
                  textAlign: "left",
                  color: forgotMessage.includes("valid") ? "red" : "lightgreen",
                }}
              >
                {forgotMessage}
              </div>
            </form>
          )}
        </div>

        {/* Map Section */}
        <div className="map-box">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3790.4449250318295!2d84.79624801487004!3d19.314961586942732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3bc5390f7a87c9%3A0xe9a2f860c6e7b4fc!2sBerhampur%20Municipal%20Corporation!5e0!3m2!1sen!2sin!4v1623318487955!5m2!1sen!2sin"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="BMC Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Login;