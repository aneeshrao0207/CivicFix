import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Mail,
  MapPin,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { apiRequest } from "../../services/api";
import "./CitizenProfile.css";

function CitizenProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Citizen",
    email: "",
    phone: "",
    role: "citizen",
  });

  const [editMode, setEditMode] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("civicfix_user");

    if (!storedUser) {
      navigate("/citizen/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      const currentUser = {
        name: parsedUser.name || "Citizen",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        role: parsedUser.role || "citizen",
      };

      setUser(currentUser);

      setProfileForm({
        name: currentUser.name,
        phone: currentUser.phone,
      });
    } catch (error) {
      console.error("Unable to read user profile:", error);

      localStorage.removeItem("civicfix_token");
      localStorage.removeItem("civicfix_user");

      navigate("/citizen/login", { replace: true });
    }
  }, [navigate]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEditProfile = () => {
    setProfileMessage("");
    setProfileError("");

    setProfileForm({
      name: user.name,
      phone: user.phone,
    });

    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setProfileForm({
      name: user.name,
      phone: user.phone,
    });

    setProfileMessage("");
    setProfileError("");
    setEditMode(false);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    setProfileMessage("");
    setProfileError("");

    if (!profileForm.name.trim()) {
      setProfileError("Full name is required.");
      return;
    }

    try {
      setIsSavingProfile(true);

      const data = await apiRequest("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: profileForm.name.trim(),
          phone: profileForm.phone.trim(),
        }),
      });

      const updatedUser = {
        ...user,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || "",
        role: data.user.role,
      };

      setUser(updatedUser);

      localStorage.setItem(
        "civicfix_user",
        JSON.stringify(data.user)
      );

      setProfileForm({
        name: data.user.name,
        phone: data.user.phone || "",
      });

      setEditMode(false);
      setProfileMessage("Your profile has been updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);

      setProfileError(
        error.message || "Unable to update your profile."
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError("Please complete all password fields.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError(
        "Your new password must be at least 8 characters long."
      );
      return;
    }

    if (
      passwordForm.newPassword !== passwordForm.confirmPassword
    ) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (
      passwordForm.currentPassword === passwordForm.newPassword
    ) {
      setPasswordError(
        "Your new password must be different from your current password."
      );
      return;
    }

    try {
      setIsChangingPassword(true);

      const data = await apiRequest("/auth/password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordMessage(
        data.message || "Password updated successfully."
      );
    } catch (error) {
      console.error("Password update error:", error);

      setPasswordError(
        error.message || "Unable to update your password."
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

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
            Manage your CivicFix account and security.
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

          {!editMode && (
            <button
              className="edit-profile-button"
              type="button"
              onClick={handleEditProfile}
            >
              Edit profile
            </button>
          )}

        </section>


        {/* PROFILE MESSAGE */}

        {profileMessage && (
          <div className="profile-alert profile-alert-success">
            <Check size={17} />
            <span>{profileMessage}</span>

            <button
              type="button"
              onClick={() => setProfileMessage("")}
              aria-label="Dismiss message"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {profileError && (
          <div className="profile-alert profile-alert-error">
            <X size={17} />
            <span>{profileError}</span>

            <button
              type="button"
              onClick={() => setProfileError("")}
              aria-label="Dismiss error"
            >
              <X size={15} />
            </button>
          </div>
        )}


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


          {!editMode ? (

            <div className="profile-fields">

              <div className="profile-field">
                <span>Full name</span>
                <strong>{user.name}</strong>
              </div>

              <div className="profile-field">
                <span>Email address</span>
                <strong>
                  {user.email || "Not provided"}
                </strong>
              </div>

              <div className="profile-field">
                <span>Phone number</span>
                <strong>
                  {user.phone || "Not provided"}
                </strong>
              </div>

            </div>

          ) : (

            <form
              className="profile-edit-form"
              onSubmit={handleSaveProfile}
            >

              <div className="profile-input-group">

                <label htmlFor="profile-name">
                  Full name
                </label>

                <input
                  id="profile-name"
                  name="name"
                  type="text"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />

              </div>


              <div className="profile-input-group">

                <label htmlFor="profile-email">
                  Email address
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={user.email}
                  disabled
                />

                <small>
                  Email address cannot be changed here.
                </small>

              </div>


              <div className="profile-input-group">

                <label htmlFor="profile-phone">
                  Phone number
                </label>

                <input
                  id="profile-phone"
                  name="phone"
                  type="tel"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                />

              </div>


              <div className="profile-form-actions">

                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={handleCancelEdit}
                  disabled={isSavingProfile}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={isSavingProfile}
                >
                  {isSavingProfile
                    ? "Saving..."
                    : "Save changes"}
                </button>

              </div>

            </form>

          )}

        </section>


        {/* PREFERENCES */}

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
                Keep your CivicFix account protected.
              </p>
            </div>

            <ShieldCheck size={18} />

          </div>


          <form
            className="password-form"
            onSubmit={handleChangePassword}
          >

            <div className="password-field">

              <label htmlFor="current-password">
                Current password
              </label>

              <div className="password-input-wrapper">

                <input
                  id="current-password"
                  name="currentPassword"
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showCurrentPassword
                      ? "Hide current password"
                      : "Show current password"
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

            </div>


            <div className="password-field">

              <label htmlFor="new-password">
                New password
              </label>

              <div className="password-input-wrapper">

                <input
                  id="new-password"
                  name="newPassword"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showNewPassword
                      ? "Hide new password"
                      : "Show new password"
                  }
                >
                  {showNewPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

            </div>


            <div className="password-field">

              <label htmlFor="confirm-password">
                Confirm new password
              </label>

              <div className="password-input-wrapper">

                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

            </div>


            <div className="password-requirement">
              <Lock size={15} />

              <span>
                Use at least 8 characters for your new password.
              </span>
            </div>


            {passwordMessage && (
              <div className="password-alert password-alert-success">
                <Check size={16} />
                <span>{passwordMessage}</span>
              </div>
            )}

            {passwordError && (
              <div className="password-alert password-alert-error">
                <X size={16} />
                <span>{passwordError}</span>
              </div>
            )}


            <button
              className="change-password-button"
              type="submit"
              disabled={isChangingPassword}
            >
              {isChangingPassword
                ? "Updating password..."
                : "Update password"}
            </button>

          </form>

        </section>


        {/* LOGOUT */}

        <section className="logout-section">

          <div>
            <strong>
              Sign out of CivicFix
            </strong>

            <span>
              You'll need to sign in again to access your account.
            </span>
          </div>

          <button
            className="logout-button"
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={15} />
            Sign out
          </button>

        </section>

      </main>

    </div>
  );
}

export default CitizenProfile;