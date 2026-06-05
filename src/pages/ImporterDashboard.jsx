import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getJobs, logout } from "../services/api";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/goagentlogo.png";

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
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.nav}>
        <img src={logo} alt="GoAgent" style={styles.navLogo} />
        <div style={styles.navRight}>
          <div style={styles.userBadge}>
            <div style={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={styles.userInfo}>
              <span style={styles.userName}>{user?.name}</span>
              <span style={styles.userRole}>Importer</span>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Hero Strip */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Good day, {user?.name?.split(" ")[0]}.</h1>
          <p style={styles.heroSub}>Manage your clearing jobs and track bids in one place.</p>
        </div>
        <button
          style={styles.postBtn}
          onClick={() => navigate("/jobs/create")}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#14532d")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#166534")}
        >
          + Post New Job
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { label: "Total Jobs", value: stats.total, color: "#111827", bg: "#f9fafb" },
            { label: "Open", value: stats.open, color: "#059669", bg: "#f0fdf4" },
            { label: "Awarded", value: stats.awarded, color: "#d97706", bg: "#fffbeb" },
            { label: "Completed", value: stats.completed, color: "#1a56db", bg: "#eff6ff" },
          ].map((s) => (
            <div key={s.label} style={{ ...styles.statCard, background: s.bg }}>
              <span style={{ ...styles.statNum, color: s.color }}>{s.value}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Jobs List */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>My Jobs</h2>
          {loading ? (
            <div style={styles.emptyState}>Loading your jobs...</div>
          ) : jobs.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                You haven't posted any jobs yet.
              </p>
              <button
                style={styles.postBtn}
                onClick={() => navigate("/jobs/create")}
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div style={styles.jobsGrid}>
              {jobs.map((job) => (
                <div
                  key={job.id}
                  style={styles.jobCard}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                  }}
                >
                  <div style={styles.jobCardTop}>
                    <span style={{ ...styles.badge, ...getBadgeStyle(job.status) }}>
                      {job.status.replace("_", " ")}
                    </span>
                    <span style={styles.bidCount}>
                      {job.bids_count || 0} bid{job.bids_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <div style={styles.jobRoute}>
                    <span style={styles.routePoint}>{job.origin_port}</span>
                    <span style={styles.routeArrow}>→</span>
                    <span style={styles.routePoint}>{job.destination}</span>
                  </div>
                  <div style={styles.jobFooter}>
                    <span style={styles.budget}>
                      ₦{Number(job.budget).toLocaleString()}
                    </span>
                    <span style={styles.deadline}>
                      Due: {job.expected_delivery_date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getBadgeStyle(status) {
  const map = {
    open: { background: "#dcfce7", color: "#166534" },
    awarded: { background: "#fef9c3", color: "#854d0e" },
    in_progress: { background: "#dbeafe", color: "#1e40af" },
    completed: { background: "#e0e7ff", color: "#3730a3" },
  };
  return map[status] || {};
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
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
  },
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#166534",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "1rem",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontWeight: "600",
    fontSize: "0.9rem",
    color: "#111827",
    lineHeight: 1.2,
  },
  userRole: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  logoutBtn: {
    padding: "0.5rem 1.25rem",
    background: "white",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
    transition: "all 0.2s",
  },
  hero: {
    background: "linear-gradient(135deg, #166534 0%, #14532d 100%)",
    padding: "2.5rem 2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroContent: {},
  heroTitle: {
    color: "white",
    fontSize: "1.75rem",
    fontWeight: "800",
    margin: "0 0 0.25rem 0",
    padding: 0,
  },
heroSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: "0.95rem",
    margin: 0,
    padding: 0,
  },
  postBtn: {
    padding: "0.875rem 1.75rem",
    background: "#166534",
    color: "white",
    border: "2px solid rgba(255,255,255,0.4)",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "700",
    boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
    transition: "background 0.2s",
    whiteSpace: "nowrap",
  },
  content: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "2rem 2.5rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1.25rem",
    marginBottom: "2.5rem",
  },
  statCard: {
    padding: "1.5rem",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    border: "1px solid #e5e7eb",
  },
  statNum: {
    fontSize: "2.25rem",
    fontWeight: "800",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: "0.8rem",
    color: "#6b7280",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  section: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "1rem",
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
    color: "#6b7280",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  jobsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.25rem",
  },
  jobCard: {
    background: "white",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    transition: "all 0.2s",
  },
  jobCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
  },
  badge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  bidCount: {
    fontSize: "0.8rem",
    color: "#6b7280",
    fontWeight: "500",
  },
  jobTitle: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 0.75rem 0",
    lineHeight: 1.3,
  },
  jobRoute: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  routePoint: {
    fontSize: "0.875rem",
    color: "#374151",
    fontWeight: "500",
  },
  routeArrow: {
    color: "#166534",
    fontWeight: "700",
  },
  jobFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "0.75rem",
    borderTop: "1px solid #f3f4f6",
  },
  budget: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#166534",
  },
  deadline: {
    fontSize: "0.8rem",
    color: "#9ca3af",
  },
};

export default ImporterDashboard;