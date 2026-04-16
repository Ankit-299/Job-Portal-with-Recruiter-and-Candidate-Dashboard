import { useLocation, useNavigate } from "react-router-dom";
import { Home, Briefcase, User, LogOut, Users, Settings, ChevronRight, Bell, Search, BarChart3 } from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const menu =
    user?.role === "admin"
      ? [
          { name: "Dashboard", path: "/admin", icon: <Home size={16} /> },
          { name: "Manage Users", path: "/admin/users", icon: <Users size={16} /> },
          { name: "Manage Jobs", path: "/admin/jobs", icon: <Briefcase size={16} /> },
          { name: "Verify Recruiters", path: "/admin/recruiters", icon: <Settings size={16} /> },
          { name: "Analytics", path: "/admin/analytics", icon: <BarChart3 size={16} /> },
        ]
      : user?.role === "recruiter"
      ? [
          { name: "Dashboard", path: "/recruiter", icon: <Home size={16} /> },
          { name: "Post a Job", path: "/create-job", icon: <Briefcase size={16} /> },
          { name: "My Jobs", path: "/my-jobs", icon: <Briefcase size={16} /> },
          { name: "Notifications", path: "/notifications", icon: <Bell size={16} /> },
          { name: "Profile", path: "/profile", icon: <User size={16} /> },
        ]
      : [
          { name: "Dashboard", path: "/dashboard", icon: <Home size={16} /> },
          { name: "Browse Jobs", path: "/browse-jobs", icon: <Search size={16} /> },
          { name: "My Applications", path: "/applications", icon: <Briefcase size={16} /> },
          { name: "Notifications", path: "/notifications", icon: <Bell size={16} /> },
          { name: "Profile", path: "/profile", icon: <User size={16} /> },
        ];

  const handleLogout = () => {
    if (window.confirm("Log out of CareerPath?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const roleColors = { admin: "#F59E0B", recruiter: "#9B6AF7", candidate: "#4F8EF7" };
  const roleColor = roleColors[user?.role] || "#4F8EF7";

  return (
    <div style={{
      width: "240px", minHeight: "100vh",
      background: "#0D0D14",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      flexShrink: 0
    }}>
      {/* Logo */}
      <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #4F8EF7, #7C3AED)", borderRadius: "6px", flexShrink: 0 }} />
          <span style={{ fontSize: "16px", fontWeight: "700", color: "#F0EDEA" }}>
            Career<span style={{ color: "#4F8EF7" }}>Path</span>
          </span>
        </div>
      </div>

      {/* User badge */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
            background: `${roleColor}20`, border: `1px solid ${roleColor}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", fontWeight: "700", color: roleColor
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#F0EDEA", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.name || "User"}
            </div>
            <div style={{
              fontSize: "11px", fontWeight: "600", textTransform: "capitalize",
              color: roleColor, background: `${roleColor}15`, padding: "1px 8px",
              borderRadius: "100px", display: "inline-block", marginTop: "2px"
            }}>
              {user?.role || "user"}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        <p style={{ fontSize: "11px", fontWeight: "600", color: "rgba(240,237,234,0.25)", textTransform: "uppercase", letterSpacing: "1px", padding: "0 8px", marginBottom: "8px" }}>
          Menu
        </p>
        {menu.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: "10px", padding: "10px 12px", borderRadius: "8px",
                cursor: "pointer", marginBottom: "2px", transition: "all 0.15s",
                background: isActive ? "rgba(79,142,247,0.12)" : "transparent",
                border: isActive ? "1px solid rgba(79,142,247,0.2)" : "1px solid transparent",
                color: isActive ? "#4F8EF7" : "rgba(240,237,234,0.55)"
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                <span style={{ fontSize: "14px", fontWeight: isActive ? "600" : "400" }}>{item.name}</span>
              </div>
              {isActive && <ChevronRight size={12} />}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 12px", borderRadius: "8px", cursor: "pointer",
            background: "transparent", border: "1px solid rgba(255,255,255,0.07)",
            color: "rgba(240,237,234,0.5)", fontSize: "14px", fontFamily: "inherit",
            transition: "all 0.15s"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#F87171"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(240,237,234,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
        >
          <LogOut size={15} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;