import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJob, submitBid, acceptBid } from "../services/api";
import { useAuth } from "../context/AuthContext";

function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidForm, setBidForm] = useState({
    amount: "",
    message: "",
    estimated_completion_time: "",
  });
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getJob(id)
      .then((res) => setJob(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setBidError("");
    try {
      await submitBid(id, bidForm);
      setBidSuccess("Bid submitted successfully.");
      setBidForm({ amount: "", message: "", estimated_completion_time: "" });
    } catch (err) {
      setBidError(err.response?.data?.message || "Failed to submit bid");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      await acceptBid(bidId);
      const res = await getJob(id);
      setJob(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept bid");
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (!job) return <div style={{ padding: "2rem" }}>Job not found.</div>;

  const isOwner = user?.id === job.importer_id;
  const isAgent = user?.role === "agent";
  const statuses = ["open", "awarded", "in_progress", "completed"];

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>

        <div style={styles.card}>
          <div style={styles.jobHeader}>
            <h1 style={styles.jobTitle}>{job.title}</h1>
            <span style={styles.badge}>{job.status}</span>
          </div>
          <p style={styles.desc}>{job.description}</p>
          <div style={styles.details}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Origin Port</span>
              <span>{job.origin_port}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Destination</span>
              <span>{job.destination}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Budget</span>
              <span>₦{Number(job.budget).toLocaleString()}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Expected Delivery</span>
              <span>{job.expected_delivery_date}</span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h2>Job Timeline</h2>
          <div style={styles.timeline}>
            {statuses.map((s, i) => (
              <div key={s} style={styles.timelineStep}>
                <div
                  style={{
                    ...styles.timelineDot,
                    background: statuses.indexOf(job.status) >= i ? "#1a56db" : "#d1d5db",
                  }}
                />
                <span style={{ color: statuses.indexOf(job.status) >= i ? "#1a56db" : "#9ca3af" }}>
                  {s.replace("_", " ")}
                </span>
                {i < statuses.length - 1 && <div style={styles.timelineLine} />}
              </div>
            ))}
          </div>
        </div>

        {isAgent && job.status === "open" && (
          <div style={styles.card}>
            <h2>Submit Your Bid</h2>
            {bidSuccess && <div style={styles.success}>{bidSuccess}</div>}
            {bidError && <div style={styles.error}>{bidError}</div>}
            <form onSubmit={handleBidSubmit}>
              <div style={styles.field}>
                <label style={styles.label}>Your Quote (₦)</label>
                <input
                  style={styles.input}
                  type="number"
                  value={bidForm.amount}
                  onChange={(e) => setBidForm({ ...bidForm, amount: e.target.value })}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Estimated Completion Time</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="e.g. 14 days"
                  value={bidForm.estimated_completion_time}
                  onChange={(e) => setBidForm({ ...bidForm, estimated_completion_time: e.target.value })}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Message to Importer</label>
                <textarea
                  style={{ ...styles.input, height: "80px" }}
                  value={bidForm.message}
                  onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                  required
                />
              </div>
              <button style={styles.primaryBtn} type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Bid"}
              </button>
            </form>
          </div>
        )}

        {isOwner && job.bids && job.bids.length > 0 && (
          <div style={styles.card}>
            <h2>Bids Received ({job.bids.length})</h2>
            {job.bids.map((bid) => (
              <div key={bid.id} style={styles.bidCard}>
                <div style={styles.bidHeader}>
                  <span style={styles.agentName}>{bid.agent?.name}</span>
                  <span style={styles.bidAmount}>
                    ₦{Number(bid.amount).toLocaleString()}
                  </span>
                </div>
                <p style={styles.bidMessage}>{bid.message}</p>
                <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                  Completion: {bid.estimated_completion_time}
                </p>
                {bid.status === "accepted" && (
                  <span style={styles.acceptedBadge}>Accepted</span>
                )}
                {bid.status === "rejected" && (
                  <span style={styles.rejectedBadge}>Rejected</span>
                )}
                {bid.status === "pending" && job.status === "open" && (
                  <button
                    style={styles.acceptBtn}
                    onClick={() => handleAcceptBid(bid.id)}
                  >
                    Accept This Bid
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f0f2f5", padding: "2rem" },
  content: { maxWidth: "800px", margin: "0 auto" },
  backBtn: {
    background: "none",
    border: "none",
    color: "#1a56db",
    cursor: "pointer",
    marginBottom: "1rem",
    fontSize: "1rem",
    padding: 0,
  },
  card: {
    background: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: "1.5rem",
  },
  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  jobTitle: { margin: 0 },
  badge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    background: "#dbeafe",
    color: "#1e40af",
    fontSize: "0.875rem",
  },
  desc: { color: "#6b7280", marginBottom: "1rem" },
  details: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  detailItem: { display: "flex", flexDirection: "column" },
  detailLabel: { fontSize: "0.75rem", color: "#9ca3af", marginBottom: "0.25rem" },
  timeline: { display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" },
  timelineStep: { display: "flex", alignItems: "center", gap: "0.5rem" },
  timelineDot: { width: "12px", height: "12px", borderRadius: "50%" },
  timelineLine: { width: "40px", height: "2px", background: "#e5e7eb" },
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
  primaryBtn: {
    padding: "0.75rem 1.5rem",
    background: "#1a56db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  success: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "0.75rem",
    borderRadius: "4px",
    marginBottom: "1rem",
  },
  error: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "0.75rem",
    borderRadius: "4px",
    marginBottom: "1rem",
  },
  bidCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem",
  },
  bidHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  },
  agentName: { fontWeight: "600" },
  bidAmount: { fontWeight: "700", color: "#059669", fontSize: "1.1rem" },
  bidMessage: { color: "#374151", margin: "0.5rem 0" },
  acceptBtn: {
    padding: "0.5rem 1rem",
    background: "#059669",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  acceptedBadge: {
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    background: "#d1fae5",
    color: "#065f46",
    borderRadius: "999px",
    fontSize: "0.875rem",
  },
  rejectedBadge: {
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    background: "#fee2e2",
    color: "#dc2626",
    borderRadius: "999px",
    fontSize: "0.875rem",
  },
};

export default JobDetails;