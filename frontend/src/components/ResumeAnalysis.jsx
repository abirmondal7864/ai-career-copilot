import { useEffect, useState } from "react";

function ResumeAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedAnalysis = localStorage.getItem("resume_analysis");

    if (!savedAnalysis) {
      setError("No resume analysis found. Analyze a resume first.");
      return;
    }

    try {
      setAnalysis(JSON.parse(savedAnalysis));
    } catch {
      setError("Unable to load resume analysis.");
    }
  }, []);

  if (error) {
    return (
      <div className="resume-upload-container">
        <h1>Resume Analysis</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="resume-upload-container">
        <h1>Resume Analysis</h1>
        <p>Loading analysis...</p>
      </div>
    );
  }

  return (
    <div className="resume-upload-container">
      <h1>Resume Analysis</h1>

      <p className="resume-subtitle">
        AI-powered analysis of your resume and career profile.
      </p>

      {/* Score */}
      <div className="analysis-score-card">
        <div>
          <p className="analysis-label">Overall Score</p>
          <h3>{analysis.analysis.readiness_score}/100</h3>
        </div>
      </div>

      {/* Summary */}
      <div className="analysis-section">
        <h3>📝 Summary</h3>
        <p>{analysis.analysis.summary}</p>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="analysis-grid">
        <div className="analysis-section">
          <h3>💪 Strengths</h3>
          <ul>
            {(analysis.analysis.strengths || []).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-section">
          <h3>⚠️ Weaknesses</h3>
          <ul>
            {(analysis.analysis.skill_gaps || []).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skills */}
      <div className="analysis-section">
        <h3>🧠 Skills Analysis</h3>

        <h4>Recommended Skills</h4>

        <div className="skills-container">
          {(analysis.analysis.recommended_skills || []).map(
            (skill, index) => (
              <span className="skill-tag" key={index}>
                {skill}
              </span>
            )
          )}
        </div>

        <h4>Missing Skills</h4>

        <div className="skills-container">
          {(
            analysis.analysis.skills_analysis?.missing_skills ||
            analysis.analysis.skill_gaps ||
            []
          ).map((skill, index) => (
            <span className="missing-skill-tag" key={index}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="analysis-section">
        <h3>🚀 Recommended Projects</h3>

        <ul>
          {(analysis.analysis.recommended_projects || []).map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>

        <h3>🗺️ Roadmap</h3>

        <ul>
          {(analysis.analysis.roadmap || []).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ResumeAnalysis;