import { useEffect, useState } from "react";
import {
  Bell,
  ChevronRight,
  Lock,
  LogOut,
  Mail,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./CitizenProfile.css";

function CitizenProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Citizen",
    email: "",
    phone: "",
    role: "citizen",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("civicfix_user");

    if (!storedUser) {
      navigate("/citizen/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      setUser({
        name: parsedUser.name || "Citizen",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        role: parsedUser.role || "citizen",
      });
    } catch (error) {
      console.error("Unable to read user profile:", error);

      localStorage.removeItem("civicfix_token");
      localStorage.removeItem("civicfix_user");

      navigate("/citizen/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("civicfix_token");
    localStorage.removeItem("civicfix_user");

    navigate("/citizen/login", { replace: true });
  };

  const initials = user.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <div className="citizen-profile-page">

      {/* HEADER */}

      <header className="profile-header">

        <div>
          <p className="profile-eyebrow">
            CITIZEN PORTAL
          </p>

          <h1>Profile</h1>

          <p>
            Manage your CivicFix account and preferences.
          </p>
        </div>

      </header>


      <main className="profile-container">

        {/* PROFILE CARD */}

        <section className="profile-card">

          <div className="profile-avatar">
            {initials || "C"}
          </div>

          <div className="profile-main">

            <h2>
              {user.name}
            </h2>

            <span className="profile-role">
              Citizen
            </span>

            <div className="profile-contact">

              <span>
                <Mail size={13} />
                {user.email || "No email available"}
              </span>

              <span>
                <MapPin size={13} />
                {user.phone || "Phone not provided"}
              </span>

            </div>

          </div>

          <button
            className="edit-profile-button"
            type="button"
            disabled
            title="Profile editing is not available yet"
          >
            Edit profile
          </button>

        </section>


        {/* ACCOUNT */}

        <section className="profile-section">

          <div className="profile-section-heading">

            <div>
              <h2>Account</h2>

              <p>
                Your basic account information.
              </p>
            </div>

            <User size={18} />

          </div>


          <div className="profile-fields">

            <div className="profile-field">

              <span>
                Full name
              </span>

              <strong>
                {user.name}
              </strong>

            </div>


            <div className="profile-field">

              <span>
                Email address
              </span>

              <strong>
                {user.email || "Not provided"}
              </strong>

            </div>


            <div className="profile-field">

              <span>
                Phone number
              </span>

              <strong>
                {user.phone || "Not provided"}
              </strong>

            </div>

          </div>

        </section>


        {/* SETTINGS */}

        <section className="profile-section">

          <div className="profile-section-heading">

            <div>
              <h2>Preferences</h2>

              <p>
                Manage how CivicFix communicates with you.
              </p>
            </div>

            <Bell size={18} />

          </div>


          <div className="settings-list">

            <button
              className="setting-item"
              type="button"
              onClick={() =>
                navigate("/citizen/notifications")
              }
            >

              <div className="setting-icon">
                <Bell size={16} />
              </div>

              <div>
                <strong>
                  Notifications
                </strong>

                <span>
                  Receive updates about your reports.
                </span>
              </div>

              <ChevronRight size={16} />

            </button>

          </div>

        </section>


        {/* SECURITY */}

        <section className="profile-section">

          <div className="profile-section-heading">

            <div>
              <h2>Security</h2>

              <p>
                Keep your account secure.
              </p>
            </div>

            <ShieldCheck size={18} />

          </div>


          <div className="settings-list">

            <button
              className="setting-item"
              type="button"
              disabled
              title="Password management will be added later"
            >

              <div className="setting-icon">
                <Lock size={16} />
              </div>

              <div>
                <strong>
                  Change password
                </strong>

                <span>
                  Update your account password.
                </span>
              </div>

              <ChevronRight size={16} />

            </button>

          </div>

        </section>


        {/* LOGOUT */}

        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
        >
          <LogOut size={15} />
          Sign out
        </button>

      </main>

    </div>
  );
}

export default CitizenProfile;