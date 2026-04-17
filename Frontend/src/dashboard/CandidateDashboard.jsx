import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../layouts/DashboardLayout";
import ApplicationForm from "../components/ApplicationForm";

function CandidateDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          axiosInstance.get("/applications/my-applications"),
          axiosInstance.get("/jobs"),
        ]);
        setApplications(appsRes.data ?? []);
        setJobs(jobsRes.data.data.jobs || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleApplicationSuccess = () => {
    setShowApplicationModal(false);
    setSelectedJob(null);
    // Refresh applications
    axiosInstance.get("/applications/my-applications")
      .then(res => setApplications(res.data.data))
      .catch(error => console.error(error));
    alert("Application submitted successfully! 🎉");
  };

  const totalApplied = applications?.length ?? 0;
  const interviews = applications?.filter(a => a.status === "interview").length ?? 0;
  const offers = applications?.filter(a => a.status === "accepted").length ?? 0 ;

  const statusStyle = (s) => ({
    accepted: { bg: "rgba(16,185,129,0.1)", color: "#10B981", border: "rgba(16,185,129,0.2)" },
    rejected: { bg: "rgba(239,68,68,0.1)", color: "#F87171", border: "rgba(239,68,68,0.2)" },
    interview: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "rgba(245,158,11,0.2)" },
    pending: { bg: "rgba(79,142,247,0.1)", color: "#4F8EF7", border: "rgba(79,142,247,0.2)" },
  }[s] || { bg: "rgba(79,142,247,0.1)", color: "#4F8EF7", border: "rgba(79,142,247,0.2)" });

  const card = (children, style = {}) => (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "16px", ...style
    }}>
      {children}
    </div>
  );

  return (
    <DashboardLayout>
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "36px", height: "36px", border: "2px solid rgba(79,142,247,0.2)", borderTopColor: "#4F8EF7", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 12px" }} />
            <p style={{ color: "rgba(240,237,234,0.35)", fontSize: "14px" }}>Loading...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
            {[
              { label: "Applications", value: totalApplied, accent: "#4F8EF7", icon: "📋" },
              { label: "Interviews", value: interviews, accent: "#F59E0B", icon: "🗓" },
              { label: "Offers", value: offers, accent: "#10B981", icon: "🎉" },
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

          {/* Available Jobs */}
          {card(
            <>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#F0EDEA", margin: 0 }}>Available Jobs</h2>
                <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.35)", margin: "4px 0 0" }}>{jobs.length} open positions</p>
              </div>
              <div style={{ padding: "16px" }}>
                {jobs.length === 0 ? (
                  <p style={{ textAlign: "center", color: "rgba(240,237,234,0.3)", padding: "40px 0", fontSize: "14px" }}>No jobs available right now</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {(jobs ?? []).map((job) => {
                      const hasApplied = (applications ?? []).some(a => a.job?._id === job._id || a.job === job._id);
                      return (
                        <div key={job._id} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "16px", borderRadius: "10px",
                          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                          transition: "border-color 0.15s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"}
                        >
                          <div>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#F0EDEA", margin: 0, cursor: "pointer" }}
                                onClick={() => navigate(`/job/${job._id}`)}>{job.title}</h3>
                            <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.4)", margin: "4px 0 0" }}>
                              {job.company} · {job.location}
                            </p>
                            <p style={{ fontSize: "13px", color: "#4F8EF7", margin: "4px 0 0", fontWeight: "500" }}>
                              ₹{job.salary?.toLocaleString('en-IN')}/yr
                            </p>
                          </div>
                          <button
                            onClick={() => handleApply(job)}
                            disabled={hasApplied}
                            style={{
                              padding: "8px 18px", borderRadius: "8px", border: "none",
                              cursor: hasApplied ? "default" : "pointer", fontSize: "13px", fontWeight: "600",
                              background: hasApplied ? "rgba(255,255,255,0.06)" : "#4F8EF7",
                              color: hasApplied ? "rgba(240,237,234,0.35)" : "#fff",
                              flexShrink: 0, fontFamily: "inherit"
                            }}
                          >
                            {hasApplied ? "Applied" : "Apply Now"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>,
            { marginBottom: "24px" }
          )}

          {/* Recent Applications */}
          {card(
            <>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#F0EDEA", margin: 0 }}>Recent Applications</h2>
                <span style={{ fontSize: "12px", color: "rgba(240,237,234,0.35)" }}>{applications.length} total</span>
              </div>
              <div style={{ padding: "16px" }}>
                {applications.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <p style={{ color: "rgba(240,237,234,0.3)", fontSize: "14px" }}>No applications yet. Start applying!</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {applications.slice(0, 5).map((app) => {
                      const ss = statusStyle(app.status);
                      return (
                        <div key={app._id} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "14px 16px", borderRadius: "10px",
                          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)"
                        }}>
                          <div>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#F0EDEA", margin: 0, cursor: "pointer" }}
                                onClick={() => navigate(`/job/${app.job?._id}`)}>{app.job?.title || "Untitled"}</h3>
                            <p style={{ fontSize: "12px", color: "rgba(240,237,234,0.4)", margin: "3px 0 0" }}>
                              {app.job?.company} · {app.job?.location}
                            </p>
                          </div>
                          <span style={{
                            fontSize: "11px", fontWeight: "600", padding: "4px 10px",
                            borderRadius: "100px", textTransform: "capitalize",
                            background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`
                          }}>
                            {app.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Application Form Modal */}
      {showApplicationModal && selectedJob && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px",
          overflowY: "auto"
        }}
        onClick={() => setShowApplicationModal(false)}
        >
          <div style={{
            background: "#0D0D14",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            maxWidth: "800px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}
          onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: "24px 32px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              top: 0,
              background: "#0D0D14",
              zIndex: 1
            }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 4px" }}>
                  Apply for this Position
                </h2>
                <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.5)", margin: 0 }}>
                  Complete the application process
                </p>
              </div>
              <button
                onClick={() => setShowApplicationModal(false)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  color: "rgba(240,237,234,0.6)",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  fontFamily: "inherit"
                }}
              >
                ✕ Cancel
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: "32px" }}>
              <ApplicationForm 
                job={selectedJob} 
                user={JSON.parse(localStorage.getItem("user"))}
                onSuccess={handleApplicationSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default CandidateDashboard;