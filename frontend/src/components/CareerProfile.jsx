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
        years_experience: 0,
    });

    const [loading, setLoading] = useState(true);
    const [profileExists, setProfileExists] = useState(false);
    const [message, setMessage] = useState("");

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
                years_experience: data.years_experience || 0,
            });

            setProfileExists(true);
        } catch (error) {
            if (error.message === "Career profile not found.") {
                setProfileExists(false);
            } else {
                setMessage(error.message);
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            const endpoint = profileExists
                ? "/career/profile"
                : "/career/profile";

            const method = profileExists ? "PUT" : "POST";

            await apiRequest(endpoint, {
                method,
                body: JSON.stringify(payload),
            });

            setProfileExists(true);
            setMessage(
                profileExists
                    ? "Profile updated successfully!"
                    : "Profile created successfully!"
            );
        } catch (error) {
            setMessage(error.message);
        }
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    return (
        <div>
            <h2>Career Profile</h2>

            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="education"
                    placeholder="Education"
                    value={form.education}
                    onChange={handleChange}
                    required
                />

                <input
                    name="skills"
                    placeholder="Skills (comma separated)"
                    value={form.skills}
                    onChange={handleChange}
                />

                <input
                    name="projects"
                    placeholder="Projects (comma separated)"
                    value={form.projects}
                    onChange={handleChange}
                />

                <input
                    name="experience"
                    placeholder="Experience (comma separated)"
                    value={form.experience}
                    onChange={handleChange}
                />

                <input
                    name="target_role"
                    placeholder="Target Role"
                    value={form.target_role}
                    onChange={handleChange}
                    required
                />

                <input
                    name="years_experience"
                    type="number"
                    min="0"
                    placeholder="Years of Experience"
                    value={form.years_experience}
                    onChange={handleChange}
                />

                <button type="submit">
                    {profileExists ? "Update Profile" : "Create Profile"}
                </button>
            </form>
        </div>
    );
}

export default CareerProfile;