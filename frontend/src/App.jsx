import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { apiRequest } from "./services/apiClient";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CareerProfile from "./components/CareerProfile";
import CareerAnalysis from "./pages/CareerAnalysis";
import "./App.css";

function App() {
  const { isAuthenticated, logoutUser } = useAuth();


  const testCareerAPI = async () => {
    try {
      const data = await apiRequest("/career/profile");
      console.log("Career API:", data);
    } catch (error) {
      console.error("Career API error:", error.message);
    }
  };


  return (
    <div>
      <h1>AI Career Copilot</h1>

      {isAuthenticated && (
        <button onClick={logoutUser}>Logout</button>
      )}

      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <CareerProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/career-analysis"
          element={<CareerAnalysis />
          }
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>

    </div>
  );
}

export default App;