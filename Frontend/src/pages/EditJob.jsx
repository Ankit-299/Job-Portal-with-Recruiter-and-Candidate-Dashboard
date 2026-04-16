import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../layouts/DashboardLayout";
import { ArrowLeft } from "lucide-react";

function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const res = await axiosInstance.get("/jobs/my-jobs");
      const job = res.data.data.find(j => j._id === jobId);
      
      if (!job) {
        alert("Job not found");
        navigate("/my-jobs");
        return;
      }

      setFormData({
        title: job.title,
        description: job.description,
        company: job.company,
        location: job.location,
        salary: job.salary
      });
    } catch (error) {
      console.error("Failed to fetch job:", error);
      alert("Failed to load job details");
      navigate("/my-jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Note: Backend needs PUT endpoint for updating jobs
      // For now, we'll delete and recreate (or you can add update endpoint)
      alert("Update functionality requires backend PUT endpoint. Please add it to jobController.js");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#F0EDEA",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s"
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: "500",
    color: "rgba(240,237,234,0.5)",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  const onFocus = e => e.target.style.borderColor = "#4F8EF7";
  const onBlur = e => e.target.style.borderColor = "rgba(255,255,255,0.1)";

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
      <div style={{ maxWidth: "680px" }}>
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
          Back to My Jobs
        </button>

        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 6px" }}>
            Edit Job
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.4)", margin: 0 }}>
            Update your job posting details
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          padding: "32px"
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={labelStyle}>Job Title</label>
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Senior React Developer"
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
              <div>
                <label style={labelStyle}>Company</label>
                <input
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Acme Inc."
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. San Francisco, CA"
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
              <div>
                <label style={labelStyle}>Annual Salary (₹ INR)</label>
                <input
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 1200000"
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>Job Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="8"
                placeholder="Describe the role, responsibilities, requirements, and benefits..."
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {/* Preview Card */}
            {formData.title && (
              <div style={{
                background: "rgba(79,142,247,0.05)",
                border: "1px solid rgba(79,142,247,0.15)",
                borderRadius: "10px",
                padding: "16px 20px",
                marginBottom: "24px"
              }}>
                <p style={{ fontSize: "11px", color: "#4F8EF7", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px", fontWeight: "600" }}>
                  Preview
                </p>
                <p style={{ fontSize: "15px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 4px" }}>
                  {formData.title}
                </p>
                <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.45)", margin: 0 }}>
                  {[formData.company, formData.location, formData.salary && `₹${Number(formData.salary).toLocaleString('en-IN')}/yr`].filter(Boolean).join(" · ")}
                </p>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => navigate("/my-jobs")}
                style={{
                  flex: 1,
                  padding: "13px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: "rgba(240,237,234,0.7)",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "inherit"
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 2,
                  padding: "13px",
                  background: saving ? "rgba(79,142,247,0.4)" : "linear-gradient(135deg, #4F8EF7, #6366F1)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: saving ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontFamily: "inherit",
                  transition: "background 0.2s",
                  boxShadow: "0 4px 12px rgba(79,142,247,0.3)"
                }}
              >
                {saving ? (
                  <>
                    <span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                    Saving Changes...
                  </>
                ) : "Update Job"}
              </button>
            </div>
          </form>
        </div>

        <div style={{
          marginTop: "20px",
          padding: "16px",
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: "10px"
        }}>
          <p style={{ fontSize: "13px", color: "#F59E0B", margin: 0 }}>
            ⚠️ Note: Backend update endpoint required. Please add PUT /api/jobs/:id endpoint to enable job editing.
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}

export default EditJob;
