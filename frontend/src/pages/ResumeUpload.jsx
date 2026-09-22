import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resumes, setResumes] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

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
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_URL}/resume/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch resumes.");
      }

      setResumes(data);
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
      const token = localStorage.getItem("access_token");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/api/resume/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Resume upload failed.");
      }

      setMessage(`Resume uploaded: ${data.file_name}`);
      setFile(null);
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
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_URL}/resume/analyze?resume_id=${resumeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Resume analysis failed.");
      }

      setAnalysis(data);
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

            <div className="score">
              <h3>Score</h3>
              <p>{analysis.analysis.overall_score}/100</p>
            </div>

            <div>
              <h3>Summary</h3>
              <p>{analysis.analysis.summary}</p>
            </div>

            <div>
              <h3>Strengths</h3>
              <ul>
                {analysis.analysis.strengths.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Weaknesses</h3>
              <ul>
                {analysis.analysis.weaknesses.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Skills Analysis</h3>

              <strong>Technical Skills</strong>
              <ul>
                {analysis.analysis.skills_analysis.technical_skills.map(
                  (skill, index) => (
                    <li key={index}>{skill}</li>
                  )
                )}
              </ul>

              <strong>Missing Skills</strong>
              <ul>
                {analysis.analysis.skills_analysis.missing_skills.map(
                  (skill, index) => (
                    <li key={index}>{skill}</li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3>Suggestions</h3>
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