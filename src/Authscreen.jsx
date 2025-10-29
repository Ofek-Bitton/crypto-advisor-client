import { useState } from "react";
import { login, signup } from "./api";

/**
 * AuthScreen:
 * Handles signup / login.
 */
function AuthScreen({ onLoggedIn }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [name, setName] = useState("");      // used only on signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      let result;
      if (mode === "signup") {
        // Create new account
        result = await signup({ name, email, password });
      } else {
        // Login
        result = await login({ email, password });
      }

      if (!result.ok) {
        throw new Error(result.data?.msg || "Authentication failed");
      }

      // Store token and user info in localStorage
      const { token, user } = result;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", user?.name || "");
      localStorage.setItem("hasPrefs", user?.preferences ? "true" : "false");

      // If user already has preferences (did onboarding before),
      // jump directly to dashboard
      onLoggedIn({
        token,
        name: user?.name || "",
        hasPrefs: Boolean(user?.preferences),
      });
    } catch (error) {
      console.error(error);
      setErr(error.message || "Login / signup error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "360px",
          maxWidth: "90vw",
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
          padding: "20px",
          fontSize: "14px",
          lineHeight: 1.5,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "16px", fontSize: "18px" }}>
          {mode === "signup" ? "Create Account" : "Welcome Back"}
        </h2>

        {mode === "signup" && (
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>Full Name</label>
            <input
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #444",
                background: "#000",
                color: "#fff",
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
          </div>
        )}

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Email</label>
          <input
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#000",
              color: "#fff",
            }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Password</label>
          <input
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#000",
              color: "#fff",
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
              background: "#3a1717",
              color: "#fbb",
              borderRadius: "6px",
              fontSize: "13px",
              padding: "8px",
              marginBottom: "12px",
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
            padding: "10px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {mode === "signup" ? "Sign up" : "Log in"}
        </button>

        <p
          style={{
            color: "#888",
            textAlign: "center",
            marginTop: "16px",
          }}
        >
          {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            style={{
              background: "transparent",
              border: "none",
              color: "#4fa3ff",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
              fontSize: "14px",
            }}
          >
            {mode === "signup" ? "Log in" : "Sign up"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default AuthScreen;
