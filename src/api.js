// client/src/api.js

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Utility: safely parse JSON and throw a structured error
 */
async function parseResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// ----------------------------------
// AUTH
// ----------------------------------

/**
 * Sign up
 * Returns { ok: true, token, user }
 */
export async function signup({ name, email, password }) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await parseResponse(res);

  // Persist auth data locally so the dashboard can access it
  if (data?.token) {
    localStorage.setItem("token", data.token);
  }
  if (data?.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("userName", data.user.name || "");
    if (data.user.preferences) {
      localStorage.setItem(
        "userPreferences",
        JSON.stringify(data.user.preferences)
      );
    }
  }

  return {
    ok: true,
    token: data.token,
    user: data.user,
  };
}

/**
 * Login
 * Returns { ok: true, token, user }
 */
export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseResponse(res);

  // Persist auth data locally so the dashboard can access it
  if (data?.token) {
    localStorage.setItem("token", data.token);
  }
  if (data?.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("userName", data.user.name || "");
    if (data.user.preferences) {
      localStorage.setItem(
        "userPreferences",
        JSON.stringify(data.user.preferences)
      );
    }
  }

  return {
    ok: true,
    token: data.token,
    user: data.user,
  };
}

// ----------------------------------
// USER PREFERENCES (Onboarding)
// ----------------------------------
//
// This function sends onboarding preferences to the server and then
// mirrors the updated preferences locally in localStorage so the app
// can route the user directly to the dashboard after onboarding.
//
export async function savePreferences(token, prefs) {
  // Get the currently stored user so we can extract the userId
  let rawUser = localStorage.getItem("user");
  let userObj = null;
  try {
    userObj = rawUser ? JSON.parse(rawUser) : null;
  } catch (e) {
    userObj = null;
  }

  const userId = userObj._id;

  // Send onboarding data to the backend to update this user's preferences
  const resp = await fetch(`${API_URL}/onboarding/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(prefs),
  });

  const data = await resp.json();
  if (!resp.ok || !data.ok) {
    throw new Error(data.error || "Failed to save onboarding");
  }

  // Update a local copy of the user object with the new preferences.
  // This lets the client treat the user as "onboarded" without requiring
  // an immediate refetch.
  const updatedUser = {
    ...(userObj || {}),
    preferences: {
      cryptoAssets: Array.isArray(prefs.cryptoAssets)
        ? prefs.cryptoAssets
        : [],
      investorType: prefs.investorType || "",
      contentTypes: Array.isArray(prefs.contentTypes)
        ? prefs.contentTypes
        : [],
    },
  };

  // Persist locally for fast access (dashboard, routing, etc.)
  localStorage.setItem("user", JSON.stringify(updatedUser));
  localStorage.setItem(
    "userPreferences",
    JSON.stringify(updatedUser.preferences)
  );

  console.log("[savePreferences] preferences stored locally");

  return {
    ok: true,
    data: {
      user: updatedUser,
    },
  };
}

// ----------------------------------
// DASHBOARD DATA
// ----------------------------------

/**
 * Fetches all data required for the dashboard:
 * {
 *   user,
 *   prices (normalized),
 *   news,
 *   aiInsight,
 *   meme
 * }
 */
export async function getDashboardData(token) {
  const res = await fetch(`${API_URL}/dashboard`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseResponse(res);

  // The server returns prices as an array like:
  // [ { symbol: "bitcoin", usd: 12345 }, ... ]
  //
  // We normalize it into an object map:
  // {
  //   bitcoin:  { usd: 12345 },
  //   ethereum: { usd: 3200 },
  //   ...
  // }
  const priceMap = {};
  if (Array.isArray(data.prices)) {
    data.prices.forEach((p) => {
      if (p && p.symbol) {
        priceMap[p.symbol.toLowerCase()] = { usd: p.usd };
      }
    });
  }

  return {
    user: data.user || null,
    prices: priceMap,
    news: Array.isArray(data.news) ? data.news : [],
    aiInsight: data.aiInsight || null,
    meme: data.meme || null,
  };
}

// ----------------------------------
// FEEDBACK (👍 / 👎)
// ----------------------------------
//
// Sends user feedback (like/dislike) for specific dashboard items
// (news item, price card, AI insight, meme, ...).
// If the request fails, we fail silently so the UI doesn't crash.
//
export async function sendFeedback(token, { section, itemId, vote, userId }) {
  console.log("[sendFeedback] payload:", { userId, section, itemId, vote });

  const res = await fetch(`${API_URL}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ section, itemId, vote, userId }),
  }).catch((e) => {
    console.warn("[sendFeedback] request error:", e);
    return null;
  });

  if (!res) {
    return { ok: false, data: null };
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error(
      "[sendFeedback] failed:",
      res.status,
      res.statusText,
      data
    );
  }

  return { ok: res.ok, data };
}
