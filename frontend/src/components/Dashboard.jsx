import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/apiClient";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/career/profile");
      setProfile(data);

      const resumeData = await apiRequest("/resume/");
      setResumes(resumeData);

      const analyzedResume = resumeData.find(
        (resume) => resume.analysis
      );

      if (analyzedResume) {
        setAnalysis(analyzedResume.analysis);
      }
    } catch (error) {
      if (error.message === "Career profile not found.") {
        setProfile(null);
      } else {
        console.error("Profile error:", error);
        setError(error.message || "Unable to load your career profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <h2>Loading dashboard...</h2>
          <p>Getting your career information ready.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>

        <div className="error-message">
          {error}
        </div>

        <button
          className="primary-button"
          onClick={loadProfile}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>

        <div className="empty-state">
          <h2>Welcome to AI Career Copilot 👋</h2>

          <p>
            Create your career profile to get personalized
            career guidance.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/profile")}
          >
            Create Career Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Track your career preparation in one place.</p>
      </div>

      <div className="card dashboard-welcome">
        <h2>Welcome, {profile.name}! 👋</h2>
        <p>
          Here is a quick overview of your career profile and
          resume progress.
        </p>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <span>Target Role</span>
          <strong>
            {profile.target_role || "Not set yet"}
          </strong>
        </div>

        <div className="insight-card">
          <span>Experience</span>
          <strong>
            {profile.years_experience !== undefined
              ? `${profile.years_experience} years`
              : "Not set yet"}
          </strong>
        </div>

        <div className="insight-card">
          <span>Primary Skills</span>
          <strong>
            {profile.skills?.length
              ? profile.skills.join(", ")
              : "No skills added yet"}
          </strong>
        </div>

        <div className="insight-card">
          <span>Career Goal</span>
          <strong>
            {profile.career_goal || "Not set yet"}
          </strong>
        </div>
      </div>

      <div className="card dashboard-summary">
        <h2>Profile Summary</h2>

        <div className="dashboard-detail">
          <span>Education</span>
          <strong>{profile.education || "Not provided"}</strong>
        </div>

        <div className="dashboard-detail">
          <span>Resume</span>
          <strong>
            {resumes.length > 0
              ? `${resumes.length} resume${
                  resumes.length > 1 ? "s" : ""
                } uploaded`
              : "No resume uploaded"}
          </strong>
        </div>

        <div className="dashboard-detail">
          <span>Resume Analysis</span>
          <strong>
            {analysis ? "Completed ✓" : "Not analyzed yet"}
          </strong>
        </div>
      </div>

      <div className="dashboard-actions">
        <button
          className="primary-button"
          onClick={() => navigate("/profile")}
        >
          Edit Profile
        </button>

        <button
          className="secondary-button"
          onClick={() => navigate("/resume")}
        >
          Manage Resume
        </button>

        {analysis && (
          <button
            className="secondary-button"
            onClick={() => navigate("/resume/analysis")}
          >
            View Resume Analysis
          </button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;