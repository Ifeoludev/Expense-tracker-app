import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Key, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { authService } from "../services/authService";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function PasswordResetPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState("loading");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [oobCode, setOobCode] = useState(null);

  useEffect(() => {
    // Get the action code from URL parameters
    const code = searchParams.get("oobCode");
    const actionMode = searchParams.get("mode");

    if (!code || actionMode !== "resetPassword") {
      setMode("error");
      setError("Invalid or expired password reset link");
      return;
    }

    setOobCode(code);
    setMode("reset");
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    const result = await authService.confirmPasswordReset(
      oobCode,
      formData.newPassword
    );

    if (result.success) {
      setMode("success");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  if (mode === "loading") {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading-container">
            <div className="spinner spinner-md"></div>
            <p>Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "error") {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="error-icon">
              <AlertCircle size={48} color="#ef4444" />
            </div>
            <h2 className="auth-title">Invalid Link</h2>
            <p className="auth-subtitle">
              This password reset link is invalid or has expired.
            </p>
          </div>

          <div className="error-instructions">
            <p>
              Password reset links expire after a certain time for security
              reasons. Please request a new password reset link.
            </p>
          </div>

          <div className="auth-footer">
            <Button
              variant="primary"
              onClick={handleBackToLogin}
              className="full-width"
            >
              <ArrowLeft size={18} />
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "success") {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="success-icon">
              <Check size={48} color="#10b981" />
            </div>
            <h2 className="auth-title">Password Reset Successful!</h2>
            <p className="auth-subtitle">
              Your password has been successfully updated.
            </p>
          </div>

          <div className="success-instructions">
            <h3>What's next?</h3>
            <ol>
              <li>Click the button below to go to the login page</li>
              <li>Sign in with your new password</li>
              <li>Make sure to remember your new password</li>
            </ol>
          </div>

          <div className="auth-footer">
            <Button
              variant="primary"
              onClick={handleBackToLogin}
              className="full-width"
            >
              Continue to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon">
            <Key size={32} color="#3b82f6" />
          </div>
          <h2 className="auth-title">Reset Your Password</h2>
          <p className="auth-subtitle">
            Choose a strong, new password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter your new password"
            required
            autoComplete="new-password"
          />

          <Input
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your new password"
            required
            autoComplete="new-password"
          />

          <div className="password-requirements">
            <h4>Password Requirements:</h4>
            <ul>
              <li className={formData.newPassword.length >= 8 ? "met" : ""}>
                At least 8 characters long
              </li>
              <li className={/[a-z]/.test(formData.newPassword) ? "met" : ""}>
                Contains lowercase letters
              </li>
              <li className={/[A-Z]/.test(formData.newPassword) ? "met" : ""}>
                Contains uppercase letters
              </li>
              <li className={/[0-9]/.test(formData.newPassword) ? "met" : ""}>
                Contains numbers
              </li>
              <li
                className={
                  /[^A-Za-z0-9]/.test(formData.newPassword) ? "met" : ""
                }
              >
                Contains special characters
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            style={{ width: "100%", marginTop: "1rem" }}
          >
            <Key size={20} />
            <span>Update Password</span>
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password?{" "}
            <button onClick={handleBackToLogin} className="link-button">
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetPage;
