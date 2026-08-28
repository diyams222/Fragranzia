/**
 * Unified authentication storage utility
 */

// Safely retrieve the stored user object from sessionStorage or localStorage
const getStoredUser = () => {
  try {
    const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (!userStr) return null;

    const parsed = JSON.parse(userStr);
    if (parsed && typeof parsed === "object" && parsed.role) {
      if (!sessionStorage.getItem("user")) {
        sessionStorage.setItem("user", userStr);
      }
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Returns the active logged-in User ONLY if role === "user"
 */
export const getUser = () => {
  const user = getStoredUser();
  if (user && user.role && user.role.trim().toLowerCase() === "user") {
    return user;
  }
  return null;
};

/**
 * Returns the active Admin ONLY if role === "admin"
 */
export const getAdminUser = () => {
  const user = getStoredUser();
  if (user && user.role && user.role.trim().toLowerCase() === "admin") {
    return user;
  }
  return null;
};

/**
 * Returns active role: "admin" | "user" | null
 */
export const getActiveRole = () => {
  const user = getStoredUser();
  return user && user.role ? user.role.trim().toLowerCase() : null;
};

/**
 * Sets session on Login / Signup
 */
export const setUserSession = (userData) => {
  const dataStr = JSON.stringify(userData);
  sessionStorage.setItem("user", dataStr);
  localStorage.setItem("user", dataStr);

  // Purge any old legacy keys
  sessionStorage.removeItem("adminUser");
  sessionStorage.removeItem("activeRole");
  localStorage.removeItem("adminUser");
  localStorage.removeItem("activeRole");
};

/**
 * Sets admin session (shares the unified storage)
 */
export const setAdminSession = (adminData) => {
  setUserSession(adminData);
};

/**
 * Updates existing user session data (e.g. from Profile page)
 */
export const updateUserSession = (updatedUser) => {
  const dataStr = JSON.stringify(updatedUser);
  sessionStorage.setItem("user", dataStr);
  localStorage.setItem("user", dataStr);
};

/**
 * Clears all authentication storage on logout
 */
export const clearUserSession = () => {
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("adminUser");
  sessionStorage.removeItem("activeRole");
  localStorage.removeItem("user");
  localStorage.removeItem("adminUser");
  localStorage.removeItem("activeRole");
};

/**
 * Clears all authentication storage on admin logout
 */
export const clearAdminSession = () => {
  clearUserSession();
};
