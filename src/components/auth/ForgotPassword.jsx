import React, { useState } from "react";
import { Mail, ArrowLeft, Check } from "lucide-react";
import { authService } from "../../services/authService";
import Input from "../ui/Input";
import Button from "../ui/Button";

function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await authService.resetPassword(email);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="success-icon">
              <Check size={48} color="#10b981" />
            </div>
            <h2 className="auth-title">Email Sent!</h2>
            <p className="auth-subtitle">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <div className="success-instructions">
            <h3>What's next?</h3>
            <ol>
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the "Reset Password" link in the email</li>
              <li>Create a new password</li>
              <li>Sign in with your new password</li>
            </ol>
          </div>

          <div className="auth-footer">
            <Button variant="secondary" onClick={onBack} className="full-width">
              <ArrowLeft size={18} />
              Back to Login
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
          <h2 className="auth-title">Forgot Password?</h2>
          <p className="auth-subtitle">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            style={{ width: "100%", marginTop: "1rem" }}
          >
            <Mail size={20} />
            <span>Send Reset Link</span>
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password?{" "}
            <button onClick={onBack} className="link-button">
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
