import React, { useState, useEffect } from "react";
import { Mail, RefreshCw, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import Button from "../ui/Button";

function EmailVerification({ onVerified, onSkip }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Check verification status periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      if (currentUser) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          setSuccess(true);
          setTimeout(() => {
            onVerified && onVerified();
          }, 2000);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentUser, onVerified]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    setError("");
    setLoading(true);

    const result = await authService.resendEmailVerification();

    if (result.success) {
      setResendCooldown(60);
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
            <h2 className="auth-title">Email Verified!</h2>
            <p className="auth-subtitle">
              Your email has been successfully verified. Redirecting you to the
              dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="verification-icon">
            <Mail size={48} color="#3b82f6" />
          </div>
          <h2 className="auth-title">Verify Your Email</h2>
          <p className="auth-subtitle">
            We've sent a verification link to{" "}
            <strong>{currentUser?.email}</strong>
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="verification-instructions">
          <h3>To complete your account setup:</h3>
          <ol>
            <li>Check your email inbox (and spam folder)</li>
            <li>Click the verification link in the email</li>
            <li>This page will automatically update once verified</li>
          </ol>
        </div>

        <div className="verification-actions">
          <Button
            variant="primary"
            onClick={handleResendVerification}
            loading={loading}
            disabled={resendCooldown > 0}
            style={{ width: "100%" }}
          >
            <RefreshCw size={18} />
            <span>
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend Verification Email"}
            </span>
          </Button>

          <Button
            variant="secondary"
            onClick={onSkip}
            style={{ width: "100%", marginTop: "1rem" }}
          >
            Skip for Now
          </Button>
        </div>

        <div className="verification-note">
          <AlertCircle size={16} color="#f59e0b" />
          <p>
            You'll have limited access until your email is verified. Some
            features may not be available.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
