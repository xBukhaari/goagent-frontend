import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getJobs, logout } from "../services/api";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/goagentlogo.png";
import portImage from "../assets/agentpage.jpeg";

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
              <span style={styles.userRole}>Clearing Agent</span>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={styles.hero}>
        <img src={portImage} alt="Port" style={styles.heroImage} />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Find Your Next Job
          </h1>
          <p style={styles.heroSub}>
            Browse open clearing jobs and submit competitive bids to win contracts.
          </p>
          <div style={styles.heroStats}>
            <div style={styles.heroStat}>
              <span style={styles.heroStatNum}>{jobs.length}</span>
              <span style={styles.heroStatLabel}>Open Jobs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Available Jobs</h2>
          <span style={styles.jobCount}>{jobs.length} job{jobs.length !== 1 ? "s" : ""} available</span>
        </div>

        {loading ? (
          <div style={styles.emptyState}>Loading available jobs...</div>
        ) : jobs.length === 0 ? (
          <div style={styles.emptyState}>
            No open jobs available right now. Check back soon.
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
                  <span style={styles.openBadge}>Open</span>
                  <span style={styles.bidCount}>
                    {job.bids_count || 0} bid{job.bids_count !== 1 ? "s" : ""}
                  </span>
                </div>
                <h3 style={styles.jobTitle}>{job.title}</h3>
                <p style={styles.jobDesc}>{job.description}</p>
                <div style={styles.jobRoute}>
                  <span style={styles.routePoint}>{job.origin_port}</span>
                  <span style={styles.routeArrow}>→</span>
                  <span style={styles.routePoint}>{job.destination}</span>
                </div>
                <div style={styles.jobFooter}>
                  <div>
                    <div style={styles.budgetLabel}>Budget</div>
                    <div style={styles.budget}>
                      ₦{Number(job.budget).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={styles.budgetLabel}>Delivery By</div>
                    <div style={styles.deadline}>
                      {job.expected_delivery_date}
                    </div>
                  </div>
                </div>
                <button style={styles.bidBtn}>
                  View & Submit Bid →
                </button>
              </div>
            ))}
          </div>
        )}
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
    alignItems: "flex-start",
    justifyContent: "center",
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
  },
  hero: {
    position: "relative",
    height: "220px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
  },
  heroImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center 40%",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    padding: "0 2.5rem",
    color: "white",
  },
  heroTitle: {
    fontSize: "2rem",
    fontWeight: "800",
    margin: "0 0 0.5rem 0",
    color: "white",
  },
  heroSub: {
    fontSize: "1rem",
    color: "rgba(255,255,255,0.85)",
    margin: "0 0 1rem 0",
    maxWidth: "500px",
  },
  heroStats: {
    display: "flex",
    gap: "2rem",
  },
  heroStat: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  heroStatNum: {
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#4ade80",
  },
  heroStatLabel: {
    fontSize: "0.875rem",
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "2rem 2.5rem",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  jobCount: {
    fontSize: "0.875rem",
    color: "#6b7280",
    fontWeight: "500",
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
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
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
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  jobCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  openBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    background: "#dcfce7",
    color: "#166534",
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
    margin: 0,
    lineHeight: 1.3,
  },
  jobDesc: {
    fontSize: "0.875rem",
    color: "#6b7280",
    margin: 0,
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  jobRoute: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0",
    borderTop: "1px solid #f3f4f6",
    borderBottom: "1px solid #f3f4f6",
  },
  routePoint: {
    fontSize: "0.875rem",
    color: "#374151",
    fontWeight: "600",
  },
  routeArrow: {
    color: "#166534",
    fontWeight: "700",
  },
  jobFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  budgetLabel: {
    fontSize: "0.7rem",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.2rem",
  },
  budget: {
    fontSize: "1.1rem",
    fontWeight: "800",
    color: "#166534",
  },
  deadline: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
  },
  bidBtn: {
    width: "100%",
    padding: "0.75rem",
    background: "#166534",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "0.25rem",
    boxShadow: "0 4px 12px rgba(22,101,52,0.3)",
    transition: "background 0.2s",
  },
};

export default AgentDashboard;