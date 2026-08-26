/**
 * Tab-specific and persistent authentication storage utility
 */

// Returns active role in this tab: "admin" | "user" | null
export const getActiveRole = () => {
  const tabRole = sessionStorage.getItem("activeRole");
  if (tabRole) return tabRole;

  if (sessionStorage.getItem("adminUser")) return "admin";
  if (sessionStorage.getItem("user")) return "user";

  return null;
};

/**
 * Returns the active User in this tab (or hydrates from localStorage if not in admin mode)
 */
export const getUser = () => {
  const role = getActiveRole();
  if (role === "admin") {
    // This tab is explicitly active as admin; cannot act as regular user
    return null;
  }

  const tabUser = sessionStorage.getItem("user");
  if (tabUser) {
    try {
      return JSON.parse(tabUser);
    } catch {
      return null;
    }
  }

  // If no tab-specific user is set, check persistent localStorage
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser);
      if (parsed && parsed.role === "user") {
        sessionStorage.setItem("user", savedUser);
        sessionStorage.setItem("activeRole", "user");
        return parsed;
      }
    } catch {
      return null;
    }
  }

  return null;
};

/**
 * Returns the active Admin in this tab (or hydrates from localStorage if not in user mode)
 */
export const getAdminUser = () => {
  const role = getActiveRole();
  if (role === "user") {
    // This tab is explicitly active as user; cannot act as admin
    return null;
  }

  const tabAdmin = sessionStorage.getItem("adminUser");
  if (tabAdmin) {
    try {
      return JSON.parse(tabAdmin);
    } catch {
      return null;
    }
  }

  // If no tab-specific admin is set, check persistent localStorage
  const savedAdmin = localStorage.getItem("adminUser");
  if (savedAdmin) {
    try {
      const parsed = JSON.parse(savedAdmin);
      if (parsed && parsed.role === "admin") {
        sessionStorage.setItem("adminUser", savedAdmin);
        sessionStorage.setItem("activeRole", "admin");
        return parsed;
      }
    } catch {
      return null;
    }
  }

  return null;
};

/**
 * Sets user session on Login / Signup
 */
export const setUserSession = (userData) => {
  const dataStr = JSON.stringify(userData);
  sessionStorage.setItem("activeRole", "user");
  sessionStorage.setItem("user", dataStr);
  sessionStorage.removeItem("adminUser");
  localStorage.setItem("user", dataStr);
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
 * Clears user session on explicit logout
 */
export const clearUserSession = () => {
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("activeRole");
  localStorage.removeItem("user");
};

/**
 * Sets admin session on Admin Login
 */
export const setAdminSession = (adminData) => {
  const dataStr = JSON.stringify(adminData);
  sessionStorage.setItem("activeRole", "admin");
  sessionStorage.setItem("adminUser", dataStr);
  sessionStorage.removeItem("user");
  localStorage.setItem("adminUser", dataStr);
};

/**
 * Clears admin session on explicit logout
 */
export const clearAdminSession = () => {
  sessionStorage.removeItem("adminUser");
  sessionStorage.removeItem("activeRole");
  localStorage.removeItem("adminUser");
};
