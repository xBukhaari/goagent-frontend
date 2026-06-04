import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getJobs, logout } from "../services/api";
import { useAuth } from "../context/AuthContext";

function AgentDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getJobs()
      .then((res) => setJobs(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    logoutUser();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2 style={styles.navTitle}>GoAgent</h2>
        <div style={styles.navRight}>
          <span style={styles.navUser}>Welcome, {user?.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <h1>Available Jobs</h1>
        <p style={{ color: "#6b7280" }}>
          Browse open jobs and submit your bids
        </p>

        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No open jobs available right now.</p>
        ) : (
          <div style={styles.jobsList}>
            {jobs.map((job) => (
              <div
                key={job.id}
                style={styles.jobCard}
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div style={styles.jobHeader}>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <span style={styles.openBadge}>open</span>
                </div>
                <p style={styles.jobDesc}>{job.description}</p>
                <p style={styles.jobMeta}>
                  {job.origin_port} → {job.destination}
                </p>
                <div style={styles.jobFooter}>
                  <span style={styles.budget}>
                    Budget: ₦{Number(job.budget).toLocaleString()}
                  </span>
                  <span style={styles.deadline}>
                    Delivery: {job.expected_delivery_date}
                  </span>
                  <span style={styles.bids}>
                    {job.bids_count || 0} bids
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f0f2f5" },
  nav: {
    background: "white",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  navTitle: { color: "#1a56db", margin: 0 },
  navRight: { display: "flex", alignItems: "center", gap: "1rem" },
  navUser: { color: "#6b7280" },
  logoutBtn: {
    padding: "0.5rem 1rem",
    background: "transparent",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    cursor: "pointer",
  },
  content: { maxWidth: "900px", margin: "0 auto", padding: "2rem" },
  jobsList: { display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" },
  jobCard: {
    background: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    cursor: "pointer",
  },
  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  jobTitle: { margin: 0, color: "#111827" },
  openBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.875rem",
    background: "#d1fae5",
    color: "#065f46",
  },
  jobDesc: { color: "#6b7280", margin: "0.5rem 0" },
  jobMeta: { color: "#374151", fontWeight: "500", margin: "0.25rem 0" },
  jobFooter: {
    display: "flex",
    gap: "1.5rem",
    marginTop: "0.75rem",
    fontSize: "0.875rem",
  },
  budget: { color: "#059669", fontWeight: "600" },
  deadline: { color: "#6b7280" },
  bids: { color: "#6b7280" },
};

export default AgentDashboard;