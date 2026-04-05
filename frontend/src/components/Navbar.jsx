import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div>
        <Link to="/" style={styles.logo}>
          Storage Unit System
        </Link>
      </div>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>

        {!userInfo && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
            <Link to="/admin/login" style={styles.link}>Admin Login</Link>
          </>
        )}

        {userInfo && userInfo.role === "customer" && (
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        )}

        {userInfo && userInfo.role === "admin" && (
          <Link to="/admin/dashboard" style={styles.link}>Admin Dashboard</Link>
        )}

        {userInfo && (
          <button onClick={handleLogout} style={styles.button}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ddd",
    marginBottom: "20px",
    backgroundColor: "#fff",
  },
  logo: {
    textDecoration: "none",
    color: "#222",
    fontWeight: "700",
    fontSize: "18px",
  },
  links: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "#222",
    fontWeight: "500",
  },
  button: {
    padding: "8px 12px",
    cursor: "pointer",
    backgroundColor: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
  },
};

export default Navbar;