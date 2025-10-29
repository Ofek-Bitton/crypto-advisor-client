import DashboardCard from "../DashboardCard";

export default function InsightSection({ insight, onUpvote, onDownvote, voted }) {
  return (
    <DashboardCard
      title="AI Insight of the Day 🤖"
      onUpvote={onUpvote}
      onDownvote={onDownvote}
      voted={voted}
    >
      <div
        style={{
          fontSize: "13px",
          lineHeight: "1.4",
          marginBottom: "8px",
          whiteSpace: "pre-line",
        }}
      >
        {insight?.text || "No AI insight available right now."}
      </div>
      <div
        style={{
          fontSize: "11px",
          color: "#aaa",
          background: "#2a2a2a",
          display: "inline-block",
          padding: "4px 6px",
          borderRadius: "6px",
        }}
      >
        sentiment: {insight?.sentiment || "n/a"}
      </div>
    </DashboardCard>
  );
}
