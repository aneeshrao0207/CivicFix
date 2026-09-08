import { useState } from "react";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { apiRequest } from "../../services/api";
import "./CitizenLogin.css";

function CitizenLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      if (data.user?.role !== "citizen") {
        throw new Error(
          "This account is not registered as a citizen."
        );
      }

      localStorage.setItem("civicfix_token", data.token);

      localStorage.setItem(
        "civicfix_user",
        JSON.stringify(data.user)
      );

      navigate("/citizen/dashboard");
    } catch (loginError) {
      console.error("Citizen login error:", loginError);

      setError(
        loginError.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="citizen-login-page">

      {/* =========================================
          BRAND SIDE
      ========================================= */}

      <section className="citizen-login-brand">

        <div className="citizen-login-brand-grid" />

        <div className="citizen-login-glow citizen-login-glow-one" />
        <div className="citizen-login-glow citizen-login-glow-two" />

        <Link to="/" className="citizen-login-logo">
          <span className="citizen-login-logo-mark">C</span>

          <span>CivicFix</span>
        </Link>

        <div className="citizen-login-brand-content">

          <div className="citizen-login-kicker">
            <span className="citizen-login-kicker-dot" />
            Built for better communities
          </div>

          <h1>
            Your city.
            <br />
            <span>Your voice.</span>
          </h1>

          <p>
            Report civic problems, track their progress,
            and help make your community cleaner, safer,
            and better.
          </p>

          <div className="citizen-login-trust-list">

            <div className="citizen-login-trust-item">
              <CheckCircle2 size={17} />
              <span>Report issues in your community</span>
            </div>

            <div className="citizen-login-trust-item">
              <CheckCircle2 size={17} />
              <span>Track every report in one place</span>
            </div>

            <div className="citizen-login-trust-item">
              <CheckCircle2 size={17} />
              <span>Stay informed as issues are resolved</span>
            </div>

          </div>

        </div>

        <div className="citizen-login-brand-footer">
          <span>Report Problems.</span>
          <span>Drive Action.</span>
        </div>

      </section>


      {/* =========================================
          FORM SIDE
      ========================================= */}

      <section className="citizen-login-form-section">

        <div className="citizen-login-form-container">

          {/* Mobile logo */}

          <Link to="/" className="citizen-login-mobile-logo">
            <span className="citizen-login-logo-mark">C</span>
            <span>CivicFix</span>
          </Link>


          {/* Header */}

          <div className="citizen-login-header">

            <div className="citizen-login-welcome-icon">
              <ShieldCheck size={22} />
            </div>

            <div>
              <span className="citizen-login-eyebrow">
                Citizen Portal
              </span>

              <h2>Welcome back</h2>

              <p>
                Sign in to manage your reports and
                track their progress.
              </p>
            </div>

          </div>


          {/* Error */}

          {error && (
            <div
              className="citizen-login-error"
              role="alert"
            >
              <span className="citizen-login-error-icon">
                !
              </span>

              <span>{error}</span>
            </div>
          )}


          {/* Form */}

          <form
            className="citizen-login-form"
            onSubmit={handleSubmit}
          >

            {/* Email */}

            <div className="citizen-login-field">

              <label htmlFor="email">
                Email address
              </label>

              <div className="citizen-login-input-wrap">

                <Mail
                  size={18}
                  className="citizen-login-input-icon"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />

              </div>

            </div>


            {/* Password */}

            <div className="citizen-login-field">

              <div className="citizen-login-label-row">

                <label htmlFor="password">
                  Password
                </label>

                <Link
                  to="/citizen/forgot-password"
                  className="citizen-login-forgot"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="citizen-login-input-wrap">

                <LockKeyhole
                  size={18}
                  className="citizen-login-input-icon"
                />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="citizen-login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* Remember */}

            <label className="citizen-login-remember">

              <input
                type="checkbox"
                name="remember"
              />

              <span>
                Remember me
              </span>

            </label>


            {/* Submit */}

            <div className="citizen-login-submit">

              <Button
                type="submit"
                size="large"
                disabled={loading}
              >
                {loading ? (
                  <span className="citizen-login-loading">
                    <span className="citizen-login-spinner" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={17} />
                  </>
                )}
              </Button>

            </div>

          </form>


          {/* Register */}

          <div className="citizen-login-register">

            <span>
              Don't have an account?
            </span>

            <Link to="/citizen/register">
              Create one
            </Link>

          </div>


          {/* Security */}

          <div className="citizen-login-security">

            <ShieldCheck size={16} />

            <span>
              Your account and reports are securely protected.
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}

export default CitizenLogin;