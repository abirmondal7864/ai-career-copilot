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
    return <h2>Loading dashboard...</h2>;
  }

  if (error) {
    return (
      <div>
        <h2>Dashboard</h2>
        <p>{error}</p>
        <button onClick={loadProfile}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Dashboard</h2>

      {!profile ? (
        <div>
          <h3>Welcome to AI Career Copilot 👋</h3>
          <p>
            Create your career profile to get personalized career guidance.
          </p>

          <button onClick={() => navigate("/profile")}>
            Create Career Profile
          </button>
        </div>
      ) : (
        <div>
          <h3>Welcome, {profile.name}!</h3>

          <p>
            <strong>Education:</strong> {profile.education}
          </p>

          <p>
            <strong>Target Role:</strong> {profile.target_role}
          </p>

          <p>
            <strong>Experience:</strong> {profile.years_experience} years
          </p>

          <p>
            <strong>Skills:</strong> {profile.skills.join(", ")}
          </p>
          <p>
            <strong>Resume:</strong>{" "}
            {resumes.length > 0
              ? `${resumes.length} resume${resumes.length > 1 ? "s" : ""} uploaded`
              : "No resume uploaded"}
          </p>
          <p>
            <strong>Resume Analysis:</strong>{" "}
            {analysis ? "Completed ✓" : "Not analyzed yet"}
          </p>

          <h3>🎯 Career Insights</h3>

          <div className="insights-grid">
            <div className="insight-card">
              <span>Target Role</span>
              <strong>{profile.target_role || "Not set yet"}</strong>
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
              <strong>{profile.career_goal || "Not set yet"}</strong>
            </div>
          </div>

          <button onClick={() => navigate("/profile")}>
            Edit Profile
          </button>
          <div>
            <button onClick={() => navigate("/resume")}>
              Manage Resume
            </button>

            {analysis && (
              <button onClick={() => navigate("/resume/analysis")}>
                View Resume Analysis
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;