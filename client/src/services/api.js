import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://127.0.0.1:5001" : "");

const API = axios.create({
  baseURL: `${API_URL}/api`,
});


export const getDashboardStats = () => API.get("/stats");
export const getAttackTypes = () => API.get("/stats?full=false");
export const getGeoData = () => API.get("/stats?full=false");

// Advanced PhishViz Endpoints
export const checkURL = (url) => API.post("/analyze-url", { url });
export const analyzeEmail = (text) => API.post("/analyze-email", { text });
export const scanQR = (imageB64) => API.post("/analyze-qr", { image: imageB64 });
export const checkRedirects = (url) => API.post("/check-redirects", { url });
export const checkSimilarity = (url) => API.post("/domain-similarity", { url });
export const downloadReport = (data) => API.post("/generate-report", data, { responseType: 'blob' });
