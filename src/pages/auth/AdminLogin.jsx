import { useState } from "react";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { apiRequest } from "../../services/api";
import "./Auth.css";

function AdminLogin() {
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

      // Make sure the account is an administrator
      if (data.user?.role !== "admin") {
        throw new Error(
          "This account is not authorized as an administrator."
        );
      }

      // Make sure authentication data was returned
      if (!data.token || !data.user) {
        throw new Error(
          "Login succeeded, but authentication data was not returned."
        );
      }

      // Save JWT token
      localStorage.setItem(
        "civicfix_token",
        data.token
      );

      // Save user information
      localStorage.setItem(
        "civicfix_user",
        JSON.stringify(data.user)
      );

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (loginError) {
      console.error("Admin login error:", loginError);

      setError(
        loginError.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">
      {/* =====================================================
          LEFT AUTHORITY PANEL
      ====================================================== */}

      <section className="admin-auth-brand-panel">
        <div className="admin-auth-brand-glow admin-glow-one" />
        <div className="admin-auth-brand-glow admin-glow-two" />

        {/* BRAND */}

        <Link to="/" className="admin-auth-brand">
          <span className="admin-auth-brand-mark">
            C
          </span>

          <span>
            <strong>CivicFix</strong>
            <small>Authority Portal</small>
          </span>
        </Link>

        {/* MAIN BRAND CONTENT */}

        <div className="admin-auth-brand-content">
          <div className="admin-auth-eyebrow">
            <ShieldCheck size={15} />
            <span>Secure authority access</span>
          </div>

          <h1>
            Better decisions.
            <br />
            <span>Better cities.</span>
          </h1>

          <p>
            A centralized workspace for civic authorities
            to review reports, coordinate responses and
            move community issues toward resolution.
          </p>

          <div className="admin-auth-features">
            <div className="admin-auth-feature">
              <span className="admin-auth-feature-icon">
                <CheckCircle2 size={16} />
              </span>

              <div>
                <strong>Review citizen reports</strong>
                <span>
                  Access incoming civic issues from one
                  workspace.
                </span>
              </div>
            </div>

            <div className="admin-auth-feature">
              <span className="admin-auth-feature-icon">
                <CheckCircle2 size={16} />
              </span>

              <div>
                <strong>Coordinate action</strong>
                <span>
                  Prioritize issues and manage their
                  progress.
                </span>
              </div>
            </div>

            <div className="admin-auth-feature">
              <span className="admin-auth-feature-icon">
                <CheckCircle2 size={16} />
              </span>

              <div>
                <strong>Monitor civic activity</strong>
                <span>
                  Understand what is happening across
                  your service area.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className="admin-auth-brand-footer">
          <span>© CivicFix</span>
          <span className="admin-auth-footer-divider" />
          <span>Authority Operations</span>
        </div>
      </section>

      {/* =====================================================
          FORM PANEL
      ====================================================== */}

      <section className="admin-auth-form-panel">
        <div className="admin-auth-form-container">
          {/* HEADER */}

          <div className="admin-auth-form-header">
            <div className="admin-auth-form-icon">
              <Building2 size={21} />
            </div>

            <div className="admin-auth-form-eyebrow">
              AUTHORITY PORTAL
            </div>

            <h2>Welcome back</h2>

            <p>
              Sign in to securely access the CivicFix
              administration workspace.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="admin-auth-error" role="alert">
              <ShieldCheck size={17} />
              <span>{error}</span>
            </div>
          )}

          {/* FORM */}

          <form
            className="admin-auth-form"
            onSubmit={handleSubmit}
          >
            {/* EMAIL */}

            <div className="admin-auth-field">
              <label htmlFor="admin-email">
                Official email
              </label>

              <div className="admin-auth-input-wrapper">
                <Mail
                  size={18}
                  className="admin-auth-input-icon"
                />

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  className="admin-auth-input"
                  placeholder="admin@civicfix.gov"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="admin-auth-field">
              <label htmlFor="admin-password">
                Password
              </label>

              <div className="admin-auth-input-wrapper">
                <LockKeyhole
                  size={18}
                  className="admin-auth-input-icon"
                />

                <input
                  id="admin-password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  className="admin-auth-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="admin-auth-password-toggle"
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

            {/* OPTIONS */}

            <div className="admin-auth-form-options">
              <label className="admin-auth-checkbox">
                <input
                  type="checkbox"
                  name="remember"
                />

                <span>Remember me</span>
              </label>

              <a
                href="mailto:support@civicfix.example"
                className="admin-auth-help-link"
              >
                Need assistance?
              </a>
            </div>

            {/* SUBMIT */}

            <div className="admin-auth-submit">
              <Button
                type="submit"
                size="large"
                disabled={loading}
              >
                {loading ? (
                  "Verifying access..."
                ) : (
                  <>
                    Access authority portal
                    <ArrowRight size={17} />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* SECURITY NOTE */}

          <div className="admin-auth-security-note">
            <ShieldCheck size={17} />

            <div>
              <strong>Authorized personnel only</strong>

              <span>
                This portal is restricted to registered
                CivicFix authority accounts.
              </span>
            </div>
          </div>

          {/* RETURN */}

          <div className="admin-auth-return">
            <Link to="/">
              <span>←</span>
              Return to CivicFix
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminLogin;