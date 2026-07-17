import axios from "axios";
import { getToken, clearAuth } from "./auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor: Attach Bearer Token ────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle 401 ───────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Auth Endpoints ──────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  logout: () => api.post("/auth/logout"),
  profile: () => api.get("/auth/profile"),
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
};

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardApi = {
  kpis: () => api.get("/dashboard/kpis"),
  charts: () => api.get("/dashboard/charts"),
};

// ─── Customers ───────────────────────────────────────────────────────────────
export const customersApi = {
  list: (params?: Record<string, unknown>) => api.get("/customers", { params }),
  get: (id: string) => api.get(`/customers/${id}`),
  create: (data: Record<string, unknown>) => api.post("/customers", data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};

// ─── Leads ───────────────────────────────────────────────────────────────────
export const leadsApi = {
  list: (params?: Record<string, unknown>) => api.get("/leads", { params }),
  get: (id: string) => api.get(`/leads/${id}`),
  create: (data: Record<string, unknown>) => api.post("/leads", data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/leads/${id}`, data),
  delete: (id: string) => api.delete(`/leads/${id}`),
  convert: (id: string) => api.post(`/leads/${id}/convert`),
};

// ─── Opportunities ────────────────────────────────────────────────────────────
export const opportunitiesApi = {
  list: (params?: Record<string, unknown>) => api.get("/opportunities", { params }),
  get: (id: string) => api.get(`/opportunities/${id}`),
  create: (data: Record<string, unknown>) => api.post("/opportunities", data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/opportunities/${id}`, data),
  delete: (id: string) => api.delete(`/opportunities/${id}`),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productsApi = {
  list: (params?: Record<string, unknown>) => api.get("/products", { params }),
  get: (id: string) => api.get(`/products/${id}`),
  create: (data: Record<string, unknown>) => api.post("/products", data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// ─── Quotations ───────────────────────────────────────────────────────────────
export const quotationsApi = {
  list: (params?: Record<string, unknown>) => api.get("/quotations", { params }),
  get: (id: string) => api.get(`/quotations/${id}`),
  create: (data: Record<string, unknown>) => api.post("/quotations", data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/quotations/${id}`, data),
  delete: (id: string) => api.delete(`/quotations/${id}`),
  pdf: (id: string) => api.get(`/quotations/${id}/pdf`, { responseType: "blob" }),
};

// ─── Invoices ─────────────────────────────────────────────────────────────────
export const invoicesApi = {
  list: (params?: Record<string, unknown>) => api.get("/invoices", { params }),
  get: (id: string) => api.get(`/invoices/${id}`),
  create: (data: Record<string, unknown>) => api.post("/invoices", data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/invoices/${id}`, data),
  delete: (id: string) => api.delete(`/invoices/${id}`),
  addPayment: (id: string, data: Record<string, unknown>) => api.post(`/invoices/${id}/payments`, data),
};

// ─── Tasks ────────────────────────────────────────────────────────────────────
export const tasksApi = {
  list: (params?: Record<string, unknown>) => api.get("/tasks", { params }),
  get: (id: string) => api.get(`/tasks/${id}`),
  create: (data: Record<string, unknown>) => api.post("/tasks", data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

// ─── Calendar ─────────────────────────────────────────────────────────────────
export const calendarApi = {
  list: (params?: Record<string, unknown>) => api.get("/calendar", { params }),
  create: (data: Record<string, unknown>) => api.post("/calendar", data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/calendar/${id}`, data),
  delete: (id: string) => api.delete(`/calendar/${id}`),
};

// ─── Reports ──────────────────────────────────────────────────────────────────
export const reportsApi = {
  sales: (params?: Record<string, unknown>) => api.get("/reports/sales", { params }),
  leads: (params?: Record<string, unknown>) => api.get("/reports/leads", { params }),
  customers: (params?: Record<string, unknown>) => api.get("/reports/customers", { params }),
  tasks: (params?: Record<string, unknown>) => api.get("/reports/tasks", { params }),
  revenue: (params?: Record<string, unknown>) => api.get("/reports/revenue", { params }),
};

// ─── Files ────────────────────────────────────────────────────────────────────
export const filesApi = {
  list: (params?: Record<string, unknown>) => api.get("/files", { params }),
  upload: (formData: FormData) =>
    api.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  download: (uuid: string) =>
    api.get(`/files/download/${uuid}`, { responseType: "blob" }),
  delete: (id: string) => api.delete(`/files/${id}`),
};

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const auditLogsApi = {
  list: (params?: Record<string, unknown>) => api.get("/audit-logs", { params }),
};

// ─── Settings ─────────────────────────────────────────────────────────────────
export const settingsApi = {
  all: () => api.get("/settings"),
  group: (group: string) => api.get(`/settings/${group}`),
  update: (group: string, data: Record<string, unknown>) =>
    api.put(`/settings/${group}`, data),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersApi = {
  list: (params?: Record<string, unknown>) => api.get("/users", { params }),
  get: (id: string) => api.get(`/users/${id}`),
  create: (data: Record<string, unknown>) => api.post("/users", data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// ─── Roles ────────────────────────────────────────────────────────────────────
export const rolesApi = {
  list: () => api.get("/roles"),
  get: (id: string) => api.get(`/roles/${id}`),
  create: (data: Record<string, unknown>) => api.post("/roles", data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/roles/${id}`, data),
  delete: (id: string) => api.delete(`/roles/${id}`),
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const notificationsApi = {
  list: (params?: Record<string, unknown>) => api.get("/notifications", { params }),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put("/notifications/read-all"),
};
