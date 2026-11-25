import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiRequest } from "../services/apiClient";

const SELECTED_RESUME_KEY = "selected_resume_id";

function ResumeAnalysis() {
  const [searchParams] = useSearchParams();
  const routeResumeId = searchParams.get("resume_id");
  const [selectedResumeId, setSelectedResumeId] = useState(
    routeResumeId || localStorage.getItem(SELECTED_RESUME_KEY) || ""
  );
  const [analysis, setAnalysis] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchAnalysis = async () => {
      setLoading(true);
      setError("");
      setAnalysis(null);

      try {
        let resumeId = routeResumeId || localStorage.getItem(SELECTED_RESUME_KEY);

        // Navbar navigation has no query string, so restore the last selection.
        if (!resumeId) {
          const resumes = await apiRequest("/resume/");
          const defaultResume = resumes.find((resume) => resume.analysis);

          if (!defaultResume) {
            throw new Error("Choose and analyze a resume from the Resume page first.");
          }

          resumeId = String(defaultResume.id);
        }

        const resume = await apiRequest(`/resume/${resumeId}`);

        if (!resume.analysis) {
          throw new Error("This resume has not been analyzed yet. Analyze it from the Resume page first.");
        }

        if (!ignore) {
          localStorage.setItem(SELECTED_RESUME_KEY, String(resume.id));
          setSelectedResumeId(String(resume.id));
          setAnalysis(resume.analysis);
          setFileName(resume.file_name || "");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Unable to load this resume's analysis.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchAnalysis();

    return () => {
      ignore = true;
    };
  }, [routeResumeId]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Resume Analysis</h1>
          <p>Loading your resume insights...</p>
        </div>
      </div>
    );
  }

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

  if (!analysis) return null;

  const result = analysis.analysis || analysis;
  const strengths = result.strengths || [];
  const skillGaps = result.skill_gaps || [];
  const recommendedSkills = result.recommended_skills || [];
  const recommendedProjects = result.recommended_projects || [];
  const roadmap = result.roadmap || [];
  const missingSkills = result.skills_analysis?.missing_skills || skillGaps || [];

  return (
    <div className="page-container resume-analysis-page" data-resume-id={selectedResumeId}>
      <div className="page-header">
        <h1>Resume Analysis</h1>
        <p>AI-powered analysis of {fileName || "your resume"} and career profile.</p>
      </div>

      <div className="analysis-score-card">
        <p className="analysis-label">Career Readiness Score</p>
        <div className="score-value">
          {result.readiness_score ?? 0}
          <span>/100</span>
        </div>
        <p className="score-caption">
          Based on this resume and the career profile available when it was analyzed.
        </p>
      </div>

      <div className="analysis-section">
        <h3>📝 Summary</h3>
        <p>{result.summary || "No summary available."}</p>
      </div>

      <div className="analysis-grid">
        <div className="analysis-section">
          <h3>💪 Strengths</h3>
          {strengths.length > 0 ? (
            <ul>{strengths.map((item, index) => <li key={index}>{item}</li>)}</ul>
          ) : <p className="section-empty">No strengths identified.</p>}
        </div>
        <div className="analysis-section">
          <h3>⚠️ Skill Gaps</h3>
          {skillGaps.length > 0 ? (
            <ul>{skillGaps.map((item, index) => <li key={index}>{item}</li>)}</ul>
          ) : <p className="section-empty">No major skill gaps identified.</p>}
        </div>
      </div>

      <div className="analysis-section">
        <h3>🧠 Skills Analysis</h3>
        <div className="skill-group">
          <h4>Recommended Skills</h4>
          {recommendedSkills.length > 0 ? (
            <div className="skills-container">
              {recommendedSkills.map((skill, index) => <span className="skill-tag" key={index}>{skill}</span>)}
            </div>
          ) : <p className="section-empty">No additional skills recommended.</p>}
        </div>
        <div className="skill-group">
          <h4>Missing Skills</h4>
          {missingSkills.length > 0 ? (
            <div className="skills-container">
              {missingSkills.map((skill, index) => <span className="missing-skill-tag" key={index}>{skill}</span>)}
            </div>
          ) : <p className="section-empty">No missing skills identified.</p>}
        </div>
      </div>

      <div className="analysis-grid">
        <div className="analysis-section">
          <h3>🚀 Recommended Projects</h3>
          {recommendedProjects.length > 0 ? (
            <ol>{recommendedProjects.map((item, index) => <li key={index}>{item}</li>)}</ol>
          ) : <p className="section-empty">No project recommendations available.</p>}
        </div>
        <div className="analysis-section">
          <h3>🗺️ Roadmap</h3>
          {roadmap.length > 0 ? (
            <ol>{roadmap.map((item, index) => <li key={index}>{item}</li>)}</ol>
          ) : <p className="section-empty">No roadmap available.</p>}
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalysis;