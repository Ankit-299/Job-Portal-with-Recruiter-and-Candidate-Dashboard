import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function CreateJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", description: "", company: "", location: "", salary: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/jobs", formData);
      alert("Job posted successfully!");
      navigate("/my-jobs");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
    color: "#F0EDEA", fontSize: "14px", outline: "none",
    boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s"
  };

  const labelStyle = {
    display: "block", fontSize: "12px", fontWeight: "500",
    color: "rgba(240,237,234,0.5)", marginBottom: "8px",
    textTransform: "uppercase", letterSpacing: "0.5px"
  };

  const onFocus = e => e.target.style.borderColor = "#4F8EF7";
  const onBlur = e => e.target.style.borderColor = "rgba(255,255,255,0.1)";

  const fields = [
    { name: "title", label: "Job Title", placeholder: "e.g. Senior React Developer", type: "text" },
    { name: "company", label: "Company", placeholder: "e.g. Acme Inc.", type: "text" },
    { name: "location", label: "Location", placeholder: "e.g. San Francisco, CA", type: "text" },
    { name: "salary", label: "Annual Salary (₹ INR)", placeholder: "e.g. 1200000", type: "number" },
  ];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "680px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 6px" }}>Post a Job</h1>
          <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.4)", margin: 0 }}>Fill in the details below to publish your job listing</p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px", padding: "32px"
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "20px" }}>
              {fields.map(f => (
                <div key={f.name}>
                  <label style={labelStyle}>{f.label}</label>
                  <input
                    name={f.name} type={f.type} value={formData[f.name]}
                    onChange={handleChange} required placeholder={f.placeholder}
                    style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>Job Description</label>
              <textarea
                name="description" value={formData.description}
                onChange={handleChange} required rows="6"
                placeholder="Describe the role, responsibilities, requirements, and benefits..."
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={onFocus} onBlur={onBlur}
              />
            </div>

            {/* Preview Card */}
            {formData.title && (
              <div style={{
                background: "rgba(79,142,247,0.05)", border: "1px solid rgba(79,142,247,0.15)",
                borderRadius: "10px", padding: "16px 20px", marginBottom: "24px"
              }}>
                <p style={{ fontSize: "11px", color: "#4F8EF7", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px", fontWeight: "600" }}>Preview</p>
                <p style={{ fontSize: "15px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 4px" }}>{formData.title || "—"}</p>
                <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.45)", margin: 0 }}>
                  {[formData.company, formData.location, formData.salary && `$${Number(formData.salary).toLocaleString()}/yr`].filter(Boolean).join(" · ")}
                </p>
              </div>
            )}

            <button
              disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading ? "rgba(79,142,247,0.4)" : "#4F8EF7",
                border: "none", borderRadius: "10px", color: "#fff",
                fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                fontFamily: "inherit", transition: "background 0.2s"
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  Publishing...
                </>
              ) : "Publish Job"}
            </button>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: rgba(240,237,234,0.2); }
      `}</style>
    </DashboardLayout>
  );
}

export default CreateJob;