import { useEffect, useState } from "react";
import { apiRequest } from "../services/apiClient";

const SELECTED_RESUME_KEY = "selected_resume_id";

function CareerAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchAnalysis = async () => {
      setLoading(true);
      setError("");

      try {
        let selectedResumeId = localStorage.getItem(SELECTED_RESUME_KEY);

        // On a first visit, choose the newest resume that already has an analysis.
        if (!selectedResumeId) {
          const resumes = await apiRequest("/resume/");
          const defaultResume = resumes.find((resume) => resume.analysis);

          if (!defaultResume) {
            throw new Error("No analyzed resume found. Upload and analyze a resume first.");
          }

          selectedResumeId = String(defaultResume.id);
          localStorage.setItem(SELECTED_RESUME_KEY, selectedResumeId);
        }

        let resume;
        try {
          resume = await apiRequest(`/resume/${selectedResumeId}`);
        } catch {
          // The previously selected resume may have been deleted. Choose the
          // newest analyzed resume rather than showing stale cached content.
          const resumes = await apiRequest("/resume/");
          const fallbackResume = resumes.find((item) => item.analysis);

          if (!fallbackResume) {
            throw new Error("No analyzed resume found. Upload and analyze a resume first.");
          }

          selectedResumeId = String(fallbackResume.id);
          localStorage.setItem(SELECTED_RESUME_KEY, selectedResumeId);
          resume = fallbackResume;
        }

        if (!resume.analysis) {
          throw new Error("The selected resume has not been analyzed yet. Analyze it from the Resume page first.");
        }

        if (!ignore) {
          setAnalysis(resume.analysis.analysis || resume.analysis);
          setFileName(resume.file_name || "");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Unable to load career analysis.");
          setAnalysis(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchAnalysis();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <div>Loading career analysis...</div>;
  }

  if (error) {
    return <div className="page-container"><div className="empty-state"><h3>Career analysis unavailable</h3><p>{error}</p></div></div>;
  }

  return (
    <div className="career-analysis">
      <h1>Your AI Career Analysis</h1>
      {fileName && <p>Based on: {fileName}</p>}
      <p>Personalized insights, skill gaps, projects, and a roadmap for your target role.</p>

      <div className="analysis-card">
        <h2>Career Summary</h2>
        <p>{analysis.summary}</p>
      </div>

      <div className="analysis-card">
        <h2>Strengths</h2>
        <ul>
          {(analysis.strengths || []).map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="analysis-card">
        <h2>Skill Gaps</h2>
        <ul>
          {(analysis.skill_gaps || []).map((gap, index) => (
            <li key={index}>{gap}</li>
          ))}
        </ul>
      </div>

      <div className="analysis-card">
        <h2>Recommended Skills</h2>
        <ul>
          {(analysis.recommended_skills || []).map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>

      <div className="analysis-card">
        <h2>Recommended Projects</h2>
        <ul>
          {(analysis.recommended_projects || []).map((project, index) => (
            <li key={index}>{project}</li>
          ))}
        </ul>
      </div>

      <div className="analysis-card">
        <h2>Career Roadmap</h2>
        <ol>
          {(analysis.roadmap || []).map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default CareerAnalysis;