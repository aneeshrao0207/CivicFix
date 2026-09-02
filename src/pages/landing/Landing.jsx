import { ArrowRight, Check, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing">

      {/* ================================
          NAVBAR
      ================================= */}

      <header className="landing-navbar">
        <div className="landing-navbar-inner">

          <Link to="/" className="landing-logo">
            <span className="landing-logo-mark">C</span>
            CivicFix
          </Link>

          <nav className="landing-nav-links">
            <a href="#how-it-works">How it works</a>
            <a href="#for-citizens">For Citizens</a>
            <a href="#for-authorities">For Authorities</a>
          </nav>

          <div className="landing-nav-actions">
            <Link to="/citizen/login">
              <Button variant="secondary" size="small">
                Login
              </Button>
            </Link>

            <Link to="/citizen/report">
              <Button size="small">
                Report Issue
              </Button>
            </Link>
          </div>

        </div>
      </header>

      {/* ================================
          HERO
      ================================= */}

      <main>

        <section className="landing-hero">

          <div className="landing-hero-content">

            <div className="landing-eyebrow">
              <span className="landing-eyebrow-dot" />
              Civic infrastructure, connected
            </div>

            <h1>
              Report problems.
              <br />
              <span>Drive action.</span>
            </h1>

            <p className="landing-hero-description">
              CivicFix gives citizens a simple way to report problems
              around them and gives authorities the tools to review,
              prioritize, track and resolve them.
            </p>

            <div className="landing-hero-actions">

              <Link to="/citizen/report">
                <Button size="large">
                  Report an Issue
                  <ArrowRight size={17} />
                </Button>
              </Link>

              <Link to="/citizen/login">
                <Button variant="secondary" size="large">
                  Track a Report
                </Button>
              </Link>

            </div>

          </div>

          {/* Visual */}

          <div className="landing-visual">

            <div className="landing-grid" />

            <div className="landing-map-card">

              <div className="landing-map-header">

                <span className="landing-map-title">
                  Community issues
                </span>

                <span className="landing-map-status">
                  <span className="landing-map-status-dot" />
                  Live overview
                </span>

              </div>

              <div className="landing-map-area">

                <div className="landing-road landing-road-one" />
                <div className="landing-road landing-road-two" />

                <div className="issue-marker marker-red" />
                <div className="issue-marker marker-yellow" />
                <div className="issue-marker marker-blue" />
                <div className="issue-marker marker-green" />

              </div>

            </div>

          </div>

        </section>

        {/* ================================
            HOW IT WORKS
        ================================= */}

        <section
          className="landing-section"
          id="how-it-works"
        >

          <div className="landing-section-inner">

            <div className="landing-section-heading">

              <div className="landing-section-label">
                How it works
              </div>

              <h2>
                From a problem on the street
                to action on the ground.
              </h2>

              <p>
                CivicFix connects the complete reporting and
                resolution journey in one transparent workflow.
              </p>

            </div>

            <div className="landing-process">

              <article className="process-card">
                <div className="process-number">01 / REPORT</div>

                <h3>Spot something?</h3>

                <p>
                  Submit the problem with a description,
                  photo and location so authorities have
                  the information they need to act.
                </p>
              </article>

              <article className="process-card">
                <div className="process-number">02 / REVIEW</div>

                <h3>Authorities review.</h3>

                <p>
                  Reports are reviewed, prioritized and
                  assigned to the department responsible
                  for handling the issue.
                </p>
              </article>

              <article className="process-card">
                <div className="process-number">03 / RESOLVE</div>

                <h3>Track the action.</h3>

                <p>
                  Follow the issue as it moves through
                  the workflow until the problem is
                  resolved.
                </p>
              </article>

            </div>

          </div>

        </section>

        {/* ================================
            AUDIENCES
        ================================= */}

        <section className="landing-section">

          <div className="landing-section-inner">

            <div className="landing-two-column">

              <article
                className="audience-card"
                id="for-citizens"
              >

                <h3>For itizens</h3>

                <p>
                  Turn observations into actionable reports
                  and stay informed about what happens next.
                </p>

                <ul className="audience-list">

                  <li>
                    <span className="audience-check">
                      <Check size={13} />
                    </span>
                    Report issues with photos and location
                  </li>

                  <li>
                    <span className="audience-check">
                      <Check size={13} />
                    </span>
                    Track every submitted report
                  </li>

                  <li>
                    <span className="audience-check">
                      <Check size={13} />
                    </span>
                    See status and resolution updates
                  </li>

                </ul>

              </article>

              <article
                className="audience-card"
                id="for-authorities"
              >

                <h3>For Authorities</h3>

                <p>
                  Manage civic issues through a centralized
                  workflow built around visibility and action.
                </p>

                <ul className="audience-list">

                  <li>
                    <span className="audience-check">
                      <Check size={13} />
                    </span>
                    Review and prioritize reports
                  </li>

                  <li>
                    <span className="audience-check">
                      <Check size={13} />
                    </span>
                    Assign issues to departments
                  </li>

                  <li>
                    <span className="audience-check">
                      <Check size={13} />
                    </span>
                    Monitor issues geographically
                  </li>

                </ul>

              </article>

            </div>

          </div>

        </section>

        {/* ================================
            CTA
        ================================= */}

        <section className="landing-cta">

          <div className="landing-cta-inner">

            <h2>See a problem? Report it.</h2>

            <p>
              Help make your surroundings better by turning
              civic problems into visible, trackable action.
            </p>

            <Link to="/citizen/report">
              <Button size="large">
                Report an Issue
                <ArrowRight size={17} />
              </Button>
            </Link>

          </div>

        </section>

      </main>

      {/* ================================
          FOOTER
      ================================= */}

      <footer className="landing-footer">

        <div className="landing-footer-inner">

          <span>
            © 2026 CivicFix
          </span>

          <span>
            Report Problems. Drive Action.
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Landing;