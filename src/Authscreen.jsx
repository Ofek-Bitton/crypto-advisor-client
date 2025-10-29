import { useState } from "react";
import { login, signup } from "./api";

function AuthScreen({ onLoggedIn }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [name, setName] = useState(""); // only for signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      let result;
      if (mode === "signup") {
        result = await signup({ name, email, password });
      } else {
        result = await login({ email, password });
      }

      console.log("AUTH RESULT >>>", result);

      // Try to normalize the shape we got back.
      // We support:
      // 1) { ok, token, user }
      // 2) { ok, data: { token, user } }
      // 3) { token, user } (no ok)
      const okFlag =
        result.ok === true ||
        result.success === true ||
        (result.token && result.user);

      if (!okFlag) {
        throw new Error(
          result?.data?.msg ||
            result?.msg ||
            "Authentication failed"
        );
      }

      const token =
        result.token ||
        result?.data?.token ||
        "";
      const user =
        result.user ||
        result?.data?.user ||
        {};

      if (!token) {
        throw new Error("No token returned from server");
      }

      // persist auth locally
      localStorage.setItem("token", token);
      localStorage.setItem("userName", user?.name || "");
      localStorage.setItem(
        "hasPrefs",
        user?.preferences ? "true" : "false"
      );

      // tell parent we're logged in
      onLoggedIn({
        token,
        name: user?.name || "",
        hasPrefs: Boolean(user?.preferences),
      });
    } catch (error) {
      console.error("AUTH ERROR >>>", error);
      setErr(error.message || "Login / signup error");
    }
  };

  // styled neon card UI
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(0,255,255,0.07) 0%, rgba(0,0,0,0) 60%), radial-gradient(circle at 80% 30%, rgba(0,102,255,0.12) 0%, rgba(0,0,0,0) 60%)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          backgroundColor: "rgba(20,20,20,0.6)",
          border: "1px solid rgba(111,255,233,0.25)",
          borderRadius: "12px",
          padding: "24px",
          boxShadow:
            "0 40px 140px rgba(0,0,0,0.9), 0 0 80px rgba(0,255,255,0.15)",
          backdropFilter: "blur(8px)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            fontWeight: 500,
            color: "rgba(111,255,233,0.9)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          {mode === "signup"
            ? "Early access onboarding"
            : "Welcome back, trader"}
        </div>

        <div
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.3,
            backgroundImage:
              "linear-gradient(90deg,#ffffff 0%,#6fffe9 50%,#00b3ff 100%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textShadow: "0 30px 80px rgba(0,255,255,0.3)",
          }}
        >
          {mode === "signup" ? "Create your account" : "Log in to your feed"}
        </div>

        <div
          style={{
            fontSize: "0.8rem",
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {mode === "signup"
            ? "Get AI-driven crypto insights, custom alerts and smarter signals built around how you trade."
            : "Secure access to your personal crypto dashboard: live market intel, alerts and AI calls."}
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "8px",
          }}
        >
          {mode === "signup" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "#fff",
                }}
              >
                Full Name
              </label>
              <input
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontFamily: "Inter, system-ui, sans-serif",
                  outline: "none",
                  boxShadow:
                    "0 0 20px rgba(0,255,255,0.08), 0 0 60px rgba(0,224,255,0.08)",
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "#fff",
              }}
            >
              Email
            </label>
            <input
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.15)",
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "#fff",
                fontSize: "0.9rem",
                fontFamily: "Inter, system-ui, sans-serif",
                outline: "none",
                boxShadow:
                  "0 0 20px rgba(0,255,255,0.08), 0 0 60px rgba(0,224,255,0.08)",
              }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "#fff",
              }}
            >
              Password
            </label>
            <input
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.15)",
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "#fff",
                fontSize: "0.9rem",
                fontFamily: "Inter, system-ui, sans-serif",
                outline: "none",
                boxShadow:
                  "0 0 20px rgba(0,255,255,0.08), 0 0 60px rgba(0,224,255,0.08)",
              }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          {err && (
            <div
              style={{
                background:
                  "radial-gradient(circle at 0% 0%, rgba(255,0,64,0.22) 0%, rgba(0,0,0,0) 70%)",
                border: "1px solid rgba(255,0,64,0.4)",
                color: "#ff9fae",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: 500,
                lineHeight: 1.4,
                padding: "10px 12px",
                textAlign: "center",
              }}
            >
              {err}
            </div>
          )}

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
            {mode === "signup" ? "Sign up" : "Log in"}
          </button>
        </form>

        <div
          style={{
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            marginTop: "8px",
            lineHeight: 1.4,
          }}
        >
          {mode === "signup"
            ? "Already have an account?"
            : "Don’t have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            style={{
              background: "transparent",
              border: "none",
              color: "#6fffe9",
              cursor: "pointer",
              padding: 0,
              fontSize: "0.8rem",
              fontWeight: 500,
              textDecoration: "underline",
            }}
          >
            {mode === "signup" ? "Log in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;

