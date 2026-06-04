import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getJobs, logout } from "../services/api";
import { useAuth } from "../context/AuthContext";

function ImporterDashboard() {
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

  const stats = {
    total: jobs.length,
    open: jobs.filter((j) => j.status === "open").length,
    awarded: jobs.filter((j) => j.status === "awarded").length,
    completed: jobs.filter((j) => j.status === "completed").length,
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
        <div style={styles.header}>
          <h1>My Jobs</h1>
          <button style={styles.primaryBtn} onClick={() => navigate("/jobs/create")}>
            + Post New Job
          </button>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.total}</div>
            <div style={styles.statLabel}>Total Jobs</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statNumber, color: "#059669" }}>
              {stats.open}
            </div>
            <div style={styles.statLabel}>Open</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statNumber, color: "#d97706" }}>
              {stats.awarded}
            </div>
            <div style={styles.statLabel}>Awarded</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statNumber, color: "#1a56db" }}>
              {stats.completed}
            </div>
            <div style={styles.statLabel}>Completed</div>
          </div>
        </div>

        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <div style={styles.empty}>
            <p>You haven't posted any jobs yet.</p>
            <button
              style={styles.primaryBtn}
              onClick={() => navigate("/jobs/create")}
            >
              Post Your First Job
            </button>
          </div>
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
                  <span style={{ ...styles.badge, ...getBadgeStyle(job.status) }}>
                    {job.status}
                  </span>
                </div>
                <p style={styles.jobMeta}>
                  {job.origin_port} → {job.destination}
                </p>
                <div style={styles.jobFooter}>
                  <span>Budget: ₦{Number(job.budget).toLocaleString()}</span>
                  <span>{job.bids_count || 0} bids received</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getBadgeStyle(status) {
  const colors = {
    open: { background: "#d1fae5", color: "#065f46" },
    awarded: { background: "#fef3c7", color: "#92400e" },
    in_progress: { background: "#dbeafe", color: "#1e40af" },
    completed: { background: "#e0e7ff", color: "#3730a3" },
  };
  return colors[status] || {};
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  primaryBtn: {
    padding: "0.75rem 1.5rem",
    background: "#1a56db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statCard: {
    background: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  statNumber: { fontSize: "2rem", fontWeight: "bold", color: "#111827" },
  statLabel: { color: "#6b7280", marginTop: "0.25rem" },
  empty: { textAlign: "center", padding: "3rem", color: "#6b7280" },
  jobsList: { display: "flex", flexDirection: "column", gap: "1rem" },
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
  badge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  jobMeta: { color: "#6b7280", margin: "0.5rem 0" },
  jobFooter: {
    display: "flex",
    justifyContent: "space-between",
    color: "#6b7280",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
};

export default ImporterDashboard;