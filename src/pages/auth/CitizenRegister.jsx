import { useState } from "react";
import {
  ArrowRight,
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import "./Auth.css";

function CitizenRegister() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
  event.preventDefault();

  console.log("Citizen registration submitted");

  window.location.href = "/citizen/login";
};

  return (
    <div className="auth-page">

      {/* LEFT PANEL */}

      <section className="auth-brand-panel">

        <Link to="/" className="auth-brand">
          <span className="auth-brand-mark">C</span>
          CivicFix
        </Link>

        <div className="auth-brand-content">

          <h1>
            Make your
            <br />
            <span>voice count.</span>
          </h1>

          <p>
            Create your CivicFix account and help turn
            everyday civic problems into visible,
            trackable action.
          </p>

        </div>

        <div className="auth-brand-footer">
          Report Problems. Drive Action.
        </div>

      </section>

      {/* FORM */}

      <section className="auth-form-panel">

        <div className="auth-form-container">

          <div className="auth-form-header">

            <h2>Create your account</h2>

            <p>
              Join CivicFix and start reporting problems
              in your community.
            </p>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            <div className="auth-field">

              <label htmlFor="name">
                Full name
              </label>

              <div className="auth-input-wrapper">

                <User
                  size={18}
                  className="auth-input-icon"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  className="auth-input"
                  placeholder="Your full name"
                  required
                />

              </div>

            </div>

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
                  placeholder="Create a password"
                  minLength={8}
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

            {/* TERMS */}

            <label className="auth-checkbox">

              <input
                type="checkbox"
                required
              />

              I agree to the CivicFix terms and privacy policy.

            </label>

            {/* SUBMIT */}

            <div className="auth-submit">

              <Button
                type="submit"
                size="large"
              >
                Create account
                <ArrowRight size={17} />
              </Button>

            </div>

          </form>

          <div className="auth-switch">

            Already have an account?{" "}

            <Link to="/citizen/login">
              Sign in
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default CitizenRegister;