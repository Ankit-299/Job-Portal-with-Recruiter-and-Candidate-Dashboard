import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../layouts/DashboardLayout";

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/jobs/my-jobs");
      setJobs(res.data.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    
    // Auto-refresh every 30 seconds to show new applicants
    const interval = setInterval(fetchJobs, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const totalApplicants = jobs.reduce((acc, j) => acc + (j.applicants?.length || 0), 0);

  return (
    <DashboardLayout>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#F0EDEA", margin: 0 }}>Dashboard</h1>
          {lastUpdated && (
            <p style={{ fontSize: "12px", color: "rgba(240,237,234,0.4)", margin: "4px 0 0" }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={fetchJobs}
          disabled={loading}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: loading ? "rgba(240,237,234,0.3)" : "rgba(240,237,234,0.7)",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "13px",
            fontWeight: "600",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Active Jobs", value: jobs.length, accent: "#4F8EF7", icon: "💼" },
          { label: "Total Applicants", value: totalApplicants, accent: "#9B6AF7", icon: "👥" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px", padding: "20px 24px", position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: s.accent, opacity: 0.8 }} />
            <div style={{ fontSize: "22px", marginBottom: "10px" }}>{s.icon}</div>
            <div style={{ fontSize: "11px", color: "rgba(240,237,234,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{s.label}</div>
            <div style={{ fontSize: "30px", fontWeight: "700", color: "#F0EDEA", letterSpacing: "-1px" }}>{s.value}</div>
          </div>
        ))}

      </div>

      {/* Recent Jobs */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px"
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#F0EDEA", margin: 0 }}>Recent Jobs</h2>
            <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.35)", margin: "4px 0 0" }}>Your latest postings</p>
          </div>
          <button
            onClick={() => navigate("/my-jobs")}
            style={{
              background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(240,237,234,0.6)", padding: "7px 14px", borderRadius: "8px",
              cursor: "pointer", fontSize: "13px", fontFamily: "inherit"
            }}
          >
            View all →
          </button>
        </div>

        <div style={{ padding: "16px" }}>
          {jobs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ color: "rgba(240,237,234,0.3)", fontSize: "14px", marginBottom: "16px" }}>No jobs posted yet</p>
              <button
                onClick={() => navigate("/create-job")}
                style={{
                  background: "#4F8EF7", border: "none", color: "#fff",
                  padding: "10px 20px", borderRadius: "8px", cursor: "pointer",
                  fontSize: "14px", fontWeight: "600", fontFamily: "inherit"
                }}
              >
                Post your first job
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {jobs.slice(0, 5).map(job => (
                <div key={job._id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 16px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                  transition: "border-color 0.15s"
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"}
                >
                  <div>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#F0EDEA", margin: 0 }}>{job.title}</h3>
                    <p style={{ fontSize: "12px", color: "rgba(240,237,234,0.4)", margin: "3px 0 0" }}>{job.company} · {job.location}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{
                      fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "100px",
                      background: "rgba(79,142,247,0.1)", color: "#4F8EF7", border: "1px solid rgba(79,142,247,0.2)"
                    }}>
                      {job.applicants?.length || 0} applicants
                    </span>
                    <button
                      onClick={() => navigate(`/applicants/${job._id}`)}
                      style={{
                        background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(240,237,234,0.5)", padding: "6px 12px", borderRadius: "7px",
                        cursor: "pointer", fontSize: "12px", fontFamily: "inherit"
                      }}
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default RecruiterDashboard;