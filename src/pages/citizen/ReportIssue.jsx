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
     SELECT CURRENT LOCATION
  ========================================================= */

  const handleUseCurrentLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError(
        "Location services are not supported by your browser. Please enable location services or try another browser."
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
     SUBMIT REPORT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const title = formData.title.trim();
    const description = formData.description.trim();
    const address = formData.address.trim();

    /* ---------------------------------------------------------
       BASIC VALIDATION
    --------------------------------------------------------- */

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

    /* ---------------------------------------------------------
       LOCATION IS REQUIRED
       
       GPS coordinates must be selected.
       Address is only descriptive text.
    --------------------------------------------------------- */

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

      /* -------------------------------------------------------
         ISSUE DETAILS
      ------------------------------------------------------- */

      issueFormData.append("title", title);

      issueFormData.append(
        "category",
        formData.category
      );

      issueFormData.append(
        "description",
        description
      );

      /* -------------------------------------------------------
         GPS LOCATION
         
         These are the actual coordinates selected by
         the citizen.
      ------------------------------------------------------- */

      issueFormData.append(
        "latitude",
        String(location.latitude)
      );

      issueFormData.append(
        "longitude",
        String(location.longitude)
      );

      /* -------------------------------------------------------
         ADDRESS / LANDMARK
         
         This is simply descriptive text.
         It does NOT need to be geocoded or exact.
      ------------------------------------------------------- */

      issueFormData.append(
        "address",
        address
      );

      /* -------------------------------------------------------
         PHOTO
      ------------------------------------------------------- */

      if (selectedFile) {
        issueFormData.append(
          "image",
          selectedFile
        );
      }

      /* -------------------------------------------------------
         API REQUEST
      ------------------------------------------------------- */

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
              HEADER
          =================================================== */}

          <header className="report-page-header">
            <div className="report-header-left">
              <div className="report-header-icon">
                <FileText size={19} />
              </div>

              <div>
                <span className="report-eyebrow">
                  CIVICFIX · CITIZEN REPORT
                </span>

                <h1>Report a civic issue</h1>

                <p>
                  Tell us what is wrong and help your
                  community get it resolved.
                </p>
              </div>
            </div>

            <div className="report-header-status">
              <span className="status-dot"></span>
              Secure submission
            </div>
          </header>

          {/* ===================================================
              ERROR
          =================================================== */}

          {error && (
            <div className="report-error">
              <span className="report-error-icon">
                !
              </span>

              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={13} />
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

            <div className="report-main-grid">

              {/* =================================================
                  ISSUE DETAILS
              ================================================= */}

              <section className="report-card">

                <div className="report-card-heading">
                  <div className="section-number">
                    01
                  </div>

                  <div>
                    <h2>Issue details</h2>

                    <p>
                      Describe the problem clearly so it
                      can be routed to the right department.
                    </p>
                  </div>
                </div>

                <div className="report-fields">

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
                      placeholder="e.g. Large pothole near main gate"
                      maxLength={120}
                    />
                  </div>

                  {/* CATEGORY */}

                  <div className="report-field">
                    <label htmlFor="category">
                      Category <span>*</span>
                    </label>

                    <div className="report-select">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="">
                          Select a category
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

                      <ChevronDown size={14} />
                    </div>
                  </div>

                  {/* DESCRIPTION */}

                  <div className="report-field">
                    <div className="label-row">
                      <label htmlFor="description">
                        Description <span>*</span>
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
                      placeholder="Explain what happened, where it is, and any other useful details..."
                      maxLength={1500}
                    />

                    <small>
                      Include details that could help the
                      responsible department understand
                      the issue.
                    </small>
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

                  <div>
                    <h2>Issue location</h2>

                    <p>
                      First select the location, then
                      describe the address or landmark.
                    </p>
                  </div>

                  <span className="optional-badge">
                    REQUIRED
                  </span>
                </div>

                {/* CURRENT LOCATION */}

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
                        : "Select my location"}
                    </strong>

                    <span>
                      {location
                        ? "GPS coordinates have been captured successfully."
                        : "Use your current location to mark where the issue is."}
                    </span>
                  </div>

                  {!location && !isGettingLocation && (
                    <ChevronDown size={14} />
                  )}
                </button>

                {/* =================================================
                    MANUAL ADDRESS
                ================================================= */}

                <div className="location-or">
                  <span>THEN ENTER LOCATION DETAILS</span>
                </div>

                <div className="report-field">
                  <label htmlFor="address">
                    Address / area / landmark{" "}
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
                    Enter any useful description such as an
                    area, landmark, street, building, or nearby
                    place. It does not need to be an exact address.
                  </small>
                </div>

                {/* =================================================
                    MAP PREVIEW
                ================================================= */}

                <div className="map-preview">
                  <div className="map-grid"></div>

                  <div className="map-center">
                    <div className="map-pin">
                      <MapPin size={17} />
                    </div>

                    <span>
                      {location
                        ? "Location selected"
                        : "Select your location"}
                    </span>
                  </div>

                  <span className="map-label map-label-top">
                    CivicFix
                  </span>

                  <span className="map-label map-label-bottom">
                    GPS location
                  </span>
                </div>

              </section>
            </div>

            {/* ===================================================
                EVIDENCE
            =================================================== */}

            <section className="report-card evidence-card">

              <div className="report-card-heading">
                <div className="section-number">
                  03
                </div>

                <div>
                  <h2>Photo evidence</h2>

                  <p>
                    Add a photo to help verify and understand
                    the issue.
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
                    <div className="upload-main">
                      <div className="upload-icon">
                        <ImagePlus size={19} />
                      </div>

                      <div>
                        <strong>
                          Upload an issue photo
                        </strong>

                        <span>
                          Choose a clear photo showing
                          the problem.
                        </span>
                      </div>
                    </div>

                    <span className="upload-choose">
                      <Upload size={12} />
                      Choose image
                    </span>

                    <span className="upload-format">
                      JPG · PNG · WEBP
                    </span>
                  </button>
                </>
              ) : (
                <div className="image-preview">

                  <img
                    src={preview}
                    alt="Selected issue evidence"
                  />

                  <div className="image-preview-info">
                    <div>
                      <strong>
                        {selectedFile.name}
                      </strong>

                      <span>
                        Photo ready to upload
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      aria-label="Remove selected image"
                      disabled={isSubmitting}
                    >
                      <X size={14} />
                    </button>
                  </div>

                </div>
              )}

            </section>

            {/* ===================================================
                SUBMISSION
            =================================================== */}

            <div className="report-submit-area">

              <div className="submission-security">
                <div className="security-icon">
                  <ShieldCheck size={16} />
                </div>

                <div>
                  <strong>
                    Your report is securely submitted
                  </strong>

                  <span>
                    CivicFix uses your information only
                    to process this report.
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
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check size={13} />
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