import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5001/api",
});

export const getDashboardStats = () => API.get("/dashboard");
export const getAttackTypes = () => API.get("/analysis");
export const getGeoData = () => API.get("/geo");

// Advanced PhishViz Endpoints
export const checkURL = (url) => API.post("/analyze-url", { url });
export const analyzeEmail = (text) => API.post("/analyze-email", { text });
export const scanQR = (imageB64) => API.post("/analyze-qr", { image: imageB64 });
export const checkRedirects = (url) => API.post("/check-redirects", { url });
export const checkSimilarity = (url) => API.post("/domain-similarity", { url });
export const downloadReport = (data) => API.post("/generate-report", data, { responseType: 'blob' });
