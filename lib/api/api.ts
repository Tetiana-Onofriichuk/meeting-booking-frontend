import axios from "axios";

const isProd = process.env.NODE_ENV === "production";

export const nextApi = axios.create({
  baseURL: "/api",
  withCredentials: true,
  validateStatus: () => true,
});

export const backend = axios.create({
  baseURL: isProd ? process.env.NEXT_PUBLIC_API_URL : "http://localhost:3030",
  withCredentials: true,
  validateStatus: () => true,
});
