export function StatsCard({ title, value, icon, accent = "#4F8EF7", trend }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "14px",
      padding: "20px 24px",
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.2s"
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = `${accent}30`}
    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: accent, opacity: 0.7
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <span style={{ fontSize: "12px", color: "rgba(240,237,234,0.45)", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</span>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: `${accent}15`, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "14px"
        }}>
          {icon}
        </div>
      </div>

      <div style={{ fontSize: "32px", fontWeight: "700", color: "#F0EDEA", letterSpacing: "-1px" }}>
        {value}
      </div>

      {trend && (
        <div style={{ marginTop: "8px", fontSize: "12px", color: "rgba(240,237,234,0.35)" }}>
          {trend}
        </div>
      )}
    </div>
  );
}

export function JobCard({ title, company, location, status }) {
  const statusMap = {
    Applied: { bg: "rgba(79,142,247,0.1)", color: "#4F8EF7", border: "rgba(79,142,247,0.2)" },
    Interview: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "rgba(245,158,11,0.2)" },
    Rejected: { bg: "rgba(239,68,68,0.1)", color: "#F87171", border: "rgba(239,68,68,0.2)" },
  };
  const s = statusMap[status] || statusMap.Applied;

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "12px", padding: "16px 20px",
      display: "flex", justifyContent: "space-between", alignItems: "center"
    }}>
      <div>
        <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#F0EDEA", margin: 0 }}>{title}</h3>
        <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.45)", margin: "4px 0 0" }}>{company} · {location}</p>
      </div>
      <span style={{
        fontSize: "12px", fontWeight: "600", padding: "4px 12px",
        borderRadius: "100px", background: s.bg, color: s.color,
        border: `1px solid ${s.border}`
      }}>
        {status}
      </span>
    </div>
  );
}

export default StatsCard;