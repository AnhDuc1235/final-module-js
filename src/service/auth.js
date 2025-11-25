const BASE_URL = "https://youtube-music.f8team.dev/api";

export const authService = {
  getToken() { return localStorage.getItem("access_token"); },

  async login(email, password) {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || "Login failed" };
    } catch (e) { return { success: false, message: "Network error" }; }
  },

  async register(name, email, password, confirmPassword) {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword })
      });
      const data = await res.json();
      if (res.ok) {
        if(data.access_token) localStorage.setItem("access_token", data.access_token);
        return { success: true };
      }
      return { success: false, message: data.message || "Register failed" };
    } catch (e) { return { success: false, message: "Network error" }; }
  },

  async getMe() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      return res.ok ? await res.json() : null;
    } catch { return null; }
  },

  async updateProfile(name, email) {
    const token = this.getToken();
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name, email })
      });
      const data = await res.json();
      return res.ok ? { success: true } : { success: false, message: data.message };
    } catch { return { success: false, message: "Error" }; }
  },

  async changePassword(oldPassword, password, confirmPassword) {
    const token = this.getToken();
    try {
      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ oldPassword, password, confirmPassword })
      });
      const data = await res.json();
      return res.ok ? { success: true } : { success: false, message: data.message };
    } catch { return { success: false, message: "Error" }; }
  },

  logout() {
    const token = this.getToken();
    if(token) fetch(`${BASE_URL}/auth/logout`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
    localStorage.clear();
    window.location.reload();
  }
};