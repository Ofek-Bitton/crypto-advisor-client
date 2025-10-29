import { useState, useEffect } from "react";
import { savePreferences } from "./api";

export default function Onboarding({ onFinish, onLogout }) {
  // coins selection
  const [assets, setAssets] = useState({
    BTC: false,
    ETH: false,
    SOL: false,
    DOGE: false,
  });

  // "low" / "medium" / "high"
  const [risk, setRisk] = useState("");

  // content types selection
  const [contentTypes, setContentTypes] = useState({
    news: false,
    education: false,
    signals: false,
  });

  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  //
  // preload previous preferences from localStorage (if they exist)
  //
  useEffect(() => {
    try {
      const raw = localStorage.getItem("userPreferences");
      if (!raw) return;

      const prefs = JSON.parse(raw);
      // prefs is expected to look like:
      // {
      //   cryptoAssets: ["BTC","ETH"],
      //   investorType: "medium",
      //   contentTypes: ["news","education"]
      // }

      // 1. init assets checkboxes
      if (Array.isArray(prefs.cryptoAssets)) {
        setAssets({
          BTC: prefs.cryptoAssets.includes("BTC"),
          ETH: prefs.cryptoAssets.includes("ETH"),
          SOL: prefs.cryptoAssets.includes("SOL"),
          DOGE: prefs.cryptoAssets.includes("DOGE"),
        });
      }

      // 2. init risk radio
      if (prefs.investorType) {
        setRisk(prefs.investorType); // "low" / "medium" / "high"
      }

      // 3. init contentTypes checkboxes
      if (Array.isArray(prefs.contentTypes)) {
        setContentTypes({
          news: prefs.contentTypes.includes("news"),
          education: prefs.contentTypes.includes("education"),
          signals: prefs.contentTypes.includes("signals"),
        });
      }
    } catch (err) {
      console.warn("[Onboarding] failed to preload prefs:", err);
    }
  }, []);

  function toggleAsset(symbol) {
    setAssets((prev) => ({ ...prev, [symbol]: !prev[symbol] }));
  }

  function toggleContent(key) {
    setContentTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSaved(false);

    const token = window.localStorage.getItem("token");

    const chosenAssets = Object.keys(assets).filter((k) => assets[k]);
    const chosenContent = Object.keys(contentTypes).filter(
      (k) => contentTypes[k]
    );

    const prefs = {
      cryptoAssets: chosenAssets,
      investorType: risk,
      contentTypes: chosenContent,
    };

    try {
      const result = await savePreferences(token, prefs);

      if (!result.ok) {
        throw new Error(result.data?.msg || "Failed to save preferences");
      }

      // mark completed locally
      window.localStorage.setItem("hasPrefs", "true");
      setSaved(true);

      // move to dashboard
      onFinish && onFinish();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to save preferences");
    }
  }

  // styled header buttons
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

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
        width: "100%",
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
          maxWidth: "900px",
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "24px",
        }}
      >
        {LogoutButton}
      </div>

      {/* headline section */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          textAlign: "center",
          marginBottom: "32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
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
          Setup your trading DNA
        </div>

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 600,
            margin: 0,
            lineHeight: 1.2,
            backgroundImage:
              "linear-gradient(90deg,#ffffff 0%,#6fffe9 50%,#00b3ff 100%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textShadow: "0 30px 80px rgba(0,255,255,0.3)",
            maxWidth: "700px",
          }}
        >
          Personalize your crypto feed.
        </h1>

        <p
          style={{
            fontSize: "1rem",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.6)",
            maxWidth: "560px",
            margin: 0,
          }}
        >
          Tell us what you trade and how you think, and we’ll build a live
          dashboard just for you – curated market moves, tailored alerts,
          smarter AI insights. You get signal, not noise. ✦
        </p>

        {errorMsg && (
          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              fontWeight: 500,
              lineHeight: 1.4,
              color: "#f55",
            }}
          >
            {errorMsg}
          </p>
        )}

        {saved && (
          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              fontWeight: 500,
              lineHeight: 1.4,
              color: "rgb(0,255,170)",
            }}
          >
            Saved. Redirecting to your dashboard...
          </p>
        )}
      </div>

      {/* preferences card */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "rgba(20,20,20,0.6)",
          border: "1px solid rgba(111,255,233,0.25)",
          borderRadius: "12px",
          padding: "24px",
          boxShadow:
            "0 30px 120px rgba(0,0,0,0.9), 0 0 80px rgba(0,255,255,0.15)",
          backdropFilter: "blur(8px)",
          fontSize: "14px",
          lineHeight: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* crypto assets */}
        <div>
          <h3
            style={{
              margin: "0 0 8px 0",
              fontSize: "15px",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Which coins are you into?
          </h3>

          {Object.keys(assets).map((coin) => (
            <label
              key={coin}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                cursor: "pointer",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 400,
              }}
            >
              <input
                type="checkbox"
                checked={assets[coin]}
                onChange={() => toggleAsset(coin)}
                style={{
                  accentColor: "#00e0ff",
                  cursor: "pointer",
                }}
              />
              <span>{coin}</span>
            </label>
          ))}
        </div>

        {/* investor profile */}
        <div>
          <h3
            style={{
              margin: "0 0 8px 0",
              fontSize: "15px",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            What's your trading style?
          </h3>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              cursor: "pointer",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: 1.4,
            }}
          >
            <input
              type="radio"
              name="risk"
              value="low"
              checked={risk === "low"}
              onChange={() => setRisk("low")}
              style={{
                accentColor: "#00e0ff",
                cursor: "pointer",
              }}
            />
            <span>
              Conservative{" "}
              <span
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 400,
                }}
              >
                (low risk)
              </span>
            </span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              cursor: "pointer",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: 1.4,
            }}
          >
            <input
              type="radio"
              name="risk"
              value="medium"
              checked={risk === "medium"}
              onChange={() => setRisk("medium")}
              style={{
                accentColor: "#00e0ff",
                cursor: "pointer",
              }}
            />
            <span>
              Balanced{" "}
              <span
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 400,
                }}
              >
                (medium risk)
              </span>
            </span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              cursor: "pointer",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: 1.4,
            }}
          >
            <input
              type="radio"
              name="risk"
              value="high"
              checked={risk === "high"}
              onChange={() => setRisk("high")}
              style={{
                accentColor: "#00e0ff",
                cursor: "pointer",
              }}
            />
            <span>
              Aggressive{" "}
              <span
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 400,
                }}
              >
                (degen mode 🚀)
              </span>
            </span>
          </label>
        </div>

        {/* content preferences */}
        <div>
          <h3
            style={{
              margin: "0 0 8px 0",
              fontSize: "15px",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            What do you actually want to get from us?
          </h3>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              cursor: "pointer",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 400,
            }}
          >
            <input
              type="checkbox"
              checked={contentTypes.news}
              onChange={() => toggleContent("news")}
              style={{
                accentColor: "#00e0ff",
                cursor: "pointer",
              }}
            />
            <span>Market news / live updates</span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              cursor: "pointer",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 400,
            }}
          >
            <input
              type="checkbox"
              checked={contentTypes.education}
              onChange={() => toggleContent("education")}
              style={{
                accentColor: "#00e0ff",
                cursor: "pointer",
              }}
            />
            <span>Learning / smart explanations</span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              cursor: "pointer",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 400,
            }}
          >
            <input
              type="checkbox"
              checked={contentTypes.signals}
              onChange={() => toggleContent("signals")}
              style={{
                accentColor: "#00e0ff",
                cursor: "pointer",
              }}
            />
            <span>Technical analysis / signals</span>
          </label>
        </div>

        {/* submit CTA */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px 16px",
            background:
              "linear-gradient(90deg, #0066ff 0%, #00e0ff 100%)",
            color: "#fff",
            border: "0",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600",
            fontFamily: "Inter, system-ui, sans-serif",
            boxShadow:
              "0 20px 60px rgba(0,102,255,0.4), 0 0 80px rgba(0,224,255,0.4)",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 24px 72px rgba(0,224,255,0.6), 0 0 100px rgba(0,224,255,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 20px 60px rgba(0,102,255,0.4), 0 0 80px rgba(0,224,255,0.4)";
          }}
        >
          Save and continue 🚀
        </button>
      </form>
    </div>
  );
}
