import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <NavLink to="/dashboard" className="navbar-brand">
                    <span className="navbar-logo">✦</span>
                    <span>Career Copilot</span>
                </NavLink>

                <div className="navbar-links">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Profile
                    </NavLink>

                    <NavLink
                        to="/career-analysis"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Career Analysis
                    </NavLink>

                    <NavLink
                        to="/resume"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Resume
                    </NavLink>
                    <NavLink
                        to="/resume/analysis"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Resume Analysis
                    </NavLink>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;