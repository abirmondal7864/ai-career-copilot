import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/apiClient";

function ResumeUpload() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resumes, setResumes] = useState([]);
  const [analyzingResumeId, setAnalyzingResumeId] = useState(null);

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
    } catch (err) {
      setError(err.message || "Unable to load resumes.");
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadResumes = async () => {
      try {
        const data = await apiRequest("/resume/");
        if (!ignore) {
          setResumes(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Unable to load resumes.");
        }
      }
    };

    loadResumes();

    return () => {
      ignore = true;
    };
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

      setMessage(`Resume uploaded successfully: ${data.file_name}`);
      setFile(null);

      localStorage.removeItem("career_analysis");
      localStorage.removeItem("resume_analysis");

      await fetchResumes();
    } catch (err) {
      setError(err.message || "Unable to upload resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (resume) => {
    setError("");

    // Existing analyses are snapshots. Open them without overwriting
    // them with a new result or another resume's analysis.
    if (resume.analysis) {
      navigate(`/resume/analysis?resume_id=${resume.id}`);
      return;
    }

    setAnalyzingResumeId(resume.id);

    try {
      await apiRequest(
        `/resume/analyze?resume_id=${resume.id}`,
        {
          method: "POST",
        }
      );

      await fetchResumes();
      navigate(`/resume/analysis?resume_id=${resume.id}`);
    } catch (err) {
      setError(err.message || "Unable to analyze resume.");
    } finally {
      setAnalyzingResumeId(null);
    }
  };

  return (
    <div className="resume-upload-container">
      <div className="page-header">
        <h1>Upload Resume</h1>
        <p>
          Upload your latest resume to analyze your career profile.
        </p>
      </div>

      <div className="upload-box">
        <div className="upload-icon">📄</div>

        <h2>Upload your PDF resume</h2>

        <p className="upload-description">
          Choose a PDF file from your device to get started.
        </p>

        <label className="file-input-label">
          Choose PDF
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
          />
        </label>

        {file && (
          <div className="selected-file">
            <strong>Selected:</strong>
            <span>{file.name}</span>
          </div>
        )}

        <button
          className="primary-button"
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      <div className="resume-list">
        <div className="resume-list-header">
          <div>
            <h2>Your Resumes</h2>
            <p>
              Manage and analyze your uploaded resumes.
            </p>
          </div>

          <span className="resume-count">
            {resumes.length}{" "}
            {resumes.length === 1 ? "resume" : "resumes"}
          </span>
        </div>

        {resumes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No resumes uploaded yet</h3>
            <p>
              Upload your first PDF resume above to start your
              career analysis.
            </p>
          </div>
        ) : (
          resumes.map((resume, index) => (
            <div className="resume-card" key={resume.id}>
              <div className="resume-info">
                <strong>Resume {resumes.length - index}</strong>
                <p>{resume.file_name}</p>
              </div>

              <div className="resume-actions">
                <span className="uploaded-status">
                  ✓ Uploaded
                </span>

                <button
                  className="secondary-button"
                  onClick={() => handleAnalyze(resume)}
                  disabled={analyzingResumeId !== null}
                >
                  {analyzingResumeId === resume.id
                    ? "Analyzing..."
                    : resume.analysis
                      ? "View Analysis"
                      : "Analyze Resume"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ResumeUpload;