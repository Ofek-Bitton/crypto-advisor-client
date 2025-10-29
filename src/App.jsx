import { useState, useEffect } from "react";
import Onboarding from "./Onboarding";
import Dashboard from "./Dashboard";
import AuthScreen from "./Authscreen";

/**
 * App:
 * Determines which screen to display based on authentication
 * and onboarding status.
 */
export default function App() {
  // Possible screens: 'auth' | 'onboarding' | 'dashboard'
  const [screen, setScreen] = useState("auth");

  // When the app loads, decide which screen to show
  useEffect(() => {
    const token = localStorage.getItem("token");
    const prefs = localStorage.getItem("prefs");

    if (token && prefs) {
      setScreen("dashboard"); // User is logged in and has preferences → show dashboard
    } else if (token && !prefs) {
      setScreen("onboarding"); // User is logged in but has no preferences → show onboarding
    } else {
      setScreen("auth"); // No login data → show authentication screen
    }
  }, []);

  function handleLoggedIn() {
    // Called after login or signup
    const hasPrefs = !!localStorage.getItem("prefs");
    if (hasPrefs) {
      setScreen("dashboard");
    } else {
      setScreen("onboarding");
    }
  }

  function handleOnboardingComplete() {
    // Called after onboarding data is saved
    setScreen("dashboard");
  }

  function handleLogout() {
    // After logout → return to login/signup screen
    setScreen("auth");
  }

  // Render the correct screen based on current state
  if (screen === "auth") {
    return <AuthScreen onLoggedIn={handleLoggedIn} />;
  }

  if (screen === "onboarding") {
    return (
      <Onboarding
        onFinish={handleOnboardingComplete}
        onLogout={handleLogout}
      />
    );
  }

  if (screen === "dashboard") {
    return <Dashboard onLogout={handleLogout} setScreen={setScreen} />;
  }

  return null;
}
