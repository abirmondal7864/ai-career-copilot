import { apiRequest } from "./apiClient";

export async function register(userData) {
    return apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
}

export async function login(email, password) {
    return apiRequest("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            username: email,
            password: password,
        }),
    });
}
