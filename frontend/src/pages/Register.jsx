import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import AuthCard from "../components/AuthCard";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, userInfo } = useAuth();
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

  const handleRegister = async (formData) => {
    setError("");

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-page">
      <AuthNavbar />

      <main className="auth-page__main">
        <div className="auth-page__container">
          <AuthCard
            mode="register"
            title="Register"
            subtitle="Create your MR. Bunker account to book and manage storage units"
            buttonText="Create Account"
            footerText="Already have an account?"
            footerLinkText="Login"
            footerLinkTo="/login"
            onSubmit={handleRegister}
            loading={loading}
            error={error}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;