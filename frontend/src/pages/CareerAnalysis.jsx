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
        setError(err.message);
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
    <div className="career-analysis">
      <h1>Your AI Career Analysis</h1>
      <p>Personalized insights, skill gaps, projects, and a roadmap for your target role.</p>

      <div className="analysis-card">
        <h2>Career Summary</h2>
        <p>{analysis.summary}</p>
      </div>

      <div className="analysis-card">
        <h2>Strengths</h2>
        <ul>
          {analysis.strengths.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="analysis-card">
        <h2>Skill Gaps</h2>
        <ul>
          {analysis.skill_gaps.map((gap, index) => (
            <li key={index}>{gap}</li>
          ))}
  </ul>
</div>

      <div className="analysis-card">
        <h2>Recommended Skills</h2>
        <ul>
          {analysis.recommended_skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>

      <div className="analysis-card">
        <h2>Recommended Projects</h2>
        <ul>
          {analysis.recommended_projects.map((project, index) => (
            <li key={index}>{project}</li>
          ))}
        </ul>
      </div>
      <div className="analysis-card">
  <h2>Career Roadmap</h2>
  <ol>
    {analysis.roadmap.map((step, index) => (
      <li key={index}>{step}</li>
    ))}
  </ol>
</div>

    </div>
  );
}

export default CareerAnalysis;