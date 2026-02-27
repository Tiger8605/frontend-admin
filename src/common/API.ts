import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

/* =========================================
   🌐 BASE URL
========================================= */
export const BASE_URL = "http://localhost:5000/api";
// export const BASE_URL = "http://localhost:5001/api";

/* =========================================
   🔥 AXIOS INSTANCE
========================================= */
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =========================================
   🔗 ALL API PATHS
========================================= */
export const URL_PATH = {
  /* ---------- ADMIN AUTH ---------- */
  AdminRegister: "/admin/register",
  AdminLogin: "/admin/login",

  /* ---------- Tables ---------- */
  Tables: "/tables",
  CreateTable: "/tables/create",
  UpdateTable: (id: string) => `/tables/update/${id}`,
  DeleteTable: (id: string) => `/tables/delete/${id}`,
  getTables: "/"


  /* ---------- MENU ---------- */
Categories: "/menu/category",
GetCategories: "/menu/category",
DeleteCategory: (id: string) => `/menu/category/${id}`,

Dishes: "menu/dish",
GetDishes:"menu/dish",
UpdateDish: (id: string) => `/menu/dish/${id}`,
DeleteDish: (id: string) => `/menu/dish/${id}`,


} as const;




/* =========================================
   ✅ API HELPER (Typed)
========================================= */
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export default async function API<T = any>(
  method: HttpMethod,
  path: string,
  data?: unknown,
  config: AxiosRequestConfig = {}
): Promise<T> {
  const res: AxiosResponse<T> = await apiClient({
    method,
    url: path,
    data,
    ...config,
  });

  return res.data;
}