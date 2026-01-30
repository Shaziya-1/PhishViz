import { useEffect, useState } from "react";

const DATA_URL = "/data/phishviz_master_dataset.json";

const usePhishData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(DATA_URL)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load phishing data");
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
};

export default usePhishData;
