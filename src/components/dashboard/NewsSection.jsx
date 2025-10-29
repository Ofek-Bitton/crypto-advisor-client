// client/src/components/dashboard/NewsSection.jsx
import DashboardCard from "../DashboardCard";

export default function NewsSection({ news, onUpvote, onDownvote, voted }) {
  return (
    <DashboardCard
      title="Market News 📢"
      onUpvote={onUpvote}
      onDownvote={onDownvote}
      voted={voted}
    >
      {(!news || news.length === 0) && (
        <div style={{ fontSize: "13px", opacity: 0.7 }}>
          No personalized news for you right now.
        </div>
      )}

      {news &&
        news.map((item, idx) => (
          <div
            key={idx}
            style={{
              fontSize: "13px",
              lineHeight: "1.4",
              marginBottom: "12px",
              borderBottom: "1px solid #333",
              paddingBottom: "8px",
            }}
          >
            <div style={{ fontWeight: "600", marginBottom: "4px" }}>
              {item.title || "Untitled headline"}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              {item.summary || item.description || ""}
            </div>

            {item.url && (
              <a
                href={item.url}
                style={{
                  color: "#4fa3ff",
                  fontSize: "12px",
                  textDecoration: "underline",
                }}
                target="_blank"
                rel="noreferrer"
              >
                Read more
              </a>
            )}
          </div>
        ))}
    </DashboardCard>
  );
}
