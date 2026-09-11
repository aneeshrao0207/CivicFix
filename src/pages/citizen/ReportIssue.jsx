import { useRef, useState } from "react";

import {
  AlertCircle,
  Camera,
  Check,
  CheckCircle2,
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

const categories = [
  "Road",
  "Garbage",
  "Streetlight",
  "Water",
  "Traffic",
  "Public Infrastructure",
  "Other",
];

const ReportIssue = () => {
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
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [error, setError] = useState("");

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  /* =========================================================
     CURRENT LOCATION
  ========================================================= */

  const handleUseCurrentLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError(
        "Location services are not supported by your browser. Please try another browser."
      );
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = Number(position.coords.latitude);
        const longitude = Number(position.coords.longitude);

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude)
        ) {
          setIsGettingLocation(false);

          setError(
            "We could not determine your location. Please try again."
          );

          return;
        }

        setLocation({
          latitude,
          longitude,
        });

        setIsGettingLocation(false);
        setError("");
      },

      (geoError) => {
        setIsGettingLocation(false);

        if (geoError.code === 1) {
          setError(
            "Location permission was denied. Please allow location access in your browser and try again."
          );
        } else if (geoError.code === 2) {
          setError(
            "Your location could not be determined. Please try again."
          );
        } else if (geoError.code === 3) {
          setError(
            "Location request timed out. Please try again."
          );
        } else {
          setError(
            "Unable to get your current location. Please try again."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  /* =========================================================
     FILE SELECTION
  ========================================================= */

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  /* =========================================================
     REMOVE IMAGE
  ========================================================= */

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const title = formData.title.trim();
    const description = formData.description.trim();
    const address = formData.address.trim();

    if (!title) {
      setError("Please enter an issue title.");
      return;
    }

    if (!formData.category) {
      setError("Please select an issue category.");
      return;
    }

    if (!description) {
      setError("Please describe the issue.");
      return;
    }

    if (!location) {
      setError(
        "Please select your location before submitting the report."
      );
      return;
    }

    if (!address) {
      setError(
        "Please enter the address, area, landmark, or other location details."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const issueFormData = new FormData();

      issueFormData.append("title", title);

      issueFormData.append(
        "category",
        formData.category
      );

      issueFormData.append(
        "description",
        description
      );

      issueFormData.append(
        "latitude",
        String(location.latitude)
      );

      issueFormData.append(
        "longitude",
        String(location.longitude)
      );

      issueFormData.append(
        "address",
        address
      );

      if (selectedFile) {
        issueFormData.append(
          "image",
          selectedFile
        );
      }

      const data = await apiRequest("/issues", {
        method: "POST",
        body: issueFormData,
      });

      const issueId = data?.issue?.id;

      if (!issueId) {
        throw new Error(
          "The report was submitted, but the issue ID was not returned."
        );
      }

      navigate(`/citizen/reports/${issueId}`);
    } catch (submitError) {
      setError(
        submitError?.message ||
          "Something went wrong while submitting your report."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="report-page">
      <main className="report-main">
        <div className="report-container">

          {/* ===================================================
              PAGE HEADER
          =================================================== */}

          <header className="report-page-header">

            <div className="report-header-content">

              

              <div>
                <span className="report-eyebrow">
                  CIVICFIX · NEW REPORT
                </span>

                <h1>
                  Report a civic issue
                </h1>

                <p>
                  Help improve your community by reporting
                  a problem that needs attention.
                </p>
              </div>

            </div>

            <div className="report-header-security">
              <ShieldCheck size={15} />
              <span>Secure submission</span>
            </div>

          </header>

          {/* ===================================================
              PROGRESS
          =================================================== */}

          <div className="report-progress">

            <div className="progress-step active">
              <span>01</span>
              <div>
                <strong>Issue</strong>
                <small>What happened?</small>
              </div>
            </div>

            <div className="progress-line"></div>

            <div className="progress-step active">
              <span>02</span>
              <div>
                <strong>Location</strong>
                <small>Where is it?</small>
              </div>
            </div>

            <div className="progress-line"></div>

            <div className="progress-step">
              <span>03</span>
              <div>
                <strong>Evidence</strong>
                <small>Add a photo</small>
              </div>
            </div>

          </div>

          {/* ===================================================
              ERROR
          =================================================== */}

          {error && (
            <div className="report-error">

              <div className="report-error-icon">
                <AlertCircle size={16} />
              </div>

              <div className="report-error-content">
                <strong>Something needs your attention</strong>
                <span>{error}</span>
              </div>

              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={15} />
              </button>

            </div>
          )}

          {/* ===================================================
              FORM
          =================================================== */}

          <form
            className="report-form"
            onSubmit={handleSubmit}
          >

            {/* =================================================
                TOP GRID
            ================================================= */}

            <div className="report-main-grid">

              {/* =================================================
                  ISSUE DETAILS
              ================================================= */}

              <section className="report-card issue-details-card">

                <div className="report-card-heading">

                  <div className="section-number">
                    01
                  </div>

                  <div className="section-heading-text">
                    <span className="section-kicker">
                      ISSUE DETAILS
                    </span>

                    <h2>
                      What is the problem?
                    </h2>

                    <p>
                      Give enough detail so the responsible
                      department can understand the issue quickly.
                    </p>
                  </div>

                </div>

                <div className="report-fields">

                  {/* TITLE */}

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
                      placeholder="e.g. Large pothole near main gate"
                      maxLength={120}
                      disabled={isSubmitting}
                    />

                    <div className="field-footer">
                      <span>
                        Keep it short and specific.
                      </span>

                      <span>
                        {formData.title.length}/120
                      </span>
                    </div>

                  </div>

                  {/* CATEGORY */}

                  <div className="report-field">

                    <label htmlFor="category">
                      Issue category
                      <span>*</span>
                    </label>

                    <div className="report-select">

                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      >
                        <option value="">
                          Select the type of issue
                        </option>

                        {categories.map((category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        ))}
                      </select>

                      <ChevronDown size={15} />

                    </div>

                  </div>

                  {/* DESCRIPTION */}

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
                      placeholder="Explain what happened, where it is, how serious it is, and any other useful details..."
                      maxLength={1500}
                      disabled={isSubmitting}
                    />

                    <div className="field-footer">

                      <span>
                        More detail helps the department act faster.
                      </span>

                      <span>
                        {formData.description.length}/1500
                      </span>

                    </div>

                  </div>

                </div>

              </section>

              {/* =================================================
                  LOCATION
              ================================================= */}

              <section className="report-card location-card">

                <div className="report-card-heading">

                  <div className="section-number">
                    02
                  </div>

                  <div className="section-heading-text">
                    <span className="section-kicker">
                      LOCATION
                    </span>

                    <h2>
                      Where is the issue?
                    </h2>

                    <p>
                      Mark the location first, then add
                      a useful landmark or area description.
                    </p>
                  </div>

                  <span className="required-badge">
                    REQUIRED
                  </span>

                </div>

                {/* LOCATION BUTTON */}

                <button
                  type="button"
                  className={`location-action ${
                    location
                      ? "location-action-success"
                      : ""
                  }`}
                  onClick={handleUseCurrentLocation}
                  disabled={
                    isGettingLocation ||
                    isSubmitting
                  }
                >

                  <div className="location-action-icon">

                    {location ? (
                      <Check size={17} />
                    ) : (
                      <MapPin size={17} />
                    )}

                  </div>

                  <div className="location-action-text">

                    <strong>
                      {isGettingLocation
                        ? "Getting your location..."
                        : location
                        ? "Location selected"
                        : "Use my current location"}
                    </strong>

                    <span>
                      {location
                        ? "GPS coordinates captured successfully."
                        : "Allow CivicFix to mark the issue location."}
                    </span>

                  </div>

                  {location && (
                    <CheckCircle2
                      size={17}
                      className="location-success-icon"
                    />
                  )}

                  {!location &&
                    !isGettingLocation && (
                      <ChevronDown size={14} />
                    )}

                </button>

                {/* LOCATION STATUS */}

                {location && (
                  <div className="location-coordinates">

                    <div>
                      <span>LATITUDE</span>
                      <strong>
                        {location.latitude.toFixed(6)}
                      </strong>
                    </div>

                    <div>
                      <span>LONGITUDE</span>
                      <strong>
                        {location.longitude.toFixed(6)}
                      </strong>
                    </div>

                  </div>
                )}

                {/* DIVIDER */}

                <div className="location-divider">
                  <span>
                    LOCATION DETAILS
                  </span>
                </div>

                {/* ADDRESS */}

                <div className="report-field">

                  <label htmlFor="address">
                    Address / area / landmark
                    <span>*</span>
                  </label>

                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. Near Garden City University, Tumakuru"
                    maxLength={250}
                    disabled={isSubmitting}
                  />

                  <small>
                    Add a street, area, building, landmark,
                    or nearby place. It does not need to be
                    an exact address.
                  </small>

                </div>

                {/* MAP */}

                <div
                  className={`map-preview ${
                    location
                      ? "map-preview-selected"
                      : ""
                  }`}
                >

                  <div className="map-grid"></div>

                  <div className="map-road map-road-one"></div>
                  <div className="map-road map-road-two"></div>
                  <div className="map-road map-road-three"></div>

                  <div className="map-center">

                    <div className="map-pin">
                      <MapPin size={17} />
                    </div>

                    <span>
                      {location
                        ? "Issue location captured"
                        : "GPS location preview"}
                    </span>

                  </div>

                  <span className="map-label map-label-top">
                    CIVICFIX
                  </span>

                  <span className="map-label map-label-bottom">
                    {location
                      ? "COORDINATES READY"
                      : "WAITING FOR LOCATION"}
                  </span>

                </div>

              </section>

            </div>

            {/* =================================================
                EVIDENCE
            ================================================= */}

            <section className="report-card evidence-card">

              <div className="report-card-heading">

                <div className="section-number">
                  03
                </div>

                <div className="section-heading-text">
                  <span className="section-kicker">
                    EVIDENCE
                  </span>

                  <h2>
                    Add a photo
                  </h2>

                  <p>
                    A clear photo can help the department
                    understand and verify the issue.
                  </p>
                </div>

                <span className="optional-badge">
                  OPTIONAL
                </span>

              </div>

              {!selectedFile ? (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />

                  <button
                    type="button"
                    className="upload-area"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={isSubmitting}
                  >

                    <div className="upload-visual">

                      <div className="upload-icon">
                        <Camera size={19} />
                      </div>

                      <div className="upload-plus">
                        <ImagePlus size={13} />
                      </div>

                    </div>

                    <div className="upload-main">

                      <strong>
                        Add issue photo
                      </strong>

                      <span>
                        Show the problem clearly from
                        a useful angle.
                      </span>

                    </div>

                    <span className="upload-choose">
                      <Upload size={12} />
                      Choose image
                    </span>

                    <span className="upload-format">
                      JPG · PNG · WEBP · MAX 10 MB
                    </span>

                  </button>
                </>
              ) : (
                <div className="image-preview">

                  <div className="image-preview-media">

                    <img
                      src={preview}
                      alt="Selected issue evidence"
                    />

                    <div className="image-preview-badge">
                      <Check size={12} />
                      Ready
                    </div>

                  </div>

                  <div className="image-preview-info">

                    <div className="image-file-details">

                      <strong>
                        {selectedFile.name}
                      </strong>

                      <span>
                        Photo ready to upload ·{" "}
                        {(
                          selectedFile.size /
                          (1024 * 1024)
                        ).toFixed(2)}{" "}
                        MB
                      </span>

                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      aria-label="Remove selected image"
                      disabled={isSubmitting}
                    >
                      <X size={15} />
                    </button>

                  </div>

                </div>
              )}

            </section>

            {/* =================================================
                SUBMISSION
            ================================================= */}

            <div className="report-submit-area">

              <div className="submission-security">

                <div className="security-icon">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <strong>
                    Your information is protected
                  </strong>

                  <span>
                    CivicFix uses your information only
                    to process and track this report.
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
                  disabled={
                    isSubmitting ||
                    isGettingLocation
                  }
                >

                  {isSubmitting ? (
                    <>
                      <span className="submit-spinner"></span>
                      Submitting report...
                    </>
                  ) : (
                    <>
                      <Check size={14} />
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
};

export default ReportIssue;