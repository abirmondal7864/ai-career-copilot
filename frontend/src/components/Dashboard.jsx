import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/apiClient";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await apiRequest("/career/profile");
      setProfile(data);
    } catch (error) {
      if (error.message === "Career profile not found.") {
        setProfile(null);
      } else {
        console.error("Profile error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading dashboard...</h2>;
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

          <button onClick={() => navigate("/profile")}>
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;