import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/api";

const usePhishData = (includeRaw = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardStats(includeRaw)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to load phishing data from API. Please verify the backend status.");
        setLoading(false);
      });
  }, [includeRaw]);

  return { data, loading, error };
};

export default usePhishData;
