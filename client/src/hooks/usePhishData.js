import { useEffect, useState } from "react";

const DATA_URL = "/data/phishviz_master_dataset.json";

const usePhishData = (includeRaw = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(DATA_URL)
      .then((res) => res.json())
      .then((json) => {
        const rawArray = Array.isArray(json) ? json : [];
        const totalThreats = rawArray.length;
        const highRiskURLs = rawArray.filter(i => i.site_label === 'bad' || i.url_type === 'phishing' || i.url_type === 'malicious').length;
        const blockedAttempts = rawArray.filter(i => i.defense_mechanism && i.defense_mechanism !== 'None').length;
        
        const formattedData = {
          totalThreats,
          highRiskURLs,
          blockedAttempts,
          activeAlerts: Math.max(1, Math.floor(rawArray.length / 5000) || 0),
          timelineData: rawArray,
          attackDistribution: rawArray,
          recentThreats: rawArray,
          geoDistribution: rawArray,
          raw_data: rawArray
        };
        
        setData(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load phishing data from API");
        setLoading(false);
      });
  }, [includeRaw]);

  return { data, loading, error };
};

export default usePhishData;
