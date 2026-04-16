import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../layouts/DashboardLayout";

function CandidateDetails() {
  const { candidateId, jobId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    fetchCandidateDetails();
  }, [candidateId]);

  const fetchCandidateDetails = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/applications/candidate/${candidateId}`);
      setCandidate(res.data.data.candidate);
      setApplications(res.data.data.applications);
      
      // Find current job application to load notes
      const currentApp = res.data.data.applications.find(app => app.job._id === jobId);
      if (currentApp) {
        setNotes(currentApp.recruiterNotes || "");
      }
    } catch (error) {
      console.error("Failed to fetch candidate details:", error);
      alert("Failed to load candidate details");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      // Find the application ID for this job
      const currentApp = applications.find(app => app.job._id === jobId);
      if (currentApp) {
        await axiosInstance.put(`/applications/${currentApp._id}/notes`, { notes });
        alert("Notes saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save notes:", error);
      alert("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleShortlist = async () => {
    try {
      const currentApp = applications.find(app => app.job._id === jobId);
      if (currentApp) {
        await axiosInstance.put(`/applications/${currentApp._id}/shortlist`);
        // Refresh candidate details
        fetchCandidateDetails();
        alert(currentApp.isShortlisted ? "Removed from shortlist" : "Candidate shortlisted!");
      }
    } catch (error) {
      console.error("Failed to toggle shortlist:", error);
      alert("Failed to update shortlist");
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      const currentApp = applications.find(app => app.job._id === jobId);
      if (currentApp) {
        await axiosInstance.put(`/applications/${currentApp._id}/status`, { status });
        fetchCandidateDetails();
        alert(`Application ${status}`);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  const statusConfig = {
    accepted: { bg: "rgba(16,185,129,0.1)", color: "#10B981", border: "rgba(16,185,129,0.2)", label: "Accepted" },
    rejected: { bg: "rgba(239,68,68,0.1)", color: "#F87171", border: "rgba(239,68,68,0.2)", label: "Rejected" },
    pending: { bg: "rgba(79,142,247,0.1)", color: "#4F8EF7", border: "rgba(79,142,247,0.2)", label: "Pending" },
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <div style={{ width: "36px", height: "36px", border: "2px solid rgba(79,142,247,0.2)", borderTopColor: "#4F8EF7", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </DashboardLayout>
    );
  }

  if (!candidate) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ color: "rgba(240,237,234,0.4)", fontSize: "15px" }}>Candidate not found</p>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "#4F8EF7", border: "none", color: "#fff",
              padding: "10px 20px", borderRadius: "8px", cursor: "pointer",
              fontSize: "14px", fontWeight: "600", fontFamily: "inherit", marginTop: "16px"
            }}
          >
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const currentApplication = applications.find(app => app.job._id === jobId);
  const currentStatus = currentApplication?.status || "pending";
  const sc = statusConfig[currentStatus] || statusConfig.pending;

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
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 4px" }}>Candidate Profile</h1>
          <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.4)", margin: 0 }}>Detailed candidate information</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Left Column - Profile Info */}
        <div>
          {/* Basic Info Card */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px", padding: "24px", marginBottom: "20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "14px",
                background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", fontWeight: "700", color: "#4F8EF7"
              }}>
                {candidate.name?.charAt(0)?.toUpperCase() || "C"}
              </div>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 4px" }}>{candidate.name}</h2>
                <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.5)", margin: 0 }}>{candidate.email}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>Phone</p>
                <p style={{ fontSize: "14px", color: candidate.phone ? "#F0EDEA" : "rgba(240,237,234,0.25)", margin: 0 }}>
                  {candidate.phone || "Not provided"}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>Location</p>
                <p style={{ fontSize: "14px", color: candidate.location ? "#F0EDEA" : "rgba(240,237,234,0.25)", margin: 0 }}>
                  {candidate.location || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px", padding: "24px", marginBottom: "20px"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 16px" }}>Professional Details</h3>
            
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>Skills</p>
              <p style={{ fontSize: "14px", color: candidate.skills ? "#F0EDEA" : "rgba(240,237,234,0.25)", margin: 0 }}>
                {candidate.skills || "Not provided"}
              </p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>Experience</p>
              <p style={{ fontSize: "14px", color: candidate.experience ? "#F0EDEA" : "rgba(240,237,234,0.25)", margin: 0 }}>
                {candidate.experience || "Not provided"}
              </p>
            </div>

            <div>
              <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>Bio</p>
              <p style={{ fontSize: "14px", color: candidate.bio ? "#F0EDEA" : "rgba(240,237,234,0.25)", margin: 0, lineHeight: "1.6" }}>
                {candidate.bio || "No bio provided"}
              </p>
            </div>
          </div>

          {/* Resume */}
          {candidate.resume && (
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "14px", padding: "24px"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 16px" }}>Resume</h3>
              <a
                href={candidate.resume}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  background: "rgba(79,142,247,0.1)", border: "1px solid rgba(79,142,247,0.2)",
                  color: "#4F8EF7", padding: "10px 20px", borderRadius: "8px",
                  textDecoration: "none", fontSize: "14px", fontWeight: "600"
                }}
              >
                📄 View Resume →
              </a>
            </div>
          )}
        </div>

        {/* Right Column - Application Actions */}
        <div>
          {/* Application Status */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px", padding: "24px", marginBottom: "20px"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 16px" }}>Application Status</h3>
            
            <div style={{ marginBottom: "16px" }}>
              <span style={{
                fontSize: "13px", fontWeight: "600", padding: "6px 14px", borderRadius: "100px",
                background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                textTransform: "capitalize"
              }}>
                {sc.label}
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <button
                onClick={() => handleUpdateStatus("accepted")}
                disabled={currentStatus === "accepted"}
                style={{
                  flex: 1, padding: "10px", borderRadius: "8px", border: "none",
                  cursor: currentStatus === "accepted" ? "default" : "pointer",
                  fontSize: "14px", fontWeight: "600", fontFamily: "inherit",
                  background: currentStatus === "accepted" ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.15)",
                  color: currentStatus === "accepted" ? "rgba(16,185,129,0.5)" : "#10B981",
                  border: "1px solid rgba(16,185,129,0.2)"
                }}
              >
                {currentStatus === "accepted" ? "✓ Accepted" : "Accept"}
              </button>
              <button
                onClick={() => handleUpdateStatus("rejected")}
                disabled={currentStatus === "rejected"}
                style={{
                  flex: 1, padding: "10px", borderRadius: "8px",
                  cursor: currentStatus === "rejected" ? "default" : "pointer",
                  fontSize: "14px", fontWeight: "600", fontFamily: "inherit",
                  background: "transparent",
                  color: currentStatus === "rejected" ? "rgba(248,113,113,0.5)" : "#F87171",
                  border: `1px solid ${currentStatus === "rejected" ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.25)"}`
                }}
              >
                {currentStatus === "rejected" ? "Rejected" : "Reject"}
              </button>
            </div>

            <button
              onClick={handleShortlist}
              style={{
                width: "100%", padding: "10px", borderRadius: "8px",
                cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "inherit",
                background: currentApplication?.isShortlisted ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.1)",
                color: "#F59E0B", border: "1px solid rgba(245,158,11,0.2)"
              }}
            >
              {currentApplication?.isShortlisted ? "★ Shortlisted" : "☆ Shortlist Candidate"}
            </button>
          </div>

          {/* Recruiter Notes */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px", padding: "24px", marginBottom: "20px"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 16px" }}>Recruiter Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="6"
              placeholder="Add your notes about this candidate..."
              style={{
                width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px",
                color: "#F0EDEA", fontSize: "14px", outline: "none",
                fontFamily: "inherit", resize: "vertical", boxSizing: "border-box"
              }}
              onFocus={e => e.target.style.borderColor = "#4F8EF7"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
            />
            <button
              onClick={handleSaveNotes}
              disabled={savingNotes}
              style={{
                marginTop: "12px", width: "100%", padding: "10px", borderRadius: "8px",
                background: "#4F8EF7", border: "none", color: "#fff",
                cursor: savingNotes ? "not-allowed" : "pointer",
                fontSize: "14px", fontWeight: "600", fontFamily: "inherit"
              }}
            >
              {savingNotes ? "Saving..." : "Save Notes"}
            </button>
          </div>

          {/* Application History */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px", padding: "24px"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 16px" }}>
              Application History ({applications.length})
            </h3>
            
            {applications.length === 0 ? (
              <p style={{ color: "rgba(240,237,234,0.3)", fontSize: "14px" }}>No other applications</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {applications.map(app => {
                  const appStatus = statusConfig[app.status] || statusConfig.pending;
                  const isCurrentJob = app.job._id === jobId;
                  return (
                    <div
                      key={app._id}
                      style={{
                        padding: "12px", borderRadius: "8px",
                        background: isCurrentJob ? "rgba(79,142,247,0.08)" : "rgba(255,255,255,0.02)",
                        border: isCurrentJob ? "1px solid rgba(79,142,247,0.2)" : "1px solid rgba(255,255,255,0.05)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#F0EDEA", margin: 0 }}>
                          {app.job.title}
                          {isCurrentJob && (
                            <span style={{
                              marginLeft: "8px", fontSize: "11px", padding: "2px 6px",
                              borderRadius: "4px", background: "rgba(79,142,247,0.2)",
                              color: "#4F8EF7"
                            }}>
                              Current
                            </span>
                          )}
                        </h4>
                        <span style={{
                          fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "100px",
                          background: appStatus.bg, color: appStatus.color, border: `1px solid ${appStatus.border}`,
                          textTransform: "capitalize"
                        }}>
                          {appStatus.label}
                        </span>
                      </div>
                      <p style={{ fontSize: "12px", color: "rgba(240,237,234,0.4)", margin: 0 }}>
                        {app.job.company} · {app.job.location} · Applied {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}

export default CandidateDetails;
