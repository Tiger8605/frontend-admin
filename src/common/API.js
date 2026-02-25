import axios from "axios";




/* =========================================
   🌐 BASE URL
========================================= */
export const BASE_URL = "http://localhost:5000/api";

/* =========================================
   🔥 AXIOS INSTANCE
========================================= */
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});


/* =========================================
   🔗 ALL API PATHS
========================================= */
export const URL_PATH = {
    /* ---------- AUTH ---------- */
    Register: "/auth/register",
    Login: "/auth/login",

};