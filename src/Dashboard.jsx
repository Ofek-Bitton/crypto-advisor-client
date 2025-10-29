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

  // current time state
  const [currentTime, setCurrentTime] = useState(() => new Date());

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

        // Pull user preferences from server first
        let prefsFromServer = data.user?.preferences;

        // If preferences are missing (for safety in dev), try from localStorage
        if (
          (!prefsFromServer || Object.keys(prefsFromServer).length === 0) &&
          window.localStorage.getItem("userPreferences")
        ) {
          try {
            prefsFromServer = JSON.parse(
              window.localStorage.getItem("userPreferences")
            );
          } catch (err) {
            // ignore JSON parse errors
          }
        }

        // Store dashboard data in state
        setDashboard({
          news: data.news || [],
          prices: data.prices || {},
          aiInsight: data.aiInsight || null,
          meme: data.meme || null,
          user: data.user || null,
        });

        // Save preferences separately
        setPrefs(prefsFromServer || null);

        // Cache username locally for header greeting
        if (data.user?.name) {
          window.localStorage.setItem("userName", data.user.name);
        }

        setUser(data.user || {});
        setLoading(false);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setErrorMsg("Failed to load dashboard data.");
        setLoading(false);
      }
    }

    load();
  }, []);

  // live clock updater (every 30s)
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(id);
  }, []);

  function formatTime(dateObj) {
    const optsDay = { weekday: "short", month: "short", day: "numeric" };
    const dayPart = dateObj.toLocaleDateString("en-US", optsDay);
    const year = dateObj.getFullYear();
    const hh = String(dateObj.getHours()).padStart(2, "0");
    const mm = String(dateObj.getMinutes()).padStart(2, "0");
    return `${dayPart} ${year} • ${hh}:${mm}`;
  }

  // Optimistic voting (instant UI update)
  async function handleVote(section, itemId, vote, userId) {
    const token = window.localStorage.getItem("token");
    const k = voteKey(section, itemId);
    const optimistic = vote === 1 ? "up" : "down";

    setVotedMap((m) => ({ ...m, [k]: optimistic }));

    try {
      await sendFeedback(token, { section, itemId, vote, userId });
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
          backgroundColor: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "1rem",
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

  // Styled logout button (glass / neon)
  const LogoutButton = (
    <button
      onClick={onLogout}
      style={{
        backgroundColor: "transparent",
        border: "1px solid rgba(255,255,255,0.2)",
        color: "#fff",
        padding: "8px 14px",
        borderRadius: "999px",
        fontSize: "0.8rem",
        fontWeight: "500",
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        cursor: "pointer",
        boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
        backdropFilter: "blur(6px)",
        backgroundImage:
          "radial-gradient(circle at 0% 0%, rgba(0, 255, 255, 0.15) 0%, rgba(0,0,0,0) 60%)",
        fontFamily: "Inter, system-ui, sans-serif",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = "1px solid rgba(0,255,255,0.5)";
        e.currentTarget.style.boxShadow =
          "0 10px 30px rgba(0,255,255,0.25), 0 0 40px rgba(0,255,255,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.2)";
        e.currentTarget.style.boxShadow =
          "0 8px 24px rgba(0,0,0,0.6), 0 0 0 rgba(0,0,0,0)";
      }}
    >
      <span>Log out</span>
      <span style={{ fontSize: "0.9rem" }}>⏻</span>
    </button>
  );

  // Button to go back to onboarding
  const BackToOnboardingButton = (
    <button
      onClick={() => setScreen("onboarding")}
      style={{
        backgroundColor: "transparent",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "rgba(255,255,255,0.6)",
        padding: "8px 12px",
        borderRadius: "8px",
        fontSize: "0.7rem",
        fontWeight: "500",
        lineHeight: 1,
        cursor: "pointer",
        boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
        fontFamily: "Inter, system-ui, sans-serif",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.4)";
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
        e.currentTarget.style.color = "rgba(255,255,255,0.6)";
      }}
    >
      Preferences
    </button>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        padding: "24px",
        fontFamily: "Inter, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* top bar */}
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* time + heading block */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "baseline",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 500,
                color: "rgba(111,255,233,0.9)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Your crypto command center
            </div>

            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 400,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1,
              }}
            >
              {formatTime(currentTime)}
            </div>
          </div>

          <div
            style={{
              fontSize: "1.4rem",
              fontWeight: 600,
              lineHeight: 1.25,
              backgroundImage:
                "linear-gradient(90deg,#ffffff 0%,#6fffe9 50%,#00b3ff 100%)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              textShadow: "0 30px 80px rgba(0,255,255,0.3)",
              maxWidth: "700px",
            }}
          >
            {`Welcome back, ${
              dashboard?.user?.name ||
              window.localStorage.getItem("userName") ||
              "trader"
            }.`}{" "}
            This is your live market feed, AI insights and signals – tuned to
            how you trade.
          </div>

          <div
            style={{
              fontSize: "0.8rem",
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.6)",
              maxWidth: "600px",
            }}
          >
            Every card below can get a 👍 or 👎. We learn from that and adapt
            what you see – price alerts, strategy notes, even memes. You train
            the feed.
          </div>

          {errorMsg && (
            <div
              style={{
                color: "#f55",
                fontSize: "0.75rem",
                lineHeight: 1.4,
                fontWeight: 500,
              }}
            >
              {errorMsg}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          {BackToOnboardingButton}
          {LogoutButton}
        </div>
      </div>

      {/* user prefs summary */}
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "0 0 16px 0",
        }}
      >
        <UserPrefsSection prefs={prefs} />
      </div>

      {/* dashboard cards layout (reordered) */}
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "stretch",
          margin: "0 auto 64px auto",
        }}
      >
        {/* Prices */}
        <PricesSection
          prices={dashboard?.prices || {}}
          prefs={prefs?.cryptoAssets}
          onUpvote={() => handleVote("prices", pricesId, 1, user.id)}
          onDownvote={() => handleVote("prices", pricesId, -1, user.id)}
          voted={votedMap[voteKey("prices", pricesId)] || null}
        />

        {/* AI insight */}
        <InsightSection
          insight={dashboard?.aiInsight || null}
          onUpvote={() => handleVote("insight", insightId, 1, user.id)}
          onDownvote={() => handleVote("insight", insightId, -1, user.id)}
          voted={votedMap[voteKey("insight", insightId)] || null}
        />

        {/* Meme */}
        <MemeSection
          meme={dashboard?.meme || null}
          onUpvote={() => handleVote("meme", memeId, 1, user.id)}
          onDownvote={() => handleVote("meme", memeId, -1, user.id)}
          voted={votedMap[voteKey("meme", memeId)] || null}
        />

        {/* News */}
        <NewsSection
          news={dashboard?.news || []}
          onUpvote={() => handleVote("news", newsId, 1, user.id)}
          onDownvote={() => handleVote("news", newsId, -1, user.id)}
          voted={votedMap[voteKey("news", newsId)] || null}
        />
      </div>
    </div>
  );
}
