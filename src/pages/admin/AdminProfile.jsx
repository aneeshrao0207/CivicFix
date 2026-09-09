import { useEffect, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
} from "lucide-react";
import { apiRequest } from "../../services/api";
import "./AdminProfile.css";

function AdminProfile() {
  const [user, setUser] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileMessage, setProfileMessage] = useState({
    type: "",
    text: "",
  });

  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("civicfix_user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);

        setProfileData({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
        });
      }
    } catch (error) {
      console.error("Failed to load admin profile:", error);
    }
  }, []);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setProfileMessage({
      type: "",
      text: "",
    });
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordMessage({
      type: "",
      text: "",
    });
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    setProfileMessage({
      type: "",
      text: "",
    });

    if (!profileData.name.trim()) {
      setProfileMessage({
        type: "error",
        text: "Name cannot be empty.",
      });
      return;
    }

    if (!profileData.email.trim()) {
      setProfileMessage({
        type: "error",
        text: "Email cannot be empty.",
      });
      return;
    }

    try {
      setProfileLoading(true);

      const response = await apiRequest("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: profileData.name.trim(),
          email: profileData.email.trim(),
        }),
      });

      const updatedUser =
        response.user ||
        response.data ||
        {
          ...user,
          name: profileData.name.trim(),
          email: profileData.email.trim(),
        };

      const finalUser = {
        ...user,
        ...updatedUser,
      };

      setUser(finalUser);

      localStorage.setItem(
        "civicfix_user",
        JSON.stringify(finalUser)
      );

      setProfileData({
        name: finalUser.name || "",
        email: finalUser.email || "",
      });

      setProfileMessage({
        type: "success",
        text: response.message || "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Profile update error:", error);

      setProfileMessage({
        type: "error",
        text: error.message || "Failed to update profile.",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setPasswordMessage({
      type: "",
      text: "",
    });

    if (!passwordData.currentPassword) {
      setPasswordMessage({
        type: "error",
        text: "Enter your current password.",
      });
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordMessage({
        type: "error",
        text: "Enter a new password.",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "New password must contain at least 6 characters.",
      });
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await apiRequest("/auth/password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordMessage({
        type: "success",
        text:
          response.message ||
          "Password changed successfully.",
      });
    } catch (error) {
      console.error("Password change error:", error);

      setPasswordMessage({
        type: "error",
        text:
          error.message ||
          "Failed to change password.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const getInitials = () => {
    if (!profileData.name) return "A";

    const words = profileData.name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const Message = ({ message }) => {
    if (!message.text) return null;

    return (
      <div
        className={`profile-message ${
          message.type === "success"
            ? "profile-message-success"
            : "profile-message-error"
        }`}
        role="alert"
      >
        {message.type === "success" ? (
          <CheckCircle2 size={17} />
        ) : (
          <AlertCircle size={17} />
        )}

        <span>{message.text}</span>
      </div>
    );
  };

  return (
    <main className="admin-profile-page">
      <div className="admin-profile-container">

        {/* HEADER */}
        <section className="admin-profile-header">
          <div>
            <div className="admin-profile-eyebrow">
              <ShieldCheck size={15} />
              Authority account
            </div>

            <h1>Profile</h1>

            <p>
              Manage your authority account information
              and security settings.
            </p>
          </div>
        </section>

        {/* PROFILE HERO */}
        <section className="admin-profile-hero">
          <div className="admin-profile-avatar">
            {getInitials()}
          </div>

          <div className="admin-profile-hero-info">
            <h2>
              {profileData.name || "Administrator"}
            </h2>

            <p>
              {profileData.email || "Authority account"}
            </p>

            <div className="admin-profile-role">
              <ShieldCheck size={14} />
              Authority Administrator
            </div>
          </div>

          <div className="admin-profile-status">
            <span className="status-dot"></span>
            Account active
          </div>
        </section>

        {/* CONTENT GRID */}
        <div className="admin-profile-grid">

          {/* PERSONAL INFORMATION */}
          <section className="admin-profile-card">
            <div className="profile-card-header">
              <div className="profile-card-icon">
                <User size={19} />
              </div>

              <div>
                <h2>Personal information</h2>
                <p>
                  Update the information associated
                  with your authority account.
                </p>
              </div>
            </div>

            <form
              className="admin-profile-form"
              onSubmit={handleProfileSubmit}
            >
              <div className="admin-profile-field">
                <label htmlFor="admin-profile-name">
                  Full name
                </label>

                <div className="admin-profile-input-wrapper">
                  <User size={17} />

                  <input
                    id="admin-profile-name"
                    name="name"
                    type="text"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="admin-profile-field">
                <label htmlFor="admin-profile-email">
                  Email address
                </label>

                <div className="admin-profile-input-wrapper">
                  <Mail size={17} />

                  <input
                    id="admin-profile-email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    placeholder="admin@civicfix.gov"
                    autoComplete="email"
                  />
                </div>
              </div>

              <Message message={profileMessage} />

              <button
                type="submit"
                className="admin-profile-save-btn"
                disabled={profileLoading}
              >
                <Save size={16} />

                {profileLoading
                  ? "Saving changes..."
                  : "Save changes"}
              </button>
            </form>
          </section>

          {/* ACCOUNT DETAILS */}
          <section className="admin-profile-card account-details-card">
            <div className="profile-card-header">
              <div className="profile-card-icon">
                <Building2 size={19} />
              </div>

              <div>
                <h2>Account details</h2>
                <p>
                  Your CivicFix authority access information.
                </p>
              </div>
            </div>

            <div className="account-details-list">
              <div className="account-detail">
                <span>Account type</span>
                <strong>Administrator</strong>
              </div>

              <div className="account-detail">
                <span>Access level</span>
                <strong>Authority portal</strong>
              </div>

              <div className="account-detail">
                <span>Account status</span>

                <strong className="active-account">
                  <span className="status-dot"></span>
                  Active
                </strong>
              </div>

              <div className="account-detail">
                <span>Platform</span>
                <strong>CivicFix</strong>
              </div>
            </div>
          </section>

          {/* CHANGE PASSWORD */}
          <section className="admin-profile-card password-card">
            <div className="profile-card-header">
              <div className="profile-card-icon">
                <LockKeyhole size={19} />
              </div>

              <div>
                <h2>Change password</h2>
                <p>
                  Keep your administrator account secure.
                </p>
              </div>
            </div>

            <form
              className="admin-profile-form"
              onSubmit={handlePasswordSubmit}
            >
              {/* CURRENT PASSWORD */}
              <div className="admin-profile-field">
                <label htmlFor="current-password">
                  Current password
                </label>

                <div className="admin-profile-input-wrapper">
                  <LockKeyhole size={17} />

                  <input
                    id="current-password"
                    name="currentPassword"
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordData.currentPassword
                    }
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="profile-password-toggle"
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

              {/* NEW PASSWORD */}
              <div className="admin-profile-field">
                <label htmlFor="new-password">
                  New password
                </label>

                <div className="admin-profile-input-wrapper">
                  <LockKeyhole size={17} />

                  <input
                    id="new-password"
                    name="newPassword"
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="profile-password-toggle"
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

              {/* CONFIRM PASSWORD */}
              <div className="admin-profile-field">
                <label htmlFor="confirm-password">
                  Confirm new password
                </label>

                <div className="admin-profile-input-wrapper">
                  <LockKeyhole size={17} />

                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordData.confirmPassword
                    }
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="profile-password-toggle"
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

              <Message message={passwordMessage} />

              <button
                type="submit"
                className="admin-profile-save-btn"
                disabled={passwordLoading}
              >
                <LockKeyhole size={16} />

                {passwordLoading
                  ? "Updating password..."
                  : "Update password"}
              </button>
            </form>
          </section>

          {/* SECURITY NOTE */}
          <section className="admin-profile-security">
            <div className="security-note-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h3>Administrator security</h3>

              <p>
                This account has administrative access to
                CivicFix. Keep your credentials private and
                use a strong password to protect authority
                operations.
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

export default AdminProfile;