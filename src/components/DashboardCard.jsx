// client/src/components/DashboardCard.jsx

export default function DashboardCard({
  title,
  children,
  onUpvote,
  onDownvote,
  voted, // "up" | "down" | null
}) {
  const upActive = voted === "up";
  const downActive = voted === "down";
  const disabled = Boolean(voted);

  return (
    <div
      style={{
        flex: "1 1 300px",
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
        minWidth: "280px",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header row with title + vote buttons */}
      <div
        style={{
          borderBottom: "1px solid #333",
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: 1.3,
            maxWidth: "75%",
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={onUpvote}
            disabled={disabled}
            style={{
              border: "1px solid #2f2",
              background: upActive ? "#173a17" : "transparent",
              color: upActive ? "#bfb" : "#2f2",
              borderRadius: "6px",
              fontSize: "13px",
              padding: "4px 8px",
              cursor: disabled ? "default" : "pointer",
              opacity: disabled && !upActive ? 0.5 : 1,
            }}
          >
            👍
          </button>

          <button
            onClick={onDownvote}
            disabled={disabled}
            style={{
              border: "1px solid #b33",
              background: downActive ? "#3a1717" : "transparent",
              color: downActive ? "#fbb" : "#b33",
              borderRadius: "6px",
              fontSize: "13px",
              padding: "4px 8px",
              opacity: disabled && !downActive ? 0.5 : 1,
              cursor: disabled ? "default" : "pointer",
            }}
          >
            👎
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px" }}>{children}</div>
    </div>
  );
}
