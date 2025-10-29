import { useEffect, useState } from "react";
import { getDashboardData, sendFeedback } from "./api.js";

import NewsSection from "./components/dashboard/NewsSection.jsx";
import PricesSection from "./components/dashboard/PricesSection.jsx";
import InsightSection from "./components/dashboard/InsightSection.jsx";
import MemeSection from "./components/dashboard/MemeSection.jsx";
import UserPrefsSection from "./components/dashboard/UserPrefsSection.jsx";

export default function Dashboard({ onLogout, setScreen }) {
  const [dashboard, setDashboard] = useState(null);
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [votedMap, setVotedMap] = useState({}); // {"section:itemId": "up"|"down"}
  const [errorMsg, setErrorMsg] = useState("");

  function voteKey(section, itemId) {
    return `${section}:${itemId}`;
  }

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErrorMsg("");

        const token = window.localStorage.getItem("token");
        if (!token) {
          setErrorMsg("No auth token found. Please log in again.");
          setLoading(false);
          return;
        }

        // Fetch all dashboard data from the server
        const data = await getDashboardData(token);
        // data = { user, prices, news, aiInsight, meme }

        // Load user preferences, prioritize data from server
        let prefsFromServer = data.user?.preferences;

        // If preferences are missing, try reading from localStorage
        if (
          (!prefsFromServer || Object.keys(prefsFromServer).length === 0) &&
          window.localStorage.getItem("userPreferences")
        ) {
          try {
            prefsFromServer = JSON.parse(
              window.localStorage.getItem("userPreferences")
            );
          } catch (err) {
            // Ignore JSON parse errors
          }
        }

        console.log({ user: data.user });

        // Save all returned data in dashboard state
        setDashboard({
          news: data.news || [],
          prices: data.prices || {},
          aiInsight: data.aiInsight || null,
          meme: data.meme || null,
          user: data.user || null,
        });

        // Save preferences for quick access
        setPrefs(prefsFromServer || null);

        // Cache username locally (used in dashboard header)
        if (data.user?.name) {
          window.localStorage.setItem("userName", data.user.name);
        }

        setUser(data.user);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setErrorMsg("Failed to load dashboard data.");
        setLoading(false);
      }
    }

    load();
  }, []);

  // Optimistic voting (updates UI immediately before server confirmation)
  async function handleVote(section, itemId, vote, userId) {
    const token = window.localStorage.getItem("token");
    const k = voteKey(section, itemId);
    const optimistic = vote === 1 ? "up" : "down";

    setVotedMap((m) => ({ ...m, [k]: optimistic }));

    try {
      await sendFeedback(token, { section, itemId, vote, userId });
      // Keep optimistic state
    } catch (err) {
      console.error("Failed to send feedback:", err);
      setVotedMap((m) => {
        const copy = { ...m };
        delete copy[k];
        return copy;
      });
      alert("Couldn't save your feedback. Please try again.");
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  const newsId = "news-1";
  const pricesId = "prices-1";
  const insightId = "insight-1";
  const memeId = "meme-1";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "24px",
        fontFamily: "sans-serif",
      }}
    >
      <button onClick={onLogout}>Log out</button>
      <button onClick={() => setScreen("onboarding")}>
        Back to onboarding
      </button>

      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto 24px",
          background: "linear-gradient(to right,#1a1a1a,#000)",
          border: "1px solid #333",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: "18px", fontWeight: 600 }}>
          👋 Hey{" "}
          {dashboard?.user?.name ||
            window.localStorage.getItem("userName") ||
            "friend"}{" "}
          — your personal crypto dashboard
        </div>

        <div
          style={{
            fontSize: "12px",
            opacity: 0.7,
            lineHeight: 1.4,
            maxWidth: "300px",
          }}
        >
          Each card below can receive a 👍 or 👎 so we can learn what you enjoy
          and improve future recommendations.
        </div>

        {errorMsg && (
          <div style={{ color: "#f55", fontSize: "12px", marginTop: "8px" }}>
            {errorMsg}
          </div>
        )}
      </div>

      {/* Preferences summary */}
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto 16px",
        }}
      >
        <UserPrefsSection prefs={prefs} />
      </div>

      {/* Cards layout */}
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "stretch",
          margin: "0 auto",
        }}
      >
        {/* News Section */}
        <NewsSection
          news={dashboard?.news || []}
          onUpvote={() => handleVote("news", newsId, 1, user.id)}
          onDownvote={() => handleVote("news", newsId, -1, user.id)}
          voted={votedMap[voteKey("news", newsId)] || null}
        />

        {/* Prices Section */}
        <PricesSection
          prices={dashboard?.prices || {}}
          prefs={prefs?.cryptoAssets}
          onUpvote={() => handleVote("prices", pricesId, 1, user.id)}
          onDownvote={() => handleVote("prices", pricesId, -1, user.id)}
          voted={votedMap[voteKey("prices", pricesId)] || null}
        />

        {/* AI Insight Section */}
        <InsightSection
          insight={dashboard?.aiInsight || null}
          onUpvote={() => handleVote("insight", insightId, 1, user.id)}
          onDownvote={() => handleVote("insight", insightId, -1, user.id)}
          voted={votedMap[voteKey("insight", insightId)] || null}
        />

        {/* Meme Section */}
        <MemeSection
          meme={dashboard?.meme || null}
          onUpvote={() => handleVote("meme", memeId, 1, user.id)}
          onDownvote={() => handleVote("meme", memeId, -1, user.id)}
          voted={votedMap[voteKey("meme", memeId)] || null}
        />
      </div>
    </div>
  );
}
