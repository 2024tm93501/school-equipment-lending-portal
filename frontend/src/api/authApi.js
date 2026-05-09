import api from "./axios";

export const login = (email, password) =>
  api.post("/auth/login", new URLSearchParams({ username: email, password }), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

export const register = (data) => api.post("/auth/register", data);

export const getMe = () => api.get("/auth/me");
