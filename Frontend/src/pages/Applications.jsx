import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../layouts/DashboardLayout";

function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axiosInstance.get("/applications/my-applications")
      .then(res => setApplications(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusConfig = {
    accepted: { bg: "rgba(16,185,129,0.1)", color: "#10B981", border: "rgba(16,185,129,0.2)" },
    rejected: { bg: "rgba(239,68,68,0.1)", color: "#F87171", border: "rgba(239,68,68,0.2)" },
    interview: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "rgba(245,158,11,0.2)" },
    pending: { bg: "rgba(79,142,247,0.1)", color: "#4F8EF7", border: "rgba(79,142,247,0.2)" },
  };

  const filters = ["all", "pending", "interview", "accepted", "rejected"];
  const filtered = filter === "all" ? applications : applications.filter(a => a.status === filter);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 4px" }}>My Applications</h1>
        <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.4)", margin: 0 }}>{applications.length} total application{applications.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {filters.map(f => {
          const count = f === "all" ? applications.length : applications.filter(a => a.status === f).length;
          const sc = statusConfig[f] || { color: "#4F8EF7", bg: "rgba(79,142,247,0.1)", border: "rgba(79,142,247,0.2)" };
          const isActive = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "7px 16px", borderRadius: "100px", cursor: "pointer",
              fontSize: "13px", fontWeight: "500", fontFamily: "inherit",
              background: isActive ? (f === "all" ? "rgba(79,142,247,0.15)" : sc.bg) : "transparent",
              color: isActive ? (f === "all" ? "#4F8EF7" : sc.color) : "rgba(240,237,234,0.45)",
              border: isActive ? `1px solid ${f === "all" ? "rgba(79,142,247,0.3)" : sc.border}` : "1px solid rgba(255,255,255,0.08)",
              textTransform: "capitalize", transition: "all 0.15s"
            }}>
              {f} {count > 0 && <span style={{ opacity: 0.7 }}>({count})</span>}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <div style={{ width: "36px", height: "36px", border: "2px solid rgba(79,142,247,0.2)", borderTopColor: "#4F8EF7", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)",
          borderRadius: "16px", padding: "60px 40px", textAlign: "center"
        }}>
          <p style={{ color: "rgba(240,237,234,0.35)", fontSize: "15px" }}>No {filter !== "all" ? filter : ""} applications found</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map(app => {
            const sc = statusConfig[app.status] || statusConfig.pending;
            return (
              <div key={app._id} 
                onClick={() => navigate(`/application/${app._id}`)}
                style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px", padding: "18px 22px",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px",
                transition: "all 0.2s",
                cursor: "pointer"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(79,142,247,0.3)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {app.job?.title || "Untitled Position"}
                  </h3>
                  <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.4)", margin: 0 }}>
                    {app.job?.company} · {app.job?.location}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                  {app.job?.salary && (
                    <span style={{ fontSize: "13px", color: "#4F8EF7", fontWeight: "500" }}>
                      ₹{Number(app.job.salary).toLocaleString('en-IN')}/yr
                    </span>
                  )}
                  <span style={{
                    fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "100px",
                    textTransform: "capitalize", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`
                  }}>
                    {app.status}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/application/${app._id}`);
                    }}
                    style={{
                      padding: "6px 14px",
                      background: "rgba(79,142,247,0.1)",
                      border: "1px solid rgba(79,142,247,0.2)",
                      borderRadius: "6px",
                      color: "#4F8EF7",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "inherit"
                    }}
                  >
                    View Details →
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

export default Applications;