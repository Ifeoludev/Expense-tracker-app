import React, { useState } from "react";
import { LogIn } from "lucide-react";
import { authService } from "../../services/authService";
import Input from "../ui/Input";
import Button from "../ui/Button";

function Login({ onToggleMode }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back!</h2>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            style={{ width: "100%", marginTop: "1rem" }}
          >
            <LogIn size={20} />
            <span>Sign In</span>
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button onClick={onToggleMode} className="link-button">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
