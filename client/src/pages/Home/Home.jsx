import React, { useState, useEffect } from "react";
import "./Home.css";

const searchItems = [
  {
    title: "About Berhampur",
    description: "Explore Berhampur and learn more about the city.",
    keywords: "about berhampur city corporation explore",
    url: "https://www.berhampur.gov.in/explore/",
    type: "Information",
  },
  {
    title: "Services",
    description: "Access municipal services provided by BMC.",
    keywords: "services municipal online services bmc",
    url: "https://www.berhampur.gov.in/services/",
    type: "Service",
  },
  {
    title: "Notices",
    description: "View the latest notices and announcements.",
    keywords: "notice notices announcement updates",
    url: "https://www.berhampur.gov.in/category/notice/",
    type: "Updates",
  },
  {
    title: "Tenders",
    description: "View current BMC tenders and procurement information.",
    keywords: "tender tenders procurement contracts",
    url: "https://www.berhampur.gov.in/category/tenders/",
    type: "Documents",
  },
  {
    title: "About Us",
    description: "Learn more about Berhampur Municipal Corporation.",
    keywords: "about us bmc corporation municipal",
    url: "https://www.berhampur.gov.in/about-bemc/",
    type: "Information",
  },
];
const getResultIcon = (type) => {
  switch (type) {
    case "Service":
      return "♻️";
    case "Updates":
      return "🔔";
    case "Documents":
      return "📄";
    case "Information":
    default:
      return "ℹ️";
  }
};

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const clearSearch = () => {
    setSearchQuery("");
  };
  const handleSearchResultClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setSearchQuery("");
  };
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredResults = normalizedQuery
    ? searchItems.filter((item) => {
        const searchableText = [
          item.title,
          item.description,
          item.keywords,
          item.type,
        ]
          .join(" ")
          .toLowerCase();
        return searchableText.includes(normalizedQuery);
      })
    : [];
  const showSearchResults = searchQuery.trim().length > 0;

  return (
    <>
      <div className="app-shell">
        <header>BMC Integrated Solid Waste Management System</header>

        <div className="navbar">
          <div className="image">
            {!menuOpen && (
              <img src="/truck.png" alt="Bin Logo" className="logo-img" />
            )}
          </div>

          <div className="menu-icon" onClick={toggleMenu}>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <ul className={menuOpen ? "active" : ""}>
            <li>
              <a href="https://www.berhampur.gov.in/about-bemc/">About Us</a>
            </li>
            <li>
              <a href="https://www.berhampur.gov.in/category/notice/">
                Notices
              </a>
            </li>
            <li>
              <a href="https://www.berhampur.gov.in/category/tenders/">
                Tenders
              </a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
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

          <div className="search-container">
            {" "}
            <div className="search-bar">
              {" "}
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search services, documents, updates..."
                aria-label="Search services, documents, and updates"
              />{" "}
              {searchQuery.length > 0 && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  {" "}
                  ×{" "}
                </button>
              )}{" "}
            </div>{" "}
            {showSearchResults && (
              <div className="search-results">
                {" "}
                {filteredResults.length > 0 ? (
                  filteredResults.map((item) => (
                    <button
                      type="button"
                      className="search-result"
                      key={item.url}
                      onClick={() => handleSearchResultClick(item.url)}
                    >
                      {" "}
                      <span className="search-result-icon" aria-hidden="true">
                        {" "}
                        {getResultIcon(item.type)}{" "}
                      </span>{" "}
                      <span className="search-result-content">
                        {" "}
                        <span className="search-result-title">
                          {" "}
                          {item.title}{" "}
                        </span>{" "}
                        <span className="search-result-description">
                          {" "}
                          {item.description}{" "}
                        </span>{" "}
                      </span>{" "}
                      <span className="search-result-type">
                        {" "}
                        {item.type}{" "}
                      </span>{" "}
                    </button>
                  ))
                ) : (
                  <div className="no-results">No results found</div>
                )}{" "}
              </div>
            )}{" "}
          </div>

          <div className="box-container">
            <div className="box">
              <div className="logo">
                <img src="/about.svg" alt="" className="about-icon" />
              </div>
              <div>
                <a href="https://www.berhampur.gov.in/explore/">
                  About Berhampur
                </a>
              </div>
            </div>

            <div className="box">
              <div className="logo">
                <img src="/t_service.png" alt="" className="service-icon" />
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
      </div>
    </>
  );
};

export default Home;
