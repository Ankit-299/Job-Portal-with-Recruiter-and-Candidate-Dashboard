import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/jobs/my-jobs")
      .then(res => setJobs(res.data.data))
      .catch(() => alert("Failed to fetch jobs"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(j => j._id !== jobId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete job");
    }
  };

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 4px" }}>My Jobs</h1>
          <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.4)", margin: 0 }}>{jobs.length} active posting{jobs.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => navigate("/create-job")}
          style={{
            background: "#4F8EF7", border: "none", color: "#fff",
            padding: "10px 18px", borderRadius: "8px", cursor: "pointer",
            fontSize: "14px", fontWeight: "600", fontFamily: "inherit"
          }}
        >
          + Post Job
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <div style={{ width: "36px", height: "36px", border: "2px solid rgba(79,142,247,0.2)", borderTopColor: "#4F8EF7", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
      ) : jobs.length === 0 ? (
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)",
          borderRadius: "16px", padding: "80px 40px", textAlign: "center"
        }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>💼</div>
          <p style={{ color: "rgba(240,237,234,0.4)", fontSize: "15px", marginBottom: "20px" }}>No jobs posted yet</p>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {jobs.map(job => (
            <div key={job._id} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "14px", padding: "20px 24px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              gap: "16px", transition: "border-color 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#F0EDEA", margin: 0 }}>{job.title}</h3>
                  <span style={{
                    fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "100px",
                    background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)"
                  }}>Active</span>
                </div>
                <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.4)", margin: 0 }}>
                  {job.company} · {job.location} · <span style={{ color: "#4F8EF7" }}>₹{Number(job.salary).toLocaleString('en-IN')}/yr</span>
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                <span style={{
                  fontSize: "13px", fontWeight: "600", padding: "6px 14px", borderRadius: "8px",
                  background: "rgba(79,142,247,0.1)", color: "#4F8EF7", border: "1px solid rgba(79,142,247,0.2)"
                }}>
                  {job.applicants?.length || 0} applicants
                </span>
                <button
                  onClick={() => navigate(`/applicants/${job._id}`)}
                  style={{
                    background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(240,237,234,0.7)", padding: "7px 14px", borderRadius: "8px",
                    cursor: "pointer", fontSize: "13px", fontFamily: "inherit", transition: "all 0.15s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#F0EDEA"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(240,237,234,0.7)"; }}
                >
                  View Applicants
                </button>
                <button
                  onClick={() => navigate(`/edit-job/${job._id}`)}
                  style={{
                    background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.2)",
                    color: "#4F8EF7", padding: "7px 14px", borderRadius: "8px",
                    cursor: "pointer", fontSize: "13px", fontFamily: "inherit", transition: "all 0.15s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(79,142,247,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(79,142,247,0.08)"; }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  style={{
                    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                    color: "#F87171", padding: "7px 14px", borderRadius: "8px",
                    cursor: "pointer", fontSize: "13px", fontFamily: "inherit", transition: "all 0.15s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}

export default MyJobs;