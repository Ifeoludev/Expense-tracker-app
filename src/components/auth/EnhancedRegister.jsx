import React, { useState } from "react";
import { UserPlus, Shield, Check, X, Eye, EyeOff } from "lucide-react";
import { authService } from "../../services/authService";
import Input from "../ui/Input";
import Button from "../ui/Button";
import EmailVerification from "./EmailVerification";

function EnhancedRegister({ onToggleMode }) {
  const [view, setView] = useState("register");
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check password strength in real-time
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One lowercase letter");
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One uppercase letter");
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One number");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One special character");
    }

    return { score, feedback };
  };

  const getPasswordStrengthColor = (score) => {
    if (score < 2) return "#ef4444";
    if (score < 4) return "#f59e0b";
    return "#10b981";
  };

  const getPasswordStrengthText = (score) => {
    if (score < 2) return "Weak";
    if (score < 4) return "Medium";
    return "Strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength.score < 3) {
      setError("Please choose a stronger password");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    const result = await authService.register(
      formData.email,
      formData.password,
      formData.displayName
    );

    if (result.success) {
      setView("verification");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleVerificationComplete = () => {
    // User will be automatically logged in after verification
    console.log("Email verified and user logged in!");
  };

  const handleSkipVerification = () => {
    // User can skip but will have limited access
    console.log("User skipped verification - limited access");
  };

  if (view === "verification") {
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
          <div className="brand-icon">
            <Shield size={32} color="#3b82f6" />
          </div>
          <h2 className="auth-title">Create Your Account</h2>
          {/* <p className="auth-subtitle">
            Join thousands of users tracking their expenses securely
          </p> */}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <Input
            label="Full Name"
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            autoComplete="name"
          />

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
              placeholder="Create a strong password"
              required
              autoComplete="new-password"
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

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div
                  className="strength-fill"
                  style={{
                    width: `${(passwordStrength.score / 5) * 100}%`,
                    backgroundColor: getPasswordStrengthColor(
                      passwordStrength.score
                    ),
                  }}
                ></div>
              </div>
              <div className="strength-text">
                <span
                  style={{
                    color: getPasswordStrengthColor(passwordStrength.score),
                  }}
                >
                  {getPasswordStrengthText(passwordStrength.score)}
                </span>
              </div>
              {passwordStrength.feedback.length > 0 && (
                <div className="strength-feedback">
                  <p>Password should include:</p>
                  <ul>
                    {passwordStrength.feedback.map((item, index) => (
                      <li key={index}>
                        <X size={12} color="#ef4444" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="password-input-container">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <div className="password-match">
              {formData.password === formData.confirmPassword ? (
                <div className="match-success">
                  <Check size={16} color="#10b981" />
                  <span>Passwords match</span>
                </div>
              ) : (
                <div className="match-error">
                  <X size={16} color="#ef4444" />
                  <span>Passwords do not match</span>
                </div>
              )}
            </div>
          )}

          {/* <div className="terms-notice">
            <p>
              By creating an account, you agree to our{" "}
              <a href="/terms" className="link-button">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="link-button">
                Privacy Policy
              </a>
            </p>
          </div> */}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            style={{ width: "100%", marginTop: "1rem" }}
          >
            <UserPlus size={20} />
            <span>Create Secure Account</span>
          </Button>
        </form>

        {/* <div className="security-features">
          <h4>Your account will include:</h4>
          <ul>
            <li>
              <Shield size={16} color="#10b981" />
              <span>End-to-end encryption</span>
            </li>
            <li>
              <Shield size={16} color="#10b981" />
              <span>Email verification</span>
            </li>
            <li>
              <Shield size={16} color="#10b981" />
              <span>Secure data backup</span>
            </li>
          </ul>
        </div> */}

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <button onClick={onToggleMode} className="link-button">
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default EnhancedRegister;
