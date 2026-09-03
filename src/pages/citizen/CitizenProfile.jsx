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

import "./CitizenProfile.css";

function CitizenProfile() {
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
            AR
          </div>

          <div className="profile-main">

            <h2>Aneesh Rao</h2>

            <span className="profile-role">
              Citizen
            </span>

            <div className="profile-contact">

              <span>
                <Mail size={13} />
                aneesh@example.com
              </span>

              <span>
                <MapPin size={13} />
                Bengaluru, Karnataka
              </span>

            </div>

          </div>

          <button className="edit-profile-button">
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
              <span>Full name</span>
              <strong>Aneesh Rao</strong>
            </div>

            <div className="profile-field">
              <span>Email address</span>
              <strong>aneesh@example.com</strong>
            </div>

            <div className="profile-field">
              <span>Location</span>
              <strong>Bengaluru, Karnataka</strong>
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

            <button className="setting-item">

              <div className="setting-icon">
                <Bell size={16} />
              </div>

              <div>
                <strong>Notifications</strong>
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

            <button className="setting-item">

              <div className="setting-icon">
                <Lock size={16} />
              </div>

              <div>
                <strong>Change password</strong>
                <span>
                  Update your account password.
                </span>
              </div>

              <ChevronRight size={16} />

            </button>

          </div>

        </section>

        {/* LOGOUT */}

        <button className="logout-button">
          <LogOut size={15} />
          Sign out
        </button>

      </main>

    </div>
  );
}

export default CitizenProfile;