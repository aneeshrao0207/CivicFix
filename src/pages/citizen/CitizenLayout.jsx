import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Home,
  ClipboardList,
  FilePlus2,
  LogOut,
  Menu,
  X,
  UserRound,
} from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import "./CitizenLayout.css";

const CitizenLayout = () => {
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("civicfix_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("civicfix_token");
    localStorage.removeItem("civicfix_user");

    navigate("/citizen/login", { replace: true });
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const userName = currentUser?.name || "Citizen";

  const userInitial =
    userName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "C";

  return (
    <div className="citizen-layout">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <button
          className="citizen-sidebar-overlay"
          aria-label="Close navigation"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`citizen-sidebar ${
          sidebarOpen ? "citizen-sidebar-open" : ""
        }`}
      >
        <div className="citizen-sidebar-header">
          <Link
            to="/citizen/dashboard"
            className="citizen-brand"
            onClick={closeSidebar}
          >
            <div className="citizen-brand-mark">C</div>

            <div className="citizen-brand-text">
              <strong>CivicFix</strong>
              <span>Civic Issue Platform</span>
            </div>
          </Link>

          <button
            className="citizen-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="citizen-sidebar-nav">
          <p className="citizen-nav-label">MENU</p>

          <NavLink
            to="/citizen/dashboard"
            end
            className={({ isActive }) =>
              `citizen-nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            <Home size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/citizen/reports"
            className={({ isActive }) =>
              `citizen-nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            <ClipboardList size={19} />
            <span>My Reports</span>
          </NavLink>

          <NavLink
            to="/citizen/report"
            className={({ isActive }) =>
              `citizen-nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            <FilePlus2 size={19} />
            <span>Report an Issue</span>
          </NavLink>
        </nav>

        <div className="citizen-sidebar-bottom">
          <div className="citizen-help-card">
            <div className="citizen-help-icon">
              ?
            </div>

            <div>
              <strong>Need help?</strong>
              <span>We're here to help you.</span>
            </div>
          </div>

          <button
            className="citizen-signout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="citizen-main">
        {/* FIXED TOPBAR */}
        <header className="citizen-topbar">
          <div className="citizen-topbar-left">
            <button
              className="citizen-mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <div className="citizen-page-context">
              <span>Citizen Portal</span>
            </div>
          </div>

          <div className="citizen-topbar-right">
            <button
              className="citizen-notification-button"
              onClick={() => navigate("/citizen/notifications")}
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="citizen-notification-dot" />
            </button>

            <div
              className="citizen-profile-wrapper"
              ref={profileRef}
            >
              <button
                className="citizen-profile-trigger"
                onClick={() => setProfileOpen((value) => !value)}
              >
                <div className="citizen-avatar">
                  {userInitial}
                </div>

                <div className="citizen-profile-info">
                  <strong>{userName}</strong>
                  <span>Citizen</span>
                </div>

                <ChevronDown
                  size={16}
                  className={profileOpen ? "rotate" : ""}
                />
              </button>

              {profileOpen && (
                <div className="citizen-profile-menu">
                  <Link
                    to="/citizen/profile"
                    onClick={() => setProfileOpen(false)}
                  >
                    <UserRound size={17} />
                    <span>My Profile</span>
                  </Link>

                  <button onClick={handleLogout}>
                    <LogOut size={17} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CHANGES HERE */}
        <main className="citizen-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CitizenLayout;