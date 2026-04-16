import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../layouts/DashboardLayout";
import { Bell, CheckCircle, XCircle, Clock, AlertCircle, Briefcase } from "lucide-react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Fetch based on user role
      if (user.role === "candidate") {
        await fetchCandidateNotifications();
      } else if (user.role === "recruiter") {
        await fetchRecruiterNotifications();
      } else if (user.role === "admin") {
        await fetchAdminNotifications();
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidateNotifications = async () => {
    try {
      const appsRes = await axiosInstance.get("/applications/my-applications");
      const applications = appsRes.data.data || [];

      const notifs = applications.map(app => ({
        id: app._id,
        type: app.status === "accepted" ? "success" : app.status === "rejected" ? "error" : "info",
        title: app.status === "accepted" ? "Application Accepted! 🎉" : 
               app.status === "rejected" ? "Application Update" : "Application Status",
        message: app.status === "accepted" ? 
          `Congratulations! Your application for ${app.job?.title} at ${app.job?.company} has been accepted.` :
          app.status === "rejected" ?
          `Your application for ${app.job?.title} at ${app.job?.company} was not selected this time.` :
          `Your application for ${app.job?.title} at ${app.job?.company} is under review.`,
        timestamp: app.updatedAt || app.createdAt,
        jobTitle: app.job?.title,
        company: app.job?.company
      }));

      setNotifications(notifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (error) {
      console.error("Failed to fetch candidate notifications:", error);
    }
  };

  const fetchRecruiterNotifications = async () => {
    try {
      const jobsRes = await axiosInstance.get("/jobs/my-jobs");
      const jobs = jobsRes.data.data || [];

      const notifs = [];
      jobs.forEach(job => {
        if (job.applicants && job.applicants.length > 0) {
          notifs.push({
            id: job._id,
            type: "info",
            title: "New Applicants",
            message: `${job.applicants.length} candidate(s) have applied for ${job.title}`,
            timestamp: job.updatedAt || job.createdAt,
            jobTitle: job.title,
            company: job.company,
            applicantsCount: job.applicants.length
          });
        }
      });

      setNotifications(notifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (error) {
      console.error("Failed to fetch recruiter notifications:", error);
    }
  };

  const fetchAdminNotifications = async () => {
    try {
      const res = await axiosInstance.get("/admin/notifications");
      const adminNotifs = res.data.data?.notifications || [];
      setNotifications(adminNotifs.map(n => ({
        ...n,
        type: n.type === "warning" ? "warning" : "info"
      })));
    } catch (error) {
      console.error("Failed to fetch admin notifications:", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} style={{ color: "#10B981" }} />;
      case "error":
        return <XCircle size={20} style={{ color: "#F87171" }} />;
      case "warning":
        return <AlertCircle size={20} style={{ color: "#F59E0B" }} />;
      case "info":
      default:
        return <Clock size={20} style={{ color: "#4F8EF7" }} />;
    }
  };

  const getBackground = (type) => {
    switch (type) {
      case "success":
        return "rgba(16,185,129,0.08)";
      case "error":
        return "rgba(239,68,68,0.08)";
      case "warning":
        return "rgba(245,158,11,0.08)";
      case "info":
      default:
        return "rgba(79,142,247,0.08)";
    }
  };

  const getBorder = (type) => {
    switch (type) {
      case "success":
        return "rgba(16,185,129,0.2)";
      case "error":
        return "rgba(239,68,68,0.2)";
      case "warning":
        return "rgba(245,158,11,0.2)";
      case "info":
      default:
        return "rgba(79,142,247,0.2)";
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  const filtered = filter === "all" 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const notificationTypes = ["all", "success", "info", "warning", "error"];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <Bell size={28} style={{ color: "#4F8EF7" }} />
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#F0EDEA", margin: 0 }}>
              Notifications
            </h1>
          </div>
          <p style={{ fontSize: "15px", color: "rgba(240,237,234,0.5)", margin: 0 }}>
            {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
          {notificationTypes.map(type => {
            const count = type === "all" ? notifications.length : notifications.filter(n => n.type === type).length;
            if (count === 0 && type !== "all") return null;
            
            const isActive = filter === type;
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "100px",
                  border: isActive ? `1px solid ${getBorder(type)}` : "1px solid rgba(255,255,255,0.1)",
                  background: isActive ? getBackground(type) : "rgba(255,255,255,0.03)",
                  color: isActive ? (type === "all" ? "#4F8EF7" : getIconColor(type)) : "rgba(240,237,234,0.5)",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  textTransform: "capitalize",
                  fontFamily: "inherit",
                  transition: "all 0.15s"
                }}
              >
                {type} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid rgba(79,142,247,0.2)", borderTopColor: "#4F8EF7", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px dashed rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "80px 40px",
            textAlign: "center"
          }}>
            <Bell size={48} style={{ color: "rgba(240,237,234,0.2)", marginBottom: "16px" }} />
            <p style={{ color: "rgba(240,237,234,0.4)", fontSize: "16px", marginBottom: "8px" }}>
              No notifications yet
            </p>
            <p style={{ color: "rgba(240,237,234,0.3)", fontSize: "14px" }}>
              We'll notify you when something happens
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.map((notif) => (
              <div
                key={notif.id}
                style={{
                  background: getBackground(notif.type),
                  border: `1px solid ${getBorder(notif.type)}`,
                  borderRadius: "14px",
                  padding: "20px",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {getIcon(notif.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "8px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#F0EDEA", margin: 0 }}>
                        {notif.title}
                      </h3>
                      <span style={{ fontSize: "12px", color: "rgba(240,237,234,0.4)", whiteSpace: "nowrap" }}>
                        {formatTimeAgo(notif.timestamp)}
                      </span>
                    </div>
                    <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.6)", margin: "0 0 12px", lineHeight: "1.6" }}>
                      {notif.message}
                    </p>
                    {notif.jobTitle && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Briefcase size={14} style={{ color: "rgba(240,237,234,0.3)" }} />
                        <span style={{ fontSize: "13px", color: "rgba(240,237,234,0.5)" }}>
                          {notif.jobTitle}{notif.company ? ` at ${notif.company}` : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}

function getIconColor(type) {
  switch (type) {
    case "success": return "#10B981";
    case "error": return "#F87171";
    case "warning": return "#F59E0B";
    case "info": return "#4F8EF7";
    default: return "#4F8EF7";
  }
}

export default Notifications;
