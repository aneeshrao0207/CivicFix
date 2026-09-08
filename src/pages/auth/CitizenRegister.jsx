import { useState } from "react";
import {
  ArrowRight,
  User,
  Mail,
  LockKeyhole,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  MapPin,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { apiRequest } from "../../services/api";
import "./CitizenRegister.css";

function CitizenRegister() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

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
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone.trim(),
        }),
      });

      if (!data.token || !data.user) {
        throw new Error(
          "Registration was successful, but authentication data was not returned."
        );
      }

      if (data.user.role !== "citizen") {
        throw new Error(
          "The registered account is not a citizen account."
        );
      }

      localStorage.setItem(
        "civicfix_token",
        data.token
      );

      localStorage.setItem(
        "civicfix_user",
        JSON.stringify(data.user)
      );

      navigate("/citizen/dashboard");
    } catch (registrationError) {
      console.error(
        "Citizen registration error:",
        registrationError
      );

      setError(
        registrationError.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginNavigation = (event) => {
    event.preventDefault();

    if (isLeaving) return;

    setIsLeaving(true);

    setTimeout(() => {
      navigate("/citizen/login", {
        state: {
          fromRegister: true,
        },
      });
    }, 420);
  };

  return (
    <div
      className={`citizen-register-page ${
        isLeaving ? "is-leaving" : ""
      }`}
    >

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="citizen-register-background">

        <div className="register-grid" />

        <div className="register-glow register-glow-one" />
        <div className="register-glow register-glow-two" />

        <div className="register-ring register-ring-one" />
        <div className="register-ring register-ring-two" />

      </div>


      {/* =====================================================
          LEFT SHOWCASE
      ===================================================== */}

      <section className="citizen-register-showcase">

        <Link
          to="/"
          className="citizen-register-logo"
        >
          <span className="citizen-register-logo-mark">
            C
          </span>

          <span>CivicFix</span>
        </Link>


        <div className="citizen-register-showcase-main">

          <div className="citizen-register-kicker">

            <span className="register-kicker-dot" />

            Join the community

          </div>


          <h1>

            Your voice
            <br />

            <span>can make a difference.</span>

          </h1>


          <p>
            Create your CivicFix account and become
            part of a community that reports problems,
            tracks progress, and helps build better
            places to live.
          </p>


          {/* BENEFITS */}

          <div className="citizen-register-benefits">

            <div className="register-benefit">

              <div className="register-benefit-icon">
                <MapPin size={17} />
              </div>

              <div>
                <strong>Report local issues</strong>

                <span>
                  Make problems visible to the right people.
                </span>
              </div>

            </div>


            <div className="register-benefit">

              <div className="register-benefit-icon">
                <ActivityIcon />
              </div>

              <div>
                <strong>Track what happens</strong>

                <span>
                  Follow every report from submission to resolution.
                </span>
              </div>

            </div>


            <div className="register-benefit">

              <div className="register-benefit-icon">
                <Users size={17} />
              </div>

              <div>
                <strong>Help your community</strong>

                <span>
                  Turn individual reports into collective action.
                </span>
              </div>

            </div>

          </div>

        </div>

        
        <div className="citizen-register-showcase-footer">

          <span>CivicFix</span>

          <i>/</i>

          <span>Citizen Portal</span>

        </div>

      </section>


      {/* =====================================================
          REGISTER FORM
      ===================================================== */}

      <section className="citizen-register-form-section">

        <div className="citizen-register-form-container">

          {/* MOBILE LOGO */}

          <Link
            to="/"
            className="citizen-register-mobile-logo"
          >

            <span className="citizen-register-logo-mark">
              C
            </span>

            CivicFix

          </Link>


          <div className="citizen-register-card">

            <div className="citizen-register-card-line" />


            {/* HEADER */}

            <div className="citizen-register-header">

              <div className="citizen-register-security-icon">

                <Users size={20} />

              </div>

              <div>

                <span className="citizen-register-eyebrow">
                  Citizen Portal
                </span>

                <h2>
                  Create your account
                </h2>

                <p>
                  Join CivicFix and start making
                  your community better.
                </p>

              </div>

            </div>


            {/* ERROR */}

            {error && (

              <div
                className="citizen-register-error"
                role="alert"
              >

                <span>!</span>

                <p>
                  {error}
                </p>

              </div>

            )}


            {/* FORM */}

            <form
              className="citizen-register-form"
              onSubmit={handleSubmit}
            >

              {/* NAME */}

              <div className="citizen-register-field">

                <label htmlFor="name">
                  Full name
                </label>

                <div className="citizen-register-input-wrap">

                  <User
                    size={17}
                    className="citizen-register-input-icon"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="citizen-register-field">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="citizen-register-input-wrap">

                  <Mail
                    size={17}
                    className="citizen-register-input-icon"
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


              {/* PHONE */}

              <div className="citizen-register-field">

                <label htmlFor="phone">
                  Phone number
                </label>

                <div className="citizen-register-input-wrap">

                  <Phone
                    size={17}
                    className="citizen-register-input-icon"
                  />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="citizen-register-field">

                <label htmlFor="password">
                  Password
                </label>

                <div className="citizen-register-input-wrap">

                  <LockKeyhole
                    size={17}
                    className="citizen-register-input-icon"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a password"
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="citizen-register-password-toggle"
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


                {/* PASSWORD HINT */}

                <div className="citizen-register-password-hint">

                  <span
                    className={
                      formData.password.length >= 8
                        ? "valid"
                        : ""
                    }
                  />

                  <span
                    className={
                      formData.password.length >= 12
                        ? "valid"
                        : ""
                    }
                  />

                  <span
                    className={
                      /[A-Z]/.test(formData.password) &&
                      /[0-9]/.test(formData.password)
                        ? "valid"
                        : ""
                    }
                  />

                  <small>
                    Use at least 8 characters
                  </small>

                </div>

              </div>


              {/* TERMS */}

              <label className="citizen-register-terms">

                <input
                  type="checkbox"
                  required
                />

                <span className="register-custom-check">
                  <CheckCircle2 size={11} />
                </span>

                <span>
                  I agree to the CivicFix terms and
                  privacy policy.
                </span>

              </label>


              {/* SUBMIT */}

              <div className="citizen-register-submit">

                <Button
                  type="submit"
                  size="large"
                  disabled={loading}
                >

                  {loading ? (

                    <span className="citizen-register-loading">

                      <span className="citizen-register-spinner" />

                      Creating account...

                    </span>

                  ) : (

                    <>

                      Create account

                      <ArrowRight size={17} />

                    </>

                  )}

                </Button>

              </div>

            </form>


            {/* LOGIN */}

            <div className="citizen-register-login">

              <span>
                Already have an account?
              </span>

              <a
                href="/citizen/login"
                onClick={handleLoginNavigation}
              >
                Sign in
              </a>

            </div>


            {/* SECURITY */}

            <div className="citizen-register-security">

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


          {/* FOOTER */}

          <div className="citizen-register-bottom">

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


/* Small inline activity icon so we don't need another import */

function ActivityIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </svg>
  );
}


export default CitizenRegister;