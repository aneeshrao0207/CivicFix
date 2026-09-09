import { useEffect, useRef, useState } from "react";

import {
  Bell,
  ChevronDown,
  Home,
  ClipboardList,
  FilePlus2,
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
  UserRound,
  ArrowLeft,
  Mail,
} from "lucide-react";

import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import "./CitizenLayout.css";

const CitizenLayout = () => {
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [selectedHelp, setSelectedHelp] = useState(null);

  /* =====================================================
     THEME
  ====================================================== */

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("civicfix_theme") || "light";
  });

  /* =====================================================
     CURRENT USER
  ====================================================== */

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser =
        localStorage.getItem("civicfix_user");

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    } catch {
      return null;
    }
  });

  /* =====================================================
     APPLY THEME
  ====================================================== */

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      "civicfix_theme",
      theme
    );
  }, [theme]);

  /* =====================================================
     THEME TOGGLE
  ====================================================== */

  const handleThemeToggle = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark"
        ? "light"
        : "dark"
    );
  };

  /* =====================================================
     CLOSE PROFILE WHEN CLICKING OUTSIDE
  ====================================================== */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =====================================================
     CLOSE MOBILE SIDEBAR ON DESKTOP
  ====================================================== */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  /* =====================================================
     LOGOUT
  ====================================================== */

  const handleLogout = () => {
    localStorage.removeItem("civicfix_token");
    localStorage.removeItem("civicfix_user");

    navigate("/citizen/login", {
      replace: true,
    });
  };

  /* =====================================================
     SIDEBAR
  ====================================================== */

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  /* =====================================================
     HELP CENTER
  ====================================================== */

  const openHelp = () => {
    setSelectedHelp(null);
    setHelpOpen(true);
  };

  const closeHelp = () => {
    setHelpOpen(false);
    setSelectedHelp(null);
  };

  /* =====================================================
     USER
  ====================================================== */

  const userName =
    currentUser?.name || "Citizen";

  const userInitial =
    userName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "C";

  /* =====================================================
     HELP CONTENT
  ====================================================== */

  const helpContent = {
    report: {
      title: "How do I report an issue?",
      answer:
        "Choose Report an Issue from the sidebar. Select the appropriate category, describe the problem clearly, provide the location, and add supporting evidence if available. Review your information and submit the report.",
      action: "Report an Issue",
      actionPath: "/citizen/report",
    },

    tracking: {
      title: "How do I track my report?",
      answer:
        "Open My Reports to see all the issues you have submitted. Select a report to view its current status, priority, details, and progress timeline.",
      action: "View My Reports",
      actionPath: "/citizen/reports",
    },

    status: {
      title: "What do the statuses mean?",
      answer:
        "Submitted means your report has been received. In Progress means the relevant authority is working on the issue. Resolved means the reported issue has been addressed or completed.",
      action: "View My Reports",
      actionPath: "/citizen/reports",
    },

    assistance: {
      title: "Need more assistance?",
      answer:
        "If you need help with your account, profile, or another CivicFix feature, visit your profile or contact the CivicFix support team using the option below.",
      action: "Open My Profile",
      actionPath: "/citizen/profile",
    },
  };

  const handleHelpAction = (path) => {
    closeHelp();
    navigate(path);
  };

  return (
    <div className="citizen-layout">

      {/* =================================================
          MOBILE OVERLAY
      ================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          className="citizen-sidebar-overlay"
          aria-label="Close navigation"
          onClick={closeSidebar}
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================== */}

      <aside
        className={`citizen-sidebar ${
          sidebarOpen
            ? "citizen-sidebar-open"
            : ""
        }`}
      >

        {/* HEADER */}

        <div className="citizen-sidebar-header">

          <Link
            to="/citizen/dashboard"
            className="citizen-brand"
            onClick={closeSidebar}
          >

            <div className="citizen-brand-mark">
              C
            </div>

            <div className="citizen-brand-text">
              <strong>CivicFix</strong>
              <span>Civic Issue Platform</span>
            </div>

          </Link>

          <button
            type="button"
            className="citizen-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

        </div>

        {/* NAVIGATION */}

        <nav className="citizen-sidebar-nav">

          <p className="citizen-nav-label">
            MENU
          </p>

          <NavLink
            to="/citizen/dashboard"
            end
            className={({ isActive }) =>
              `citizen-nav-item ${
                isActive ? "active" : ""
              }`
            }
            onClick={closeSidebar}
          >
            <Home size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/citizen/reports"
            className={({ isActive }) =>
              `citizen-nav-item ${
                isActive ? "active" : ""
              }`
            }
            onClick={closeSidebar}
          >
            <ClipboardList size={19} />
            <span>My Reports</span>
          </NavLink>

          <NavLink
            to="/citizen/report"
            className={({ isActive }) =>
              `citizen-nav-item ${
                isActive ? "active" : ""
              }`
            }
            onClick={closeSidebar}
          >
            <FilePlus2 size={19} />
            <span>Report an Issue</span>
          </NavLink>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="citizen-sidebar-bottom">

          {/* HELP */}

          <button
            type="button"
            className="citizen-help-card"
            onClick={openHelp}
          >
            <div className="citizen-help-icon">
              ?
            </div>

            <div>
              <strong>Need help?</strong>
              <span>
                We're here to help you.
              </span>
            </div>
          </button>

          {/* SIGN OUT */}

          <button
            type="button"
            className="citizen-signout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Sign out</span>
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN AREA
      ================================================== */}

      <div className="citizen-main">

        {/* =================================================
            TOPBAR
        ================================================== */}

        <header className="citizen-topbar">

          <div className="citizen-topbar-left">

            <button
              type="button"
              className="citizen-mobile-menu"
              onClick={() =>
                setSidebarOpen(true)
              }
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <div className="citizen-page-context">
              <span>
                Citizen Portal
              </span>
            </div>

          </div>

          <div className="citizen-topbar-right">

            {/* =================================================
                THEME TOGGLE
            ================================================== */}

            <button
              type="button"
              className="citizen-theme-button"
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              onClick={handleThemeToggle}
            >
              {theme === "dark" ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>

            {/* =================================================
                NOTIFICATIONS
            ================================================== */}

            <button
              type="button"
              className="citizen-notification-button"
              onClick={() =>
                navigate(
                  "/citizen/notifications"
                )
              }
              aria-label="Notifications"
            >
              <Bell size={20} />

              <span className="citizen-notification-dot" />
            </button>

            {/* =================================================
                PROFILE
            ================================================== */}

            <div
              className="citizen-profile-wrapper"
              ref={profileRef}
            >

              <button
                type="button"
                className="citizen-profile-trigger"
                onClick={() =>
                  setProfileOpen(
                    (value) => !value
                  )
                }
              >

                <div className="citizen-avatar">
                  {userInitial}
                </div>

                <div className="citizen-profile-info">
                  <strong>
                    {userName}
                  </strong>

                  <span>
                    Citizen
                  </span>
                </div>

                <ChevronDown
                  size={16}
                  className={
                    profileOpen
                      ? "rotate"
                      : ""
                  }
                />

              </button>

              {/* PROFILE MENU */}

              {profileOpen && (
                <div className="citizen-profile-menu">

                  <Link
                    to="/citizen/profile"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    <UserRound size={17} />
                    <span>
                      My Profile
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                  >
                    <LogOut size={17} />
                    <span>
                      Sign out
                    </span>
                  </button>

                </div>
              )}

            </div>

          </div>

        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================== */}

        <main className="citizen-content">
          <Outlet />
        </main>

      </div>

      {/* =====================================================
          HELP CENTER MODAL
      ===================================================== */}

      {helpOpen && (
        <div
          className="citizen-help-modal-overlay"
          onClick={closeHelp}
        >

          <div
            className="citizen-help-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="citizen-help-modal-header">

              <div>

                {selectedHelp && (
                  <button
                    type="button"
                    className="citizen-help-back"
                    onClick={() =>
                      setSelectedHelp(null)
                    }
                  >
                    <ArrowLeft size={16} />
                    <span>
                      Back
                    </span>
                  </button>
                )}

                <span className="citizen-help-modal-eyebrow">
                  CivicFix Support
                </span>

                <h2>
                  {selectedHelp
                    ? helpContent[selectedHelp]
                        .title
                    : "How can we help?"}
                </h2>

                <p>
                  {selectedHelp
                    ? "Here is a quick answer to your question."
                    : "Find quick answers about reporting and tracking civic issues."}
                </p>

              </div>

              <button
                type="button"
                className="citizen-help-modal-close"
                onClick={closeHelp}
                aria-label="Close help"
              >
                <X size={20} />
              </button>

            </div>

            {/* FAQ LIST */}

            {!selectedHelp && (
              <div className="citizen-help-options">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedHelp("report")
                  }
                >
                  <strong>
                    How do I report an issue?
                  </strong>

                  <span>
                    Learn how to submit a civic issue.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedHelp("tracking")
                  }
                >
                  <strong>
                    How do I track my report?
                  </strong>

                  <span>
                    Understand your report status and timeline.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedHelp("status")
                  }
                >
                  <strong>
                    What do the statuses mean?
                  </strong>

                  <span>
                    Understand submitted, in-progress and resolved.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedHelp("assistance")
                  }
                >
                  <strong>
                    Need more assistance?
                  </strong>

                  <span>
                    Get help with an issue or account.
                  </span>
                </button>

              </div>
            )}

            {/* FAQ ANSWER */}

            {selectedHelp && (
              <div className="citizen-help-answer">

                <p>
                  {
                    helpContent[selectedHelp]
                      .answer
                  }
                </p>

                <button
                  type="button"
                  className="citizen-help-answer-action"
                  onClick={() =>
                    handleHelpAction(
                      helpContent[selectedHelp]
                        .actionPath
                    )
                  }
                >
                  {
                    helpContent[selectedHelp]
                      .action
                  }
                </button>

              </div>
            )}

            {/* MODAL FOOTER */}

            <div className="citizen-help-modal-footer">

              <span>
                Can't find what you're looking for?
              </span>

              <a
                href="mailto:civicfix.support@gmail.com?subject=CivicFix%20Support%20Request"
                className="citizen-help-contact"
              >
                <Mail size={15} />
                <span>
                  Contact Support
                </span>
              </a>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default CitizenLayout;