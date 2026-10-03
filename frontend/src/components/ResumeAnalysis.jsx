import { useEffect, useState } from "react";
import { apiRequest } from "../services/apiClient";

function ResumeAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const resumes = await apiRequest("/resume/");

        const analyzedResume = resumes.find(
          (resume) => resume.analysis
        );

        if (!analyzedResume) {
          setError(
            "No resume analysis found. Upload and analyze a resume first."
          );
          return;
        }

        setAnalysis(analyzedResume.analysis);

        // Remove old cross-account cached analysis.
        localStorage.removeItem("resume_analysis");
      } catch (err) {
        setError(
          err.message || "Unable to load resume analysis."
        );
      }
    };

    fetchAnalysis();
  }, []);

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Resume Analysis</h1>
          <p>Review your AI-powered resume insights.</p>
        </div>

        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No analysis available</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Resume Analysis</h1>
        </div>

        <div className="loading-state">
          <h2>Loading analysis...</h2>
          <p>Preparing your resume insights.</p>
        </div>
      </div>
    );
  }

  const result = analysis.analysis || analysis;

  const strengths = result.strengths || [];
  const skillGaps = result.skill_gaps || [];
  const recommendedSkills = result.recommended_skills || [];
  const recommendedProjects = result.recommended_projects || [];
  const roadmap = result.roadmap || [];

  const missingSkills =
    result.skills_analysis?.missing_skills ||
    skillGaps ||
    [];

  return (
    <div className="page-container resume-analysis-page">
      <div className="page-header">
        <h1>Resume Analysis</h1>
        <p>
          AI-powered analysis of your resume and career profile.
        </p>
      </div>

      <div className="analysis-score-card">
        <p className="analysis-label">
          Career Readiness Score
        </p>

        <div className="score-value">
          {result.readiness_score ?? 0}
          <span>/100</span>
        </div>

        <p className="score-caption">
          Based on your resume, skills, and career profile.
        </p>
      </div>

      <div className="analysis-section">
        <h3>📝 Summary</h3>
        <p>
          {result.summary || "No summary available."}
        </p>
      </div>

      <div className="analysis-grid">
        <div className="analysis-section">
          <h3>💪 Strengths</h3>

          {strengths.length > 0 ? (
            <ul>
              {strengths.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="section-empty">
              No strengths identified.
            </p>
          )}
        </div>

        <div className="analysis-section">
          <h3>⚠️ Skill Gaps</h3>

          {skillGaps.length > 0 ? (
            <ul>
              {skillGaps.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="section-empty">
              No major skill gaps identified.
            </p>
          )}
        </div>
      </div>

      <div className="analysis-section">
        <h3>🧠 Skills Analysis</h3>

        <div className="skill-group">
          <h4>Recommended Skills</h4>

          {recommendedSkills.length > 0 ? (
            <div className="skills-container">
              {recommendedSkills.map((skill, index) => (
                <span className="skill-tag" key={index}>
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="section-empty">
              No additional skills recommended.
            </p>
          )}
        </div>

        <div className="skill-group">
          <h4>Missing Skills</h4>

          {missingSkills.length > 0 ? (
            <div className="skills-container">
              {missingSkills.map((skill, index) => (
                <span
                  className="missing-skill-tag"
                  key={index}
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="section-empty">
              No missing skills identified.
            </p>
          )}
        </div>
      </div>

      <div className="analysis-grid">
        <div className="analysis-section">
          <h3>🚀 Recommended Projects</h3>

          {recommendedProjects.length > 0 ? (
            <ol>
              {recommendedProjects.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          ) : (
            <p className="section-empty">
              No project recommendations available.
            </p>
          )}
        </div>

        <div className="analysis-section">
          <h3>🗺️ Roadmap</h3>

          {roadmap.length > 0 ? (
            <ol>
              {roadmap.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          ) : (
            <p className="section-empty">
              No roadmap available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalysis;