import { useState, useEffect } from "react";
import Onboarding from "./Onboarding";
import Dashboard from "./Dashboard";
import AuthScreen from "./Authscreen";

/**
 * App:
 * Determines which screen to display based on authentication
 * and onboarding status.
 *
 * Screens: 'auth' | 'onboarding' | 'dashboard'
 */
export default function App() {
  const [screen, setScreenState] = useState("auth");

  // Wrapper: update screen in state AND persist it so refresh remembers it
  function persistAndSetScreen(nextScreen) {
    try {
      window.localStorage.setItem("lastScreen", nextScreen);
    } catch (_) {
      // ignore storage errors
    }
    setScreenState(nextScreen);
  }

  // On first load: try to restore screen intelligently
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const prefs = window.localStorage.getItem("prefs"); // user prefs saved after onboarding
    const lastScreen = window.localStorage.getItem("lastScreen");

    // If not logged in at all → force auth
    if (!token) {
      setScreenState("auth");
      return;
    }

    // Logged in:
    // 1. If we have prefs -> user completed onboarding at least once
    // 2. If we DON'T have prefs -> they still haven't finished onboarding

    if (prefs) {
      // User already has preferences in localStorage (and likely in DB).
      // Trust lastScreen if it's dashboard or onboarding. Fallback: dashboard.
      if (lastScreen === "dashboard" || lastScreen === "onboarding") {
        setScreenState(lastScreen);
      } else {
        setScreenState("dashboard");
      }
    } else {
      // User is logged in but hasn't finished onboarding according to client
      // They should not jump to dashboard yet.
      setScreenState("onboarding");
    }
  }, []);

  // called after login/signup finishes successfully in AuthScreen
  function handleLoggedIn() {
    // after login we check if the user already had prefs in DB
    // your AuthScreen logic should already set:
    // localStorage.setItem("prefs", JSON.stringify(...)) OR not set it at all
    const hasPrefs = !!window.localStorage.getItem("prefs");

    if (hasPrefs) {
      persistAndSetScreen("dashboard");
    } else {
      persistAndSetScreen("onboarding");
    }
  }

  // called after onboarding form "Save and continue"
  function handleOnboardingComplete() {
    // IMPORTANT:
    // Mark prefs as saved locally so next refresh doesn't force onboarding again
    // If you are not already saving them, we set a minimal marker here.
    if (!window.localStorage.getItem("prefs")) {
      window.localStorage.setItem("prefs", "true");
    }

    persistAndSetScreen("dashboard");
  }

  function handleLogout() {
    // clear everything relevant on logout
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("lastScreen");
    // (OPTIONAL) you can also clear prefs if you want a clean session:
    // window.localStorage.removeItem("prefs");

    persistAndSetScreen("auth");
  }

  // Allow Dashboard to navigate (Preferences button -> onboarding)
  function externallySetScreen(nextScreen) {
    persistAndSetScreen(nextScreen);
  }

  // Render correct screen
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
    return (
      <Dashboard
        onLogout={handleLogout}
        setScreen={externallySetScreen}
      />
    );
  }

  return null;
}
