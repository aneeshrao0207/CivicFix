import { useState } from "react";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import "./Auth.css";

function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
  event.preventDefault();

  console.log("Admin login submitted");

  window.location.href = "/admin/dashboard";
};

  return (
    <div className="auth-page">

      {/* LEFT BRAND PANEL */}

      <section className="auth-brand-panel">

        <Link to="/" className="auth-brand">
          <span className="auth-brand-mark">C</span>
          CivicFix
        </Link>

        <div className="auth-brand-content">

          <div className="landing-eyebrow">
            <ShieldCheck size={14} />
            Authorized access
          </div>

          <h1>
            Manage your
            <br />
            <span>city better.</span>
          </h1>

          <p>
            Review citizen reports, coordinate responses,
            monitor civic issues and drive them toward
            resolution from one centralized workspace.
          </p>

        </div>

        <div className="auth-brand-footer">
          CivicFix Authority Portal
        </div>

      </section>

      {/* FORM PANEL */}

      <section className="auth-form-panel">

        <div className="auth-form-container">

          <div className="auth-form-header">

            <h2>Authority sign in</h2>

            <p>
              Sign in with your authorized CivicFix
              administrator account.
            </p>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="auth-field">

              <label htmlFor="admin-email">
                Official email
              </label>

              <div className="auth-input-wrapper">

                <Mail
                  size={18}
                  className="auth-input-icon"
                />

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  className="auth-input"
                  placeholder="admin@civicfix.gov"
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="auth-field">

              <label htmlFor="admin-password">
                Password
              </label>

              <div className="auth-input-wrapper">

                <LockKeyhole
                  size={18}
                  className="auth-input-icon"
                />

                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="auth-input"
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
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

            <div className="auth-form-options">

              <label className="auth-checkbox">

                <input
                  type="checkbox"
                  name="remember"
                />

                Remember me

              </label>

              <a
                href="mailto:support@civicfix.example"
                className="auth-link"
              >
                Need help?
              </a>

            </div>

            {/* SUBMIT */}

            <div className="auth-submit">

              <Button
                type="submit"
                size="large"
              >
                Access dashboard
                <ArrowRight size={17} />
              </Button>

            </div>

          </form>

          <div className="auth-switch">
            <Link to="/">
              ← Return to CivicFix
            </Link>
          </div>

        </div>

      </section>

    </div>
  );
}

export default AdminLogin;