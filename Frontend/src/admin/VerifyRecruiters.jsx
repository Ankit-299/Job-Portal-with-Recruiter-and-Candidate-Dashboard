import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../layouts/DashboardLayout";

function VerifyRecruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const res = await axiosInstance.get("/admin/recruiters");
      setRecruiters(res.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch recruiters");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (recruiterId, recruiterName) => {
    if (!window.confirm(`Verify ${recruiterName}?`)) return;
    try {
      await axiosInstance.put(`/admin/recruiters/${recruiterId}/verify`);
      alert("Recruiter verified successfully!");
      fetchRecruiters();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to verify recruiter");
    }
  };

  const handleBlockUnblock = async (recruiterId) => {
    try {
      const res = await axiosInstance.put(`/admin/users/${recruiterId}/block`);
      alert(res.data.message);
      fetchRecruiters();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const filteredRecruiters = filter === "all"
    ? recruiters
    : filter === "pending"
    ? recruiters?.filter(r => !r.isVerified) ?? []
    : recruiters?.filter(r => r.isVerified === true) ?? [];

  const statusConfig = {
    verified: { bg: "rgba(16,185,129,0.1)", color: "#10B981", border: "rgba(16,185,129,0.2)", label: "Verified ✓" },
    pending: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "rgba(245,158,11,0.2)", label: "Pending ⏳" },
    blocked: { bg: "rgba(239,68,68,0.1)", color: "#F87171", border: "rgba(239,68,68,0.2)", label: "Blocked 🚫" },
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 4px" }}>Verify Recruiters</h1>
        <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.4)", margin: 0 }}>Approve and manage recruiter accounts</p>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[
          { key: "pending", label: "Pending", count: recruiters?.filter(r => !r.isVerified).length ?? 0, accent: "#F59E0B" },
          { key: "verified", label: "Verified", count: recruiters?.filter(r => r.isVerified === true).length ?? 0, accent: "#10B981" },
          { key: "all", label: "All", count: recruiters?.length ?? 0, accent: "#4F8EF7" },
        ]?.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            style={{
              padding: "9px 18px",
              borderRadius: "8px",
              border: filter === btn.key ? `1px solid ${btn.accent}40` : "1px solid rgba(255,255,255,0.1)",
              background: filter === btn.key ? `${btn.accent}15` : "rgba(255,255,255,0.03)",
              color: filter === btn.key ? btn.accent : "rgba(240,237,234,0.5)",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "inherit"
            }}
          >
            {btn.label} ({btn.count})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <div style={{ width: "36px", height: "36px", border: "2px solid rgba(79,142,247,0.2)", borderTopColor: "#4F8EF7", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
      ) : (filteredRecruiters?.length ?? 0) === 0 ? (
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          padding: "60px",
          textAlign: "center",
          color: "rgba(240,237,234,0.3)",
          fontSize: "14px"
        }}>
          No recruiters found
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {filteredRecruiters.map((recruiter) => (
            <div
              key={recruiter._id}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                padding: "24px",
                transition: "border-color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(155,106,247,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
            >
              {/* Header with status badges */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(155,106,247,0.1)",
                  border: "1px solid rgba(155,106,247,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#9B6AF7",
                  flexShrink: 0
                }}>
                  {recruiter.recruiterName?.charAt(0)?.toUpperCase() || "R"}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 4px" }}>
                    {recruiter.recruiterName}
                  </h3>
                  <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.4)", margin: 0 }}>{recruiter.email}</p>
                </div>
                
                {/* Status Badges */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {recruiter.isVerified && (
                    <span style={{
                      padding: "5px 12px",
                      borderRadius: "100px",
                      fontSize: "11px",
                      fontWeight: "600",
                      background: statusConfig.verified.bg,
                      color: statusConfig.verified.color,
                      border: `1px solid ${statusConfig.verified.border}`
                    }}>
                      {statusConfig.verified.label}
                    </span>
                  )}
                {(recruiter.isVerified === false || recruiter.isVerified === undefined || recruiter.isVerified === null) && (
                    <span style={{
                      padding: "5px 12px",
                      borderRadius: "100px",
                      fontSize: "11px",
                      fontWeight: "600",
                      background: statusConfig.pending.bg,
                      color: statusConfig.pending.color,
                      border: `1px solid ${statusConfig.pending.border}`
                    }}>
                      {statusConfig.pending.label}
                    </span>
                  )}
                  {recruiter.isBlocked && (
                    <span style={{
                      padding: "5px 12px",
                      borderRadius: "100px",
                      fontSize: "11px",
                      fontWeight: "600",
                      background: statusConfig.blocked.bg,
                      color: statusConfig.blocked.color,
                      border: `1px solid ${statusConfig.blocked.border}`
                    }}>
                      {statusConfig.blocked.label}
                    </span>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "16px",
                padding: "20px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "10px",
                marginBottom: "20px"
              }}>
                <div>
                  <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>Company</p>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "#F0EDEA", margin: 0 }}>{recruiter.company || "—"}</p>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>Jobs Posted</p>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "#9B6AF7", margin: 0 }}>{recruiter.totalJobsPosted}</p>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>Total Applicants</p>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "#4F8EF7", margin: 0 }}>{recruiter.totalApplicants}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" }}>
                {!recruiter.isVerified && (
                  <button
                    onClick={() => handleVerify(recruiter._id, recruiter.recruiterName)}
                    style={{
                      padding: "9px 20px",
                      borderRadius: "8px",
                      border: "none",
                      background: "rgba(16,185,129,0.15)",
                      color: "#10B981",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      fontFamily: "inherit"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(16,185,129,0.25)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(16,185,129,0.15)"}
                  >
                    ✓ Verify Recruiter
                  </button>
                )}
                <button
                  onClick={() => handleBlockUnblock(recruiter._id)}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: recruiter.isBlocked ? "rgba(79,142,247,0.15)" : "rgba(245,158,11,0.15)",
                    color: recruiter.isBlocked ? "#4F8EF7" : "#F59E0B",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    fontFamily: "inherit"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = recruiter.isBlocked ? "rgba(79,142,247,0.25)" : "rgba(245,158,11,0.25)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = recruiter.isBlocked ? "rgba(79,142,247,0.15)" : "rgba(245,158,11,0.15)";
                  }}
                >
                  {recruiter.isBlocked ? "↻ Unblock" : "⊘ Block"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </DashboardLayout>
  );
}

export default VerifyRecruiters;
