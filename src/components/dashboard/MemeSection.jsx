import DashboardCard from "../DashboardCard";

export default function MemeSection({ meme, onUpvote, onDownvote, voted }) {
  console.log({ meme, onUpvote, onDownvote, voted})
  return (
    <DashboardCard
      title="Crypto Meme of the Day 🤡"
      onUpvote={onUpvote}
      onDownvote={onDownvote}
      voted={voted}
    >
      <div style={{ fontSize: "13px", marginBottom: "8px" }}>
        {meme?.title || "HODL like a pro"}
      </div>
      {meme?.url && (
        <div
          style={{
            width: "100%",
            maxWidth: "300px",
            maxHeight: "300px",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #444",
            background: "#000",
          }}
        >
          <img
            src={meme.url}
            alt="crypto meme"
            style={{ display: "block", width: "100%", objectFit: "cover" }}
          />
        </div>
      )}
    </DashboardCard>
  );
}
