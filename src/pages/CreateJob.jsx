import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/api";

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
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <h1 style={styles.title}>Post a New Job</h1>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {[
            { label: "Job Title", name: "title", type: "text" },
            { label: "Origin Port", name: "origin_port", type: "text" },
            { label: "Destination", name: "destination", type: "text" },
            { label: "Budget (₦)", name: "budget", type: "number" },
            { label: "Expected Delivery Date", name: "expected_delivery_date", type: "date" },
          ].map((field) => (
            <div key={field.name} style={styles.field}>
              <label style={styles.label}>{field.label}</label>
              <input
                style={styles.input}
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              style={{ ...styles.input, height: "100px", resize: "vertical" }}
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f0f2f5",
    padding: "2rem",
  },
  card: {
    background: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    maxWidth: "600px",
    margin: "0 auto",
  },
  header: { marginBottom: "1.5rem" },
  backBtn: {
    background: "none",
    border: "none",
    color: "#1a56db",
    cursor: "pointer",
    padding: 0,
    marginBottom: "0.5rem",
  },
  title: { margin: 0 },
  error: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "0.75rem",
    borderRadius: "4px",
    marginBottom: "1rem",
  },
  field: { marginBottom: "1rem" },
  label: { display: "block", marginBottom: "0.25rem", fontWeight: "500" },
  input: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    background: "#1a56db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
};

export default CreateJob;