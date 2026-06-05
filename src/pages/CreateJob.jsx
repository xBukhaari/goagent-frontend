import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/api";
import logo from "../assets/goagentlogo.png";
import portImage from "../assets/biddingpage.jpeg";

function CreateJob() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    origin_port: "",
    destination: "",
    budget: "",
    expected_delivery_date: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createJob(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.nav}>
        <img src={logo} alt="GoAgent" style={styles.navLogo} />
        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </nav>

      <div style={styles.body}>

        {/* Left: Form */}
        <div style={styles.formPanel}>
          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Post a Clearing Job</h1>
            <p style={styles.formSubtitle}>
              Fill in your shipment details and agents will submit competitive bids.
            </p>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Job Title</label>
              <input
                style={styles.input}
                type="text"
                name="title"
                placeholder="e.g. Import Electronics from Shanghai"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Origin Port</label>
                <input
                  style={styles.input}
                  type="text"
                  name="origin_port"
                  placeholder="e.g. Shanghai"
                  value={form.origin_port}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Destination</label>
                <input
                  style={styles.input}
                  type="text"
                  name="destination"
                  placeholder="e.g. Lagos"
                  value={form.destination}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Budget (₦)</label>
                <input
                  style={styles.input}
                  type="number"
                  name="budget"
                  placeholder="e.g. 500000"
                  value={form.budget}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Expected Delivery Date</label>
                <input
                  style={styles.input}
                  type="date"
                  name="expected_delivery_date"
                  value={form.expected_delivery_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Job Description</label>
              <textarea
                style={styles.textarea}
                name="description"
                placeholder="Describe your shipment, cargo type, special requirements..."
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <button
              style={{ ...styles.submitBtn, opacity: loading ? 0.8 : 1 }}
              type="submit"
              disabled={loading}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#14532d")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#166534")}
            >
              {loading ? "Posting Job..." : "Post Job — Get Bids Now"}
            </button>
          </form>
        </div>

        {/* Right: Image Panel */}
        <div style={styles.imagePanel}>
          <img src={portImage} alt="Port" style={styles.image} />
          <div style={styles.imageOverlay} />
          <div style={styles.imageContent}>
            <h2 style={styles.imageHeading}>How It Works</h2>
            <div style={styles.steps}>
              {[
                { num: "01", title: "Post Your Job", desc: "Fill in your shipment details and budget." },
                { num: "02", title: "Receive Bids", desc: "Verified clearing agents submit competitive quotes." },
                { num: "03", title: "Choose Your Agent", desc: "Compare bids and accept the best one." },
                { num: "04", title: "Track Progress", desc: "Monitor your job from awarded to completed." },
              ].map((step) => (
                <div key={step.num} style={styles.step}>
                  <span style={styles.stepNum}>{step.num}</span>
                  <div>
                    <div style={styles.stepTitle}>{step.title}</div>
                    <div style={styles.stepDesc}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  nav: {
    background: "white",
    padding: "0 2.5rem",
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLogo: {
    height: "38px",
    objectFit: "contain",
  },
  backBtn: {
    background: "none",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    padding: "0.5rem 1.25rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
  },
  body: {
    display: "flex",
    minHeight: "calc(100vh - 70px)",
  },
  formPanel: {
    flex: 1,
    padding: "3rem",
    maxWidth: "620px",
    overflowY: "auto",
  },
  formHeader: {
    marginBottom: "2rem",
  },
  formTitle: {
    fontSize: "1.75rem",
    fontWeight: "800",
    color: "#111827",
    margin: "0 0 0.5rem 0",
  },
  formSubtitle: {
    color: "#6b7280",
    fontSize: "0.95rem",
    margin: 0,
    lineHeight: 1.5,
  },
  error: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "0.875rem 1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    fontSize: "0.875rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.25rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontWeight: "600",
    fontSize: "0.85rem",
    color: "#374151",
  },
  input: {
    padding: "0.8rem 1rem",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "0.95rem",
    color: "#111827",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
  },
  textarea: {
    padding: "0.8rem 1rem",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "0.95rem",
    color: "#111827",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
    height: "120px",
    resize: "vertical",
    fontFamily: "inherit",
  },
  submitBtn: {
    padding: "1rem",
    background: "#166534",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(22,101,52,0.35)",
    transition: "background 0.2s",
    marginTop: "0.5rem",
  },
  imagePanel: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
  },
  imageContent: {
    position: "relative",
    zIndex: 2,
    padding: "3rem",
    color: "white",
  },
  imageHeading: {
    fontSize: "1.5rem",
    fontWeight: "800",
    marginBottom: "2rem",
    color: "white",
  },
  steps: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  step: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
  },
  stepNum: {
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#4ade80",
    minWidth: "40px",
    lineHeight: 1,
  },
  stepTitle: {
    fontWeight: "700",
    fontSize: "1rem",
    color: "white",
    marginBottom: "0.25rem",
  },
  stepDesc: {
    fontSize: "0.875rem",
    color: "rgba(255,255,255,0.75)",
    lineHeight: 1.5,
  },
};

export default CreateJob;