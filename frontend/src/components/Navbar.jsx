import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = userInfo?.name || userInfo?.email || "User";
  const displayRole = userInfo?.role || "";

  return (
    <header className="site-navbar">
      <div className="site-navbar__container">
        <Link to="/" className="site-navbar__brand">
          MR. Bunker
        </Link>

        <nav className="site-navbar__links">
          <Link to="/" className="site-navbar__link">
            Home
          </Link>
          <Link to="/search" className="site-navbar__link">
            Units
          </Link>
          <Link to="/" className="site-navbar__link">
            Services
          </Link>
        </nav>

        <div className="site-navbar__actions">
          {!userInfo && (
            <>
              <Link to="/login" className="site-navbar__text-btn">
                Login/Registration
              </Link>
              <Link to="/search" className="site-navbar__outline-btn">
                Find Storage
              </Link>
            </>
          )}

          {userInfo && (
            <>
              <div className="site-navbar__user">
                <span className="site-navbar__user-role">{displayRole}</span>
                <span className="site-navbar__user-separator">→</span>
                <span className="site-navbar__user-name">{displayName}</span>
              </div>

              {userInfo.role === "customer" && (
                <Link to="/dashboard" className="site-navbar__text-btn">
                  Dashboard
                </Link>
              )}

              {userInfo.role === "admin" && (
                <Link to="/admin/dashboard" className="site-navbar__text-btn">
                  Admin Dashboard
                </Link>
              )}

              <button onClick={handleLogout} className="site-navbar__solid-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;