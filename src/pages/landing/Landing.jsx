import {
  ArrowRight,
  Check,
  Menu,
  MapPin,
  ShieldCheck,
  Sparkles,
  X,
  Moon,
  Sun,
  Construction,
  Lightbulb,
  Trash2,
  Droplets,
  Trees,
  TrafficCone,
  Building2,
  MoreHorizontal,
  Search,
  ClipboardCheck,
  Wrench,
  TrendingUp,
  Eye,
  Users,
  BarChart3,
  Clock3,
  ChevronRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Button from "../../components/ui/Button";
import "./Landing.css";


function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* =========================================================
     THEME
  ========================================================= */

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("civicfix_theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("civicfix_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };


  /* =========================================================
     CLOSE MOBILE MENU ON ESC
  ========================================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  /* =========================================================
     NAVIGATION
  ========================================================= */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };


  return (
    <div className="landing">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="landing-navbar">
        <div className="landing-navbar-inner">

          <Link
            to="/"
            className="landing-logo"
            onClick={closeMobileMenu}
          >
            <span className="landing-logo-mark">
              C
            </span>

            <span className="landing-logo-text">
              Civic<span>Fix</span>
            </span>
          </Link>


          {/* DESKTOP NAV */}

          <nav className="landing-nav-links">
            <a href="#how-it-works">
              How It Works
            </a>

            <a href="#features">
              Features
            </a>

            <a href="#about">
              About
            </a>
          </nav>


          {/* DESKTOP ACTIONS */}

          <div className="landing-nav-actions">

            <button
              type="button"
              className="landing-theme-toggle"
              onClick={toggleTheme}
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
              title={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              {theme === "light" ? (
                <Moon size={17} />
              ) : (
                <Sun size={17} />
              )}
            </button>

            <Link to="/citizen/login">
              <Button
                variant="secondary"
                size="small"
              >
                Login
              </Button>
            </Link>

            <Link to="/citizen/report">
              <Button size="small">
                Report an Issue
                <ArrowRight size={15} />
              </Button>
            </Link>

          </div>


          {/* MOBILE MENU BUTTON */}

          <button
            className="landing-mobile-menu-button"
            type="button"
            aria-label={
              mobileMenuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={mobileMenuOpen}
            onClick={() =>
              setMobileMenuOpen((value) => !value)
            }
          >
            {mobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

        </div>


        {/* MOBILE MENU */}

        {mobileMenuOpen && (
          <div className="landing-mobile-menu">

            <a
              href="#how-it-works"
              onClick={closeMobileMenu}
            >
              How It Works
            </a>

            <a
              href="#features"
              onClick={closeMobileMenu}
            >
              Features
            </a>

            <a
              href="#about"
              onClick={closeMobileMenu}
            >
              About
            </a>


            <div className="landing-mobile-actions">

              <button
                type="button"
                className="landing-theme-toggle landing-mobile-theme-toggle"
                onClick={toggleTheme}
                aria-label={
                  theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
              >
                {theme === "light" ? (
                  <>
                    <Moon size={17} />
                    Dark mode
                  </>
                ) : (
                  <>
                    <Sun size={17} />
                    Light mode
                  </>
                )}
              </button>


              <Link
                to="/citizen/login"
                onClick={closeMobileMenu}
              >
                <Button
                  variant="secondary"
                  size="small"
                >
                  Login
                </Button>
              </Link>


              <Link
                to="/citizen/report"
                onClick={closeMobileMenu}
              >
                <Button size="small">
                  Report an Issue
                  <ArrowRight size={15} />
                </Button>
              </Link>

            </div>

          </div>
        )}
      </header>


      <main>

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="landing-hero">

          <div className="landing-hero-content">

            <div className="landing-eyebrow">
              <span className="landing-eyebrow-icon">
                <Sparkles size={13} />
              </span>

              BUILD A BETTER COMMUNITY
            </div>


            <h1>
              See a problem.
              <br />
              <span>Make it visible.</span>
            </h1>


            <p className="landing-hero-description">
              CivicFix makes it simple to report problems around
              you, while giving authorities the visibility they
              need to review, prioritize and resolve them.
            </p>


            <div className="landing-hero-actions">

              <Link to="/citizen/report">
                <Button size="large">
                  Report an Issue
                  <ArrowRight size={17} />
                </Button>
              </Link>

              <Link to="/citizen/login">
                <Button
                  variant="secondary"
                  size="large"
                >
                  Track My Reports
                </Button>
              </Link>

            </div>


            <div className="landing-hero-benefits">

              <div className="landing-hero-benefit">
                <span>
                  <Check size={12} />
                </span>
                Simple reporting
              </div>

              <div className="landing-hero-benefit">
                <span>
                  <Check size={12} />
                </span>
                Transparent tracking
              </div>

              <div className="landing-hero-benefit">
                <span>
                  <Check size={12} />
                </span>
                Connected departments
              </div>

            </div>

          </div>


          {/* HERO PRODUCT VISUAL */}

          <div className="landing-visual">

            <div className="landing-visual-glow" />

            <div className="landing-grid" />


            {/* MAP */}

            <div className="landing-map-card">

              <div className="landing-map-header">

                <div>
                  <span className="landing-map-kicker">
                    CIVICFIX MAP
                  </span>

                  <span className="landing-map-title">
                    Community issues
                  </span>
                </div>


                <span className="landing-map-status">
                  <span className="landing-map-status-dot" />
                  Live overview
                </span>

              </div>


              <div className="landing-map-area">

                <div className="landing-map-road landing-map-road-one" />
                <div className="landing-map-road landing-map-road-two" />
                <div className="landing-map-road landing-map-road-three" />

                <div className="landing-map-block block-one" />
                <div className="landing-map-block block-two" />
                <div className="landing-map-block block-three" />
                <div className="landing-map-block block-four" />


                <div className="landing-map-marker marker-red">
                  <MapPin size={15} />
                </div>

                <div className="landing-map-marker marker-yellow">
                  <MapPin size={15} />
                </div>

                <div className="landing-map-marker marker-blue">
                  <MapPin size={15} />
                </div>

                <div className="landing-map-marker marker-green">
                  <MapPin size={15} />
                </div>


                <div className="landing-map-location">
                  <span className="landing-map-location-dot" />
                  Your community
                </div>

              </div>

            </div>


            {/* ISSUE CARD */}

            <div className="landing-floating-issue">

              <div className="landing-floating-top">

                <div className="landing-floating-icon">
                  <MapPin size={16} />
                </div>


                <div>
                                    <span className="landing-floating-label">
                    ISSUE REPORTED
                  </span>

                  <strong>
                    Streetlight outage
                  </strong>
                </div>

                <span className="landing-floating-status">
                  In Review
                </span>

              </div>


              <div className="landing-floating-location">
                <MapPin size={13} />
                MG Road · Bengaluru
              </div>


              <div className="landing-floating-progress">

                <div className="landing-floating-progress-track">
                  <span />
                </div>

                <span>
                  Review in progress
                </span>

              </div>

            </div>


            {/* TRUST CARD */}

            <div className="landing-floating-trust">

              <div className="landing-floating-trust-icon">
                <ShieldCheck size={17} />
              </div>

              <div>
                <strong>
                  Every report stays visible
                </strong>

                <span>
                  Track progress from submission to resolution
                </span>
              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            HOW CIVICFIX WORKS
        =================================================== */}

        <section
          className="landing-section landing-how-section"
          id="how-it-works"
        >

          <div className="landing-section-inner">

            <div className="landing-section-heading">

              <div className="landing-section-label">
                HOW IT WORKS
              </div>

              <h2>
                From seeing a problem
                <br />
                to seeing progress.
              </h2>

              <p>
                CivicFix connects citizens and authorities through
                a simple, transparent workflow designed to keep
                every issue moving forward.
              </p>

            </div>


            <div className="landing-process">

              {/* STEP 01 */}

              <article className="process-card">

                <div className="process-card-top">

                  <span className="process-number">
                    01
                  </span>

                  <div className="process-icon">
                    <Search size={19} />
                  </div>

                </div>

                <span className="process-tag">
                  REPORT
                </span>

                <h3>
                  Spot something?
                </h3>

                <p>
                  See a pothole, broken streetlight or overflowing
                  bin? Capture the problem and send a report in a
                  few simple steps.
                </p>

                <div className="process-arrow">
                  <ArrowRight size={16} />
                </div>

              </article>


              {/* STEP 02 */}

              <article className="process-card">

                <div className="process-card-top">

                  <span className="process-number">
                    02
                  </span>

                  <div className="process-icon">
                    <ClipboardCheck size={19} />
                  </div>

                </div>

                <span className="process-tag">
                  REVIEW
                </span>

                <h3>
                  Someone takes it up.
                </h3>

                <p>
                  Authorities review the report, understand its
                  priority and route it to the department
                  responsible for action.
                </p>

                <div className="process-arrow">
                  <ArrowRight size={16} />
                </div>

              </article>


              {/* STEP 03 */}

              <article className="process-card">

                <div className="process-card-top">

                  <span className="process-number">
                    03
                  </span>

                  <div className="process-icon">
                    <Wrench size={19} />
                  </div>

                </div>

                <span className="process-tag">
                  RESOLVE
                </span>

                <h3>
                  Action happens.
                </h3>

                <p>
                  The responsible team works on the issue and
                  updates its status so everyone can see what is
                  happening.
                </p>

                <div className="process-arrow">
                  <ArrowRight size={16} />
                </div>

              </article>


              {/* STEP 04 */}

              <article className="process-card">

                <div className="process-card-top">

                  <span className="process-number">
                    04
                  </span>

                  <div className="process-icon">
                    <TrendingUp size={19} />
                  </div>

                </div>

                <span className="process-tag">
                  IMPROVE
                </span>

                <h3>
                  Community gets better.
                </h3>

                <p>
                  Resolved issues become visible progress, helping
                  communities identify problems and improve over
                  time.
                </p>

                <div className="process-arrow">
                  <ArrowRight size={16} />
                </div>

              </article>

            </div>

          </div>

        </section>


        {/* ===================================================
            ISSUE CATEGORIES
        =================================================== */}

        <section
          className="landing-section landing-categories-section"
          id="features"
        >

          <div className="landing-section-inner">

            <div className="landing-category-heading">

              <div>

                <div className="landing-section-label">
                  WHAT CAN YOU REPORT?
                </div>

                <h2>
                  Everyday problems.
                  <br />
                  One place to report them.
                </h2>

              </div>

              <p>
                CivicFix brings common civic issues into one
                organized reporting experience, making it easier
                to tell authorities exactly what needs attention.
              </p>

            </div>


            <div className="landing-category-grid">

              <article className="category-card category-card-featured">

                <div className="category-icon">
                  <Construction size={21} />
                </div>

                <div>
                  <h3>
                    Roads & Potholes
                  </h3>

                  <p>
                    Damaged roads, potholes and unsafe surfaces.
                  </p>
                </div>

                <ArrowRight size={17} />

              </article>


              <article className="category-card">

                <div className="category-icon">
                  <Lightbulb size={21} />
                </div>

                <div>
                  <h3>
                    Streetlights
                  </h3>

                  <p>
                    Broken or non-functional lights.
                  </p>
                </div>

                <ArrowRight size={17} />

              </article>


              <article className="category-card">

                <div className="category-icon">
                  <Trash2 size={21} />
                </div>

                <div>
                  <h3>
                    Waste Management
                  </h3>

                  <p>
                    Overflowing bins and waste concerns.
                  </p>
                </div>

                <ArrowRight size={17} />

              </article>


              <article className="category-card">

                <div className="category-icon">
                  <Droplets size={21} />
                </div>

                <div>
                  <h3>
                    Water & Drainage
                  </h3>

                  <p>
                    Leaks, drainage and water issues.
                  </p>
                </div>

                <ArrowRight size={17} />

              </article>


              <article className="category-card">

                <div className="category-icon">
                  <Trees size={21} />
                </div>

                <div>
                  <h3>
                    Parks & Public Spaces
                  </h3>

                  <p>
                    Issues affecting shared public spaces.
                  </p>
                </div>

                <ArrowRight size={17} />

              </article>


              <article className="category-card">

                <div className="category-icon">
                  <TrafficCone size={21} />
                </div>

                <div>
                  <h3>
                    Traffic & Signals
                  </h3>

                  <p>
                    Signals, signs and traffic concerns.
                  </p>
                </div>

                <ArrowRight size={17} />

              </article>


              <article className="category-card">

                <div className="category-icon">
                  <Building2 size={21} />
                </div>

                <div>
                  <h3>
                    Infrastructure
                  </h3>

                  <p>
                    Other public infrastructure problems.
                  </p>
                </div>

                <ArrowRight size={17} />

              </article>


              <article className="category-card">

                <div className="category-icon">
                  <MoreHorizontal size={21} />
                </div>

                <div>
                  <h3>
                    Other
                  </h3>

                  <p>
                    Something that does not fit a category.
                  </p>
                </div>

                <ArrowRight size={17} />

              </article>

            </div>

          </div>

        </section>


        {/* ===================================================
            WHY CIVICFIX
        =================================================== */}

        <section
          className="landing-section landing-why-section"
          id="about"
        >

          <div className="landing-section-inner">

            <div className="landing-why-grid">

              <div className="landing-why-content">

                <div className="landing-section-label">
                  WHY CIVICFIX
                </div>

                <h2>
                  Reporting is only
                  <br />
                  the beginning.
                </h2>

                <p>
                  A civic reporting platform should do more than
                  collect complaints. CivicFix creates visibility
                  between citizens and the people responsible for
                  solving the problem.
                </p>

                <Link
                  to="/citizen/report"
                  className="landing-inline-link"
                >
                  Start a report
                  <ArrowRight size={16} />
                </Link>

              </div>


              <div className="landing-why-features">

                <article className="why-feature">

                  <div className="why-feature-icon">
                    <Eye size={20} />
                  </div>

                  <div>
                    <span>
                      01 · TRANSPARENCY
                    </span>

                    <h3>
                      Know what is happening.
                    </h3>

                    <p>
                      Citizens can follow the progress of their
                      reports instead of wondering what happened
                      after submission.
                    </p>
                  </div>

                </article>


                <article className="why-feature">

                  <div className="why-feature-icon">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <span>
                      02 · ACCOUNTABILITY
                    </span>

                    <h3>
                      Give every issue ownership.
                    </h3>

                    <p>
                      Reports can be prioritized and routed to the
                      department responsible for taking action.
                    </p>
                  </div>

                </article>


                <article className="why-feature">

                  <div className="why-feature-icon">
                    <Users size={20} />
                  </div>

                  <div>
                    <span>
                      03 · COMMUNITY
                    </span>

                    <h3>
                      Turn individual reports into progress.
                    </h3>

                    <p>
                      A structured reporting experience helps
                      communities make everyday civic problems
                      visible.
                    </p>
                  </div>

                </article>


                <article className="why-feature">

                  <div className="why-feature-icon">
                    <BarChart3 size={20} />
                  </div>

                  <div>
                    <span>
                      04 · INSIGHT
                    </span>

                    <h3>
                      Understand recurring problems.
                    </h3>

                    <p>
                      Organized issue data gives authorities a
                      clearer view of categories, priorities and
                      operational trends.
                    </p>
                  </div>

                </article>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            PRODUCT PREVIEW
        =================================================== */}

        <section className="landing-preview-section">

          <div className="landing-section-inner">

            <div className="landing-preview-heading">

              <div>

                <div className="landing-section-label">
                  THE CIVICFIX EXPERIENCE
                </div>

                <h2>
                  One place to see
                  <br />
                  what needs attention.
                </h2>

              </div>

              <p>
                A focused citizen dashboard keeps reports,
                statuses and recent activity together so the
                experience stays simple from day one.
              </p>

            </div>


            <div className="landing-dashboard-preview">

              {/* DASHBOARD SIDEBAR */}

              <aside className="preview-sidebar">

                <div className="preview-sidebar-brand">
                  <span>
                    C
                  </span>

                  <strong>
                    CivicFix
                  </strong>
                </div>


                <div className="preview-user">

                  <div className="preview-avatar">
                    AR
                  </div>

                  <div>
                    <strong>
                      Citizen
                    </strong>

                    <span>
                      My workspace
                    </span>
                  </div>

                </div>


                <nav className="preview-nav">

                  <div className="preview-nav-item active">
                    <BarChart3 size={15} />
                    Overview
                  </div>

                  <div className="preview-nav-item">
                    <Construction size={15} />
                    My Reports
                  </div>

                  <div className="preview-nav-item">
                    <Clock3 size={15} />
                    Activity
                  </div>

                </nav>

              </aside>


              {/* DASHBOARD CONTENT */}

              <div className="preview-main">

                <div className="preview-topbar">

                  <div>
                    <span>
                      CITIZEN DASHBOARD
                    </span>

                    <h3>
                      Good morning.
                    </h3>
                  </div>

                  <div className="preview-topbar-action">
                    <Link to="/citizen/report">
                      <Button size="small">
                        Report issue
                        <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </div>

                </div>


                {/* STAT CARDS */}

                <div className="preview-stats">

                  <div className="preview-stat">

                    <span>
                      TOTAL REPORTS
                    </span>

                    <strong>
                      04
                    </strong>

                    <small>
                      Your submitted issues
                    </small>

                  </div>


                  <div className="preview-stat">

                    <span>
                      IN PROGRESS
                    </span>

                    <strong>
                      02
                    </strong>

                    <small>
                      Currently being reviewed
                    </small>

                  </div>


                  <div className="preview-stat">

                    <span>
                      RESOLVED
                    </span>

                    <strong>
                      01
                    </strong>

                    <small>
                      Successfully completed
                    </small>

                  </div>

                </div>


                {/* RECENT REPORT */}

                <div className="preview-report-card">

                  <div className="preview-report-header">

                    <div>
                      <span>
                        RECENT REPORT
                      </span>

                      <h4>
                        Streetlight outage
                      </h4>
                    </div>

                    <span className="preview-status">
                      In Review
                    </span>

                  </div>


                  <div className="preview-report-meta">

                    <div>
                      <MapPin size={13} />
                      MG Road, Bengaluru
                    </div>

                    <div>
                      <Clock3 size={13} />
                      Updated recently
                    </div>

                  </div>


                  <div className="preview-progress">

                    <div className="preview-progress-line">

                      <span className="completed" />
                      <span className="completed" />
                      <span className="current" />
                      <span />

                    </div>

                    <div className="preview-progress-labels">

                      <span>
                        Submitted
                      </span>

                      <span>
                        Reviewed
                      </span>

                      <span>
                        In progress
                      </span>

                      <span>
                        Resolved
                      </span>

                    </div>

                  </div>

                </div>


                {/* LOWER CARDS */}

                <div className="preview-lower-grid">

                  <div className="preview-mini-card">

                    <div className="preview-mini-icon">
                      <ShieldCheck size={17} />
                    </div>

                    <div>
                      <strong>
                        Transparent updates
                      </strong>

                      <span>
                        Stay informed as your issue moves forward.
                      </span>
                    </div>

                    <ChevronRight size={16} />

                  </div>


                  <div className="preview-mini-card">

                    <div className="preview-mini-icon">
                      <MapPin size={17} />
                    </div>

                    <div>
                      <strong>
                        Location aware
                      </strong>

                      <span>
                        Help authorities understand where action is needed.
                      </span>
                    </div>

                    <ChevronRight size={16} />

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            CITIZENS + AUTHORITIES
        =================================================== */}

        <section className="landing-section landing-roles-section">

          <div className="landing-section-inner">

            <div className="landing-roles-heading">

              <div className="landing-section-label">
                BUILT FOR BOTH SIDES
              </div>

              <h2>
                Better reporting for citizens.
                <br />
                Better visibility for authorities.
              </h2>

            </div>


            <div className="landing-roles-grid">

              {/* CITIZEN */}

              <article className="role-card role-card-citizen">

                <div className="role-card-top">

                  <span className="role-label">
                    FOR CITIZENS
                  </span>

                  <div className="role-icon">
                    <Users size={20} />
                  </div>

                </div>


                <h3>
                  Make the problem visible.
                </h3>

                <p>
                  Submit civic issues, provide useful details and
                  follow what happens after your report is received.
                </p>


                <ul className="role-list">

                  <li>
                    <Check size={15} />
                    Simple issue reporting
                  </li>

                  <li>
                    <Check size={15} />
                    Track report status
                  </li>

                  <li>
                    <Check size={15} />
                    Receive issue updates
                  </li>

                </ul>


                <Link to="/citizen/report">
                  <Button size="small">
                    Report an Issue
                    <ArrowRight size={15} />
                  </Button>
                </Link>

              </article>


              {/* AUTHORITY */}

              <article className="role-card role-card-authority">

                <div className="role-card-top">

                  <span className="role-label">
                    FOR AUTHORITIES
                  </span>

                  <div className="role-icon">
                    <BarChart3 size={20} />
                  </div>

                </div>


                <h3>
                  Turn reports into action.
                </h3>

                <p>
                  Give responsible teams a structured view of
                  incoming issues, priorities, locations and status.
                </p>


                <ul className="role-list">

                  <li>
                    <Check size={15} />
                    Centralized issue management
                  </li>

                  <li>
                    <Check size={15} />
                    Prioritize and assign reports
                  </li>

                  <li>
                    <Check size={15} />
                    Monitor progress and trends
                  </li>

                </ul>


                <Link to="/admin/login">
                  <Button
                    variant="secondary"
                    size="small"
                  >
                    Authority Login
                    <ArrowRight size={15} />
                  </Button>
                </Link>

              </article>

            </div>

          </div>

        </section>


        {/* ===================================================
            FINAL CTA
        =================================================== */}

        <section className="landing-final-cta">

          <div className="landing-final-cta-inner">

            <div className="landing-final-cta-glow" />

            <div className="landing-final-cta-content">

              <div className="landing-section-label">
                START WITH ONE REPORT
              </div>

              <h2>
                Your city starts
                <br />
                with one report.
              </h2>

              <p>
                See something that needs attention?
                Make it visible and help move it forward.
              </p>


              <div className="landing-final-actions">

                <Link to="/citizen/report">
                  <Button size="large">
                    Report an Issue
                    <ArrowRight size={17} />
                  </Button>
                </Link>

                <Link to="/citizen/login">
                  <Button
                    variant="secondary"
                    size="large"
                  >
                    Track My Reports
                  </Button>
                </Link>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="landing-footer">

        <div className="landing-footer-inner">

          <div className="landing-footer-main">

            <div className="landing-footer-brand">

              <Link
                to="/"
                className="landing-logo"
              >
                <span className="landing-logo-mark">
                  C
                </span>

                <span className="landing-logo-text">
                  Civic<span>Fix</span>
                </span>
              </Link>


              <p>
                Making everyday civic problems visible,
                trackable and easier to resolve.
              </p>

            </div>


            <div className="landing-footer-links">

              <div className="footer-column">

                <span>
                  PRODUCT
                </span>

                <a href="#how-it-works">
                  How It Works
                </a>

                <a href="#features">
                  Features
                </a>

                <a href="#about">
                  About
                </a>

              </div>


              <div className="footer-column">

                <span>
                  CITIZENS
                </span>

                <Link to="/citizen/report">
                  Report an Issue
                </Link>

                <Link to="/citizen/login">
                  Track Reports
                </Link>

                <Link to="/citizen/register">
                  Create Account
                </Link>

              </div>


              <div className="footer-column">

                <span>
                  AUTHORITIES
                </span>

                <Link to="/admin/login">
                  Authority Login
                </Link>

                <a href="#about">
                  Platform Overview
                </a>

              </div>

            </div>

          </div>


          <div className="landing-footer-bottom">

            <span>
              © {new Date().getFullYear()} CivicFix. Built for better communities.
            </span>

            <span>
              Civic technology · Community · Accountability
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Landing;