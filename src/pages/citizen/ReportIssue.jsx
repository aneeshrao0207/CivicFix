import { useRef, useState } from "react";
import {
  Camera,
  Check,
  ChevronDown,
  FileText,
  ImagePlus,
  MapPin,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { apiRequest } from "../../services/api";

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
  const [error, setError] = useState("");

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

    if (error) {
      setError("");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be 10MB or less.");
      event.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    setError("");
  };

  const removeFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setError("");
      },
      () => {
        setError(
          "Unable to access your location. Please allow location access and try again."
        );
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Please enter an issue title.");
      return;
    }

    if (!formData.category) {
      setError("Please select an issue category.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please describe the issue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await apiRequest("/issues", {
        method: "POST",
        body: JSON.stringify({
          title: formData.title.trim(),
          category: formData.category,
          description: formData.description.trim(),
          latitude: location?.latitude ?? null,
          longitude: location?.longitude ?? null,
          address: formData.address.trim() || null,

          // Image upload will be connected separately.
          imageUrl: null,
        }),
      });

      console.log("Issue created successfully:", data);

      const issueId = data?.issue?.id;

      if (!issueId) {
        throw new Error(
          "Your report was submitted, but the server did not return the issue ID."
        );
      }

      navigate(`/citizen/reports/${issueId}`);
    } catch (submitError) {
      console.error("Report submission error:", submitError);

      setError(
        submitError.message ||
          "Unable to submit your report. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-page">
      <main className="report-main">
        <div className="report-container">

          {/* =====================================================
              PAGE HEADER
          ====================================================== */}

          <header className="report-page-header">
            <div className="report-header-left">
              <div className="report-header-icon">
                <FileText size={20} />
              </div>

              <div>
                <span className="report-eyebrow">
                  CIVIC REPORT
                </span>

                <h1>Report an issue</h1>

                <p>
                  Help improve your community by reporting a
                  problem that needs attention.
                </p>
              </div>
            </div>

            <div className="report-header-status">
              <span className="status-dot"></span>
              Secure submission
            </div>
          </header>

          {/* =====================================================
              ERROR
          ====================================================== */}

          {error && (
            <div className="report-error">
              <span className="report-error-icon">!</span>

              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={15} />
              </button>
            </div>
          )}

          <form
            className="report-form"
            onSubmit={handleSubmit}
          >

            {/* ===================================================
                MAIN TWO COLUMN GRID
            ==================================================== */}

            <div className="report-main-grid">

              {/* =================================================
                  ISSUE DETAILS
              ================================================== */}

              <section className="report-card issue-details-card">

                <div className="report-card-heading">
                  <div className="section-number">
                    01
                  </div>

                  <div>
                    <h2>Issue details</h2>
                    <p>
                      Tell us what is happening.
                    </p>
                  </div>
                </div>

                <div className="report-fields">

                  <div className="report-field">
                    <label htmlFor="title">
                      Issue title
                      <span>*</span>
                    </label>

                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Large pothole on Main Road"
                      required
                    />

                    <small>
                      Keep the title short and specific.
                    </small>
                  </div>

                  <div className="report-field">
                    <label htmlFor="category">
                      Category
                      <span>*</span>
                    </label>

                    <div className="report-select">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Select a category
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

                      <ChevronDown size={16} />
                    </div>
                  </div>

                  <div className="report-field">
                    <div className="label-row">
                      <label htmlFor="description">
                        Description
                        <span>*</span>
                      </label>

                      <span className="field-hint">
                        Be specific
                      </span>
                    </div>

                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the problem, what is affected, and any details that may help the authorities understand it."
                      rows="8"
                      required
                    />

                    <small>
                      Include important details such as severity,
                      nearby landmarks, or how long the problem
                      has existed.
                    </small>
                  </div>

                </div>
              </section>

              {/* =================================================
                  LOCATION
              ================================================== */}

              <section className="report-card location-card">

                <div className="report-card-heading">
                  <div className="section-number">
                    02
                  </div>

                  <div>
                    <h2>Issue location</h2>
                    <p>
                      Help authorities find the exact location.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={`location-action ${
                    location ? "location-action-success" : ""
                  }`}
                  onClick={getCurrentLocation}
                >
                  <div className="location-action-icon">
                    {location ? (
                      <Check size={18} />
                    ) : (
                      <MapPin size={18} />
                    )}
                  </div>

                  <div className="location-action-text">
                    <strong>
                      {location
                        ? "Location captured"
                        : "Use my current location"}
                    </strong>

                    <span>
                      {location
                        ? "Coordinates have been added to your report."
                        : "Allow location access to pinpoint the issue."}
                    </span>
                  </div>

                  <MapPin size={16} />
                </button>

                <div className="location-or">
                  <span>OR ENTER MANUALLY</span>
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

                <div className="map-preview">
                  <div className="map-grid"></div>

                  <div className="map-center">
                    <div className="map-pin">
                      <MapPin size={19} />
                    </div>

                    <span>
                      {location
                        ? "Location selected"
                        : "Map preview"}
                    </span>
                  </div>

                  <div className="map-label map-label-top">
                    Your location
                  </div>

                  <div className="map-label map-label-bottom">
                    Interactive map
                  </div>
                </div>

              </section>
            </div>

            {/* ===================================================
                EVIDENCE
            ==================================================== */}

            <section className="report-card evidence-card">

              <div className="report-card-heading">
                <div className="section-number">
                  03
                </div>

                <div>
                  <h2>Evidence photo</h2>
                  <p>
                    Add a photo to help authorities understand
                    the issue.
                  </p>
                </div>

                <span className="optional-badge">
                  OPTIONAL
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
                  <div className="upload-main">
                    <div className="upload-icon">
                      <ImagePlus size={22} />
                    </div>

                    <div>
                      <strong>
                        Upload evidence photo
                      </strong>

                      <span>
                        Drag and drop your image here or choose
                        a file from your device
                      </span>
                    </div>
                  </div>

                  <div className="upload-choose">
                    <Upload size={15} />
                    Choose image
                  </div>

                  <span className="upload-format">
                    PNG, JPG or WEBP · Maximum 10MB
                  </span>
                </button>
              ) : (
                <div className="image-preview">
                  <img
                    src={preview}
                    alt="Selected issue evidence"
                  />

                  <div className="image-preview-info">
                    <div>
                      <strong>
                        {selectedFile?.name}
                      </strong>

                      <span>
                        Photo selected successfully
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      aria-label="Remove image"
                    >
                      <X size={17} />
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

            {/* ===================================================
                SUBMISSION FOOTER
            ==================================================== */}

            <div className="report-submit-area">

              <div className="submission-security">
                <div className="security-icon">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <strong>
                    Your report is secure
                  </strong>

                  <span>
                    It will be reviewed by an authorized
                    CivicFix administrator.
                  </span>
                </div>
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
                      Submit report
                      <Camera size={16} />
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

export default ReportIssue;