import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../layouts/DashboardLayout";
import { Users, Briefcase, FileText, TrendingUp, UserCheck, UserX } from "lucide-react";

function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [statsRes, recruitersRes, jobsRes] = await Promise.all([
        axiosInstance.get("/admin/stats"),
        axiosInstance.get("/admin/recruiters"),
        axiosInstance.get("/admin/jobs")
      ]);

      setStats(statsRes.data.data);
      setRecruiters(recruitersRes.data.data);
      setJobs(jobsRes.data.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      alert("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const getTopRecruiters = () => {
    return recruiters
      ?.sort((a, b) => b.totalJobsPosted - a.totalJobsPosted)
      ?.slice(0, 5) ?? [];
  };

  const getTopJobs = () => {
    return jobs
      ?.sort((a, b) => (b.applicants?.length || 0) - (a.applicants?.length || 0))
      ?.slice(0, 5) ?? [];
  };

  const getAverageApplicants = () => {
    if (jobs?.length ?? 0 === 0) return 0;
    const total = jobs?.reduce((acc, job) => acc + (job.applicants?.length || 0), 0) ?? 0;
    return Math.round(total / (jobs?.length ?? 0));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid rgba(79,142,247,0.2)", borderTopColor: "#4F8EF7", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 8px" }}>
            Platform Analytics
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(240,237,234,0.5)", margin: 0 }}>
            Comprehensive insights and statistics
          </p>
        </div>

        {/* Key Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { 
              label: "Total Users", 
              value: stats?.totalUsers || 0, 
              icon: Users, 
              color: "#4F8EF7",
              sub: `${stats?.totalCandidates || 0} candidates, ${stats?.totalRecruiters || 0} recruiters`
            },
            { 
              label: "Active Jobs", 
              value: stats?.totalJobs || 0, 
              icon: Briefcase, 
              color: "#9B6AF7",
              sub: `Avg ${getAverageApplicants()} applicants/job`
            },
            { 
              label: "Applications", 
              value: stats?.totalApplications || 0, 
              icon: FileText, 
              color: "#10B981",
              sub: "Total submissions"
            },
            { 
              label: "Verification Rate", 
              value: stats?.totalRecruiters > 0 ? Math.round(((stats.totalRecruiters - stats.pendingRecruiters) / stats.totalRecruiters) * 100) : 0, 
              icon: UserCheck, 
              color: "#F59E0B",
              sub: `${stats?.pendingRecruiters || 0} pending`
            },
          ].map((metric, i) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${metric.color}20`,
                  borderRadius: "14px",
                  padding: "24px",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: metric.color }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: `${metric.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: metric.color
                  }}>
                    <IconComponent size={22} />
                  </div>
                </div>
                <div style={{ fontSize: "32px", fontWeight: "700", color: "#F0EDEA", marginBottom: "6px" }}>
                  {metric.label.includes("Rate") ? `${metric.value}%` : metric.value?.toLocaleString()}
                </div>
                <div style={{ fontSize: "13px", color: "rgba(240,237,234,0.5)", marginBottom: "4px" }}>
                  {metric.label}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(240,237,234,0.35)" }}>
                  {metric.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts and Visualizations */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px", marginBottom: "32px" }}>
          {/* User Distribution */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "24px"
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 20px" }}>
              User Distribution
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Candidates", value: stats?.totalCandidates || 0, color: "#4F8EF7" },
                { label: "Recruiters", value: stats?.totalRecruiters || 0, color: "#9B6AF7" },
                { label: "Blocked Users", value: stats?.blockedUsers || 0, color: "#F87171" },
              ].map((item, i) => {
                const percentage = stats?.totalUsers > 0 ? (item.value / stats.totalUsers) * 100 : 0;
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "14px", color: "rgba(240,237,234,0.7)" }}>{item.label}</span>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: item.color }}>{item.value}</span>
                    </div>
                    <div style={{ height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ 
                        height: "100%", 
                        width: `${percentage}%`, 
                        background: item.color, 
                        borderRadius: "4px",
                        transition: "width 0.5s ease"
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Application Funnel */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "24px"
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 20px" }}>
              Platform Health
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { label: "Jobs per Recruiter", value: stats?.totalRecruiters > 0 ? (stats.totalJobs / stats.totalRecruiters).toFixed(1) : 0, icon: "📊" },
                { label: "Applications per Job", value: getAverageApplicants(), icon: "📝" },
                { label: "Active Recruiters", value: stats?.totalRecruiters - stats?.pendingRecruiters || 0, icon: "✓" },
                { label: "Pending Verifications", value: stats?.pendingRecruiters || 0, icon: "⏳" },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: "16px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "10px",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon}</div>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#F0EDEA", marginBottom: "4px" }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(240,237,234,0.5)" }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
          {/* Top Recruiters */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "24px"
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 20px" }}>
              Top Recruiters by Jobs Posted
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {getTopRecruiters().map((recruiter, i) => (
                <div key={recruiter._id} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "10px"
                }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: i === 0 ? "rgba(245,158,11,0.15)" : "rgba(79,142,247,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "700",
                    color: i === 0 ? "#F59E0B" : "#4F8EF7"
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#F0EDEA" }}>{recruiter.recruiterName}</div>
                    <div style={{ fontSize: "12px", color: "rgba(240,237,234,0.4)" }}>{recruiter.company || "No company"}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#9B6AF7" }}>{recruiter.totalJobsPosted}</div>
                    <div style={{ fontSize: "11px", color: "rgba(240,237,234,0.4)" }}>jobs</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Popular Jobs */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "24px"
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 20px" }}>
              Most Popular Jobs
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {getTopJobs().map((job, i) => (
                <div key={job._id} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "10px"
                }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: i === 0 ? "rgba(16,185,129,0.15)" : "rgba(79,142,247,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "700",
                    color: i === 0 ? "#10B981" : "#4F8EF7"
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#F0EDEA" }}>{job.title}</div>
                    <div style={{ fontSize: "12px", color: "rgba(240,237,234,0.4)" }}>{job.company}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#4F8EF7" }}>{job.applicants?.length || 0}</div>
                    <div style={{ fontSize: "11px", color: "rgba(240,237,234,0.4)" }}>applicants</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}

export default AdminAnalytics;
