import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";
import portImage from "../assets/loginpage.jpeg";
import logo from "../assets/goagentlogo.png";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login(form);
      loginUser(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.overlay} />
        <img src={portImage} alt="Port" style={styles.portImage} />
        <div style={styles.leftContent}>
          <img src={logo} alt="GoAgent" style={styles.leftLogo} />
          <h1 style={styles.leftHeading}>
            Nigeria's #1 Logistics Clearing Marketplace
          </h1>
          <p style={styles.leftSubtext}>
            Connect with verified clearing agents. Get competitive bids.
            Clear your goods faster.
          </p>
          <div style={styles.statsRow}>
            <div style={styles.stat}>
              <span style={styles.statNum}>500+</span>
              <span style={styles.statLabel}>Verified Agents</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNum}>2,000+</span>
              <span style={styles.statLabel}>Jobs Completed</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNum}>98%</span>
              <span style={styles.statLabel}>Success Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formWrapper}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Welcome back</h2>
            <p style={styles.formSubtitle}>Sign in to your GoAgent account</p>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              style={{
                ...styles.button,
                opacity: loading ? 0.8 : 1,
              }}
              type="submit"
              disabled={loading}
              onMouseEnter={(e) => (e.target.style.background = "#14532d")}
              onMouseLeave={(e) => (e.target.style.background = "#166534")}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerText}>New to GoAgent?</span>
          </div>

          <Link to="/register" style={styles.registerBtn}>
            Create an Account
          </Link>

          <p style={styles.footer}>
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  leftPanel: {
    flex: 1,
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    overflow: "hidden",
  },
  portImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(20,83,45,0.92) 0%, rgba(0,0,0,0.75) 100%)",
    zIndex: 1,
  },
  leftContent: {
    position: "relative",
    zIndex: 2,
    padding: "3rem",
    color: "white",
  },
  leftLogo: {
    height: "60px",
    marginBottom: "2rem",
  },
  leftHeading: {
    fontSize: "2rem",
    fontWeight: "800",
    lineHeight: 1.2,
    marginBottom: "1rem",
    color: "white",
  },
  leftSubtext: {
    fontSize: "1rem",
    color: "rgba(255,255,255,0.8)",
    lineHeight: 1.6,
    marginBottom: "2.5rem",
    maxWidth: "400px",
  },
  statsRow: {
    display: "flex",
    gap: "2rem",
    marginBottom: "2rem",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
  },
  statNum: {
    fontSize: "1.75rem",
    fontWeight: "800",
    color: "#4ade80",
  },
  statLabel: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  rightPanel: {
    width: "480px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "380px",
  },
  formHeader: {
    marginBottom: "2rem",
  },
  formTitle: {
    fontSize: "1.75rem",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "0.25rem",
  },
  formSubtitle: {
    color: "#6b7280",
    fontSize: "0.95rem",
  },
  error: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "0.875rem 1rem",
    borderRadius: "8px",
    marginBottom: "1.25rem",
    fontSize: "0.875rem",
  },
  field: {
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    fontSize: "0.875rem",
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "0.875rem 1rem",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "0.95rem",
    color: "#111827",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  button: {
    width: "100%",
    padding: "0.875rem",
    background: "#166534",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "0.5rem",
    letterSpacing: "0.025em",
    boxShadow: "0 4px 14px rgba(22,101,52,0.4)",
    transition: "all 0.2s",
  },
  divider: {
    textAlign: "center",
    margin: "1.5rem 0",
    position: "relative",
  },
  dividerText: {
    color: "#9ca3af",
    fontSize: "0.875rem",
    background: "white",
    padding: "0 0.75rem",
  },
  registerBtn: {
    display: "block",
    width: "100%",
    padding: "0.875rem",
    background: "white",
    color: "#166534",
    border: "2px solid #166534",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    textAlign: "center",
    textDecoration: "none",
    boxSizing: "border-box",
    letterSpacing: "0.025em",
    transition: "all 0.2s",
  },
  footer: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "0.75rem",
    marginTop: "1.5rem",
    lineHeight: 1.5,
  },
};

export default Login;