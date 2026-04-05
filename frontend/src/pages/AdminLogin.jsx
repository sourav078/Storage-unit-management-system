import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import AuthCard from "../components/AuthCard";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, logout, loading, userInfo } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (userInfo?.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [userInfo, navigate]);

  const handleAdminLogin = async (formData) => {
    setError("");

    try {
      const data = await login({
        email: formData.email,
        password: formData.password,
      });

      if (data?.role !== "admin") {
        logout();
        setError("Access denied. Admin credentials are required.");
        return;
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Admin login failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-page auth-page--admin">
      <AuthNavbar hideAuthLinks ctaText="Back to Home" ctaLink="/" />

      <main className="auth-page__main">
        <div className="auth-page__container">
          <AuthCard
            title="Admin Login"
            subtitle="Login to manage MR. Bunker storage operations"
            buttonText="Admin Login"
            footerText="Need a customer account?"
            footerLinkText="User Login"
            footerLinkTo="/login"
            onSubmit={handleAdminLogin}
            loading={loading}
            error={error}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLogin;