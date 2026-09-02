import { useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronDown,
  FileText,
  ImagePlus,
  MapPin,
  Upload,
  X,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import "./ReportIssue.css";

function ReportIssue() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    address: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Road",
    "Garbage",
    "Streetlight",
    "Water",
    "Traffic",
    "Public Infrastructure",
    "Other",
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        alert(
          "Unable to access your location. Please allow location access and try again."
        );
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    // Temporary submission simulation.
    // This will later be replaced with our real backend API.

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const reportId = `CF-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    console.log("Report submitted:", {
      id: reportId,
      ...formData,
      location,
      image: selectedFile,
    });

    setIsSubmitting(false);

    navigate(`/citizen/reports/${reportId}`);
  };

  return (
    <div className="report-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="report-header">

        <Link
          to="/citizen/dashboard"
          className="report-header-back"
        >
          <ArrowLeft size={18} />

          <span>Back to dashboard</span>
        </Link>

        <Link to="/" className="report-header-logo">
          <span>C</span>
          CivicFix
        </Link>

        <div className="report-header-spacer"></div>

      </header>

      {/* =====================================
          MAIN
      ===================================== */}

      <main className="report-main">

        <div className="report-container">

          {/* PAGE INTRO */}

          <div className="report-intro">

            <div className="report-intro-icon">
              <FileText size={21} />
            </div>

            <div>

              <p className="report-eyebrow">
                CIVIC REPORT
              </p>

              <h1>Report an issue</h1>

              <p>
                Help improve your community by reporting
                a problem that needs attention.
              </p>

            </div>

          </div>

          {/* FORM */}

          <form
            className="report-form"
            onSubmit={handleSubmit}
          >

            {/* =================================
                BASIC INFORMATION
            ================================= */}

            <section className="report-card">

              <div className="report-card-header">

                <div>
                  <h2>Issue details</h2>

                  <p>
                    Tell us what is happening.
                  </p>
                </div>

                <span className="required-note">
                  * Required
                </span>

              </div>

              {/* TITLE */}

              <div className="report-field">

                <label htmlFor="title">
                  Issue title <span>*</span>
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Large pothole near Main Road"
                  required
                />

                <small>
                  Keep it short and specific.
                </small>

              </div>

              {/* CATEGORY */}

              <div className="report-field">

                <label htmlFor="category">
                  Category <span>*</span>
                </label>

                <div className="report-select-wrapper">

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select an issue category
                    </option>

                    {categories.map((category) => (
                      <option
                        value={category}
                        key={category}
                      >
                        {category}
                      </option>
                    ))}

                  </select>

                  <ChevronDown size={17} />

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="report-field">

                <label htmlFor="description">
                  Description <span>*</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the problem, what is affected, and any details that may help the authorities understand it."
                  rows="6"
                  required
                />

                <small>
                  Provide enough detail to help authorities
                  understand the issue.
                </small>

              </div>

            </section>

            {/* =================================
                LOCATION
            ================================= */}

            <section className="report-card">

              <div className="report-card-header">

                <div>
                  <h2>Location</h2>

                  <p>
                    Where is the issue located?
                  </p>
                </div>

              </div>

              <div className="location-box">

                <div className="location-box-icon">
                  <MapPin size={21} />
                </div>

                <div className="location-box-content">

                  <strong>
                    Add the issue location
                  </strong>

                  <p>
                    Use your current location or enter
                    the address manually.
                  </p>

                  {location && (
                    <div className="location-success">

                      <Check size={14} />

                      Location captured

                    </div>
                  )}

                </div>

                <button
                  type="button"
                  className="location-button"
                  onClick={getCurrentLocation}
                >
                  <MapPin size={16} />

                  {location
                    ? "Update location"
                    : "Use my location"}

                </button>

              </div>

              <div className="location-divider">
                <span>OR</span>
              </div>

              <div className="report-field">

                <label htmlFor="address">
                  Address / landmark
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Near Main Road bus stop"
                />

              </div>

              <div className="map-placeholder">

                <div className="map-placeholder-icon">
                  <MapPin size={22} />
                </div>

                <strong>
                  Map location
                </strong>

                <span>
                  Interactive map will be available here
                </span>

              </div>

            </section>

            {/* =================================
                PHOTO
            ================================= */}

            <section className="report-card">

              <div className="report-card-header">

                <div>
                  <h2>Evidence photo</h2>

                  <p>
                    Add a photo to help authorities
                    understand the issue.
                  </p>
                </div>

                <span className="optional-note">
                  Optional
                </span>

              </div>

              {!preview ? (

                <button
                  type="button"
                  className="upload-area"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >

                  <div className="upload-icon">
                    <ImagePlus size={23} />
                  </div>

                  <strong>
                    Upload a photo
                  </strong>

                  <span>
                    PNG, JPG or WEBP up to 10MB
                  </span>

                  <div className="upload-button">
                    <Upload size={15} />
                    Choose image
                  </div>

                </button>

              ) : (

                <div className="image-preview">

                  <img
                    src={preview}
                    alt="Selected issue"
                  />

                  <div className="image-preview-overlay">

                    <span>
                      {selectedFile?.name}
                    </span>

                    <button
                      type="button"
                      onClick={removeFile}
                      aria-label="Remove image"
                    >
                      <X size={18} />
                    </button>

                  </div>

                </div>

              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                hidden
              />

            </section>

            {/* =================================
                SUBMIT
            ================================= */}

            <div className="report-submit-area">

              <div className="report-submit-info">

                <ShieldIcon />

                <span>
                  Your report will be reviewed by
                  an authorized CivicFix administrator.
                </span>

              </div>

              <div className="report-submit-actions">

                <Link
                  to="/citizen/dashboard"
                  className="cancel-button"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="submit-report-button"
                  disabled={isSubmitting}
                >

                  {isSubmitting ? (
                    <>
                      <span className="submit-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Camera size={17} />
                      Submit report
                    </>
                  )}

                </button>

              </div>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

/* Small inline icon component */

function ShieldIcon() {
  return (
    <div className="submit-info-icon">
      ✓
    </div>
  );
}

export default ReportIssue;