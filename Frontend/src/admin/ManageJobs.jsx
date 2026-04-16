import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../layouts/DashboardLayout";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get("/admin/jobs");
      setJobs(res.data.data);
    } catch { alert("Failed to fetch jobs"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (jobId, title) => {
    if (!window.confirm(`Delete "${title}"? This will also remove all related applications.`)) return;
    try {
      await axiosInstance.delete(`/admin/jobs/${jobId}`);
      fetchJobs();
    } catch (error) { alert(error.response?.data?.message || "Failed"); }
  };

  const filtered = jobs.filter(j =>
    !search ||
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase()) ||
    j.createdBy?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 4px" }}>Manage Jobs</h1>
        <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.4)", margin: 0 }}>{jobs.length} total postings</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text" placeholder="Search by title, company, or recruiter..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "11px 16px", boxSizing: "border-box",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", color: "#F0EDEA", fontSize: "14px", outline: "none", fontFamily: "inherit"
          }}
        />
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <div style={{ width: "36px", height: "36px", border: "2px solid rgba(79,142,247,0.2)", borderTopColor: "#4F8EF7", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
      ) : (
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px", overflow: "hidden"
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 100px 1.5fr 90px 80px",
            padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)"
          }}>
            {["Job Title", "Company", "Location", "Salary", "Posted By", "Date", ""].map((h, i) => (
              <span key={i} style={{ fontSize: "11px", fontWeight: "600", color: "rgba(240,237,234,0.35)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "rgba(240,237,234,0.3)", fontSize: "14px" }}>
              No jobs found
            </div>
          ) : (
            filtered.map((job, i) => (
              <div key={job._id} style={{
                display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 100px 1.5fr 90px 80px",
                padding: "14px 20px", alignItems: "center",
                borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                transition: "background 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#F0EDEA", margin: 0, paddingRight: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.title}</p>
                <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.55)", margin: 0 }}>{job.company}</p>
                <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.45)", margin: 0 }}>{job.location}</p>
                <p style={{ fontSize: "13px", color: "#10B981", fontWeight: "600", margin: 0 }}>₹{Number(job.salary).toLocaleString('en-IN')}</p>
                <div>
                  <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.55)", margin: "0 0 2px" }}>{job.createdBy?.name || "—"}</p>
                  <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.3)", margin: 0 }}>{job.createdBy?.email}</p>
                </div>
                <p style={{ fontSize: "12px", color: "rgba(240,237,234,0.35)", margin: 0 }}>
                  {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
                <button
                  onClick={() => handleDelete(job._id, job.title)}
                  style={{
                    padding: "6px 12px", borderRadius: "7px", border: "none", cursor: "pointer",
                    fontSize: "12px", fontWeight: "600", fontFamily: "inherit",
                    background: "rgba(239,68,68,0.1)", color: "#F87171"
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(240,237,234,0.2); }
      `}</style>
    </DashboardLayout>
  );
}

export default ManageJobs;