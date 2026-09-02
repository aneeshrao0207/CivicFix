import { useState } from "react";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import "./Auth.css";

function CitizenLogin() {
  const [showPassword, setShowPassword] = useState(false);

 const handleSubmit = (event) => {
  event.preventDefault();

  console.log("Citizen login submitted");

  window.location.href = "/citizen/dashboard";
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

          <h1>
            Your city.
            <br />
            <span>Your voice.</span>
          </h1>

          <p>
            Report problems around you, follow their progress
            and stay informed as your community gets better.
          </p>

        </div>

        <div className="auth-brand-footer">
          Report Problems. Drive Action.
        </div>

      </section>

      {/* FORM PANEL */}

      <section className="auth-form-panel">

        <div className="auth-form-container">

          <div className="auth-form-header">

            <h2>Welcome back</h2>

            <p>
              Sign in to view your reports and track
              their progress.
            </p>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="auth-field">

              <label htmlFor="email">
                Email address
              </label>

              <div className="auth-input-wrapper">

                <Mail
                  size={18}
                  className="auth-input-icon"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="auth-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="auth-input-wrapper">

                <LockKeyhole
                  size={18}
                  className="auth-input-icon"
                />

                <input
                  id="password"
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

              <Link
                to="/citizen/forgot-password"
                className="auth-link"
              >
                Forgot password?
              </Link>

            </div>

            {/* SUBMIT */}

            <div className="auth-submit">

              <Button
                type="submit"
                size="large"
              >
                Sign in
                <ArrowRight size={17} />
              </Button>

            </div>

          </form>

          <div className="auth-switch">

            Don't have an account?{" "}

            <Link to="/citizen/register">
              Create one
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default CitizenLogin;