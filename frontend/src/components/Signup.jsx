import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            await register({
                name,
                email,
                password,
            });

            setMessage("Account created successfully! Redirecting...");

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            setMessage(error.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-brand">
                <div className="brand-mark">✦</div>

                <div>
                    <h1>Career Copilot</h1>
                    <p>
                        Your personal workspace for becoming
                        job-ready.
                    </p>
                </div>

                <div className="brand-points">
                    <span>Resume insights</span>
                    <span>Career guidance</span>
                    <span>Personalized preparation</span>
                </div>
            </div>

            <div className="login-card">
                <div className="login-header">
                    <span className="login-eyebrow">
                        YOUR CAREER WORKSPACE
                    </span>

                    <h2>Create your account.</h2>

                    <p>
                        Start your personalized career preparation.
                    </p>
                </div>

                <form onSubmit={handleSignup} className="login-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {message && (
                        <div
                            className={
                                message.startsWith("Account created")
                                    ? "success-message"
                                    : "error-message"
                            }
                        >
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="primary-button login-button"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="login-footer">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="auth-link"
                        onClick={() => navigate("/login")}
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Signup;