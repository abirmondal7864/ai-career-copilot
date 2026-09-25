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
      const data = await apiRequest("/resume/");
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
      const formData = new FormData();
      formData.append("file", file);

      const data = await apiRequest("/resume/", {
        method: "POST",
        body: formData,
      });
      setMessage(`Resume uploaded: ${data.file_name}`);
      setFile(null);
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

    try {
      const data = await apiRequest(
        `/resume/analyze?resume_id=${resumeId}`,
        {
          method: "POST",
        }
      );

      localStorage.setItem("resume_analysis", JSON.stringify(data));

      navigate("/resume/analysis");
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