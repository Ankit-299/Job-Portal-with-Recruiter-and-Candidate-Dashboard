import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import axiosInstance from "../api/axiosInstance";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [user, setUser] = useState(storedUser);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch latest user data from backend
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      const userData = response.data.data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const response = await axiosInstance.put("/auth/profile", user);
      const updatedUser = response.data.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  const roleColor = { admin: "#F59E0B", recruiter: "#9B6AF7", candidate: "#4F8EF7" }[user?.role] || "#4F8EF7";

  const inputStyle = {
    padding: "9px 12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "7px",
    color: "#F0EDEA", fontSize: "14px", outline: "none",
    fontFamily: "inherit", transition: "border-color 0.2s", width: "220px"
  };

  const Section = ({ title, children, accent = "#4F8EF7" }) => (
    <div style={{ marginBottom: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <div style={{ width: "3px", height: "16px", background: accent, borderRadius: "2px" }} />
        <h2 style={{ fontSize: "14px", fontWeight: "600", color: accent, margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
        {children}
      </div>
    </div>
  );

  const Field = ({ label, value, name, edit, onChange, readOnly, type = "text" }) => (
    <div>
      <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>{label}</p>
      {edit && !readOnly ? (
        <input
          name={name} value={value || ""} onChange={onChange} type={type}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = "#4F8EF7"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
        />
      ) : (
        <p style={{ fontSize: "14px", color: value ? "#F0EDEA" : "rgba(240,237,234,0.25)", margin: 0, fontWeight: "500" }}>
          {value || "Not set"}
        </p>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <div style={{ 
            width: "40px", 
            height: "40px", 
            border: "3px solid rgba(79,142,247,0.2)", 
            borderTopColor: "#4F8EF7", 
            borderRadius: "50%", 
            animation: "spin 1s linear infinite" 
          }} />
        </div>
      ) : (
        <>
      {/* Profile Header */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px", padding: "28px 32px", marginBottom: "24px",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px",
        flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "14px", flexShrink: 0,
            background: `${roleColor}20`, border: `1.5px solid ${roleColor}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", fontWeight: "700", color: roleColor
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 4px" }}>{user?.name || "User"}</h1>
            <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.45)", margin: "0 0 6px" }}>{user?.email}</p>
            <span style={{
              fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "100px",
              background: `${roleColor}15`, color: roleColor, border: `1px solid ${roleColor}25`,
              textTransform: "capitalize"
            }}>
              {user?.role || "user"}
            </span>
            {user?.role === "recruiter" && (
              <span style={{
                marginLeft: "8px", fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "100px",
                background: user?.isVerified ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                color: user?.isVerified ? "#10B981" : "#F59E0B",
                border: `1px solid ${user?.isVerified ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}`
              }}>
                {user?.isVerified ? "Verified" : "Pending verification"}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => editMode ? handleSave() : setEditMode(true)}
          style={{
            padding: "10px 22px", borderRadius: "9px",
            background: editMode ? "#4F8EF7" : "transparent",
            border: editMode ? "none" : "1px solid rgba(255,255,255,0.12)",
            color: editMode ? "#fff" : "rgba(240,237,234,0.7)",
            cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "inherit",
            transition: "all 0.2s"
          }}
        >
          {editMode ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {editMode && (
        <button
          onClick={() => setEditMode(false)}
          style={{
            marginBottom: "16px", background: "transparent", border: "none",
            color: "rgba(240,237,234,0.4)", cursor: "pointer", fontSize: "13px", fontFamily: "inherit"
          }}
        >
          ← Cancel editing
        </button>
      )}

      {/* Profile Content */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px", padding: "32px"
      }}>
        <Section title="Basic Info">
          <Field label="Full Name" value={user?.name} name="name" edit={editMode} onChange={handleChange} />
          <Field label="Email" value={user?.email} name="email" edit={editMode} onChange={handleChange} />
          <Field label="Phone" value={user?.phone} name="phone" edit={editMode} onChange={handleChange} />
          <Field label="Location" value={user?.location} name="location" edit={editMode} onChange={handleChange} />
          <Field label="Role" value={user?.role} readOnly />
        </Section>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "28px" }} />

        <Section title="About">
          <div style={{ gridColumn: "1 / -1" }}>
            <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>Bio</p>
            {editMode ? (
              <textarea
                name="bio" value={user?.bio || ""} onChange={handleChange} rows="3"
                style={{ ...inputStyle, width: "100%", boxSizing: "border-box", resize: "vertical" }}
                onFocus={e => e.target.style.borderColor = "#4F8EF7"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
              />
            ) : (
              <p style={{ fontSize: "14px", color: user?.bio ? "#F0EDEA" : "rgba(240,237,234,0.25)", margin: 0 }}>
                {user?.bio || "No bio added yet."}
              </p>
            )}
          </div>
        </Section>

        {user?.role === "candidate" && (
          <>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "28px" }} />
            <Section title="Professional" accent="#10B981">
              <Field label="Skills" value={user?.skills} name="skills" edit={editMode} onChange={handleChange} />
              <Field label="Experience" value={user?.experience} name="experience" edit={editMode} onChange={handleChange} />
              <div>
                <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>Resume</p>
                {user?.resume ? (
                  <a href={user.resume} target="_blank" rel="noreferrer" style={{ color: "#4F8EF7", fontSize: "14px", fontWeight: "500" }}>
                    View Resume →
                  </a>
                ) : (
                  <p style={{ color: "rgba(240,237,234,0.25)", fontSize: "14px", margin: 0 }}>Not uploaded</p>
                )}
              </div>
            </Section>
          </>
        )}

        {user?.role === "recruiter" && (
          <>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "28px" }} />
            <Section title="Company" accent="#9B6AF7">
              <Field label="Company Name" value={user?.company} name="company" edit={editMode} onChange={handleChange} />
              <Field label="Website" value={user?.companyWebsite} name="companyWebsite" edit={editMode} onChange={handleChange} />
              <div>
                <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>Verification Proof</p>
                {user?.companyProof ? (
                  <a href={user.companyProof} target="_blank" rel="noreferrer" style={{ color: "#4F8EF7", fontSize: "14px", fontWeight: "500" }}>
                    View Document →
                  </a>
                ) : (
                  <p style={{ color: "rgba(240,237,234,0.25)", fontSize: "14px", margin: 0 }}>Not uploaded</p>
                )}
              </div>
            </Section>
          </>
        )}
      </div>
      <style>{`input::placeholder, textarea::placeholder { color: rgba(240,237,234,0.2); }`}</style>
        </>
      )}
    </DashboardLayout>
  );
}

export default Profile;