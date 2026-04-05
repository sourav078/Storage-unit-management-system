import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import AuthCard from "../components/AuthCard";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, userInfo } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [userInfo, navigate]);

  const handleLogin = async (formData) => {
    setError("");

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid email or password."
      );
    }
  };

  return (
    <div className="auth-page">
      <AuthNavbar />

      <main className="auth-page__main">
        <div className="auth-page__container">
          <AuthCard
            title="Login"
            subtitle="Login to access your MR. Bunker account"
            buttonText="Login"
            footerText="Don’t have an account?"
            footerLinkText="Registration"
            footerLinkTo="/register"
            onSubmit={handleLogin}
            loading={loading}
            error={error}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;