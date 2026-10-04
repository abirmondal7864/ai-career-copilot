// Use the configured API URL in production, while keeping localhost for local development.
const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    (window.location.hostname === "localhost"
        ? "http://localhost:8000"
        : "https://ai-career-copilot-k4d0.onrender.com");

const API_URL = `${API_BASE_URL}/api`;

function getAuthHeaders() {
    const token = localStorage.getItem("access_token");

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
}

export async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...(options.body instanceof FormData
                ? {}
                : {
                    "Content-Type": "application/json",
                }),
            ...(options.headers || {}),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
        }

        throw new Error(data.detail || "API request failed");
    }

    return data;
}
