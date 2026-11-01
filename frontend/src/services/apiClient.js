// Local development talks directly to FastAPI.
// Production talks directly to the deployed Render API.
const API_BASE_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8000"
        : "https://ai-career-copilot-k4d0.onrender.com";

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

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
        ? await response.json()
        : { detail: await response.text() };

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
        }

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("access_token");
                window.location.href = "/login";
            }

            const detail = data.detail;

            const errorMessage = Array.isArray(detail)
                ? detail.map((err) => err.msg || JSON.stringify(err)).join(", ")
                : typeof detail === "object" && detail !== null
                    ? JSON.stringify(detail)
                    : detail || "API request failed";

            throw new Error(errorMessage);
        }
    }

    return data;
}
