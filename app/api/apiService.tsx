import axios from "axios";
import { getToken } from "@/hooks/auth.ts";

// Base URL
export const BASE_URL = "https://curevia.tech/api";

// --- 1. Axios instance ---
export const api = axios.create({
  baseURL: BASE_URL,
});

// --- 2. Add Authorization Header Before Request ---
api.interceptors.request.use((config) => {
  const accessToken = getToken();
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

export const LoginCmd = async (email: string, password: string) => {
  const payload = {
    email,
    password,
  };

  const reponse = await api.post("/Auth/login", payload);

  return reponse.data;
};

export const MeCmd = async () => {
  const response = await api.get("/Auth/me");
  return response.data;
};

export const LoadDoctorsPatientsByDoctorIdCmd = async (doctorId: string) => {
  const response = await api.get(`/Patient/doctor/${doctorId}`);
  return response.data;
};

export const LoadAllPatientsCmd = async () => {
  const response = await api.get("/Patient");
  return response.data;
};

export const LoadAllDoctorsCmd = async () => {
  const response = await api.get("/Doctor");
  return response.data;
};

export const crud = {
  loadAll: async (resource: any) => {
    const response = await api.get(`/${resource}`);
    return response.data;
  },

  loadAllById: async ({ resource, id }: any) => {
    const response = await api.get(`/${resource}/${id}`);
    return response.data;
  },

  create: async ({ resource, data }: any) => {
    const response = await api.post(`/${resource}/`, data);
    return response.data;
  },

  createByID: async ({ resource, data, id }: any) => {
    const response = await api.post(`/${resource}/${id}`, data);
    return response.data;
  },

  update: async ({ resource, id, data }: any) => {
    const response = await api.put(`/${resource}/${id}`, data);
    return response.data;
  },

  remove: async ({ resource, id }: any) => {
    const response = await api.delete(`/${resource}/${id}`);
    return response.data;
  },
};
