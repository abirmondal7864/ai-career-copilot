import { useState } from "react";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const { loginUser } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const data = await login(email, password);
            loginUser(data.access_token);
            setMessage("Login successful!");
        } catch (error) {
            setMessage(error.message || "Login failed. Please try again.");
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

                    <h2>Welcome back.</h2>

                    <p>
                        Sign in to continue your preparation.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
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
                            placeholder="Your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {message && (
                        <div
                            className={
                                message === "Login successful!"
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
                        {loading ? "Signing in..." : "Continue"}
                    </button>
                </form>

                <p className="login-footer">
                    AI Career Copilot · Career preparation workspace
                </p>
            </div>
        </div>
    );
}

export default Login;