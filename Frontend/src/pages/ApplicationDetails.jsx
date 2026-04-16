import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../layouts/DashboardLayout";
import { 
  ArrowLeft, Building2, MapPin, DollarSign, Calendar, 
  CheckCircle, Clock, XCircle, FileText, Phone, Mail,
  User, Award, Briefcase
} from "lucide-react";

function ApplicationDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      const res = await axiosInstance.get("/applications/my-applications");
      const apps = res.data.data || [];
      const foundApp = apps.find(app => app._id === applicationId);
      
      if (foundApp) {
        setApplication(foundApp);
      } else {
        alert("Application not found");
        navigate("/applications");
      }
    } catch (error) {
      console.error("Failed to fetch application:", error);
      alert("Failed to load application details");
      navigate("/applications");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    const num = Number(salary);
    if (num >= 1000000) {
      return `₹${(num / 100000).toFixed(1)} Lakhs/year`;
    } else if (num >= 100000) {
      return `₹${(num / 1000).toFixed(0)}K/year`;
    }
    return `₹${num.toLocaleString('en-IN')}/year`;
  };

  const getStatusConfig = (status) => {
    const configs = {
      accepted: { 
        bg: "rgba(16,185,129,0.1)", 
        color: "#10B981", 
        border: "rgba(16,185,129,0.2)",
        icon: <CheckCircle size={20} />,
        label: "Accepted",
        message: "Congratulations! Your application has been accepted."
      },
      rejected: { 
        bg: "rgba(239,68,68,0.1)", 
        color: "#F87171", 
        border: "rgba(239,68,68,0.2)",
        icon: <XCircle size={20} />,
        label: "Rejected",
        message: "Your application was not selected for this position."
      },
      pending: { 
        bg: "rgba(79,142,247,0.1)", 
        color: "#4F8EF7", 
        border: "rgba(79,142,247,0.2)",
        icon: <Clock size={20} />,
        label: "Under Review",
        message: "Your application is being reviewed by the recruiter."
      }
    };
    return configs[status] || configs.pending;
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

  if (!application) return null;

  const statusConfig = getStatusConfig(application.status);

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "none",
            color: "rgba(240,237,234,0.6)",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "24px",
            fontFamily: "inherit",
            padding: "8px 0"
          }}
        >
          <ArrowLeft size={16} />
          Back to Applications
        </button>

        {/* Status Banner */}
        <div style={{
          background: statusConfig.bg,
          border: `1px solid ${statusConfig.border}`,
          borderRadius: "14px",
          padding: "24px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "16px"
        }}>
          <div style={{ color: statusConfig.color }}>
            {statusConfig.icon}
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: statusConfig.color, margin: "0 0 4px" }}>
              {statusConfig.label}
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.7)", margin: 0 }}>
              {statusConfig.message}
            </p>
          </div>
        </div>

        {/* Job Information */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "24px"
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 20px" }}>
            Job Information
          </h3>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "14px",
              background: "linear-gradient(135deg, #4F8EF7, #6366F1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px", fontWeight: "700", color: "#fff"
            }}>
              {application.job?.company?.charAt(0)?.toUpperCase() || "C"}
            </div>
            <div>
              <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 4px" }}>
                {application.job?.title || "Untitled Position"}
              </h4>
              <p style={{ fontSize: "15px", color: "rgba(240,237,234,0.6)", margin: 0 }}>
                {application.job?.company || "Company"}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <MapPin size={16} style={{ color: "rgba(240,237,234,0.5)" }} />
              <div>
                <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.4)", margin: "0 0 2px" }}>Location</p>
                <p style={{ fontSize: "14px", color: "#F0EDEA", margin: 0, fontWeight: "600" }}>
                  {application.job?.location || "Not specified"}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <DollarSign size={16} style={{ color: "#4F8EF7" }} />
              <div>
                <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.4)", margin: "0 0 2px" }}>Salary</p>
                <p style={{ fontSize: "14px", color: "#4F8EF7", margin: 0, fontWeight: "600" }}>
                  {formatSalary(application.job?.salary)}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Calendar size={16} style={{ color: "rgba(240,237,234,0.5)" }} />
              <div>
                <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.4)", margin: "0 0 2px" }}>Applied On</p>
                <p style={{ fontSize: "14px", color: "#F0EDEA", margin: 0, fontWeight: "600" }}>
                  {formatDate(application.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Application Details */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "24px"
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 20px" }}>
            Your Application Details
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Contact Information */}
            <div>
              <h4 style={{ fontSize: "13px", fontWeight: "600", color: "rgba(240,237,234,0.5)", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Contact Information
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {application.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Phone size={16} style={{ color: "rgba(240,237,234,0.5)" }} />
                    <div>
                      <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.4)", margin: "0 0 2px" }}>Phone</p>
                      <p style={{ fontSize: "14px", color: "#F0EDEA", margin: 0, fontWeight: "600" }}>
                        {application.phone}
                      </p>
                    </div>
                  </div>
                )}
                {application.currentLocation && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <MapPin size={16} style={{ color: "rgba(240,237,234,0.5)" }} />
                    <div>
                      <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.4)", margin: "0 0 2px" }}>Location</p>
                      <p style={{ fontSize: "14px", color: "#F0EDEA", margin: 0, fontWeight: "600" }}>
                        {application.currentLocation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Details */}
            {(application.yearsOfExperience || application.expectedSalary || application.availableNoticePeriod) && (
              <div>
                <h4 style={{ fontSize: "13px", fontWeight: "600", color: "rgba(240,237,234,0.5)", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Professional Details
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {application.yearsOfExperience && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Award size={16} style={{ color: "rgba(240,237,234,0.5)" }} />
                      <div>
                        <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.4)", margin: "0 0 2px" }}>Experience</p>
                        <p style={{ fontSize: "14px", color: "#F0EDEA", margin: 0, fontWeight: "600" }}>
                          {application.yearsOfExperience}
                        </p>
                      </div>
                    </div>
                  )}
                  {application.expectedSalary && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <DollarSign size={16} style={{ color: "#4F8EF7" }} />
                      <div>
                        <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.4)", margin: "0 0 2px" }}>Expected Salary</p>
                        <p style={{ fontSize: "14px", color: "#4F8EF7", margin: 0, fontWeight: "600" }}>
                          {formatSalary(application.expectedSalary)}
                        </p>
                      </div>
                    </div>
                  )}
                  {application.availableNoticePeriod && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Briefcase size={16} style={{ color: "rgba(240,237,234,0.5)" }} />
                      <div>
                        <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.4)", margin: "0 0 2px" }}>Notice Period</p>
                        <p style={{ fontSize: "14px", color: "#F0EDEA", margin: 0, fontWeight: "600", textTransform: "capitalize" }}>
                          {application.availableNoticePeriod.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cover Letter */}
            {application.coverLetter && (
              <div>
                <h4 style={{ fontSize: "13px", fontWeight: "600", color: "rgba(240,237,234,0.5)", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <FileText size={14} style={{ display: "inline", marginRight: "6px" }} />
                  Cover Letter
                </h4>
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "10px",
                  padding: "16px",
                  fontSize: "14px",
                  color: "rgba(240,237,234,0.7)",
                  lineHeight: "1.7",
                  whiteSpace: "pre-wrap"
                }}>
                  {application.coverLetter}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Application Timeline */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          padding: "28px"
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 20px" }}>
            Application Timeline
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "rgba(79,142,247,0.1)",
                border: "2px solid #4F8EF7",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0
              }}>
                <CheckCircle size={16} style={{ color: "#4F8EF7" }} />
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 4px" }}>
                  Application Submitted
                </p>
                <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.5)", margin: 0 }}>
                  {formatDate(application.createdAt)}
                </p>
              </div>
            </div>

            {application.status !== "pending" && (
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: application.status === "accepted" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                  border: `2px solid ${application.status === "accepted" ? "#10B981" : "#F87171"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0
                }}>
                  {application.status === "accepted" ? 
                    <CheckCircle size={16} style={{ color: "#10B981" }} /> :
                    <XCircle size={16} style={{ color: "#F87171" }} />
                  }
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 4px" }}>
                    Application {application.status === "accepted" ? "Accepted" : "Rejected"}
                  </p>
                  <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.5)", margin: 0 }}>
                    {formatDate(application.updatedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}

export default ApplicationDetails;
