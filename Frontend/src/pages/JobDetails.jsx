import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../layouts/DashboardLayout";
import ApplicationForm from "../components/ApplicationForm";
import { 
  MapPin, DollarSign, Building2, Calendar, ArrowLeft, CheckCircle, 
  Briefcase, Clock, Award, Users, Share2, Bookmark, BookmarkCheck,
  Globe, TrendingUp, AlertCircle
} from "lucide-react";

function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applications, setApplications] = useState([]);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    fetchApplications();
    fetchSimilarJobs();
    loadSavedJobs();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const res = await axiosInstance.get(`/jobs/${jobId}`);
      if (res.data.data) {
        setJob(res.data.data);
      } else {
        alert("Job not found");
        navigate("/browse-jobs");
      }
    } catch (error) {
      console.error("Failed to fetch job:", error);
      alert("Failed to load job details");
      navigate("/browse-jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarJobs = async () => {
    try {
      const res = await axiosInstance.get(`/jobs/${jobId}/similar`);
      setSimilarJobs(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch similar jobs:", error);
    }
  };

  const loadSavedJobs = () => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setIsSaved(savedJobs.includes(jobId));
  };

  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get("/applications/my-applications");
      const apps = res.data.data || [];
      setApplications(apps);
      setHasApplied(apps.some(a => a.job?._id === jobId || a.job === jobId));
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const handleApply = () => {
    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    setShowApplicationForm(false);
    setHasApplied(true);
    fetchApplications();
    alert("Application submitted successfully! 🎉");
  };

  const handleSaveJob = () => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    if (isSaved) {
      const updated = savedJobs.filter(id => id !== jobId);
      localStorage.setItem("savedJobs", JSON.stringify(updated));
      setIsSaved(false);
      alert("Job removed from saved list");
    } else {
      savedJobs.push(jobId);
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
      setIsSaved(true);
      alert("Job saved successfully!");
    }
  };

  const handleShareJob = () => {
    const shareUrl = `${window.location.origin}/job/${jobId}`;
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this ${job.title} position at ${job.company}`,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Job link copied to clipboard!");
    }
    setShowShareModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatSalary = (salary) => {
    if (salary >= 1000000) {
      return `₹${(salary / 100000).toFixed(1)} Lakhs/year`;
    } else if (salary >= 100000) {
      return `₹${(salary / 1000).toFixed(0)}K/year`;
    }
    return `₹${salary.toLocaleString('en-IN')}/year`;
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getJobTypeColor = (type) => {
    const colors = {
      "full-time": { bg: "rgba(16,185,129,0.1)", color: "#10B981", border: "rgba(16,185,129,0.2)" },
      "part-time": { bg: "rgba(79,142,247,0.1)", color: "#4F8EF7", border: "rgba(79,142,247,0.2)" },
      "contract": { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "rgba(245,158,11,0.2)" },
      "internship": { bg: "rgba(155,106,247,0.1)", color: "#9B6AF7", border: "rgba(155,106,247,0.2)" },
      "freelance": { bg: "rgba(236,72,153,0.1)", color: "#EC4899", border: "rgba(236,72,153,0.2)" }
    };
    return colors[type] || colors["full-time"];
  };

  const getExperienceLevelColor = (level) => {
    const colors = {
      "entry": { bg: "rgba(79,142,247,0.1)", color: "#4F8EF7", border: "rgba(79,142,247,0.2)" },
      "mid": { bg: "rgba(16,185,129,0.1)", color: "#10B981", border: "rgba(16,185,129,0.2)" },
      "senior": { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "rgba(245,158,11,0.2)" },
      "lead": { bg: "rgba(155,106,247,0.1)", color: "#9B6AF7", border: "rgba(155,106,247,0.2)" },
      "executive": { bg: "rgba(239,68,68,0.1)", color: "#F87171", border: "rgba(239,68,68,0.2)" }
    };
    return colors[level] || colors["mid"];
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

  if (!job) return null;

  const daysRemaining = getDaysRemaining(job.applicationDeadline);
  const jobTypeColor = getJobTypeColor(job.jobType);
  const experienceColor = getExperienceLevelColor(job.experienceLevel);

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
          Back to Jobs
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "24px" }}>
          {/* Main Content */}
          <div>
            {/* Job Header */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", marginBottom: "24px" }}>
                <div style={{ flex: 1 }}>
                  <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 12px" }}>
                    {job.title}
                  </h1>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "15px", color: "rgba(240,237,234,0.6)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Building2 size={16} />
                      {job.company}
                    </span>
                    <span style={{ fontSize: "15px", color: "rgba(240,237,234,0.6)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <MapPin size={16} />
                      {job.location}
                    </span>
                    <span style={{ fontSize: "15px", color: "#4F8EF7", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                      <DollarSign size={16} />
                      {formatSalary(job.salary)}
                    </span>
                  </div>
                  
                  {/* Job Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    <span style={{
                      fontSize: "12px", fontWeight: "600", padding: "6px 12px", borderRadius: "8px",
                      background: jobTypeColor.bg, color: jobTypeColor.color, border: `1px solid ${jobTypeColor.border}`,
                      textTransform: "capitalize"
                    }}>
                      <Briefcase size={12} style={{ display: "inline", marginRight: "4px" }} />
                      {job.jobType?.replace("-", " ") || "Full-time"}
                    </span>
                    <span style={{
                      fontSize: "12px", fontWeight: "600", padding: "6px 12px", borderRadius: "8px",
                      background: experienceColor.bg, color: experienceColor.color, border: `1px solid ${experienceColor.border}`,
                      textTransform: "capitalize"
                    }}>
                      <Award size={12} style={{ display: "inline", marginRight: "4px" }} />
                      {job.experienceLevel || "Mid"} Level
                    </span>
                    <span style={{
                      fontSize: "12px", fontWeight: "600", padding: "6px 12px", borderRadius: "8px",
                      background: "rgba(79,142,247,0.1)", color: "#4F8EF7", border: "1px solid rgba(79,142,247,0.2)",
                      textTransform: "capitalize"
                    }}>
                      <Globe size={12} style={{ display: "inline", marginRight: "4px" }} />
                      {job.remoteOption || "On-site"}
                    </span>
                    {job.department && (
                      <span style={{
                        fontSize: "12px", fontWeight: "600", padding: "6px 12px", borderRadius: "8px",
                        background: "rgba(155,106,247,0.1)", color: "#9B6AF7", border: "1px solid rgba(155,106,247,0.2)"
                      }}>
                        {job.department}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={handleSaveJob}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      cursor: "pointer",
                      background: isSaved ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.05)",
                      color: isSaved ? "#F59E0B" : "rgba(240,237,234,0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                  </button>
                  <button
                    onClick={() => setShowShareModal(true)}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      cursor: "pointer",
                      background: "rgba(255,255,255,0.05)",
                      color: "rgba(240,237,234,0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApply}
                disabled={hasApplied || !job.isOpen}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: (hasApplied || !job.isOpen) ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  fontWeight: "700",
                  background: hasApplied ? "rgba(16,185,129,0.15)" : !job.isOpen ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #4F8EF7, #6366F1)",
                  color: hasApplied ? "#10B981" : !job.isOpen ? "rgba(240,237,234,0.3)" : "#fff",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: (hasApplied || !job.isOpen) ? "none" : "0 4px 16px rgba(79,142,247,0.4)"
                }}
              >
                {hasApplied ? (
                  <>
                    <CheckCircle size={18} />
                    Applied Successfully
                  </>
                ) : !job.isOpen ? (
                  "Position Closed"
                ) : (
                  "Apply Now"
                )}
              </button>
            </div>

            {/* Job Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
              {/* Job Description */}
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "28px"
              }}>
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 16px" }}>
                  Job Description
                </h2>
                <div style={{ fontSize: "14px", color: "rgba(240,237,234,0.7)", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
                  {job.description}
                </div>
              </div>

              {/* Responsibilities & Qualifications */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {job.responsibilities && (
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "28px"
                  }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 16px" }}>
                      Key Responsibilities
                    </h2>
                    <div style={{ fontSize: "14px", color: "rgba(240,237,234,0.7)", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
                      {job.responsibilities}
                    </div>
                  </div>
                )}
                
                {job.qualifications && (
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "28px"
                  }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 16px" }}>
                      Qualifications
                    </h2>
                    <div style={{ fontSize: "14px", color: "rgba(240,237,234,0.7)", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
                      {job.qualifications}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills & Benefits */}
            {(job.requiredSkills?.length > 0 || job.benefits) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                {job.requiredSkills?.length > 0 && (
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "28px"
                  }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 16px" }}>
                      Required Skills
                    </h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {job.requiredSkills.map((skill, index) => (
                        <span key={index} style={{
                          padding: "8px 14px",
                          background: "rgba(79,142,247,0.1)",
                          border: "1px solid rgba(79,142,247,0.2)",
                          borderRadius: "8px",
                          color: "#4F8EF7",
                          fontSize: "13px",
                          fontWeight: "600"
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.benefits && (
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "28px"
                  }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 16px" }}>
                      Benefits & Perks
                    </h2>
                    <div style={{ fontSize: "14px", color: "rgba(240,237,234,0.7)", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
                      {job.benefits}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Company Info */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "28px"
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 20px" }}>
                About the Company
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #4F8EF7, #6366F1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#fff"
                }}>
                  {job.company?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 4px" }}>
                    {job.company}
                  </h3>
                  <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.5)", margin: 0 }}>
                    {job.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Job Overview */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "24px"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 20px" }}>
                Job Overview
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <p style={{ fontSize: "12px", color: "rgba(240,237,234,0.4)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Posted Date</p>
                  <p style={{ fontSize: "14px", color: "#F0EDEA", margin: 0, fontWeight: "600" }}>
                    <Calendar size={14} style={{ display: "inline", marginRight: "6px" }} />
                    {formatDate(job.createdAt)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "rgba(240,237,234,0.4)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Applicants</p>
                  <p style={{ fontSize: "14px", color: "#F0EDEA", margin: 0, fontWeight: "600" }}>
                    <Users size={14} style={{ display: "inline", marginRight: "6px" }} />
                    {job.applicants?.length || 0} candidates
                  </p>
                </div>
                {job.positions && (
                  <div>
                    <p style={{ fontSize: "12px", color: "rgba(240,237,234,0.4)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Open Positions</p>
                    <p style={{ fontSize: "14px", color: "#F0EDEA", margin: 0, fontWeight: "600" }}>
                      {job.positions} position{job.positions > 1 ? "s" : ""}
                    </p>
                  </div>
                )}
                {daysRemaining !== null && (
                  <div>
                    <p style={{ fontSize: "12px", color: "rgba(240,237,234,0.4)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Application Deadline</p>
                    <p style={{ 
                      fontSize: "14px", 
                      margin: 0, 
                      fontWeight: "600",
                      color: daysRemaining > 7 ? "#10B981" : daysRemaining > 3 ? "#F59E0B" : "#F87171"
                    }}>
                      <AlertCircle size={14} style={{ display: "inline", marginRight: "6px" }} />
                      {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Deadline passed"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "24px"
              }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 16px" }}>
                  <TrendingUp size={16} style={{ display: "inline", marginRight: "8px" }} />
                  Similar Jobs
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {similarJobs.map(similarJob => (
                    <div
                      key={similarJob._id}
                      onClick={() => navigate(`/job/${similarJob._id}`)}
                      style={{
                        padding: "14px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "rgba(79,142,247,0.3)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                      }}
                    >
                      <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 6px" }}>
                        {similarJob.title}
                      </h4>
                      <p style={{ fontSize: "12px", color: "rgba(240,237,234,0.5)", margin: "0 0 4px" }}>
                        {similarJob.company}
                      </p>
                      <p style={{ fontSize: "12px", color: "#4F8EF7", margin: 0, fontWeight: "600" }}>
                        {formatSalary(similarJob.salary)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}
        onClick={() => setShowShareModal(false)}
        >
          <div style={{
            background: "#0D0D14",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "32px",
            maxWidth: "400px",
            width: "90%"
          }}
          onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 16px" }}>
              Share this Job
            </h3>
            <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.6)", margin: "0 0 24px" }}>
              Share this opportunity with your network
            </p>
            <button
              onClick={handleShareJob}
              style={{
                width: "100%",
                padding: "12px",
                background: "linear-gradient(135deg, #4F8EF7, #6366F1)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "inherit"
              }}
            >
              Copy Link to Clipboard
            </button>
            <button
              onClick={() => setShowShareModal(false)}
              style={{
                width: "100%",
                padding: "12px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "rgba(240,237,234,0.6)",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "inherit",
                marginTop: "12px"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {showApplicationForm && (
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
        onClick={() => setShowApplicationForm(false)}
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
                onClick={() => setShowApplicationForm(false)}
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
                job={job} 
                user={JSON.parse(localStorage.getItem("user"))}
                onSuccess={handleApplicationSuccess}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}

export default JobDetails;
