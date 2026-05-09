import api from "./axios";

export const submitRequest = (data) => api.post("/requests", data);
export const getMyRequests = (params) => api.get("/requests/my", { params });
export const getAllRequests = (params) => api.get("/requests", { params });
export const getRequestById = (id) => api.get(`/requests/${id}`);
export const approveRequest = (id, admin_note) =>
  api.patch(`/requests/${id}/approve`, { admin_note });
export const rejectRequest = (id, admin_note) =>
  api.patch(`/requests/${id}/reject`, { admin_note });
export const returnRequest = (id) => api.patch(`/requests/${id}/return`);
