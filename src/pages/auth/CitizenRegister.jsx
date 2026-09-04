import { useState } from "react";
import {
  ArrowRight,
  User,
  Mail,
  LockKeyhole,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { apiRequest } from "../../services/api";
import "./Auth.css";

function CitizenRegister() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove previous error when user starts correcting the form
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });

      // Store authentication information
      localStorage.setItem("civicfix_token", data.token);
      localStorage.setItem(
        "civicfix_user",
        JSON.stringify(data.user)
      );

      // Registration successful
      navigate("/citizen/dashboard");

    } catch (registrationError) {
      console.error("Registration error:", registrationError);

      setError(
        registrationError.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
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

          {/* ERROR MESSAGE */}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

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
                  value={formData.name}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* PHONE */}

            <div className="auth-field">

              <label htmlFor="phone">
                Phone number
              </label>

              <div className="auth-input-wrapper">

                <Phone
                  size={18}
                  className="auth-input-icon"
                />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="auth-input"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
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
                disabled={loading}
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create account
                    <ArrowRight size={17} />
                  </>
                )}
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