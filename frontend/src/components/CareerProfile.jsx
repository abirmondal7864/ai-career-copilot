import { useEffect, useState } from "react";
import { apiRequest } from "../services/apiClient";

function CareerProfile() {
    const [form, setForm] = useState({
        name: "",
        education: "",
        skills: "",
        projects: "",
        experience: "",
        target_role: "",
        career_goal: "",
        years_experience: 0,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profileExists, setProfileExists] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await apiRequest("/career/profile");

            setForm({
                name: data.name || "",
                education: data.education || "",
                skills: data.skills?.join(", ") || "",
                projects: data.projects?.join(", ") || "",
                experience: data.experience?.join(", ") || "",
                target_role: data.target_role || "",
                career_goal: data.career_goal || "",
                years_experience: data.years_experience || 0,
            });

            setProfileExists(true);
        } catch (error) {
            if (error.message === "Career profile not found.") {
                setProfileExists(false);
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setMessage("");
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        const payload = {
            ...form,

            skills: form.skills
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),

            projects: form.projects
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),

            experience: form.experience
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),

            years_experience: Number(form.years_experience),
        };

        try {
            const method = profileExists ? "PUT" : "POST";

            await apiRequest("/career/profile", {
                method,
                body: JSON.stringify(payload),
            });

            setProfileExists(true);

            setMessage(
                profileExists
                    ? "Profile updated successfully."
                    : "Profile created successfully."
            );
        } catch (error) {
            setError(error.message || "Unable to save profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-state">
                    <h2>Loading profile...</h2>
                    <p>Getting your career information ready.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container profile-page">
            <div className="page-header">
                <h1>Career Profile</h1>
                <p>
                    Keep your career information updated so AI Career Copilot
                    can personalize its recommendations.
                </p>
            </div>

            {message && (
                <div className="success-message">
                    ✓ {message}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="profile-form">
                <section className="profile-card">
                    <div className="profile-card-header">
                        <div className="profile-card-icon">👤</div>
                        <div>
                            <h2>Personal Information</h2>
                            <p>Basic information about you.</p>
                        </div>
                    </div>

                    <div className="profile-grid">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                name="name"
                                placeholder="Your name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="education">Education</label>
                            <input
                                id="education"
                                name="education"
                                placeholder="e.g. B.Tech CSE"
                                value={form.education}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </section>

                <section className="profile-card">
                    <div className="profile-card-header">
                        <div className="profile-card-icon">🎯</div>
                        <div>
                            <h2>Career Target</h2>
                            <p>Tell us where you want to go.</p>
                        </div>
                    </div>

                    <div className="profile-grid">
                        <div className="form-group">
                            <label htmlFor="target_role">Target Role</label>
                            <input
                                id="target_role"
                                name="target_role"
                                placeholder="e.g. Software Engineer"
                                value={form.target_role}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="career_goal">Career Goal</label>
                            <textarea
                                id="career_goal"
                                name="career_goal"
                                rows="3"
                                placeholder="e.g. Become a full-stack developer and get a software engineering role"
                                value={form.career_goal}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="years_experience">
                                Years of Experience
                            </label>
                            <input
                                id="years_experience"
                                name="years_experience"
                                type="number"
                                min="0"
                                value={form.years_experience}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>

                <section className="profile-card">
                    <div className="profile-card-header">
                        <div className="profile-card-icon">🧠</div>
                        <div>
                            <h2>Skills & Experience</h2>
                            <p>Separate multiple items with commas.</p>
                        </div>
                    </div>

                    <div className="profile-fields">
                        <div className="form-group">
                            <label htmlFor="skills">Skills</label>
                            <textarea
                                id="skills"
                                name="skills"
                                rows="3"
                                placeholder="Java, Python, React, SQL..."
                                value={form.skills}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="experience">Experience</label>
                            <textarea
                                id="experience"
                                name="experience"
                                rows="3"
                                placeholder="Internship at XYZ, Open-source contribution..."
                                value={form.experience}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>

                <section className="profile-card">
                    <div className="profile-card-header">
                        <div className="profile-card-icon">🚀</div>
                        <div>
                            <h2>Projects</h2>
                            <p>Projects that represent your practical experience.</p>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="projects">Projects</label>
                        <textarea
                            id="projects"
                            name="projects"
                            rows="3"
                            placeholder="Expense Tracker, AI Career Copilot..."
                            value={form.projects}
                            onChange={handleChange}
                        />
                    </div>
                </section>

                <div className="profile-actions">
                    <button
                        type="submit"
                        className="primary-button"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : profileExists
                                ? "Save Changes"
                                : "Create Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CareerProfile;