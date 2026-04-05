import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

const AuthCard = ({
  mode = "login",
  title = "Login",
  subtitle = "Login to access your MR. Bunker account",
  buttonText = "Login",
  footerText = "Don’t have an account?",
  footerLinkText = "Registration",
  footerLinkTo = "/register",
  onSubmit,
  loading = false,
  error = "",
}) => {
  const isRegister = mode === "register";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (isRegister) {
      if (!formData.name.trim()) {
        setLocalError("Full name is required.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }

      if (formData.password.length < 6) {
        setLocalError("Password must be at least 6 characters.");
        return;
      }
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-card__header">
        <h1 className="auth-card__title">{title}</h1>
        <p className="auth-card__subtitle">{subtitle}</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {isRegister && (
          <div className="auth-form__group">
            <label htmlFor="name" className="auth-form__label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="auth-form__input"
              placeholder="Input your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="auth-form__group">
          <label htmlFor="email" className="auth-form__label">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="auth-form__input"
            placeholder="Input your email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-form__group">
          <label htmlFor="password" className="auth-form__label">
            Password
          </label>
          <div className="auth-form__password-wrap">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="auth-form__input auth-form__input--password"
              placeholder="Input your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="auth-form__toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {isRegister && (
          <div className="auth-form__group">
            <label htmlFor="confirmPassword" className="auth-form__label">
              Confirm Password
            </label>
            <div className="auth-form__password-wrap">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="auth-form__input auth-form__input--password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="auth-form__toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        )}

        {!isRegister && (
          <div className="auth-form__row">
            <label className="auth-form__checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>

            <Link to="/forgot-password" className="auth-form__forgot">
              Forgot Password?
            </Link>
          </div>
        )}

        {localError ? <p className="auth-form__error">{localError}</p> : null}
        {error ? <p className="auth-form__error">{error}</p> : null}

        <button
          type="submit"
          className="auth-form__submit"
          disabled={loading}
        >
          {loading ? "Please wait..." : buttonText}
        </button>

        <p className="auth-form__bottom-text">
          <span>{footerText} </span>
          <Link to={footerLinkTo} className="auth-form__bottom-link">
            {footerLinkText}
          </Link>
        </p>

        <div className="auth-form__divider">
          <span className="auth-form__line"></span>
          <span className="auth-form__divider-text">
            {isRegister ? "Or register with" : "Or login with"}
          </span>
          <span className="auth-form__line"></span>
        </div>

        <div className="auth-form__socials">
          <button type="button" className="auth-form__social-btn" disabled>
            Facebook
          </button>
          <button type="button" className="auth-form__social-btn" disabled>
            Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthCard;