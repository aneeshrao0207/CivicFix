import { useEffect, useRef, useState } from "react";

import {
  BarChart3,
  Bell,
  ChevronDown,
  ClipboardList,
  Home,
  LogOut,
  Map,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  UserRound,
  X,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
      const storedUser = localStorage.getItem("civicfix_user");

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
     CLOSE SIDEBAR / PROFILE WHEN ROUTE CHANGES
  ====================================================== */

  useEffect(() => {
    setSidebarOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  /* =====================================================
     LOGOUT
  ====================================================== */

  const handleLogout = () => {
    localStorage.removeItem("civicfix_token");
    localStorage.removeItem("civicfix_user");

    navigate("/admin/login", {
      replace: true,
    });
  };

  /* =====================================================
     OPEN ADMIN PROFILE
  ====================================================== */

  const handleProfile = () => {
    setProfileOpen(false);
    navigate("/admin/profile");
  };

  /* =====================================================
     USER
  ====================================================== */

  const userName =
    currentUser?.name || "Administrator";

  const userEmail =
    currentUser?.email || "Authority account";

  const userInitial =
    userName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A";

  /* =====================================================
     PAGE CONTEXT
  ====================================================== */

  const getPageContext = () => {
    if (
      location.pathname === "/admin/dashboard"
    ) {
      return {
        eyebrow: "CIVIC OPERATIONS",
        title: "Dashboard",
      };
    }

    if (
      location.pathname === "/admin/issues"
    ) {
      return {
        eyebrow: "ISSUE MANAGEMENT",
        title: "Issues",
      };
    }

    if (
      location.pathname.startsWith(
        "/admin/issues/"
      )
    ) {
      return {
        eyebrow: "ISSUE MANAGEMENT",
        title: "Issue details",
      };
    }

    if (
      location.pathname === "/admin/map"
    ) {
      return {
        eyebrow: "GEOGRAPHIC MONITORING",
        title: "Issue map",
      };
    }

    if (
      location.pathname === "/admin/analytics"
    ) {
      return {
        eyebrow: "CIVIC OPERATIONS",
        title: "Analytics",
      };
    }

    if (
      location.pathname === "/admin/notifications"
    ) {
      return {
        eyebrow: "CIVIC OPERATIONS",
        title: "Notifications",
      };
    }

    if (
      location.pathname === "/admin/profile"
    ) {
      return {
        eyebrow: "ACCOUNT MANAGEMENT",
        title: "Profile",
      };
    }

    return {
      eyebrow: "CIVIC OPERATIONS",
      title: "Authority Portal",
    };
  };

  const pageContext = getPageContext();

  return (
    <div className="admin-layout">

      {/* =================================================
          MOBILE OVERLAY
      ================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          aria-label="Close navigation"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================== */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen
            ? "admin-sidebar-open"
            : ""
        }`}
      >

        {/* BRAND */}

        <div className="admin-sidebar-header">

          <NavLink
            to="/admin/dashboard"
            className="admin-sidebar-brand"
          >

            <span className="admin-sidebar-brand-mark">
              C
            </span>

            <span className="admin-sidebar-brand-copy">
              <strong>CivicFix</strong>
              <small>Authority Portal</small>
            </span>

          </NavLink>

          <button
            type="button"
            className="admin-sidebar-close"
            aria-label="Close navigation"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={19} />
          </button>

        </div>

        {/* AUTHORITY BADGE */}

        <div className="admin-authority-badge">

          <div className="admin-authority-icon">
            <ShieldCheck size={15} />
          </div>

          <div>
            <strong>Authority access</strong>
            <span>Administrator</span>
          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="admin-sidebar-nav">

          <span className="admin-nav-label">
            WORKSPACE
          </span>

          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <Home size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/issues"
            end
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <ClipboardList size={18} />
            <span>Issues</span>
          </NavLink>

          <NavLink
            to="/admin/map"
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <Map size={18} />
            <span>Issue map</span>
          </NavLink>

          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <BarChart3 size={18} />
            <span>Analytics</span>
          </NavLink>

        </nav>

        {/* SIDEBAR FOOTER */}

        <div className="admin-sidebar-footer">

          <div className="admin-sidebar-status">

            <span className="admin-online-dot" />

            <div>
              <strong>System operational</strong>
              <span>CivicFix services active</span>
            </div>

          </div>

          <button
            type="button"
            className="admin-sidebar-signout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            <span>Sign out</span>
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================== */}

      <div className="admin-main">

        {/* =================================================
            TOPBAR
        ================================================== */}

        <header className="admin-topbar">

          <div className="admin-topbar-left">

            <button
              type="button"
              className="admin-mobile-menu"
              aria-label="Open navigation"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              <Menu size={21} />
            </button>

            <div className="admin-page-context">

              <span>
                {pageContext.eyebrow}
              </span>

              <strong>
                {pageContext.title}
              </strong>

            </div>

          </div>

          <div className="admin-topbar-right">

            {/* =================================================
                THEME TOGGLE
            ================================================== */}

            <button
              type="button"
              className="admin-theme-btn"
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
              className="admin-notification-btn"
              aria-label="Open notifications"
              onClick={() =>
                navigate("/admin/notifications")
              }
            >
              <Bell size={20} />
            </button>

            {/* =================================================
                PROFILE
            ================================================== */}

            <div
              className="admin-profile-wrapper"
              ref={profileRef}
            >

              <button
                type="button"
                className={`admin-profile-trigger ${
                  profileOpen
                    ? "open"
                    : ""
                }`}
                onClick={() =>
                  setProfileOpen(
                    (value) => !value
                  )
                }
              >

                <div className="admin-avatar">
                  {userInitial}
                </div>

                <div className="admin-profile-info">
                  <strong>{userName}</strong>
                  <span>Administrator</span>
                </div>

                <ChevronDown
                  size={15}
                  className={
                    profileOpen
                      ? "admin-profile-chevron rotate"
                      : "admin-profile-chevron"
                  }
                />

              </button>

              {/* =================================================
                  PROFILE DROPDOWN
              ================================================== */}

              {profileOpen && (
                <div className="admin-profile-dropdown">

                  <div className="admin-profile-dropdown-header">

                    <div className="admin-dropdown-avatar">
                      {userInitial}
                    </div>

                    <div>
                      <strong>{userName}</strong>
                      <span>{userEmail}</span>
                    </div>

                  </div>

                  <div className="admin-profile-dropdown-divider" />

                  {/* PROFILE */}

                  <button
                    type="button"
                    onClick={handleProfile}
                  >
                    <UserRound size={16} />
                    <span>
                      Administrator account
                    </span>
                  </button>

                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="admin-dropdown-signout"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>

                </div>
              )}

            </div>

          </div>

        </header>

        {/* =================================================
            CONTENT
        ================================================== */}

        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;