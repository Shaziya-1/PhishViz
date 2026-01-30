import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getDashboardStats = () => API.get("/dashboard");
export const getAttackTypes = () => API.get("/analysis");
export const getGeoData = () => API.get("/geo");
export const checkURL = (url) =>
  API.post("/url-check", { url });
