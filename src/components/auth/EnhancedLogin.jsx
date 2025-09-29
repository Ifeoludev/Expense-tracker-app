// components/auth/EnhancedLogin.jsx
import React, { useState } from "react";
import { LogIn, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";
import { authService } from "../../services/authService";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ForgotPassword from "./ForgotPassword";
import EmailVerification from "./EmailVerification";

function EnhancedLogin({ onToggleMode }) {
  const [view, setView] = useState("login"); // login, forgot, verification
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await authService.login(formData.email, formData.password);

    if (result.success) {
      console.log("Login successful!", result.user);
    } else {
      if (result.code === "email-not-verified") {
        setUnverifiedUser(result.user);
        setView("verification");
      } else {
        setError(result.error);
      }
    }

    setLoading(false);
  };

  const handleForgotPassword = () => {
    setView("forgot");
    setError("");
  };

  const handleBackToLogin = () => {
    setView("login");
    setError("");
    setUnverifiedUser(null);
  };

  const handleVerificationComplete = () => {
    setView("login");
    setUnverifiedUser(null);
    // User will be automatically logged in after verification
  };

  const handleSkipVerification = () => {
    setView("login");
    setUnverifiedUser(null);
  };

  // Render different views
  if (view === "forgot") {
    return <ForgotPassword onBack={handleBackToLogin} />;
  }

  if (view === "verification" && unverifiedUser) {
    return (
      <EmailVerification
        onVerified={handleVerificationComplete}
        onSkip={handleSkipVerification}
      />
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          {/* <div className="brand-icon">
            <Shield size={32} color="#3b82f6" />
          </div> */}
          <h2 className="auth-title">Welcome Back!</h2>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            autoComplete="email"
          />

          <div className="password-input-container">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="auth-options">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="link-button"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            style={{ width: "100%", marginTop: "1rem" }}
          >
            <LogIn size={20} />
            <span>Sign In </span>
          </Button>
        </form>
        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button onClick={onToggleMode} className="link-button">
              Create one now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default EnhancedLogin;
