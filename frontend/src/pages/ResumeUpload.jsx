import { useEffect, useState } from "react";
import { apiRequest } from "../services/apiClient";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resumes, setResumes] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);

  const [analysis, setAnalysis] = useState(() => {
    const savedAnalysis = localStorage.getItem("resume_analysis");
    return savedAnalysis ? JSON.parse(savedAnalysis) : null;
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setMessage("");
    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };
  const fetchResumes = async () => {
    try {
      const data = await apiRequest("/resume/");
      setResumes(data);

      const analyzedResume = data.find((resume) => resume.analysis);

      if (analyzedResume) {
        setAnalysis({
          resume_id: analyzedResume.id,
          file_name: analyzedResume.file_name,
          analysis: analyzedResume.analysis,
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const data = await apiRequest("/resume/", {
        method: "POST",
        body: formData,
      });
      setMessage(`Resume uploaded: ${data.file_name}`);
      setFile(null);
      setAnalysis(null);
      localStorage.removeItem("career_analysis");
      localStorage.removeItem("resume_analysis");

      await fetchResumes();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (resumeId) => {
    setAnalyzing(true);
    setError("");
    setAnalysis(null);

    try {
      const data = await apiRequest(
        `/resume/analyze?resume_id=${resumeId}`,
        {
          method: "POST",
        }
      );

      setAnalysis(data);
      localStorage.setItem("resume_analysis", JSON.stringify(data));

    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };
  return (
    <div className="resume-upload-container">
      <h1>Upload Resume</h1>

      <p className="resume-subtitle">
        Upload your latest resume to analyze your career profile.
      </p>

      <div className="upload-box">
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
        />
        <div className="resume-list">
          <h2>Your Resumes</h2>
          {resumes.length === 0 ? (
            <p>No resumes uploaded yet.</p>
          ) : (
            resumes.map((resume) => (
              <div className="resume-card" key={resume.id}>
                <div>
                  <strong>{resume.file_name}</strong>
                  <p>Resume ID: {resume.id}</p>
                </div>

                <div>
                  <span>✓ Uploaded</span>

                  <button
                    onClick={() => handleAnalyze(resume.id)}
                    disabled={analyzing}
                  >
                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {analysis && (
          <div className="resume-analysis">
            <h2>Resume Analysis</h2>

            {/* Score */}
            <div className="analysis-score-card">
              <div>
                <p className="analysis-label">Overall Score</p>
                <h3>{analysis.analysis.overall_score}/100</h3>
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
                  {analysis.analysis.strengths.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="analysis-section">
                <h3>⚠️ Weaknesses</h3>
                <ul>
                  {analysis.analysis.weaknesses.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Skills */}
            <div className="analysis-section">
              <h3>🧠 Skills Analysis</h3>

              <h4>Technical Skills</h4>
              <div className="skills-container">
                {analysis.analysis.skills_analysis.technical_skills.map(
                  (skill, index) => (
                    <span className="skill-tag" key={index}>
                      {skill}
                    </span>
                  )
                )}
              </div>

              <h4>Missing Skills</h4>
              <div className="skills-container">
                {analysis.analysis.skills_analysis.missing_skills.map(
                  (skill, index) => (
                    <span className="missing-skill-tag" key={index}>
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div className="analysis-section">
              <h3>🚀 Suggestions</h3>

              <ul>
                {analysis.analysis.suggestions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {file && (
          <div className="selected-file">
            <strong>Selected:</strong> {file.name}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>

        {message && <p className="success-message">{message}</p>}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default ResumeUpload;