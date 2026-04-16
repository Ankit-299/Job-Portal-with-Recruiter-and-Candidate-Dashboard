import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../layouts/DashboardLayout";

function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get(`/applications/${jobId}/applicants`)
      .then(res => setApplicants(res.data.data))
      .catch(() => alert("Failed to fetch applicants"))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await axiosInstance.put(`/applications/${applicationId}/status`, { status });
      setApplicants(applicants.map(a => a._id === applicationId ? { ...a, status } : a));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleShortlist = async (applicationId) => {
    try {
      await axiosInstance.put(`/applications/${applicationId}/shortlist`);
      setApplicants(applicants.map(a => a._id === applicationId ? { ...a, isShortlisted: !a.isShortlisted } : a));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update shortlist");
    }
  };

  const statusConfig = {
    accepted: { bg: "rgba(16,185,129,0.1)", color: "#10B981", border: "rgba(16,185,129,0.2)", label: "Accepted" },
    rejected: { bg: "rgba(239,68,68,0.1)", color: "#F87171", border: "rgba(239,68,68,0.2)", label: "Rejected" },
    pending: { bg: "rgba(79,142,247,0.1)", color: "#4F8EF7", border: "rgba(79,142,247,0.2)", label: "Pending" },
  };

  return (
    <DashboardLayout>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(240,237,234,0.6)", padding: "8px 14px", borderRadius: "8px",
            cursor: "pointer", fontSize: "13px", fontFamily: "inherit"
          }}
        >
          ← Back
        </button>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 4px" }}>Job Applicants</h1>
          <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.4)", margin: 0 }}>
            {applicants.length} total applicant{applicants.length !== 1 ? "s" : ""} · 
            {applicants.filter(a => a.isShortlisted).length} shortlisted
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <div style={{ width: "36px", height: "36px", border: "2px solid rgba(79,142,247,0.2)", borderTopColor: "#4F8EF7", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
      ) : applicants.length === 0 ? (
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)",
          borderRadius: "16px", padding: "80px 40px", textAlign: "center"
        }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>👥</div>
          <p style={{ color: "rgba(240,237,234,0.4)", fontSize: "15px" }}>No applicants yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {applicants.map(app => {
            const sc = statusConfig[app.status] || statusConfig.pending;
            return (
              <div key={app._id} style={{
                background: app.isShortlisted ? "rgba(245,158,11,0.03)" : "rgba(255,255,255,0.03)",
                border: app.isShortlisted ? "1px solid rgba(245,158,11,0.15)" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px", padding: "20px 24px",
                transition: "border-color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = app.isShortlisted ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.12)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = app.isShortlisted ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.07)"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div 
                    onClick={() => navigate(`/candidate/${app.candidate._id}/${jobId}`)}
                    style={{ display: "flex", alignItems: "center", gap: "14px", cursor: "pointer", flex: 1 }}
                  >
                    <div style={{
                      width: "42px", height: "42px", borderRadius: "10px", flexShrink: 0,
                      background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px", fontWeight: "700", color: "#4F8EF7"
                    }}>
                      {app.candidate?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 3px" }}>
                        {app.candidate?.name || "Unknown Candidate"}
                      </h3>
                      <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.4)", margin: 0 }}>
                        {app.candidate?.email || "N/A"} · Applied {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      {app.candidate?.skills && (
                        <p style={{ fontSize: "12px", color: "rgba(240,237,234,0.35)", margin: "4px 0 0" }}>
                          Skills: {app.candidate.skills}
                        </p>
                      )}
                      {app.candidate?.location && (
                        <p style={{ fontSize: "12px", color: "rgba(240,237,234,0.35)", margin: "2px 0 0" }}>
                          Location: {app.candidate.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {app.isShortlisted && (
                      <span style={{
                        fontSize: "11px", fontWeight: "600", padding: "4px 10px", borderRadius: "100px",
                        background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.2)"
                      }}>
                        ★ Shortlisted
                      </span>
                    )}
                    <span style={{
                      fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "100px",
                      background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                      textTransform: "capitalize"
                    }}>
                      {sc.label}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => navigate(`/candidate/${app.candidate._id}/${jobId}`)}
                    style={{
                      padding: "8px 18px", borderRadius: "8px",
                      cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "inherit",
                      background: "rgba(79,142,247,0.1)", color: "#4F8EF7",
                      border: "1px solid rgba(79,142,247,0.2)", transition: "all 0.15s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(79,142,247,0.15)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(79,142,247,0.1)"}
                  >
                    View Profile →
                  </button>
                  <button
                    onClick={() => handleShortlist(app._id)}
                    style={{
                      padding: "8px 18px", borderRadius: "8px",
                      cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "inherit",
                      background: app.isShortlisted ? "rgba(245,158,11,0.15)" : "transparent",
                      color: "#F59E0B",
                      border: "1px solid rgba(245,158,11,0.2)", transition: "all 0.15s"
                    }}
                  >
                    {app.isShortlisted ? "★ Shortlisted" : "☆ Shortlist"}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(app._id, "accepted")}
                    disabled={app.status === "accepted"}
                    style={{
                      padding: "8px 18px", borderRadius: "8px", border: "none",
                      cursor: app.status === "accepted" ? "default" : "pointer",
                      fontSize: "13px", fontWeight: "600", fontFamily: "inherit", transition: "all 0.15s",
                      background: app.status === "accepted" ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.15)",
                      color: app.status === "accepted" ? "rgba(16,185,129,0.5)" : "#10B981",
                      border: "1px solid rgba(16,185,129,0.2)"
                    }}
                  >
                    {app.status === "accepted" ? "✓ Accepted" : "Accept"}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(app._id, "rejected")}
                    disabled={app.status === "rejected"}
                    style={{
                      padding: "8px 18px", borderRadius: "8px",
                      cursor: app.status === "rejected" ? "default" : "pointer",
                      fontSize: "13px", fontWeight: "600", fontFamily: "inherit", transition: "all 0.15s",
                      background: "transparent",
                      color: app.status === "rejected" ? "rgba(248,113,113,0.5)" : "#F87171",
                      border: `1px solid ${app.status === "rejected" ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.25)"}`
                    }}
                  >
                    {app.status === "rejected" ? "Rejected" : "Reject"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}

export default Applicants;