import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import bgImg from "../assets/background.jpg";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "",
    phone: "", skills: "", experience: "", location: "", bio: "",
    resume: null, company: "", companyWebsite: "", companyProof: null,
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleRole = (role) => setFormData({ ...formData, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) return alert("Please select a role");
    if (formData.role === "candidate" && !formData.resume) return alert("Please upload your resume");
    if (formData.role === "recruiter" && (!formData.company || !formData.companyProof)) {
      return alert("Please fill company details and upload proof");
    }
    setLoading(true);
    try {
      const form = new FormData();
      for (let key in formData) form.append(key, formData[key]);
      const res = await axiosInstance.post("/auth/register", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
    color: "#F0EDEA", fontSize: "14px", outline: "none",
    boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s"
  };

  const labelStyle = {
    display: "block", fontSize: "12px", fontWeight: "500",
    color: "rgba(240,237,234,0.5)", marginBottom: "6px",
    textTransform: "uppercase", letterSpacing: "0.5px"
  };

  const onFocus = e => e.target.style.borderColor = "#4F8EF7";
  const onBlur = e => e.target.style.borderColor = "rgba(255,255,255,0.1)";

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#F0EDEA" }}>
      <img src={bgImg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.05, zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "760px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
            <div style={{ width: "24px", height: "24px", background: "linear-gradient(135deg, #4F8EF7, #7C3AED)", borderRadius: "5px" }} />
            <span style={{ fontSize: "16px", fontWeight: "700" }}>Career<span style={{ color: "#4F8EF7" }}>Path</span></span>
          </div>
          <h1 style={{ fontSize: "30px", fontWeight: "800", letterSpacing: "-0.8px", marginBottom: "8px" }}>Create your account</h1>
          <p style={{ color: "rgba(240,237,234,0.45)", fontSize: "15px" }}>Start your journey with CareerPath today</p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px", padding: "40px"
        }}>
          {/* Role Selector */}
          <div style={{ marginBottom: "32px" }}>
            <p style={{ ...labelStyle, marginBottom: "12px" }}>I am a...</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {["candidate", "recruiter"].map(r => (
                <button key={r} type="button" onClick={() => handleRole(r)} style={{
                  padding: "16px", borderRadius: "12px", cursor: "pointer",
                  border: formData.role === r ? "1.5px solid #4F8EF7" : "1px solid rgba(255,255,255,0.1)",
                  background: formData.role === r ? "rgba(79,142,247,0.1)" : "transparent",
                  color: formData.role === r ? "#4F8EF7" : "rgba(240,237,234,0.6)",
                  fontWeight: "600", fontSize: "15px", textTransform: "capitalize",
                  fontFamily: "inherit", transition: "all 0.2s"
                }}>
                  {r === "candidate" ? "👩‍💻" : "🧑‍💼"} {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input name="name" required onChange={handleChange} style={inputStyle} placeholder="John Doe" onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" name="email" required onChange={handleChange} style={inputStyle} placeholder="you@example.com" onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input type="password" name="password" required onChange={handleChange} style={inputStyle} placeholder="••••••••" onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input name="phone" onChange={handleChange} style={inputStyle} placeholder="+1 234 567 8900" onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Location</label>
              <input name="location" onChange={handleChange} style={inputStyle} placeholder="City, Country" onFocus={onFocus} onBlur={onBlur} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Bio</label>
              <textarea name="bio" onChange={handleChange} rows="3" style={{ ...inputStyle, resize: "vertical" }} placeholder="Tell us about yourself..." onFocus={onFocus} onBlur={onBlur} />
            </div>

            {/* Candidate Fields */}
            {formData.role === "candidate" && (
              <div style={{
                background: "rgba(79,142,247,0.05)", border: "1px solid rgba(79,142,247,0.15)",
                borderRadius: "12px", padding: "24px", marginBottom: "20px"
              }}>
                <p style={{ fontSize: "13px", color: "#4F8EF7", fontWeight: "600", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Candidate Details
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={labelStyle}>Skills</label>
                    <input name="skills" onChange={handleChange} style={inputStyle} placeholder="React, Node.js, Python..." onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    <label style={labelStyle}>Experience</label>
                    <input name="experience" onChange={handleChange} style={inputStyle} placeholder="3 years" onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Resume (PDF) *</label>
                  <input type="file" name="resume" required onChange={handleChange} style={{ ...inputStyle, padding: "8px 14px", cursor: "pointer" }} />
                </div>
              </div>
            )}

            {/* Recruiter Fields */}
            {formData.role === "recruiter" && (
              <div style={{
                background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.15)",
                borderRadius: "12px", padding: "24px", marginBottom: "20px"
              }}>
                <p style={{ fontSize: "13px", color: "#9B6AF7", fontWeight: "600", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Company Details
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={labelStyle}>Company Name *</label>
                    <input name="company" required onChange={handleChange} style={inputStyle} placeholder="Acme Corp" onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    <label style={labelStyle}>Company Website</label>
                    <input name="companyWebsite" onChange={handleChange} style={inputStyle} placeholder="https://acme.com" onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Verification Proof *</label>
                  <input type="file" name="companyProof" required onChange={handleChange} style={{ ...inputStyle, padding: "8px 14px", cursor: "pointer" }} />
                </div>
              </div>
            )}

            <button
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: loading ? "rgba(79,142,247,0.5)" : "#4F8EF7",
                border: "none", borderRadius: "10px", color: "#fff",
                fontSize: "15px", fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                marginTop: "8px", fontFamily: "inherit"
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  Creating account...
                </>
              ) : "Create account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "rgba(240,237,234,0.4)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#4F8EF7", fontWeight: "600", textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: rgba(240,237,234,0.2); }
      `}</style>
    </div>
  );
}

export default Register;