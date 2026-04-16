import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import bgImg from "../assets/background.jpg";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      
      // Store token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      
      // Redirect based on role
      const role = res.data.data.user.role;
      if (role === "candidate") navigate("/dashboard");
      else if (role === "recruiter") navigate("/recruiter");
      else if (role === "admin") navigate("/admin");
      else navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please check your credentials.";
      
      // Check if it's a pending verification issue
      if (error.response?.data?.pendingVerification) {
        alert("⏳ Account Pending Verification\n\nYour recruiter account is waiting for admin approval.\n\nPlease contact the admin team to verify your account before you can access the recruiter dashboard.");
      } else {
        alert(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
    color: "#F0EDEA", fontSize: "15px", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
    fontFamily: "inherit"
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "#0A0A0F"
    }}>
      {/* LEFT PANEL */}
      <div style={{
        flex: 1, position: "relative", display: "none",
        background: "linear-gradient(135deg, #0D1B3E 0%, #0A0A0F 100%)"
      }} className="left-panel">
        <img src={bgImg} alt="bg" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.15 }} />
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "64px"
        }}>
          <div style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "48px" }}>
              <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #4F8EF7, #7C3AED)", borderRadius: "6px" }} />
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#F0EDEA" }}>Career<span style={{ color: "#4F8EF7" }}>Path</span></span>
            </div>
            <h2 style={{ fontSize: "42px", fontWeight: "800", color: "#F0EDEA", lineHeight: "1.1", letterSpacing: "-1.5px", marginBottom: "16px" }}>
              Your next<br /><span style={{ color: "#4F8EF7" }}>great role</span><br />awaits
            </h2>
            <p style={{ color: "rgba(240,237,234,0.5)", lineHeight: "1.7" }}>
              Join thousands finding their perfect career match every day.
            </p>
          </div>
          {[
            { num: "5,000+", label: "Active candidates" },
            { num: "2,000+", label: "Open positions" },
            { num: "1,500+", label: "Successful hires" },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: "24px", borderLeft: "2px solid rgba(79,142,247,0.3)", paddingLeft: "16px" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#F0EDEA" }}>{s.num}</div>
              <div style={{ fontSize: "13px", color: "rgba(240,237,234,0.4)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px", minHeight: "100vh"
      }}>
        <div style={{ width: "100%", maxWidth: "440px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
              <div style={{ width: "24px", height: "24px", background: "linear-gradient(135deg, #4F8EF7, #7C3AED)", borderRadius: "5px" }} />
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#F0EDEA" }}>Career<span style={{ color: "#4F8EF7" }}>Path</span></span>
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: "800", color: "#F0EDEA", letterSpacing: "-0.8px", marginBottom: "8px" }}>
              Welcome back
            </h1>
            <p style={{ color: "rgba(240,237,234,0.45)", fontSize: "15px" }}>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "rgba(240,237,234,0.6)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</label>
              <input
                type="email" name="email" onChange={handleChange} required
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#4F8EF7"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "rgba(240,237,234,0.6)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Password</label>
              <input
                type="password" name="password" onChange={handleChange} required
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#4F8EF7"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <button
              disabled={loading}
              style={{
                width: "100%", padding: "14px", background: loading ? "rgba(79,142,247,0.5)" : "#4F8EF7",
                border: "none", borderRadius: "10px", color: "#fff",
                fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "all 0.2s"
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff", borderRadius: "50%",
                    animation: "spin 0.7s linear infinite", display: "inline-block"
                  }} />
                  Signing in...
                </>
              ) : "Sign in"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "rgba(240,237,234,0.4)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#4F8EF7", fontWeight: "600", textDecoration: "none" }}>Create one</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 768px) { .left-panel { display: flex !important; } }
        input::placeholder { color: rgba(240,237,234,0.25); }
      `}</style>
    </div>
  );
}

export default Login;