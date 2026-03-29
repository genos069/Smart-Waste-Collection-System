import React, { useState, useEffect } from "react";
import "./Home.css";

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <>
      <header>
        BMC Integrated Solid Waste Management System
      </header>

      <div className="navbar">
        <div className="image">
          {!menuOpen && (
            <img
              src="https://www.berhampur.gov.in/wp-content/uploads/2020/06/cropped-BMC-Logo_01-32x32.png"
              alt="BMC Logo"
              className="logo-img"
            />
          )}
        </div>

        <div className="menu-icon" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <ul className={menuOpen ? "active" : ""}>
          <li><a href="https://www.berhampur.gov.in/about-bemc/">About Us</a></li>
          <li><a href="https://www.berhampur.gov.in/category/notice/">Notices</a></li>
          <li><a href="https://www.berhampur.gov.in/category/tenders/">Tenders</a></li>
          <li><a href="/login">Login</a></li>
        </ul>

        <div className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? "🌙" : "🌞"}
        </div>
      </div>

      <div className="main-content">
        <div className="tagline">#iloveBerhampur</div>
        <div className="quote">
          "Clean City, Green City — Together we can make it happen."
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search services, documents, updates..."
          />
        </div>

        <div className="box-container">
          <div className="box">
            <div className="logo">
              <img
                src="https://www.reshot.com/preview-assets/icons/T29AH3ELBP/teacher-and-book-T29AH3ELBP.svg"
                alt=""
              />
            </div>
            <div>
              <a href="https://www.berhampur.gov.in/explore/">About Berhampur</a>
            </div>
          </div>

          <div className="box">
            <div className="logo">
              <img
                src="https://www.reshot.com/preview-assets/icons/VLUBDHNJPZ/recycle-VLUBDHNJPZ.svg"
                alt=""
              />
            </div>
            <div>
              <a href="https://www.berhampur.gov.in/services/">Services</a>
            </div>
          </div>
        </div>
      </div>

      <footer>
        © 2025 Berhampur Municipal Corporation (BMC). All Rights Reserved.
      </footer>
    </>
  );
};

export default Home;