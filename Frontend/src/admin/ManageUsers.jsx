import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../layouts/DashboardLayout";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data.data);
    } catch { alert("Failed to fetch users"); }
    finally { setLoading(false); }
  };

  const handleBlockUnblock = async (userId) => {
    try {
      const res = await axiosInstance.put(`/admin/users/${userId}/block`);
      alert(res.data.message);
      fetchUsers();
    } catch (error) { alert(error.response?.data?.message || "Failed"); }
  };

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (error) { alert(error.response?.data?.message || "Failed"); }
  };

  const roleConfig = {
    admin: { bg: "rgba(239,68,68,0.1)", color: "#F87171", border: "rgba(239,68,68,0.2)" },
    recruiter: { bg: "rgba(155,106,247,0.1)", color: "#9B6AF7", border: "rgba(155,106,247,0.2)" },
    candidate: { bg: "rgba(79,142,247,0.1)", color: "#4F8EF7", border: "rgba(79,142,247,0.2)" },
  };

  const filtered = users
    ?.filter(u => filter === "all" || u.role === filter)
    ?.filter(u => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())) ?? [];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 4px" }}>Manage Users</h1>
        <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.4)", margin: 0 }}>{users?.length || 0} registered users</p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text" placeholder="Search by name or email..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: "200px", padding: "9px 14px",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px", color: "#F0EDEA", fontSize: "14px", outline: "none", fontFamily: "inherit"
          }}
        />
        {["all", "candidate", "recruiter"].map(f => {
          const count = f === "all" ? users?.length ?? 0 : users?.filter(u => u.role === f).length ?? 0;
          const isActive = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "8px 16px", borderRadius: "8px", cursor: "pointer",
              fontSize: "13px", fontWeight: "500", fontFamily: "inherit",
              background: isActive ? "rgba(79,142,247,0.15)" : "rgba(255,255,255,0.04)",
              color: isActive ? "#4F8EF7" : "rgba(240,237,234,0.5)",
              border: isActive ? "1px solid rgba(79,142,247,0.3)" : "1px solid rgba(255,255,255,0.08)",
              textTransform: "capitalize"
            }}>
              {f} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <div style={{ width: "36px", height: "36px", border: "2px solid rgba(79,142,247,0.2)", borderTopColor: "#4F8EF7", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
      ) : (
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px", overflow: "hidden"
        }}>
          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 2fr 100px 80px 1fr 160px",
            padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)"
          }}>
            {["Name", "Email", "Role", "Status", "Joined", "Actions"].map(h => (
              <span key={h} style={{ fontSize: "11px", fontWeight: "600", color: "rgba(240,237,234,0.35)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "rgba(240,237,234,0.3)", fontSize: "14px" }}>
              No users found
            </div>
          ) : (
            filtered.map((user, i) => {
              const rc = roleConfig[user.role] || roleConfig.candidate;
              return (
                <div key={user._id} style={{
                  display: "grid", gridTemplateColumns: "2fr 2fr 100px 80px 1fr 160px",
                  padding: "14px 20px", alignItems: "center",
                  borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  transition: "background 0.15s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#F0EDEA", margin: 0 }}>{user.name}</p>
                    {user.company && <p style={{ fontSize: "12px", color: "rgba(240,237,234,0.35)", margin: "2px 0 0" }}>{user.company}</p>}
                  </div>
                  <span style={{ fontSize: "13px", color: "rgba(240,237,234,0.5)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "12px" }}>{user.email}</span>
                  <span style={{
                    fontSize: "11px", fontWeight: "600", padding: "3px ",
                    textTransform: "capitalize",  color: rc.color,
                    display: "inline-block"
                  }}>
                    {user.role}
                  </span>
                  <span style={{
                    fontSize: "11px", fontWeight: "600", padding: "3px 9px", display: "inline-block",
                    color: user.isBlocked ? "#F87171" : "#10B981"
                  }}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                  <p style={{ fontSize: "12px", color: "rgba(240,237,234,0.35)", margin: 0 }}>
                    {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleBlockUnblock(user._id)}
                      style={{
                        padding: "6px 12px", borderRadius: "7px", border: "none", cursor: "pointer",
                        fontSize: "12px", fontWeight: "600", fontFamily: "inherit",
                        background: user.isBlocked ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                        color: user.isBlocked ? "#10B981" : "#F59E0B"
                      }}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id, user.name)}
                      style={{
                        padding: "6px 12px", borderRadius: "7px", border: "none", cursor: "pointer",
                        fontSize: "12px", fontWeight: "600", fontFamily: "inherit",
                        background: "rgba(239,68,68,0.1)", color: "#F87171"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(240,237,234,0.2); }
      `}</style>
    </DashboardLayout>
  );
}

export default ManageUsers;