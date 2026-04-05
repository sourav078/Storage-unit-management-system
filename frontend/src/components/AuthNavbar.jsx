import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/auth-navbar.css";

const AuthNavbar = ({
  hideAuthLinks = false,
  ctaText = "Book Storage",
  ctaLink = "/search-results",
}) => {
  const location = useLocation();

  return (
    <header className="auth-navbar">
      <div className="auth-navbar__container">
        <Link to="/" className="auth-navbar__brand">
          MR. Bunker
        </Link>

        <nav className="auth-navbar__links">
          <Link to="/" className="auth-navbar__link">
            Home
          </Link>
          <Link to="/search-results" className="auth-navbar__link">
            Units
          </Link>
          <Link to="/" className="auth-navbar__link">
            How It Works
          </Link>
          <Link to="/" className="auth-navbar__link">
            Contact
          </Link>
        </nav>

        <div className="auth-navbar__actions">
          {!hideAuthLinks && location.pathname !== "/login" && (
            <Link to="/login" className="auth-navbar__signin">
              Sign In
            </Link>
          )}

          <Link to={ctaLink} className="auth-navbar__cta">
            {ctaText}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AuthNavbar;