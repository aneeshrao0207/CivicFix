import { useState } from "react";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  MapPin,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { apiRequest } from "../../services/api";
import "./CitizenLogin.css";

function CitizenLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

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

  const handleRegisterNavigation = (event) => {
    event.preventDefault();

    if (isLeaving) return;

    setIsLeaving(true);

    setTimeout(() => {
      navigate("/citizen/register", {
        state: {
          fromLogin: true,
        },
      });
    }, 420);
  };

  return (
    <div
      className={`citizen-login-page ${
        isLeaving ? "is-leaving" : ""
      }`}
    >
      {/* =========================================
          BACKGROUND
      ========================================= */}

      <div className="citizen-login-background">
        <div className="citizen-login-grid" />

        <div className="login-light login-light-one" />
        <div className="login-light login-light-two" />

        <div className="login-orbit login-orbit-one" />
        <div className="login-orbit login-orbit-two" />
      </div>

      {/* =========================================
          LEFT PANEL
      ========================================= */}

      <section className="citizen-login-showcase">

        <Link to="/" className="citizen-login-logo">
          <span className="citizen-login-logo-mark">C</span>
          <span>CivicFix</span>
        </Link>

        <div className="citizen-login-showcase-main">

          <div className="citizen-login-kicker">
            <span className="login-kicker-dot" />
            Citizen platform
          </div>

          <h1>
            Make your city
            <br />
            <span>better, together.</span>
          </h1>

          <p>
            Report local problems, track their progress,
            and stay connected to the changes happening
            around you.
          </p>

          <div className="citizen-login-features">

            <div className="citizen-login-feature">

              <div className="feature-icon">
                <MapPin size={17} />
              </div>

              <div>
                <strong>Report</strong>
                <span>Local issues</span>
              </div>

            </div>

            <div className="citizen-login-feature">

              <div className="feature-icon">
                <Activity size={17} />
              </div>

              <div>
                <strong>Track</strong>
                <span>Progress</span>
              </div>

            </div>

            <div className="citizen-login-feature">

              <div className="feature-icon">
                <CheckCircle2 size={17} />
              </div>

              <div>
                <strong>Improve</strong>
                <span>Your community</span>
              </div>

            </div>

          </div>

        </div>

        {/* Floating information card */}

        <div className="citizen-login-status-card">

          <div className="status-card-header">

            <div className="status-card-title">
              <span className="status-pulse" />
              Community activity
            </div>

            <span className="status-live">
              Live
            </span>

          </div>

          <div className="status-card-body">

            <div className="status-avatars">
              <span>A</span>
              <span>R</span>
              <span>K</span>
              <span>+</span>
            </div>

            <div className="status-copy">

              <strong>
                Citizens are taking action
              </strong>

              <span>
                Reports are being tracked every day.
              </span>

            </div>

          </div>

          <div className="status-line">
            <span />
          </div>

        </div>

        <div className="citizen-login-showcase-footer">
          CivicFix
          <span>/</span>
          Citizen Portal
        </div>

      </section>

      {/* =========================================
          RIGHT PANEL
      ========================================= */}

      <section className="citizen-login-form-section">

        <div className="citizen-login-form-container">

          <Link
            to="/"
            className="citizen-login-mobile-logo"
          >
            <span className="citizen-login-logo-mark">
              C
            </span>
            CivicFix
          </Link>

          <div className="citizen-login-card">

            <div className="citizen-login-card-highlight" />

            {/* HEADER */}

            <div className="citizen-login-header">

              <div className="citizen-login-security-icon">
                <ShieldCheck size={20} />
              </div>

              <div>

                <span className="citizen-login-eyebrow">
                  Citizen Portal
                </span>

                <h2>Welcome back</h2>

                <p>
                  Sign in to continue to your CivicFix
                  dashboard.
                </p>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div
                className="citizen-login-error"
                role="alert"
              >
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            {/* FORM */}

            <form
              className="citizen-login-form"
              onSubmit={handleSubmit}
            >

              {/* EMAIL */}

              <div className="citizen-login-field">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="citizen-login-input-wrap">

                  <Mail
                    size={17}
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

              {/* PASSWORD */}

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
                    size={17}
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
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>

              {/* REMEMBER */}

              <label className="citizen-login-remember">

                <input
                  type="checkbox"
                  name="remember"
                />

                <span className="custom-checkbox">
                  <CheckCircle2 size={11} />
                </span>

                <span>
                  Keep me signed in
                </span>

              </label>

              {/* SUBMIT */}

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

            {/* REGISTER */}

            <div className="citizen-login-register">

              <span>
                New to CivicFix?
              </span>

              <a
                href="/citizen/register"
                onClick={handleRegisterNavigation}
              >
                Create an account
              </a>

            </div>

            {/* SECURITY */}

            <div className="citizen-login-security">

              <ShieldCheck size={14} />

              <span>
                Secure authentication
              </span>

              <i />

              <span>
                Protected connection
              </span>

            </div>

          </div>

          <div className="citizen-login-bottom">
            <span>
              © {new Date().getFullYear()} CivicFix
            </span>

            <span>
              Better cities start with participation.
            </span>
          </div>

        </div>

      </section>

    </div>
  );
}

export default CitizenLogin;