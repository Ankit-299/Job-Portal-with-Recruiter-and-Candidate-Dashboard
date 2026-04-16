function JobCard({ title, company, location, status, salary, onClick }) {
  const statusConfig = {
    Applied: { bg: "rgba(79,142,247,0.1)", color: "#4F8EF7", border: "rgba(79,142,247,0.2)" },
    Interview: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "rgba(245,158,11,0.2)" },
    Accepted: { bg: "rgba(16,185,129,0.1)", color: "#10B981", border: "rgba(16,185,129,0.2)" },
    Rejected: { bg: "rgba(239,68,68,0.1)", color: "#F87171", border: "rgba(239,68,68,0.2)" },
    Pending: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "rgba(245,158,11,0.2)" },
  };

  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <div
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "14px",
        padding: "20px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        transition: "all 0.2s",
        cursor: onClick ? "pointer" : "default"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(79,142,247,0.3)";
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
    >
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 6px" }}>
          {title}
        </h3>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.5)", margin: 0 }}>
            {company}
          </p>
          <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.35)", margin: 0 }}>
            📍 {location}
          </p>
          {salary && (
            <p style={{ fontSize: "13px", color: "#10B981", fontWeight: "600", margin: 0 }}>
              ₹{Number(salary).toLocaleString('en-IN')}
            </p>
          )}
        </div>
      </div>

      {status && (
        <span
          style={{
            padding: "6px 14px",
            borderRadius: "100px",
            fontSize: "12px",
            fontWeight: "600",
            background: config.bg,
            color: config.color,
            border: `1px solid ${config.border}`,
            whiteSpace: "nowrap",
            flexShrink: 0
          }}
        >
          {status}
        </span>
      )}
    </div>
  );
}

export default JobCard;