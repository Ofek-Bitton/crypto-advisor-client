export default function UserPrefsSection({ prefs }) {
  if (!prefs) return null;

  return (
    <div
      style={{
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
        color: "#fff",
        padding: "16px",
        fontSize: "13px",
        lineHeight: 1.5,
      }}
    >
      <div
        style={{
          color: "#fff",
          fontWeight: 600,
          fontSize: "14px",
          marginBottom: "8px",
        }}
      >
        Your profile
      </div>

      <div style={{ marginBottom: "4px" }}>
        <span style={{ color: "#aaa", fontWeight: 600 }}>Investor type: </span>
        <span style={{ color: "#fff" }}>
          {prefs.investorType || "Not selected yet"}
        </span>
      </div>

      <div style={{ marginBottom: "4px" }}>
        <span style={{ color: "#aaa", fontWeight: 600 }}>Favorite assets: </span>
        <span style={{ color: "#fff" }}>
          {prefs.cryptoAssets && prefs.cryptoAssets.length > 0
            ? prefs.cryptoAssets.join(", ")
            : "None selected"}
        </span>
      </div>

      <div>
        <span style={{ color: "#aaa", fontWeight: 600 }}>
          Content you want to see:{" "}
        </span>
        <span style={{ color: "#fff" }}>
          {prefs.contentTypes && prefs.contentTypes.length > 0
            ? prefs.contentTypes.join(", ")
            : "Not selected yet"}
        </span>
      </div>
    </div>
  );
}
