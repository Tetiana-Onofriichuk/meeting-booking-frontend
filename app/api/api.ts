import axios, { AxiosError } from "axios";

export type ApiError = AxiosError<{ error: string }>;

export const api = axios.create({
  baseURL: "https://nodejs-hw-6-vj8w.onrender.com",
  withCredentials: true,
});
