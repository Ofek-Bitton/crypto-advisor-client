import { useState } from "react";
import { savePreferences } from "./api";

export default function Onboarding({ onFinish, onLogout }) {


  const [assets, setAssets] = useState({
    BTC:false,
    ETH: false,
    SOL: false,
    DOGE: false,
  });
  // "low" / "medium" / "high"
  const [risk, setRisk] = useState("");

  const [contentTypes, setContentTypes] = useState({
    news: false,
    education: false,
    signals: false,
  });

  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

      // mark completed
      window.localStorage.setItem("hasPrefs", "true");
      setSaved(true);

      // move to dashboard
      onFinish && onFinish();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to save preferences");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        // alignItems: "flex-start",
        flexDirection: 'column',
        justifyContent: "center",
        fontFamily: "sans-serif",
        paddingTop: "32px",
        alignItems: 'center'
      }}
    >
      <button onClick={onLogout}>Log out</button>
      <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "8px", paddingBottom: '8px' }}>
        Personalize your crypto experience
      </h1>
      <p style={{ color: "#444", fontSize: "15px", marginBottom: "16px" , paddingBottom: '8px' }}>
        Let's get to know you so we can send alerts and recommendations that
        match your style 😉
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "380px",
          maxWidth: "90vw",
          background: "#000",
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          fontSize: "14px",
          lineHeight: 1.5,
        }}
      >
        {/* Crypto assets */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "8px", fontSize: "15px" }}>
            Which coins are you interested in?
          </h3>

          {Object.keys(assets).map((coin) => (
            <label
              key={coin}
              style={{
                display: "block",
                marginBottom: "6px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={assets[coin]}
                onChange={() => toggleAsset(coin)}
                style={{ marginLeft: "8px" }}
              />
              {coin}
            </label>
          ))}
        </div>

        {/* Investor profile */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "8px", fontSize: "15px" }}>
            What type of investor are you?
          </h3>

          <label style={{ display: "block", marginBottom: "6px" }}>
            <input
              type="radio"
              name="risk"
              value="low"
              checked={risk === "low"}
              onChange={() => setRisk("low")}
              style={{ marginLeft: "8px" }}
            />
            Conservative (low risk)
          </label>

          <label style={{ display: "block", marginBottom: "6px" }}>
            <input
              type="radio"
              name="risk"
              value="medium"
              checked={risk === "medium"}
              onChange={() => setRisk("medium")}
              style={{ marginLeft: "8px" }}
            />
            Balanced (medium risk)
          </label>

          <label style={{ display: "block", marginBottom: "6px" }}>
            <input
              type="radio"
              name="risk"
              value="high"
              checked={risk === "high"}
              onChange={() => setRisk("high")}
              style={{ marginLeft: "8px" }}
            />
            Aggressive (degen mode 🚀)
          </label>
        </div>

        {/* Content preferences */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "8px", fontSize: "15px" }}>
            What kind of content do you want to receive?
          </h3>

          <label style={{ display: "block", marginBottom: "6px" }}>
            <input
              type="checkbox"
              checked={contentTypes.news}
              onChange={() => toggleContent("news")}
              style={{ marginLeft: "8px" }}
            />
            Market news / live updates
          </label>

          <label style={{ display: "block", marginBottom: "6px" }}>
            <input
              type="checkbox"
              checked={contentTypes.education}
              onChange={() => toggleContent("education")}
              style={{ marginLeft: "8px" }}
            />
            Learning / smart explanations
          </label>

          <label style={{ display: "block", marginBottom: "6px" }}>
            <input
              type="checkbox"
              checked={contentTypes.signals}
              onChange={() => toggleContent("signals")}
              style={{ marginLeft: "8px" }}
            />
            Technical analysis / signals
          </label>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Save and continue
        </button>

        {saved && (
          <p
            style={{
              color: "green",
              marginTop: "12px",
              textAlign: "center",
            }}
          >
            Saved! Taking you to your dashboard...
          </p>
        )}

        {errorMsg && (
          <p
            style={{
              color: "red",
              marginTop: "12px",
              textAlign: "center",
            }}
          >
            {errorMsg}
          </p>
        )}
      </form>
    </div>
  );
}
