import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../layouts/DashboardLayout";
import { Users, Briefcase, FileText, Shield, ArrowRight, AlertCircle, Clock } from "lucide-react";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingRecruiters, setPendingRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, recruitersRes] = await Promise.all([
        axiosInstance.get("/admin/stats"),
        axiosInstance.get("/admin/recruiters")
      ]);
      
      setStats(statsRes.data.data);
      
      // Get pending recruiters
      const pending = recruitersRes.data.data.filter(r => !r.isVerified);
      setPendingRecruiters(pending.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      alert("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    { 
      label: "Total Users", 
      value: stats.totalUsers, 
      sub: `${stats.totalCandidates || 0} Candidates`, 
      color: "#4F8EF7",
      icon: Users
    },
    { 
      label: "Active Jobs", 
      value: stats.totalJobs, 
      sub: "Live Listings", 
      color: "#9B6AF7",
      icon: Briefcase
    },
    { 
      label: "Applications", 
      value: stats.totalApplications, 
      sub: "Total Submissions", 
      color: "#10B981",
      icon: FileText
    },
    { 
      label: "Pending Verification", 
      value: stats.pendingRecruiters, 
      sub: "Requires Approval", 
      color: "#F59E0B",
      icon: Shield
    },
  ] : [];

  const actions = [
    { 
      label: "User Management", 
      desc: "Configure roles and permissions", 
      path: "/admin/users", 
      icon: Users, 
      color: "#4F8EF7" 
    },
    { 
      label: "Job Moderation", 
      desc: "Review and audit job postings", 
      path: "/admin/jobs", 
      icon: Briefcase, 
      color: "#9B6AF7" 
    },
    { 
      label: "Recruiter Access", 
      desc: "Validate enterprise accounts", 
      path: "/admin/recruiters", 
      icon: Shield, 
      color: "#F59E0B" 
    },
  ];

  if (loading) return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <div style={{ 
          width: "40px", 
          height: "40px", 
          border: "3px solid rgba(79,142,247,0.2)", 
          borderTopColor: "#4F8EF7", 
          borderRadius: "50%", 
          animation: "spin 1s linear infinite" 
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header Section */}
        <header style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#F0EDEA", marginBottom: "4px" }}>Admin Dashboard</h1>
          <p style={{ color: "rgba(240,237,234,0.4)", fontSize: "14px", margin: 0 }}>Platform overview and management</p>
        </header>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {statCards.map((s, i) => {
            const IconComponent = s.icon;
            return (
              <div 
                key={i} 
                style={{
                  background: "rgba(255,255,255,0.03)",
                  padding: "24px",
                  borderRadius: "14px",
                  border: `1px solid ${s.color}20`,
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${s.color}40`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${s.color}20`;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{ color: "rgba(240,237,234,0.5)", fontSize: "13px", fontWeight: "500" }}>{s.label}</div>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: `${s.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: s.color
                  }}>
                    <IconComponent size={18} />
                  </div>
                </div>
                <div style={{ fontSize: "32px", fontWeight: "700", color: "#F0EDEA", marginBottom: "6px" }}>
                  {s.value?.toLocaleString() || 0}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.color }}></span>
                  <span style={{ color: "rgba(240,237,234,0.4)" }}>{s.sub}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions Section */}
        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#F0EDEA", marginBottom: "16px" }}>Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {actions.map((a, i) => {
            const IconComponent = a.icon;
            return (
              <div 
                key={i}
                onClick={() => navigate(a.path)}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "14px",
                  padding: "24px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${a.color}40`;
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }}
              >
                <div style={{
                  background: `${a.color}15`,
                  color: a.color,
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <IconComponent size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#F0EDEA", marginBottom: "6px" }}>{a.label}</h3>
                  <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.4)", lineHeight: "1.5", marginBottom: "12px" }}>{a.desc}</p>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: a.color, display: "flex", alignItems: "center", gap: "4px" }}>
                    Manage <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pending Verifications Section */}
        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#F0EDEA", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Clock size={18} style={{ color: "#F59E0B" }} />
          Pending Verifications
        </h2>
        <div style={{ 
          background: "rgba(255,255,255,0.03)", 
          border: "1px solid rgba(255,255,255,0.07)", 
          borderRadius: "14px", 
          overflow: "hidden"
        }}>
          {pendingRecruiters.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "rgba(240,237,234,0.3)" }}>
              <Shield size={40} style={{ marginBottom: "12px", opacity: 0.3 }} />
              <p style={{ fontSize: "14px" }}>No pending verifications</p>
            </div>
          ) : (
            <div>
              {pendingRecruiters.map((recruiter, index) => (
                <div
                  key={recruiter._id}
                  onClick={() => navigate("/admin/recruiters")}
                  style={{
                    padding: "20px 24px",
                    borderBottom: index < pendingRecruiters.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#F59E0B",
                    flexShrink: 0
                  }}>
                    {recruiter.recruiterName?.charAt(0)?.toUpperCase() || "R"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 4px" }}>
                      {recruiter.recruiterName}
                    </h4>
                    <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.4)", margin: 0 }}>{recruiter.email}</p>
                  </div>
                  <div style={{
                    padding: "6px 14px",
                    borderRadius: "100px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: "rgba(245,158,11,0.1)",
                    color: "#F59E0B",
                    border: "1px solid rgba(245,158,11,0.2)"
                  }}>
                    Pending
                  </div>
                  <ArrowRight size={16} style={{ color: "rgba(240,237,234,0.3)" }} />
                </div>
              ))}
              {pendingRecruiters.length > 0 && (
                <div 
                  onClick={() => navigate("/admin/recruiters")}
                  style={{
                    padding: "16px 24px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    cursor: "pointer",
                    textAlign: "center",
                    color: "#F59E0B",
                    fontSize: "13px",
                    fontWeight: "600",
                    transition: "background 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  View All Pending Recruiters →
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;