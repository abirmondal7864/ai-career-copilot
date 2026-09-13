import { useEffect, useState } from "react";
import { apiRequest } from "../services/apiClient"; 
function CareerAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
       const data = await apiRequest("/career/analyze", {
          method: "POST",
        });
        setAnalysis(data);
      } catch (err) {
        console.error(err);
        setError("Failed to generate career analysis.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) {
    return <div>Generating your AI career analysis...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>AI Career Analysis</h1>

      <pre>
        {JSON.stringify(analysis, null, 2)}
      </pre>
    </div>
  );
}

export default CareerAnalysis;